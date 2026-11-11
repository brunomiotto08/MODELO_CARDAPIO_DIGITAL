import { useEffect } from 'react';
import { buildJsonLd } from './schema';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  absoluteUrl,
  notFoundSeo,
  routeFor,
  type SeoRoute,
} from './site';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
}

function setCanonical(href: string | null) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    existing?.remove();
    return;
  }
  const node = existing ?? document.createElement('link');
  node.setAttribute('rel', 'canonical');
  node.setAttribute('href', href);
  if (!existing) document.head.appendChild(node);
}

function setJsonLd(path: string, enabled: boolean) {
  const existing = document.getElementById('jsonld');
  if (!enabled) {
    existing?.remove();
    return;
  }
  const node = existing ?? document.createElement('script');
  node.setAttribute('type', 'application/ld+json');
  node.id = 'jsonld';
  node.textContent = JSON.stringify(buildJsonLd(path));
  if (!existing) document.head.appendChild(node);
}

export function applySeo(route: SeoRoute) {
  const url = absoluteUrl(route.path);
  const image = absoluteUrl(DEFAULT_OG_IMAGE);

  document.title = route.title;
  setMeta('name', 'description', route.description);
  setMeta('name', 'robots', route.indexable ? ROBOTS_INDEX : ROBOTS_NOINDEX);
  setCanonical(route.indexable ? url : null);

  setMeta('property', 'og:title', route.title);
  setMeta('property', 'og:description', route.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:alt', DEFAULT_OG_IMAGE_ALT);
  setMeta('name', 'twitter:title', route.title);
  setMeta('name', 'twitter:description', route.description);
  setMeta('name', 'twitter:image', image);
  setMeta('name', 'twitter:image:alt', DEFAULT_OG_IMAGE_ALT);

  setJsonLd(route.path, route.indexable);
}

/**
 * Mantém title, description, canonical, Open Graph e JSON-LD alinhados com a
 * rota atual durante a navegação cliente. O HTML inicial de cada rota já sai do
 * build com estes mesmos valores (scripts/prerender.mjs).
 */
export function useSeo(path: string) {
  useEffect(() => {
    applySeo(routeFor(path) ?? notFoundSeo);
  }, [path]);
}
