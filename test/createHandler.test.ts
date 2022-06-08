import { MigrationsHandler } from '../src/migrationsHandler';
import { createHandler } from '../src/createHandler';

jest.mock('../src/migrationsHandler');

describe('Tests for createHandler', () => {
  const dummyContext = {
    awsRequestId: '123456',
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'test',
    functionVersion: '1.0.0',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test',
    memoryLimitInMB: '128',
    logGroupName: 'testGroup',
    logStreamName: 'testStream',
    getRemainingTimeInMillis: jest.fn(),
    done: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn(),
  };

  it('should correctly return and execute the handler', async () => {
    const handler = createHandler('migrate');
    expect(handler).toBeDefined();

    jest
      .spyOn(MigrationsHandler.prototype, 'migrate')
      .mockReturnValue(Promise.resolve('Succesfully applied 2 migrations:\ntest1\ntest2'));

    const callback = jest.fn();

    await handler({}, dummyContext, callback);
    expect(callback).toHaveBeenCalledWith(null, 'Succesfully applied 2 migrations:\ntest1\ntest2');
  });

  it('should return the handler and throw an error', async () => {
    const handler = createHandler('migrate');
    expect(handler).toBeDefined();

    jest
      .spyOn(MigrationsHandler.prototype, 'migrate')
      .mockReturnValue(Promise.reject('Error while running migrate'));

    const callback = jest.fn();
    await handler({}, dummyContext, callback);

    expect(callback).toHaveBeenCalledWith('Error while running migrate');
  });
});
