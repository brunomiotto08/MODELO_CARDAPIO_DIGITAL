"""Recorta as fotos de public/mini-products e grava miniaturas transparentes da mesa."""

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "mini-products"
OUT = ROOT / "public" / "images" / "mesa"

# arquivo de origem -> ids da mesa (sabor / produto)
MAP = {
    "Torta_fria_frango.jpg": ["torta-fria-frango", "torta-fria-frango-pequena"],
    "prensadinhos.jpg": ["prensadinhos-frios"],
    "prensadinhos_vegetarianos.jpg": ["prensadinhos-vegetarianos"],
    "canapés diversos.jpg": ["canapes"],
    "terrine_caprese.jpg": ["terrine-caprese"],
    "terrine_salmao.jpg": ["terrine-salmao"],
    "terrine_castanhas_caramelo.jpg": ["terrine-castanhas"],
    "terrine_frutas_vermelhas.jpg": ["terrine-gorgonzola"],
    "assadso_copa-figo.webp": ["mini-folhado-parma-figo"],
    "assados-carneseca.webp": ["mini-folhado-carne-seca"],
}


def cutout(path: Path) -> Image.Image:
    bgr = cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)
    if bgr is None:
        raise RuntimeError(f"não abriu {path}")
    h, w = bgr.shape[:2]
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    sat = hsv[:, :, 1]
    val = hsv[:, :, 2]

    # Fundo branco, xadrez de exportação e sombra clara: quase sem cor.
    # O alimento (pão, creme, madeira) tem saturação mais alta e fica de fora.
    neutral = (sat <= 12) & (val >= 168)
    num, labels = cv2.connectedComponents(neutral.astype(np.uint8), connectivity=8)
    border = np.zeros(num, dtype=bool)
    border[labels[0, :]] = True
    border[labels[-1, :]] = True
    border[labels[:, 0]] = True
    border[labels[:, -1]] = True
    border[0] = False
    bg = border[labels]

    fg = (~bg).astype(np.uint8)
    hole_n, hole_labels, hole_stats, _ = cv2.connectedComponentsWithStats(bg.astype(np.uint8), connectivity=8)
    for index in range(1, hole_n):
        x, y, bw, bh, area = hole_stats[index]
        touches = x == 0 or y == 0 or x + bw >= w or y + bh >= h
        if not touches and area < 900:
            fg[hole_labels == index] = 1

    # Fecha só fiapos do xadrez, sem engolir o vão entre os palitos.
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))

    # Come o xadrez escuro e a faixa branca da borda, que o primeiro corte deixa.
    # Para no alimento: pão, creme e madeira têm mais cor.
    gray_fringe = (sat <= 12) & (val >= 128) & (val <= 242)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    outside = fg == 0
    for _ in range(48):
        ring = cv2.dilate(outside.astype(np.uint8), kernel) > 0
        eat = ring & gray_fringe & (fg > 0)
        if not eat.any():
            break
        fg[eat] = 0
        outside |= eat

    alpha = (fg * 255).astype(np.uint8)
    soft = cv2.GaussianBlur(alpha, (0, 0), 0.7)
    alpha = np.where(alpha == 255, 255, soft).astype(np.uint8)
    alpha[fg == 0] = 0

    # Tira o véu branco da borda sem pintar o miolo.
    color = rgb.astype(np.float32)
    a = (alpha.astype(np.float32) / 255.0)[..., None]
    fringe = (alpha > 0) & (alpha < 250)
    unmixed = np.clip((color - (1.0 - a) * 255.0) / np.maximum(a, 0.08), 0, 255)
    color[fringe] = unmixed[fringe]
    rgb = color.astype(np.uint8)

    rgba = np.dstack([rgb, alpha])
    ys, xs = np.where(alpha > 12)
    if len(xs) == 0:
        raise RuntimeError(f"recorte vazio em {path.name}")
    pad = int(max(8, round(min(h, w) * 0.012)))
    x0 = max(0, int(xs.min()) - pad)
    y0 = max(0, int(ys.min()) - pad)
    x1 = min(w, int(xs.max()) + pad + 1)
    y1 = min(h, int(ys.max()) + pad + 1)
    crop = rgba[y0:y1, x0:x1]

    # Leve realce para a miniatura não ficar lavada no pano da mesa.
    image = Image.fromarray(crop, "RGBA")
    max_side = 1400
    if max(image.size) > max_side:
        image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    return image


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, ids in MAP.items():
        image = cutout(SRC / filename)
        w, h = image.size
        print(f"{filename} -> {w}x{h}  ratio {w / h:.3f}  => {', '.join(ids)}")
        for piece_id in ids:
            dest = OUT / f"{piece_id}.webp"
            image.save(dest, "WEBP", quality=86, method=6)


if __name__ == "__main__":
    main()
