/**
 * Pré-render de SEO, executado depois do `vite build`.
 *
 * Para cada rota, gera um HTML próprio a partir de dist/index.html, com:
 *   - <title>, description, canonical, Open Graph, Twitter e JSON-LD da rota;
 *   - o conteúdo textual da página dentro de #root (para crawlers sem JavaScript).
 * O React substitui o conteúdo de #root ao iniciar, então o visual não muda.
 *
 * Também gera sitemap.xml, robots.txt e llms.txt a partir de src/seo.
 * Tudo vem do mesmo módulo usado em tempo de execução (src/seo), para que HTML
 * inicial, metadados cliente e dados estruturados nunca divirjam.
 */
import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const START = '<!--seo:start-->';
const END = '<!--seo:end-->';
const BODY = '<!--app-body-->';

if (!existsSync(path.join(dist, 'index.html'))) {
  throw new Error('dist/index.html não encontrado. Rode `vite build` antes do pré-render.');
}

const server = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
});

try {
  const seo = await server.ssrLoadModule('/src/seo/render.ts');
  const site = await server.ssrLoadModule('/src/seo/site.ts');
  const template = await readFile(path.join(dist, 'index.html'), 'utf8');

  const a = template.indexOf(START);
  const b = template.indexOf(END);
  if (a === -1 || b === -1 || !template.includes(BODY)) {
    throw new Error('Marcadores de SEO ausentes em dist/index.html.');
  }

  const targets = [
    ...site.routes.map((route) => ({
      route: route.path,
      file: route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`,
    })),
    { route: site.notFoundSeo.path, file: '404.html' },
  ];

  for (const { route, file } of targets) {
    const html =
      template.slice(0, a + START.length) +
      `\n    ${seo.renderHead(route)}\n    ` +
      template.slice(b).replace(BODY, `\n${seo.renderBody(route)}\n    `);
    await writeFile(path.join(dist, file), html);
    console.log(`prerender: ${route} -> dist/${file}`);
  }

  await writeFile(path.join(dist, 'sitemap.xml'), seo.renderSitemap());
  await writeFile(path.join(dist, 'robots.txt'), seo.renderRobots());
  await writeFile(path.join(dist, 'llms.txt'), seo.renderLlmsTxt());
  console.log('prerender: sitemap.xml, robots.txt e llms.txt gerados');
} finally {
  await server.close();
}
