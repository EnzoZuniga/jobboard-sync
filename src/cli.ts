#!/usr/bin/env node

import { Command } from 'commander';
import { parseCommand } from './commands/parse.js';
import { diffCommand } from './commands/diff.js';
import { reportCommand } from './commands/report.js';
import { ExitCode, ValidationError, IOError } from './errors.js';

const program = new Command();

program
  .name('jobboard-sync')
  .description('Normalize heterogeneous job-offer exports')
  .version('0.1.0');

program
  .command('parse <file>')
  .description('Parse and validate a job export file')
  .action((file: string) => {
    try {
      const offers = parseCommand(file);
      console.log(JSON.stringify(offers, null, 2));
      process.exit(ExitCode.OK);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('diff <fileA> <fileB>')
  .description('Compare two job export files')
  .action((fileA: string, fileB: string) => {
    try {
      diffCommand(fileA, fileB);
      process.exit(ExitCode.OK);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('report <file>')
  .description('Generate statistics report for a job export file')
  .action((file: string) => {
    try {
      reportCommand(file);
      process.exit(ExitCode.OK);
    } catch (err) {
      handleError(err);
    }
  });

program.parse();

function handleError(err: unknown): never {
  if (err instanceof ValidationError) {
    console.error(`Validation Error: ${err.message}`);
    if (err.details) {
      console.error(err.details);
    }
    process.exit(ExitCode.VALIDATION_ERROR);
  }

  if (err instanceof IOError) {
    console.error(`IO Error: ${err.message}`);
    if (err.cause) {
      console.error(err.cause);
    }
    process.exit(ExitCode.IO_ERROR);
  }

  console.error('Unexpected error:', err);
  process.exit(ExitCode.IO_ERROR);
}
