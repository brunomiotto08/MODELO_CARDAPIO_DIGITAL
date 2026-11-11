import { onImageError } from '../lib/placeholder';
import { footprint, hasCutout, mesaImageSrc, pieceId } from '../data/tablePieces';

type MesaPieceProps = {
  id: string;
  fill?: boolean;
};

/**
 * Com recorte: o prato sai da foto com contorno branco, sem caixa.
 * Sem recorte: a foto do cardápio vira uma peça emoldurada (moldura branca fina).
 */
export default function MesaPiece({ id, fill = false }: MesaPieceProps) {
  const piece = footprint(id);
  const key = pieceId(id);
  const cut = hasCutout(id);

  return (
    <span
      className={[
        'mesa-piece',
        cut ? 'is-cutout' : 'is-framed',
        piece.shape === 'round' ? 'is-round' : '',
        fill ? 'is-fill' : 'is-intrinsic',
      ].filter(Boolean).join(' ')}
      style={fill ? undefined : { aspectRatio: `${piece.w} / ${piece.h}` }}
    >
      <img src={mesaImageSrc(key)} alt="" draggable={false} loading="lazy" decoding="async" onError={onImageError} />
    </span>
  );
}
