import { readFileSync } from 'fs';
import { OfferSchema } from '../schema.js';
import { IOError, ValidationError } from '../errors.js';
import { parseCSV } from '../adapters/csv.js';
import { parseHelloWork } from '../adapters/hello-work.js';
import { parseFreework } from '../adapters/freework.js';
import type { Offer } from '../schema.js';

export function parseCommand(filePath: string): Offer[] {
  let content: string;

  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new IOError(`Cannot read file: ${filePath}`, err);
  }

  const offers = detectAndParse(content, filePath);

  // valider chaque offre avec Zod
  const validated: Offer[] = [];
  const errors: string[] = [];

  offers.forEach((offer, idx) => {
    const result = OfferSchema.safeParse(offer);
    if (result.success) {
      validated.push(result.data);
    } else {
      errors.push(`Offer ${idx}: ${result.error.message}`);
    }
  });

  if (errors.length > 0) {
    throw new ValidationError(
      `${errors.length} validation error(s)`,
      errors
    );
  }

  return validated;
}

function detectAndParse(content: string, filePath: string): Offer[] {
  // détecter le format par extension ou structure
  if (filePath.endsWith('.csv')) {
    return parseCSV(content);
  }

  try {
    const json = JSON.parse(content);
    
    if (json.resultats && Array.isArray(json.resultats)) {
      return parseHelloWork(content);
    }
    
    if (json.jobs && Array.isArray(json.jobs)) {
      return parseFreework(content);
    }

    throw new ValidationError('Unknown JSON format');
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    
    // fallback CSV
    return parseCSV(content);
  }
}
