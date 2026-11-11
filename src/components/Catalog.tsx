import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import Mark from './Mark';
import Photo from './Photo';

type Frame = 'feature' | 'tall' | 'tile';

type FoodTile = {
  id: string;
  src: string;
  alt: string;
  place: string;
  frame: Frame;
  focus?: string;
};

const tiles: FoodTile[] = [
  {
    id: 'torta-fria',
    src: '/images/insta/mesa-04.jpg',
    alt: 'Buffet de evento com canapés, sanduíches, flores e folhados',
    place: 'b-torta',
    frame: 'feature',
    focus: 'center 42%',
  },
  {
    id: 'canapes',
    src: '/images/originais/pt2/625358517_18111124681630141_3849411008942988494_n.jpg',
    alt: 'Canapés em estrela com cream cheese, tomate, damasco e nozes',
    place: 'b-canapes',
    frame: 'tile',
  },
  {
    id: 'mini-folhados',
    src: '/images/insta/mesa-14.jpg',
    alt: 'Folhados com picles e morangos servidos em um evento',
    place: 'b-mini',
    frame: 'tile',
    focus: 'center 60%',
  },
  {
    id: 'frios-janela',
    src: '/images/originais/758356920_18101351807225627_9019311309988811826_n.jpg',
    alt: 'Tábua de frios com queijos, presunto, figos e morangos junto à janela',
    place: 'b-frios',
    frame: 'tall',
    focus: 'center 40%',
  },
  {
    id: 'mesa-flores',
    src: '/images/insta/mesa-01.jpg',
    alt: 'Mesa de evento com burrata, frios, frutas e flores',
    place: 'b-mesa',
    frame: 'tall',
    focus: '42% center',
  },
  {
    id: 'prensadinhos',
    src: '/images/insta/mesa-06.jpg',
    alt: 'Prensadinhos e mini hambúrgueres em uma mesa de mármore',
    place: 'b-prensas',
    frame: 'tile',
    focus: 'center 45%',
  },
  {
    id: 'terrine-caprese',
    src: '/images/insta/mesa-13.jpg',
    alt: 'Canapés de presunto e brie com nuts em uma mesa de evento',
    place: 'b-caprese',
    frame: 'tile',
    focus: 'center 40%',
  },
  {
    id: 'burrata',
    src: '/images/originais/752279146_18100794845225627_7247277475491765640_n.jpg',
    alt: 'Brie com nuts, burrata com pesto e pães em uma mesa',
    place: 'b-burrata',
    frame: 'tile',
  },
  {
    id: 'torta-veg',
    src: '/images/originais/554681920_18070728590225627_5068617726204886317_n.jpg',
    alt: 'Mesa posta ao pôr do sol, com canapés, frios e flores',
    place: 'b-torta-veg',
    frame: 'feature',
    focus: 'center 42%',
  },
  {
    id: 'lanches',
    src: '/images/originais/734846096_18099289265225627_15695799976595639_n.jpg',
    alt: 'Mini hambúrgueres, tábua de frios e sanduíches à noite',
    place: 'b-lanches',
    frame: 'feature',
    focus: 'center 55%',
  },
  {
    id: 'brie',
    src: '/images/insta/mesa-13.jpg',
    alt: 'Brie com nuts ao fundo e canapés de presunto em primeiro plano',
    place: 'b-brie',
    frame: 'tall',
    focus: 'center 35%',
  },
  {
    id: 'folhado',
    src: '/images/originais/pt2/524710861_18064648754225627_8744832772324765551_n.jpg',
    alt: 'Folhados com geleia e picles, e um mini hambúrguer ao fundo',
    place: 'b-folhado',
    frame: 'tile',
  },
  {
    id: 'prensas-veg',
    src: '/images/insta/mesa-03.jpg',
    alt: 'Canapés de tomate e palitos de sanduíche em um encontro',
    place: 'b-prensas-veg',
    frame: 'tile',
    focus: 'center 45%',
  },
  {
    id: 'gorgonzola',
    src: '/images/originais/pt2/519614898_18063185186225627_5128743997338749391_n.jpg',
    alt: 'Torta de frutas vermelhas e canapés rosados em bandejas de vidro',
    place: 'b-gorgonzola',
    frame: 'tile',
    focus: 'center 40%',
  },
  {
    id: 'eventos-tabua',
    src: '/images/insta/mesa-10.jpg',
    alt: 'Quiches, tábua de frios e frutas em uma mesa junto à janela',
    place: 'b-tabua',
    frame: 'tile',
  },
  {
    id: 'pastries',
    src: '/images/insta/mesa-14.jpg',
    alt: 'Folhados e morangos servidos em um evento',
    place: 'b-pastries',
    frame: 'feature',
    focus: 'center 58%',
  },
  {
    id: 'assado',
    src: '/images/originais/pt2/482264012_18050911670225627_5235925662403060619_n.jpg',
    alt: 'Quiches, frios, queijos e frutas em uma mesa junto à janela',
    place: 'b-assado',
    frame: 'tile',
  },
  {
    id: 'especial',
    src: '/images/insta/mesa-08.jpg',
    alt: 'Canapés de presunto e patê, com tábua de frios ao fundo',
    place: 'b-especial',
    frame: 'tile',
  },
  {
    id: 'spread',
    src: '/images/insta/mesa-05.jpg',
    alt: 'Mesa de evento ao ar livre, com frios, frutas e flores',
    place: 'b-spread',
    frame: 'feature',
  },
  {
    id: 'flores-janela',
    src: '/images/originais/554681920_18070728590225627_5068617726204886317_n.jpg',
    alt: 'Detalhe da mesa posta com frios e frutas',
    place: 'b-detalhe',
    frame: 'tall',
    focus: 'center 68%',
  },
  {
    id: 'artisan',
    src: '/images/insta/mesa-09.jpg',
    alt: 'Canapés com presunto, damasco e cream cheese',
    place: 'b-artisan',
    frame: 'tile',
    focus: 'center 40%',
  },
  {
    id: 'canapes-reais',
    src: '/images/originais/732544599_18099586328225627_8567253256777961308_n.jpg',
    alt: 'Canapés servidos em um encontro',
    place: 'b-canapes-reais',
    frame: 'tall',
    focus: 'center 30%',
  },
  {
    id: 'mesa-noite',
    src: '/images/originais/705590216_18094783085225627_6480875386639421400_n.jpg',
    alt: 'Mesa de salgados à noite, com flores e frios',
    place: 'b-noite',
    frame: 'tall',
    focus: 'center 72%',
  },
  {
    id: 'pt-salmao',
    src: '/images/originais/pt2/499851985_18058664924225627_2769296814494146418_n.jpg',
    alt: 'Canapés de salmão, presunto e tomate-cereja, com alecrim ao fundo',
    place: 'b-pt-salmao',
    frame: 'tile',
    focus: 'center 72%',
  },
  {
    id: 'pt-varanda',
    src: '/images/originais/pt2/588055573_18078257930225627_2589721863208592128_n.jpg',
    alt: 'Mesa de frios, frutas e flores em uma varanda com vista para o campo',
    place: 'b-pt-varanda',
    frame: 'feature',
    focus: 'center 58%',
  },
  {
    id: 'pt-folhados',
    src: '/images/originais/pt2/524710861_18064648754225627_8744832772324765551_n.jpg',
    alt: 'Folhados com geleia e picles, e um mini hambúrguer ao fundo',
    place: 'b-pt-folhados',
    frame: 'tile',
    focus: 'center 62%',
  },
  {
    id: 'pt-quiches',
    src: '/images/originais/pt2/482264012_18050911670225627_5235925662403060619_n.jpg',
    alt: 'Quiches, frios, queijos e frutas em uma mesa junto à janela',
    place: 'b-pt-quiches',
    frame: 'tall',
    focus: 'center 62%',
  },
  {
    id: 'pt-sliders',
    src: '/images/originais/pt2/530325300_18065965703225627_4656856284104953876_n.jpg',
    alt: 'Mini hambúrgueres e sanduíches de palito em uma mesa de mármore',
    place: 'b-pt-sliders',
    frame: 'tall',
    focus: 'center 58%',
  },
  {
    id: 'pt-frutas',
    src: '/images/originais/pt2/519614898_18063185186225627_5128743997338749391_n.jpg',
    alt: 'Torta de frutas vermelhas e canapés rosados em bandejas de vidro',
    place: 'b-pt-frutas',
    frame: 'tall',
    focus: 'center 58%',
  },
  {
    id: 'pt-estrelas',
    src: '/images/originais/pt2/625358517_18111124681630141_3849411008942988494_n.jpg',
    alt: 'Canapés em estrela com cream cheese, tomate, damasco e nozes',
    place: 'b-pt-estrelas',
    frame: 'tall',
    focus: 'center 60%',
  },
];

