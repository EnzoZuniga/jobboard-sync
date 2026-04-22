export const ExitCode = {
  OK: 0,
  VALIDATION_ERROR: 1,
  IO_ERROR: 2,
} as const;

export class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class IOError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'IOError';
  }
}
