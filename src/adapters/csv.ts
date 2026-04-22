import type { Offer } from '../schema.js';

export function parseCSV(content: string): Offer[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1);

  return rows.map((row, idx) => {
    const values = row.split(',').map((v) => v.trim());
    const record: Record<string, string> = {};

    headers.forEach((header, i) => {
      record[header] = values[i] || '';
    });

    return {
      id: record.id || `csv-${idx}`,
      title: record.title || record.job_title || '',
      company: record.company || record.company_name || '',
      location: record.location || undefined,
      remote: record.remote === 'true' || record.remote === '1',
      contractType: normalizeContractType(record.contract || record.type),
      salary: parseSalary(record.salary_min, record.salary_max, record.currency),
      postedAt: normalizeDate(record.posted_at || record.date),
      url: record.url || undefined,
    };
  });
}

function normalizeContractType(raw?: string): Offer['contractType'] {
  if (!raw) return 'other';
  const normalized = raw.toLowerCase();
  if (normalized.includes('cdi')) return 'CDI';
  if (normalized.includes('cdd')) return 'CDD';
  if (normalized.includes('freelance')) return 'freelance';
  if (normalized.includes('stage') || normalized.includes('intern')) return 'internship';
  return 'other';
}

function parseSalary(
  min?: string,
  max?: string,
  currency?: string
): Offer['salary'] {
  const parsedMin = min ? parseFloat(min) : undefined;
  const parsedMax = max ? parseFloat(max) : undefined;

  if (!parsedMin && !parsedMax) return undefined;

  return {
    min: parsedMin,
    max: parsedMax,
    currency: currency || 'EUR',
  };
}

function normalizeDate(raw?: string): string {
  if (!raw) return new Date().toISOString();
  
  // essayer de parser différentes variantes
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  
  return parsed.toISOString();
}
