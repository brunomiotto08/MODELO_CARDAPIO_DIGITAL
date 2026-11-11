import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { brand } from '../data/brand';
import Mark from './Mark';
import Photo from './Photo';

const qualities = [
  'Ingredientes de altíssima qualidade',
  'Cuidado no preparo',
  'Produção artesanal',
  'Sob encomenda',
];

export default function About() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [videoSrc, setVideoSrc] = useState<string>();

  useEffect(() => {
    const node = mediaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVideoSrc('/images/video.mp4');
        observer.disconnect();
      },
      { rootMargin: '240px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    if (reduce) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);
  }, [reduce, videoSrc]);

  return (
    <section aria-label="Sobre a Flor Alecrim" className="about-section section-pad bg-cream">
      <div className="container-page">
        <div className="about-layout">
          <div className="about-copy">
            <div className="about-lead">
              <h2 className="section-title about-title text-text">
                Feitos para <em className="font-light italic">compartilhar</em> à mesa.
              </h2>
              <p>Salgados para o encontro e para a comemoração.</p>
            </div>

            <ul className="about-notes">
              {qualities.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>

            <p className="about-place">
              <Mark name="espatula" />
              {brand.region}
            </p>
          </div>

          <div className="about-media" ref={mediaRef}>
            <video
              ref={videoRef}
              className="about-video"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-label="Preparação de uma mesa da Flor Alecrim"
            />
            <div className="about-stills">
              <Photo
                src="/images/originais/732544599_18099586328225627_8567253256777961308_n.jpg"
                alt="Canapés com tomate e sanduíches de palito em uma mesa de encontro"
                sizes="(max-width: 900px) 42vw, 18vw"
              />
              <Photo
                src="/images/originais/pt2/524710861_18064648754225627_8744832772324765551_n.jpg"
                alt="Folhados com geleia e um mini hambúrguer ao fundo"
                sizes="(max-width: 900px) 42vw, 18vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
