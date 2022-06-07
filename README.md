# Sequelize Lambda Migrations

## Usage

In order to use the package first set up the following environment variables:

- `DB_NAME`: database name
- `DB_USERNAME`: database username
- `DB_PASSWORD`: database password
- `DB_PORT`: database port
- `DB_DIALECT`: database dialect (postgress/mysql)
- `DB_HOST`: database host
- `MIGRATIONS_PATH`: glob to the migrations files (e.g. `src/db/migrations/*.js`)

Then import the lambda functions from the package and use it directly on your serverless file.

`serverless.yml`

```yml
functions:
  migrate:
    handler: handler.migrate
    timeout: 60
  rollback:
    handler: handler.rollback
    timeout: 60
  reset:
    handler: handler.reset
    timeout: 60
```

`handler.ts`

```typescript
import { migrate, rollback, reset } from '@eagerworks/sequelize-lambda-migrations';

export { migrate, rollback, reset };
```

One can later invoke the functions to migrate or rollback the database.

```
serverless invoke --function <migrate|rollback|reset> --stage <myStage> --aws-profile <myProfile> --region <myRegion>
```
