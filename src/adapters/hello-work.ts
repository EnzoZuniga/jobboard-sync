import type { Offer } from '../schema.js';

interface HelloWorkOffer {
  offerId: string;
  intitule: string;
  entreprise: {
    nom: string;
  };
  lieuTravail: {
    libelle: string;
  };
  typeContrat: string;
  salaire?: {
    min?: number;
    max?: number;
  };
  dateCreation: string;
  origineOffre?: {
    urlOrigine?: string;
  };
}

interface HelloWorkExport {
  resultats: HelloWorkOffer[];
}

export function parseHelloWork(content: string): Offer[] {
  const data: HelloWorkExport = JSON.parse(content);

  if (!data.resultats || !Array.isArray(data.resultats)) {
    return [];
  }

  return data.resultats.map((item) => ({
    id: item.offerId,
    title: item.intitule,
    company: item.entreprise.nom,
    location: item.lieuTravail?.libelle,
    remote: false,
    contractType: mapContractType(item.typeContrat),
    salary: item.salaire
      ? {
          min: item.salaire.min,
          max: item.salaire.max,
          currency: 'EUR',
        }
      : undefined,
    postedAt: new Date(item.dateCreation).toISOString(),
    url: item.origineOffre?.urlOrigine,
  }));
}

function mapContractType(type: string): Offer['contractType'] {
  const upper = type.toUpperCase();
  if (upper.includes('CDI')) return 'CDI';
  if (upper.includes('CDD')) return 'CDD';
  if (upper.includes('FREELANCE') || upper.includes('INDEP')) return 'freelance';
  if (upper.includes('STAGE')) return 'internship';
  return 'other';
}
