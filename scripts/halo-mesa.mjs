import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Pega cada recorte de public/images/mesa e põe um contorno branco de papel
 * em volta (estilo recorte editorial). Saída em public/images/mesa/halo.
 * Também grava as proporções reais em src/data/mesa-aspect.json.
 */
const SRC = path.resolve('public/images/mesa');
const OUT = path.join(SRC, 'halo');
const WIDTH = 960;
const RING = 7;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.endsWith('.webp'));
const aspects = {};

for (const file of files) {
  const id = file.replace(/\.webp$/, '');
  const base = await sharp(path.join(SRC, file))
    .ensureAlpha()
    .resize({ width: WIDTH, withoutEnlargement: true })
    .extend({ top: RING + 2, bottom: RING + 2, left: RING + 2, right: RING + 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const { width, height } = await sharp(base).metadata();

  // Dilata o alfa: borra e corta no limiar baixo, depois suaviza a borda.
  const alpha = await sharp(base).extractChannel('alpha').toBuffer();
  const ring = await sharp(alpha)
    .blur(RING * 0.7)
    .threshold(6)
    .blur(0.9)
    .toBuffer();

  const white = await sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .joinChannel(ring)
    .png()
    .toBuffer();

  await sharp(white)
    .composite([{ input: base }])
    .webp({ quality: 88, alphaQuality: 96, effort: 5 })
    .toFile(path.join(OUT, file));

  aspects[id] = Number((width / height).toFixed(3));
}

await writeFile(
  path.resolve('src/data/mesa-aspect.json'),
  `${JSON.stringify(aspects, null, 2)}\n`,
);
console.table(aspects);
