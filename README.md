# jobboard-sync

CLI tool normalizing heterogeneous job-offer exports into a unified schema.

## Architecture

Command-line application built with Commander.js, following a layered architecture:

- **Adapters layer**: parsers for each input format (CSV, HelloWork, Freework)
- **Schema layer**: Zod-based canonical Offer type with strict validation
- **Commands layer**: CLI operations (parse, diff, report)
- **Error handling**: custom error classes with exit codes

Each adapter translates its specific format to the canonical schema. The `parse` command auto-detects format by file extension and JSON structure.

## Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5 (strict mode, ESM)
- **CLI framework**: Commander.js
- **Validation**: Zod
- **Execution**: tsx (dev) / compiled JS (prod)
- **Testing**: Vitest

## Installation

```bash
npm install
```

## Commands

### `parse <file>`

Parses and validates a job export file. Outputs normalized JSON to stdout.

```bash
npm run cli -- parse fixtures/sample.csv
npm run cli -- parse fixtures/hello-work.json
```

Exit codes:
- `0`: success
- `1`: validation errors
- `2`: I/O errors

### `diff <fileA> <fileB>`

Compares two job export files and shows added, removed, and modified offers.

```bash
npm run cli -- diff fixtures/hello-work.json fixtures/freework.json
```

### `report <file>`

Generates statistics: total count, breakdown by contract type, salary info, remote offers, top companies.

```bash
npm run cli -- report fixtures/sample.csv
```

## Supported Formats

### CSV

Generic CSV with flexible column names:
- `id` or auto-generated
- `title` / `job_title`
- `company` / `company_name`
- `contract` / `type`
- `remote` (boolean)
- `salary_min`, `salary_max`, `currency`
- `posted_at` / `date`
- `location`, `url`

### HelloWork JSON

Structure:
```json
{
  "resultats": [
    {
      "offerId": "...",
      "intitule": "...",
      "entreprise": { "nom": "..." },
      "lieuTravail": { "libelle": "..." },
      "typeContrat": "...",
      "salaire": { "min": 0, "max": 0 },
      "dateCreation": "...",
      "origineOffre": { "urlOrigine": "..." }
    }
  ]
}
```

### Freework JSON

Structure:
```json
{
  "jobs": [
    {
      "_id": "...",
      "name": "...",
      "company": "...",
      "city": "...",
      "isRemote": false,
      "contract_type": "...",
      "min_salary": 0,
      "max_salary": 0,
      "published_date": "...",
      "apply_url": "..."
    }
  ]
}
```

## Running

```bash
npm install
npm test          # run tests
npm run typecheck # verify types
npm run cli -- parse fixtures/sample.csv
```

## Trade-offs

- **No streaming parser**: entire file loaded in memory (acceptable for typical export sizes < 10MB)
- **Simple diff algorithm**: O(n) with Map lookups, uses JSON.stringify for equality (fast enough, may miss semantic equivalence)
- **Auto-detection heuristics**: relies on file extension and JSON shape (could add magic number detection)
- **Contract type normalization**: lossy mapping to 5 canonical types (extensible via schema enum)
- **Date parsing fallback**: invalid dates default to `new Date()` (could be stricter depending on requirements)
