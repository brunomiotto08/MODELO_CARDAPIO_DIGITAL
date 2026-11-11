"""Export official Flor Alecrim marks from the vector logo PDF.

The artboard holds one full-color signature and three white signatures
on brand-color panels. Gray paths are the arc and the tagline, which
the manual drops below 3 cm.
"""

from __future__ import annotations

import fitz
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "public" / "marca" / "FLOR ALECRIM_MARCA.pdf"
OUT = ROOT / "public" / "images" / "logos"
SAGE = (0xBA, 0xC6, 0xB6)
PAPER = (0xF2, 0xF2, 0xF3)


def hex_of(color: tuple | None) -> str | None:
    if not color:
        return None
    return "#{:02x}{:02x}{:02x}".format(*(int(round(channel * 255)) for channel in color[:3]))


def replay(drawings: list[dict], fills: dict[int, tuple] | None, scale: float) -> Image.Image:
    x0 = min(d["rect"].x0 for d in drawings)
    y0 = min(d["rect"].y0 for d in drawings)
    x1 = max(d["rect"].x1 for d in drawings)
    y1 = max(d["rect"].y1 for d in drawings)
    pad = 2
    doc = fitz.open()
    page = doc.new_page(width=(x1 - x0) + pad * 2, height=(y1 - y0) + pad * 2)
    shape = page.new_shape()
    for index, drawing in enumerate(drawings):
        for item in drawing["items"]:
            kind = item[0]
            if kind == "l":
                shape.draw_line(
                    fitz.Point(item[1].x - x0 + pad, item[1].y - y0 + pad),
                    fitz.Point(item[2].x - x0 + pad, item[2].y - y0 + pad),
                )
            elif kind == "c":
                shape.draw_bezier(
                    fitz.Point(item[1].x - x0 + pad, item[1].y - y0 + pad),
                    fitz.Point(item[2].x - x0 + pad, item[2].y - y0 + pad),
                    fitz.Point(item[3].x - x0 + pad, item[3].y - y0 + pad),
                    fitz.Point(item[4].x - x0 + pad, item[4].y - y0 + pad),
                )
            elif kind == "re":
                rect = item[1]
                shape.draw_rect(
                    fitz.Rect(rect.x0 - x0 + pad, rect.y0 - y0 + pad, rect.x1 - x0 + pad, rect.y1 - y0 + pad)
                )
        fill = fills[index] if fills and index in fills else drawing["fill"]
        shape.finish(
            color=None,
            fill=fill,
            even_odd=bool(drawing.get("even_odd")),
            closePath=True,
            width=0,
            fill_opacity=1,
        )
    shape.commit()
    pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    doc.close()
    return image


def unblend(color: Image.Image, mask_black: Image.Image) -> Image.Image:
    """Recover opaque colors that were anti-aliased against a white page."""
    color = color.convert("RGB")
    mask_black = mask_black.convert("RGB")
    out = Image.new("RGBA", color.size)
    src = color.load()
    mask = mask_black.load()
    dest = out.load()
    width, height = color.size
    for y in range(height):
        for x in range(width):
            coverage = 255 - mask[x, y][0]
            if coverage < 8:
                dest[x, y] = (0, 0, 0, 0)
                continue
            red, green, blue = src[x, y]
            alpha = coverage / 255
            dest[x, y] = (
                max(0, min(255, round((red - (1 - alpha) * 255) / alpha))),
                max(0, min(255, round((green - (1 - alpha) * 255) / alpha))),
                max(0, min(255, round((blue - (1 - alpha) * 255) / alpha))),
                coverage,
            )
    return out


def render(drawings: list[dict], scale: float, white: bool = False) -> Image.Image:
    if white:
        black = {index: (0, 0, 0) for index in range(len(drawings))}
        mask = replay(drawings, black, scale)
        blank = Image.new("RGB", mask.size, (255, 255, 255))
        return unblend(blank, mask)
    color = replay(drawings, None, scale)
    black = {index: (0, 0, 0) for index in range(len(drawings))}
    mask = replay(drawings, black, scale)
    return unblend(color, mask)


def trim(image: Image.Image, padding: int = 8) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > 12 else 0).getbbox()
    if not bbox:
        return image
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    bottom = min(image.height, bbox[3] + padding)
    return image.crop((left, top, right, bottom))


def save(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)
    print(path.relative_to(ROOT), image.size)


