/**
 * GALERIA DE EVENTOS REALIZADOS — somente fotos reais do cliente.
 *
 * `style` agrupa as fotos nos filtros. `packageId` (opcional) liga a foto a um
 * pacote: o botão "Quero um evento assim" abre esse pacote. Sem pacote, o botão
 * leva ao orçamento guiado (com `eventType`, já pré-selecionado).
 */
export type GalleryStyle = { id: string; label: string };

export const galleryStyles: GalleryStyle[] = [
  { id: 'antepastos', label: 'Mesas de antepastos' },
  { id: 'salgados', label: 'Salgados e coquetéis' },
  { id: 'frios', label: 'Tábuas e frios' },
];

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  style: string;
  /** Legenda curta e verdadeira (opcional). */
  caption?: string;
  /** id de src/data/events.ts, quando se sabe o tipo do evento. */
  eventType?: string;
  /** id de src/data/packages.ts. */
  packageId?: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: 'mesa-01',
    src: '/images/insta/mesa-01.jpg',
    alt: 'Mesa de evento com burrata, pães, frios, frutas e flores',
    style: 'antepastos',
    packageId: 'mesa-de-antepastos',
  },
  {
    id: 'mesa-05',
    src: '/images/insta/mesa-05.jpg',
    alt: 'Mesa de antepastos ao ar livre, com frios, frutas e um arranjo de flores',
    style: 'antepastos',
    packageId: 'mesa-de-antepastos',
  },
  {
    id: 'mesa-08',
    src: '/images/insta/mesa-08.jpg',
    alt: 'Canapés, taças e uma tábua de frios com frutas em um evento',
    style: 'salgados',
    packageId: 'coffee-break',
  },
  {
    id: 'mesa-02',
    src: '/images/insta/mesa-02.jpg',
    alt: 'Mesa posta junto à janela, com salgados e frios',
    style: 'antepastos',
  },
  {
    id: 'mesa-03',
    src: '/images/insta/mesa-03.jpg',
    alt: 'Tábua de frios, queijos e frutas em um encontro',
    style: 'frios',
    packageId: 'mesa-de-antepastos',
  },
  {
    id: 'mesa-04',
    src: '/images/insta/mesa-04.jpg',
    alt: 'Mesa de evento com flores e salgados',
    style: 'salgados',
  },
  {
    id: 'mesa-06',
    src: '/images/insta/mesa-06.jpg',
    alt: 'Mini hambúrgueres e prensadinhos em uma mesa de mármore',
    style: 'salgados',
    packageId: 'aniversario',
  },
  {
    id: 'mesa-09',
    src: '/images/insta/mesa-09.jpg',
    alt: 'Canapés com presunto, cream cheese e frutas, em uma mesa de evento',
    style: 'salgados',
    packageId: 'coquetel',
  },
  {
    id: 'mesa-10',
    src: '/images/insta/mesa-10.jpg',
    alt: 'Quiches, tábua de frios e mini hambúrgueres em um evento',
    style: 'salgados',
    packageId: 'aniversario',
  },
  {
    id: 'mesa-12',
    src: '/images/insta/mesa-12.jpg',
    alt: 'Seleção de frios e acompanhamentos',
    style: 'frios',
  },
  {
    id: 'mesa-13',
    src: '/images/insta/mesa-13.jpg',
    alt: 'Buffet de evento com salgados e frutas',
    style: 'salgados',
    packageId: 'coquetel',
  },
  {
    id: 'mesa-14',
    src: '/images/insta/mesa-14.jpg',
    alt: 'Folhados e morangos servidos em um evento',
    style: 'salgados',
    packageId: 'coffee-break',
  },
];
