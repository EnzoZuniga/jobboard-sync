import { parseCommand } from './parse.js';
import { diffOffers } from '../diff.js';

export function diffCommand(fileA: string, fileB: string): void {
  const offersA = parseCommand(fileA);
  const offersB = parseCommand(fileB);

  const result = diffOffers(offersA, offersB);

  console.log('=== Diff Results ===\n');
  console.log(`Added: ${result.added.length}`);
  console.log(`Removed: ${result.removed.length}`);
  console.log(`Modified: ${result.modified.length}\n`);

  if (result.added.length > 0) {
    console.log('--- Added ---');
    result.added.forEach((o) => console.log(`  + ${o.id}: ${o.title}`));
    console.log('');
  }

  if (result.removed.length > 0) {
    console.log('--- Removed ---');
    result.removed.forEach((o) => console.log(`  - ${o.id}: ${o.title}`));
    console.log('');
  }

  if (result.modified.length > 0) {
    console.log('--- Modified ---');
    result.modified.forEach(({ id, before, after }) => {
      console.log(`  ~ ${id}:`);
      console.log(`      before: ${before.title} @ ${before.company}`);
      console.log(`      after:  ${after.title} @ ${after.company}`);
    });
  }
}
