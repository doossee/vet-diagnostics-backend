#!/bin/sh
# Apply any pending Prisma schema migrations, then start the app.
# Idempotent: a no-op when the database is already up to date (e.g. restored
# from a dump). Runs on every container start; depends_on guarantees the DB is
# healthy first.
set -e

echo "[entrypoint] prisma migrate deploy ..."
node_modules/.bin/prisma migrate deploy

echo "[entrypoint] starting: $*"
exec "$@"
