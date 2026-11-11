/**
 * Verificação de SEO sobre dist/ (rode depois de `npm run build`).
 * Confere metadados, canonical, JSON-LD, H1, sitemap, robots e links internos.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SITE = 'https://floralecrim.com.br';
const pages = [
  ['/', 'index.html'],
  ['/cardapio', 'cardapio.html'],
  ['/monte-sua-mesa', 'monte-sua-mesa.html'],
];

let failures = 0;
const check = (ok, message) => {
  console.log(`${ok ? 'OK  ' : 'FALHA'} ${message}`);
  if (!ok) failures += 1;
};

const titles = new Set();
const descriptions = new Set();

for (const [route, file] of pages) {
  const html = await readFile(path.join(dist, file), 'utf8');
  const get = (re) => (html.match(re) || [])[1];
  const title = get(/<title>(.*?)<\/title>/);
  const description = get(/<meta name="description" content="(.*?)"/);
  const canonical = get(/<link rel="canonical" href="(.*?)"/);
  const expected = route === '/' ? `${SITE}/` : `${SITE}${route}`;

  check(Boolean(title) && title.length <= 70, `${route}: title (${title?.length} caracteres)`);
  check(Boolean(description) && description.length <= 175, `${route}: description (${description?.length} caracteres)`);
  check(canonical === expected, `${route}: canonical = ${canonical}`);
  check(get(/<meta property="og:url" content="(.*?)"/) === expected, `${route}: og:url`);
  check(get(/<meta property="og:image" content="(.*?)"/)?.startsWith(SITE), `${route}: og:image absoluto`);
  check(/<html lang="pt-BR">/.test(html), `${route}: lang pt-BR`);
  check((html.match(/<h1[ >]/g) || []).length === 1, `${route}: exatamente um H1 no HTML inicial`);
  check(!titles.has(title), `${route}: title único`);
  check(!descriptions.has(description), `${route}: description única`);
  titles.add(title);
  descriptions.add(description);

  const ld = html.match(/<script type="application\/ld\+json" id="jsonld">([\s\S]*?)<\/script>/);
  check(Boolean(ld), `${route}: JSON-LD presente`);
  if (ld) {
    const graph = JSON.parse(ld[1])['@graph'];
    const ids = graph.map((node) => node['@id']);
    check(new Set(ids).size === ids.length, `${route}: @id únicos (${graph.map((n) => [].concat(n['@type']).join('+')).join(', ')})`);
    const known = new Set(ids);
    const refs = [...ld[1].matchAll(/"@id":"(.*?)"/g)].map((m) => m[1]);
    const stray = [...ld[1].matchAll(/\{"@id":"(.*?)"\}/g)].map((m) => m[1]).filter((id) => !known.has(id));
    check(stray.length === 0, `${route}: referências @id resolvidas ${stray.join(', ')}`);
    void refs;
  }

  // Links internos do HTML inicial apontam para rotas existentes.
  const links = [...html.matchAll(/<a href="(\/[^"#]*)/g)].map((m) => m[1]);
  for (const href of new Set(links)) {
    check(pages.some(([r]) => r === href), `${route}: link interno ${href} existe`);
  }
}

const notFound = await readFile(path.join(dist, '404.html'), 'utf8');
check(/name="robots" content="noindex/.test(notFound), '404.html: noindex');
check(!/rel="canonical"/.test(notFound), '404.html: sem canonical');

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
check(locs.length === pages.length, `sitemap.xml: ${locs.length} URLs`);
check(locs.every((loc) => loc.startsWith(`${SITE}/`) || loc === SITE), 'sitemap.xml: URLs absolutas no domínio canônico');

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
check(robots.includes(`Sitemap: ${SITE}/sitemap.xml`), 'robots.txt: aponta para o sitemap');
check(!/Disallow:\s*\/\s*$/m.test(robots), 'robots.txt: não bloqueia o site inteiro');
check(!/Disallow:.*(assets|\.css|\.js)/.test(robots), 'robots.txt: não bloqueia CSS/JS');
check(existsSync(path.join(dist, 'llms.txt')), 'llms.txt gerado (opcional)');

if (failures) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log('\nTodas as verificações passaram.');
