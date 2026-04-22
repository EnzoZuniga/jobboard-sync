import type { Offer } from '../schema.js';

interface FreeworkJob {
  _id: string;
  name: string;
  company: string;
  city?: string;
  isRemote: boolean;
  contract_type: string;
  min_salary?: number;
  max_salary?: number;
  published_date: string;
  apply_url?: string;
}

interface FreeworkExport {
  jobs: FreeworkJob[];
}

export function parseFreework(content: string): Offer[] {
  const data: FreeworkExport = JSON.parse(content);

  if (!data.jobs || !Array.isArray(data.jobs)) {
    return [];
  }

  return data.jobs.map((job) => ({
    id: job._id,
    title: job.name,
    company: job.company,
    location: job.city,
    remote: job.isRemote,
    contractType: mapContractType(job.contract_type),
    salary:
      job.min_salary || job.max_salary
        ? {
            min: job.min_salary,
            max: job.max_salary,
            currency: 'EUR',
          }
        : undefined,
    postedAt: new Date(job.published_date).toISOString(),
    url: job.apply_url,
  }));
}

function mapContractType(type: string): Offer['contractType'] {
  const lower = type.toLowerCase();
  if (lower === 'cdi' || lower === 'permanent') return 'CDI';
  if (lower === 'cdd' || lower === 'fixed-term') return 'CDD';
  if (lower === 'freelance' || lower === 'contractor') return 'freelance';
  if (lower === 'internship' || lower === 'stage') return 'internship';
  return 'other';
}
