import { parseCommand } from './parse.js';

export function reportCommand(filePath: string): void {
  const offers = parseCommand(filePath);

  console.log('=== Report ===\n');
  console.log(`Total offers: ${offers.length}\n`);

  const byContractType = groupBy(offers, (o) => o.contractType);
  console.log('By contract type:');
  Object.entries(byContractType).forEach(([type, list]) => {
    console.log(`  ${type}: ${list.length}`);
  });
  console.log('');

  const withSalary = offers.filter((o) => o.salary);
  console.log(`Offers with salary info: ${withSalary.length}`);

  const remoteOffers = offers.filter((o) => o.remote);
  console.log(`Remote offers: ${remoteOffers.length}`);

  const byCompany = groupBy(offers, (o) => o.company);
  const topCompanies = Object.entries(byCompany)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  console.log('\nTop 5 companies:');
  topCompanies.forEach(([company, list]) => {
    console.log(`  ${company}: ${list.length} offer(s)`);
  });
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}
