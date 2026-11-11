import { useMemo, useState } from 'react';
import { packTable } from '../data/tablePieces';
import MesaPiece from './MesaPiece';

type StagePlate = {
  id: string;
  name: string;
};

type TableStageProps = {
  plates: StagePlate[];
  onRemove: (productId: string) => void;
};

export default function TableStage({ plates, onRemove }: TableStageProps) {
  const slots = useMemo(() => {
    const packed = packTable(plates.map((product) => product.id));
    return new Map(packed.map((slot) => [slot.id, slot]));
  }, [plates]);

  const [leaving, setLeaving] = useState<Set<string>>(() => new Set());

  // A peça some em ~200ms e só então sai da lista.
  const leave = (id: string) => {
    setLeaving((current) => new Set(current).add(id));
    window.setTimeout(() => {
      onRemove(id);
      setLeaving((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }, 200);
  };

  return (
    <div className="table-stage" aria-label="Mesa montada">
      <div className="table-scene">
        <div className="table-board">
          <div className="table-top" aria-hidden="true" />
          {plates.length === 0 && (
            <p className="table-empty">
              <span>Escolha do cardápio.</span>
              <span>Cada item pousa aqui.</span>
            </p>
          )}
          <div className="table-items">
            {plates.map((product, index) => {
              const slot = slots.get(product.id);
              if (!slot) return null;
              return (
                <div
                  key={product.id}
                  className={`table-piece-slot${leaving.has(product.id) ? ' is-leaving' : ''}`}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    width: `${slot.w}%`,
                    height: `${slot.h}%`,
                    ['--turn' as string]: `${slot.rotate}deg`,
                    ['--i' as string]: Math.min(index, 5),
                  }}
                >
                  <button
                    type="button"
                    className="table-piece"
                    onClick={() => leave(product.id)}
                    aria-label={`Tirar ${product.name} da mesa`}
                  >
                    <MesaPiece id={product.id} fill />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
