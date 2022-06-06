import { Dialect, QueryInterface, Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

export class MigrationsHandler {
  private migrationsPath: string;
  private sequelize: Sequelize;
  private umzug: Umzug<QueryInterface>;

  private initSequelize() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        port: parseInt(process.env.DB_PORT),
        dialect: process.env.DB_DIALECT as Dialect,
        host: process.env.DB_HOST,
      },
    );
  }

  private initUmzug(migrationsGlob: string) {
    this.umzug = new Umzug({
      migrations: {
        glob: migrationsGlob,
        resolve: ({ name, path, context }) => {
          const { up, down } = require(path);
          return {
            name,
            up: async () => up(context, Sequelize),
            down: async () => down(context, Sequelize),
          };
        },
      },
      context: this.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.sequelize }),
      logger: console,
    });
  }

  constructor(migrationsPath: string) {
    console.log('Setting up connections');
    this.migrationsPath = migrationsPath;
    this.initSequelize();
    this.initUmzug(this.migrationsPath);
  }

  public async migrate() {
    const pending = await this.umzug.pending();

    if (pending.length === 0) {
      this.sequelize.close();
      return 'No pending migrations to apply';
    }

    const migrations = await this.umzug.up();
    const migrationNames = migrations.map((migration) => migration.name);
    this.sequelize.close();

    return `Succesfully applied ${migrations.length} migrations:\n${migrationNames.join('\n')}`;
  }

  public async rollback() {
    const executed = await this.umzug.executed();

    if (executed.length === 0) {
      this.sequelize.close();
      return 'No executed migrations to rollback';
    }

    const migration = await this.umzug.down();
    this.sequelize.close();
    return `Succesfully rollbacked ${migration?.[0]?.name}`;
  }

  public async reset() {
    const executed = await this.umzug.executed();

    if (executed.length === 0) {
      this.sequelize.close();
      return 'No executed migrations to rollback';
    }

    const migrations = await this.umzug.down({ to: 0 as const });
    const migrationNames = migrations.map((migration) => migration.name);
    this.sequelize.close();

    return `Succesfully rollbacked ${migrations.length} migrations:\n${migrationNames.join('\n')}`;
  }
}
