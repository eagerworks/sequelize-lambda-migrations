import { MigrationsHandler } from './migrationsHandler';
import { Context, Callback } from 'aws-lambda';

export const createHandler = (handlerName: string) => {
  return async (_: any, context: Context, callback: Callback) => {
    try {
      context.callbackWaitsForEmptyEventLoop = false;

      const handler = new MigrationsHandler(process.env.MIGRATIONS_PATH);
      const response = await handler[handlerName]();

      callback(null, response);
    } catch (error: any) {
      console.log(error);
      callback(error);
    }
  };
};