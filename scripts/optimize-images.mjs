import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public/images');
const OUT = path.resolve('public/images/opt');
const MANIFEST_PATH = path.resolve('src/data/image-manifest.json');
const PHOTO_WIDTHS = [480, 960, 1440, 1920];

sharp.cache(false);

function kindOf(rel) {
  const norm = rel.replaceAll('\\', '/');
  if (norm.startsWith('logos/micros/')) return 'micro';
  if (norm.startsWith('logos/')) return 'logo';
  return 'photo';
}

function targetWidths(pixelWidth, kind) {
  if (kind === 'micro') return [Math.min(480, pixelWidth)];
  if (kind === 'logo') return [Math.min(960, pixelWidth)];

  const widths = PHOTO_WIDTHS.filter((width) => width < pixelWidth);
  const cap = Math.min(pixelWidth, 1920);
  if (!widths.includes(cap)) widths.push(cap);
  return widths;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'opt') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function isFresh(input, outputs) {
  const source = await stat(input);
  for (const output of outputs) {
    try {
      const current = await stat(output);
      if (current.mtimeMs < source.mtimeMs || current.size === 0) return false;
    } catch {
      return false;
    }
  }
  return true;
}

async function optimize(file) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const meta = await sharp(file).metadata();
  const widths = targetWidths(meta.width ?? 1, kindOf(rel));
  const stem = rel.replace(/\.[^.]+$/, '');
  const outputs = widths.map((width) => path.join(OUT, `${stem}-${width}.webp`));

  if (await isFresh(file, outputs)) {
    return { rel, widths, before: 0, after: 0, skipped: true };
  }

  const before = (await stat(file)).size;
  let after = 0;

  for (const width of widths) {
    const output = path.join(OUT, `${stem}-${width}.webp`);
    await mkdir(path.dirname(output), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 72, effort: 4, alphaQuality: 80 })
      .toFile(output);
    after += (await stat(output)).size;
  }

  return { rel, widths, before, after, skipped: false };
}

async function optimizeFavicon() {
  const sourcePath = path.resolve('assets/favicon-source.png');
  const currentPath = path.resolve('public/favicon.png');
  const iconPath = path.resolve('public/apple-touch-icon.png');

  try {
    await stat(sourcePath);
  } catch {
    const meta = await sharp(currentPath).metadata();
    if ((meta.width ?? 0) > 256) {
      await mkdir(path.dirname(sourcePath), { recursive: true });
      await writeFile(sourcePath, await readFile(currentPath));
    }
  }

  let input = currentPath;
  try {
    await stat(sourcePath);
    input = sourcePath;
  } catch {
    input = currentPath;
  }

  const source = await stat(input);
  const targets = [
    { file: currentPath, size: 64 },
    { file: iconPath, size: 180 },
  ];

  let fresh = true;
  for (const target of targets) {
    try {
      const current = await stat(target.file);
      if (current.mtimeMs < source.mtimeMs) fresh = false;
    } catch {
      fresh = false;
    }
  }
  if (fresh) return;

  for (const target of targets) {
    await sharp(input)
      .rotate()
      .resize({
        width: target.size,
        height: target.size,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(target.file);
  }
}

async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const files = await walk(ROOT);
const results = await mapPool(files, 3, optimize);
await optimizeFavicon();

const manifest = Object.fromEntries(
  results
    .sort((a, b) => a.rel.localeCompare(b.rel))
    .map((item) => [`/images/${item.rel}`, item.widths]),
);

await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

const rebuilt = results.filter((item) => !item.skipped);
const before = rebuilt.reduce((sum, item) => sum + item.before, 0);
const after = rebuilt.reduce((sum, item) => sum + item.after, 0);

if (rebuilt.length === 0) {
  console.log(`Images already optimized (${results.length} files).`);
} else {
  console.log(
    `Optimized ${rebuilt.length} images: ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB across variants.`,
  );
}
