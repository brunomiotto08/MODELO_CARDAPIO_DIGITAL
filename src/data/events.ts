/**
 * Tipos de evento atendidos. Usados nos filtros dos pacotes, no orçamento guiado
 * e na galeria. Edite por cliente.
 */
export type EventType = {
  id: string;
  label: string;
};

export const eventTypes: EventType[] = [
  { id: 'aniversario', label: 'Aniversário' },
  { id: 'corporativo', label: 'Corporativo' },
  { id: 'coffee-break', label: 'Coffee break' },
  { id: 'cafe-da-manha', label: 'Café da manhã' },
  { id: 'casamento', label: 'Casamento e noivado' },
  { id: 'confraternizacao', label: 'Confraternização' },
];

export function eventTypeLabel(id: string): string {
  return eventTypes.find((type) => type.id === id)?.label ?? id;
}
