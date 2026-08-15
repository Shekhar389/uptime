import { AppError } from './app-error.js';

export class QuotaExceededError extends AppError {
  constructor(message = 'Plan quota exceeded') {
    super(message, 402);
  }
}
