import { describe, it, expect } from 'vitest';
import { diffOffers } from '../src/diff.js';
import type { Offer } from '../src/schema.js';

const baseOffer: Offer = {
  id: '1',
  title: 'Dev',
  company: 'Co',
  remote: false,
  contractType: 'CDI',
  postedAt: '2024-01-01T00:00:00Z',
};

describe('diffOffers', () => {
  it('detects added offers', () => {
    const before: Offer[] = [];
    const after: Offer[] = [baseOffer];

    const result = diffOffers(before, after);
    expect(result.added).toHaveLength(1);
    expect(result.removed).toHaveLength(0);
    expect(result.modified).toHaveLength(0);
  });

  it('detects removed offers', () => {
    const before: Offer[] = [baseOffer];
    const after: Offer[] = [];

    const result = diffOffers(before, after);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(1);
    expect(result.modified).toHaveLength(0);
  });

  it('detects modified offers', () => {
    const before: Offer[] = [baseOffer];
    const after: Offer[] = [{ ...baseOffer, title: 'Senior Dev' }];

    const result = diffOffers(before, after);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.modified).toHaveLength(1);
    expect(result.modified[0].before.title).toBe('Dev');
    expect(result.modified[0].after.title).toBe('Senior Dev');
  });

  it('handles no changes', () => {
    const before: Offer[] = [baseOffer];
    const after: Offer[] = [baseOffer];

    const result = diffOffers(before, after);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.modified).toHaveLength(0);
  });

  it('handles complex scenarios', () => {
    const offer2: Offer = { ...baseOffer, id: '2', title: 'Designer' };
    const offer3: Offer = { ...baseOffer, id: '3', title: 'PM' };

    const before = [baseOffer, offer2];
    const after = [{ ...baseOffer, company: 'NewCo' }, offer3];

    const result = diffOffers(before, after);
    expect(result.added).toHaveLength(1); // offer3
    expect(result.removed).toHaveLength(1); // offer2
    expect(result.modified).toHaveLength(1); // baseOffer modifié
  });
});
