import { MigrationsHandler } from '../src/migrationsHandler';
import { Umzug } from 'umzug';

jest.mock('sequelize', () => {
  const mockedSequelize = {
    close: jest.fn(),
    getQueryInterface: jest.fn(),
  };
  return { Sequelize: jest.fn(() => mockedSequelize) };
});

jest.mock('umzug');

describe('Migrations Handler tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const migrationsHandler = new MigrationsHandler('test/*.js');
  const migrations = [
    { name: 'test1', file: 'test/test1.js' },
    { name: 'test2', file: 'test/test2.js' },
  ];

  it('Should return that there are no pending migrations to apply', () => {
    jest.spyOn(Umzug.prototype, 'pending').mockReturnValue(Promise.resolve([]));
    expect(migrationsHandler.migrate()).resolves.toBe('No pending migrations to apply');
  });

  it('Should migrate correctly', () => {
    jest.spyOn(Umzug.prototype, 'up').mockReturnValue(Promise.resolve(migrations));
    jest.spyOn(Umzug.prototype, 'pending').mockReturnValue(Promise.resolve(migrations));

    expect(migrationsHandler.migrate()).resolves.toBe(
      'Succesfully applied 2 migrations:\ntest1\ntest2',
    );
  });

  it('Should return that there are no executed migrations to rollback', () => {
    jest.spyOn(Umzug.prototype, 'executed').mockReturnValue(Promise.resolve([]));
    expect(migrationsHandler.rollback()).resolves.toBe('No executed migrations to rollback');
  });

  it('Should rollback correctly', () => {
    const migration = { name: 'test1', file: 'test/test1.js' };

    jest.spyOn(Umzug.prototype, 'down').mockReturnValue(Promise.resolve([migration]));
    jest.spyOn(Umzug.prototype, 'executed').mockReturnValue(Promise.resolve([migration]));

    expect(migrationsHandler.rollback()).resolves.toBe('Succesfully rollbacked test1');
  });

  it('Should return that there are no executed migrations to reset', () => {
    jest.spyOn(Umzug.prototype, 'executed').mockReturnValue(Promise.resolve([]));
    expect(migrationsHandler.reset()).resolves.toBe('No executed migrations to rollback');
  });

  it('Should reset correctly', () => {
    jest.spyOn(Umzug.prototype, 'down').mockReturnValue(Promise.resolve(migrations));
    jest.spyOn(Umzug.prototype, 'executed').mockReturnValue(Promise.resolve(migrations));

    expect(migrationsHandler.reset()).resolves.toBe(
      'Succesfully rollbacked 2 migrations:\ntest1\ntest2',
    );
  });
});
