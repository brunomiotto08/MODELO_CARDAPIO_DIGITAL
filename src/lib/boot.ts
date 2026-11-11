const HERO_WIDTHS = [480, 960, 1440, 1920];

function heroUrl() {
  const viewport = window.innerWidth;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const display = (viewport <= 1023 ? viewport : viewport * 0.56) * dpr;
  const width = HERO_WIDTHS.find((item) => item >= display) ?? 1920;
  return `/images/opt/hero/hero-${width}.webp`;
}

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = finish;
    image.onerror = finish;
    image.src = src;
  });
}

function loadFonts() {
  if (!document.fonts?.load) return Promise.resolve();
  return Promise.all([
    document.fonts.load('500 1em "Montserrat"', 'Pequenos detalhes'),
    document.fonts.load('300 italic 1em "Montserrat"', 'detalhes'),
    document.fonts.load('400 1em "Montserrat"', 'Ingredientes selecionados'),
    document.fonts.load('600 1em "Montserrat"', 'Cardápio'),
  ]).then(() => document.fonts.ready);
}

export function revealApp() {
  const reveal = () => document.documentElement.classList.add('is-ready');
  const home = window.location.pathname === '/';
  const jobs: Promise<unknown>[] = [
    loadFonts(),
    loadImage('/images/opt/logos/logo-compact-color-960.webp'),
    loadImage('/images/opt/logos/logo-color-960.webp'),
  ];
  if (home) jobs.push(loadImage(heroUrl()));

  const ready = Promise.all(jobs).then(() => undefined);
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 1600));
  void Promise.race([ready, timeout]).then(reveal);
}
