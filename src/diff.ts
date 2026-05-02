import type { Offer } from './schema.js';

export interface DiffResult {
  added: Offer[];
  removed: Offer[];
  modified: Array<{ id: string; before: Offer; after: Offer }>;
}

export function diffOffers(before: Offer[], after: Offer[]): DiffResult {
  const beforeMap = new Map(before.map((o) => [o.id, o]));
  const afterMap = new Map(after.map((o) => [o.id, o]));

  const added: Offer[] = [];
  const removed: Offer[] = [];
  const modified: Array<{ id: string; before: Offer; after: Offer }> = [];

  for (const [id, afterOffer] of afterMap) {
    const beforeOffer = beforeMap.get(id);
    if (!beforeOffer) {
      added.push(afterOffer);
    } else if (JSON.stringify(beforeOffer) !== JSON.stringify(afterOffer)) {
      // simple deep equality check
      modified.push({ id, before: beforeOffer, after: afterOffer });
    }
  }

  for (const [id, beforeOffer] of beforeMap) {
    if (!afterMap.has(id)) {
      removed.push(beforeOffer);
    }
  }

  return { added, removed, modified };
}