const mobileTileIds = [
  'torta-fria',
  'canapes',
  'frios-janela',
  'mesa-flores',
  'brie',
  'burrata',
  'canapes-reais',
  'mesa-noite',
  'pt-estrelas',
];

export default function Catalog() {
  const [following, setFollowing] = useState(false);
  const [compact, setCompact] = useState(
    () => window.matchMedia('(max-width: 899px)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(max-width: 899px)');
    const apply = () => setCompact(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const section = document.getElementById('cardapio');
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFollowing(entry.isIntersecting),
      { threshold: 0, rootMargin: '-10% 0px -8% 0px' },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="cardapio" aria-label="Nosso cardápio" className="section-pad bg-ivory">
      <Link
        to="/cardapio"
        className={`menu-follow${following ? ' is-on' : ''}`}
        tabIndex={following ? 0 : -1}
        aria-hidden={following ? undefined : true}
      >
        <span>Ver cardápio</span>
        <span className="menu-follow-arrow" aria-hidden="true">
          <ArrowRight size={20} weight="bold" />
        </span>
      </Link>

      <div className="container-page">
        <div className="mb-10 max-w-[38rem] md:mb-12">
          <h2 className="section-title flex items-center gap-3 text-text">
            Nosso cardápio
            <Mark name="flor" />
          </h2>
          <p className="mt-5 max-w-[46ch] font-sans text-base leading-relaxed text-text">
            Mesas de evento, em fotos reais. Os valores ficam no cardápio avulso, e a composição fica em Monte sua mesa.
          </p>
        </div>

        <div className="menu-bento">
          {(compact ? tiles.filter((tile) => mobileTileIds.includes(tile.id)) : tiles).map((tile) => (
            <figure
              key={tile.id}
              className={`menu-bento-item ${tile.place} is-${tile.frame}${tile.id === 'torta-fria' ? ' is-lead' : ''}`}
            >
              <Photo
                src={tile.src}
                alt={tile.alt}
                sizes={
                  tile.frame === 'feature'
                    ? '(max-width: 899px) 92vw, 42vw'
                    : tile.frame === 'tall'
                      ? '(max-width: 899px) 46vw, 26vw'
                      : '(max-width: 899px) 46vw, 22vw'
                }
                style={tile.focus ? { objectPosition: tile.focus } : undefined}
              />
            </figure>
          ))}

          <Link to="/monte-sua-mesa" className="menu-bento-cta b-cta is-feature">
            <span className="menu-bento-cta-title">
              Monte sua mesa
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </span>
            <span className="menu-bento-cta-note">
              Os antepastos aparecem na mesa.
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