def main() -> None:
    doc = fitz.open(PDF)
    drawings = doc[0].get_drawings()
    doc.close()

    def fill(drawing: dict) -> str | None:
        return hex_of(drawing.get("fill"))

    color = [
        drawing
        for drawing in drawings
        if drawing["rect"].y1 < 520 and fill(drawing) in {"#bac6b6", "#d8c5ea", "#b3b3b3"}
    ]
    compact = [drawing for drawing in color if fill(drawing) != "#b3b3b3"]
    flower = [drawing for drawing in color if fill(drawing) == "#d8c5ea"]
    whisk = [
        drawing
        for drawing in compact
        if fill(drawing) == "#bac6b6" and drawing["rect"].x0 > 860 and drawing["rect"].y1 < 330
    ]

    white_draws = [
        drawing
        for drawing in drawings
        if fill(drawing) == "#ffffff" and 560 < (drawing["rect"].x0 + drawing["rect"].x1) / 2 < 1110
    ]

    logo_color = trim(render(color, 4))
    logo_compact = trim(render(compact, 5))
    logo_white = trim(render(white_draws, 4, white=True))

    # The white signature is the same drawing, shifted. Pair each compact
    # path with the white path that has the same shape and the whisk's offset.
    whisk_color = whisk[0]["rect"]
    whisk_white = min(
        (
            drawing
            for drawing in white_draws
            if len(drawing["items"]) == len(whisk[0]["items"])
        ),
        key=lambda drawing: abs((drawing["rect"].x1 - drawing["rect"].x0) - (whisk_color.x1 - whisk_color.x0))
        + abs((drawing["rect"].y1 - drawing["rect"].y0) - (whisk_color.y1 - whisk_color.y0)),
    )
    shift_x = whisk_white["rect"].x0 - whisk_color.x0
    shift_y = whisk_white["rect"].y0 - whisk_color.y0

    def same_shape(source: dict, candidate: dict) -> bool:
        left, right = source["rect"], candidate["rect"]
        return (
            len(source["items"]) == len(candidate["items"])
            and abs(right.x0 - (left.x0 + shift_x)) < 1.5
            and abs(right.y0 - (left.y0 + shift_y)) < 1.5
            and abs((right.x1 - right.x0) - (left.x1 - left.x0)) < 1.5
            and abs((right.y1 - right.y0) - (left.y1 - left.y0)) < 1.5
        )

    white_compact = []
    for source in compact:
        hits = [candidate for candidate in white_draws if same_shape(source, candidate)]
        if len(hits) != 1:
            raise SystemExit(f"Expected one white match, found {len(hits)} for {source['rect']}")
        white_compact.append(hits[0])

    logo_compact_white = trim(render(white_compact, 5, white=True))
    flor = trim(render(flower, 10), padding=6)
    flor_white = trim(render(flower, 10, white=True), padding=6)
    fue = trim(render(whisk, 10), padding=6)

    save(logo_color, OUT / "logo-color.png")
    save(logo_white, OUT / "logo-white.png")
    save(logo_compact, OUT / "logo-compact-color.png")
    save(logo_compact_white, OUT / "logo-compact-white.png")
    save(flor, OUT / "micros" / "flor.png")
    save(flor_white, OUT / "micros" / "flor-white.png")
    save(fue, OUT / "micros" / "fue.png")

    # Favicon: the flower alone, centered, with no field behind it.
    side = 512
    icon = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    flower_icon = flor.copy()
    flower_icon.thumbnail((440, 440), Image.Resampling.LANCZOS)
    icon.alpha_composite(
        flower_icon,
        ((side - flower_icon.width) // 2, (side - flower_icon.height) // 2),
    )
    save(icon, ROOT / "assets" / "favicon-source.png")

    # Social card, 1200x630, white signature on sage.
    card = Image.new("RGBA", (1200, 630), (*SAGE, 255))
    mark = logo_white.copy()
    mark.thumbnail((460, 460), Image.Resampling.LANCZOS)
    card.alpha_composite(mark, ((1200 - mark.width) // 2, (630 - mark.height) // 2))
    og_path = ROOT / "public" / "og.jpg"
    card.convert("RGB").save(og_path, "JPEG", quality=86, optimize=True)
    print(og_path.relative_to(ROOT), card.size)


if __name__ == "__main__":
    main()
