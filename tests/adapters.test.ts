import { describe, it, expect } from 'vitest';
import { parseCSV } from '../src/adapters/csv.js';
import { parseHelloWork } from '../src/adapters/hello-work.js';
import { parseFreework } from '../src/adapters/freework.js';

describe('CSV adapter', () => {
  it('parses basic CSV', () => {
    const csv = `id,title,company,contract,posted_at
job-1,Dev,Acme,CDI,2024-01-01T00:00:00Z`;

    const offers = parseCSV(csv);
    expect(offers).toHaveLength(1);
    expect(offers[0].id).toBe('job-1');
    expect(offers[0].title).toBe('Dev');
    expect(offers[0].company).toBe('Acme');
    expect(offers[0].contractType).toBe('CDI');
  });

  it('handles empty CSV', () => {
    const offers = parseCSV('');
    expect(offers).toHaveLength(0);
  });

  it('normalizes contract types', () => {
    const csv = `id,title,company,contract,posted_at
j1,A,X,cdi permanent,2024-01-01T00:00:00Z
j2,B,Y,Freelance,2024-01-01T00:00:00Z
j3,C,Z,Stage,2024-01-01T00:00:00Z`;

    const offers = parseCSV(csv);
    expect(offers[0].contractType).toBe('CDI');
    expect(offers[1].contractType).toBe('freelance');
    expect(offers[2].contractType).toBe('internship');
  });
});

describe('HelloWork adapter', () => {
  it('parses HelloWork JSON', () => {
    const json = JSON.stringify({
      resultats: [
        {
          offerId: 'hw-1',
          intitule: 'Dev Backend',
          entreprise: { nom: 'TechCorp' },
          lieuTravail: { libelle: 'Paris' },
          typeContrat: 'CDI',
          dateCreation: '2024-01-15T10:00:00Z',
        },
      ],
    });

    const offers = parseHelloWork(json);
    expect(offers).toHaveLength(1);
    expect(offers[0].id).toBe('hw-1');
    expect(offers[0].title).toBe('Dev Backend');
    expect(offers[0].company).toBe('TechCorp');
  });

  it('maps contract types', () => {
    const json = JSON.stringify({
      resultats: [
        {
          offerId: '1',
          intitule: 'Job',
          entreprise: { nom: 'Co' },
          lieuTravail: { libelle: 'City' },
          typeContrat: 'CDD',
          dateCreation: '2024-01-01T00:00:00Z',
        },
      ],
    });

    const offers = parseHelloWork(json);
    expect(offers[0].contractType).toBe('CDD');
  });
});

describe('Freework adapter', () => {
  it('parses Freework JSON', () => {
    const json = JSON.stringify({
      jobs: [
        {
          _id: 'fw-1',
          name: 'DevOps',
          company: 'CloudCo',
          city: 'Lyon',
          isRemote: true,
          contract_type: 'freelance',
          published_date: '2024-01-10T00:00:00Z',
        },
      ],
    });

    const offers = parseFreework(json);
    expect(offers).toHaveLength(1);
    expect(offers[0].id).toBe('fw-1');
    expect(offers[0].title).toBe('DevOps');
    expect(offers[0].remote).toBe(true);
    expect(offers[0].contractType).toBe('freelance');
  });

  it('handles salary fields', () => {
    const json = JSON.stringify({
      jobs: [
        {
          _id: '1',
          name: 'Job',
          company: 'Co',
          isRemote: false,
          contract_type: 'cdi',
          min_salary: 40000,
          max_salary: 50000,
          published_date: '2024-01-01T00:00:00Z',
        },
      ],
    });

    const offers = parseFreework(json);
    expect(offers[0].salary).toEqual({
      min: 40000,
      max: 50000,
      currency: 'EUR',
    });
  });
});
