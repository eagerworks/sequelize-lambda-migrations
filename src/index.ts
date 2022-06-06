import { createHandler } from './createHandler';

export const migrate = createHandler('migrate');
export const rollback = createHandler('rollback');
export const reset = createHandler('reset');
