## A migration failed in PREVIEW, how do I fix the PREVIEW database

1. Open a new PR where you'll do the fix
1. Go to https://vercel.com/webstudio-is/webstudio/settings/environment-variables
1. Set APPLY_MIGRATIONS to "true" for your PR's branch
1. Fix the failed migration code
1. Fix the database mannually if the migration have been applied half-way
1. Temporarily change `ci:migrate` script to run `resolve` before applying migrations: `"ci:migrate": "migrations resolve rolled-back <name> --force && migrations migrate"`. Use `applied` instead of `rolled-back` if you manually applied the migration at previous step.
1. Commit the changes and check Vercel logs to see if the migration is applied
1. Change `ci:migrate` script back to normal
1. Merge the PR
1. Remove APPLY_MIGRATIONS from Vercel settings for your branch

## Transacation failed with a error "Transaction API error: Transaction already closed: Could not perform operation."

Most likely reason Prisma has thrown this error is because transaction has timed out.
If that's the case, you have the following options:

1. Optimize your migration to make it faster
2. Increase the timeout:

```js
export default () => {
  const client = new PrismaClient();
  return client.$transaction(
    async (prisma) => {
      // migration code...
    },
    {
      timeout: 1000 * 60 * 2, // in milliseconds, default 5000
    }
  );
};
```

3. Do not wrap the migration body into a transaction:

```js
export default async () => {
  const prisma = new PrismaClient();
  // use `prisma` here without wrapping it into a transaction
};
```

Note that in this case if the migration fails again, it will be harder to fix the database,
because the migration can end up half-way applied.
