# ScholarMatch AI Scholarship and Government Scheme Matcher

DBMS Level 3 mini project. **Sasyak Subudhi — PES1UG24AM256** ([SasyakSubudhi](https://github.com/SasyakSubudhi)); **Shriya Vasundhara Singh — PES1UG24AM269** ([vasun26shriya](https://github.com/vasun26shriya)).

## Run

Install Node.js 22 or later. In this folder run `npm ci`, `npm run build`, then `npm start`. Open http://127.0.0.1:3000. Development: `npm run dev`.

Student: `student@demo.local` / `Student@123`. Admin: `admin@demo.local` / `Admin@123`. These are public demo accounts; use no personal data. Localhost only.

The first API request creates and seeds `data/`. PostgreSQL runs through PGlite (Postgres compiled to WebAssembly) with the real pgvector extension. No Docker, cloud account or API key is needed. Stop the server before opening the same data directory from another process. Back up data while stopped. To reset, stop the server and rename `data` to `data-backup`.

## Verify

PowerShell: `$env:DB_PATH='memory://'; npm test`. Unset DB_PATH afterwards: `Remove-Item Env:DB_PATH`.
Generate SQL execution evidence on an isolated database: `$env:DB_PATH='memory://'; node scripts/evidence.mjs`.

## Implemented

Next.js App Router, authenticated student and administrator screens, scrypt password hashes, opaque expiring HttpOnly sessions, persisted profiles, SQL eligibility function, parameterized API queries, application save/apply/delete, admin activation control, database admin guard, vector cosine retrieval with 384 dimensions and HNSW index, SQL constraints, joins, nested queries, recursive CTE, triggers and transactions.

## Scope and limitations

All four schemes are fictional. “Apply” records a local demo application. The embedding is a deterministic hashed bag of words, **not a trained language model**; it demonstrates vector storage and ranking, with lexical rather than reliable semantic matching. pgvector is a vector extension inside PostgreSQL, not a separate NoSQL server. PGlite uses one trusted server database principal; database authorization uses a guard function supplied with the server-resolved user identity, rather than PostgreSQL LOGIN roles or RLS. A production multi-user server should add per-role privileges/RLS, HTTPS Secure cookies, CSRF tokens, login throttling, migrations, trained embeddings, audited scheme feeds and deployment monitoring.

## Project layout

`app/page.js` UI; `app/api/[...action]/route.js` API; `lib/db.mjs` database initialization and password functions; `lib/embedding.mjs` vectors; `sql/schema.sql` DDL; `scripts/evidence.mjs` executed DML/vector/advanced query examples; `tests/core.test.mjs` automated tests; `evidence/` captured results.

## Team preparation

Suggested study split, not a claim about historical work: Sasyak studies schema, SQL, API and transactions; Shriya studies interface, vector retrieval, screenshots and testing. Both should understand all modules and record their actual contributions and modifications before the individual viva. AI-assisted implementation and documentation were prepared for this submission; no fake commit attribution is used.

## Sources

- https://nextjs.org/docs/app/getting-started/route-handlers
- https://github.com/pgvector/pgvector
- https://pglite.dev/docs/

## Interactive SQL console

Stop every running ScholarMatch server with Ctrl+C before opening the same database. Run `npm run sql` from this directory. Enter SQL ending with a semicolon; multiline queries and multiple statements are supported. `.tables` lists relations, `.schema` shows the initialization schema, and `.quit` closes the database. Then run `npm start` to view saved changes in the application. This console has full local database access: INSERT, UPDATE, DELETE and DDL change the saved database. For a reversible practice session, start with `BEGIN;` and finish with `ROLLBACK;`. Run `COMMIT;` only to keep your transaction changes. If DB_PATH is set to memory://, the console uses a temporary database instead of the saved application database.

Example:
```sql
SELECT scheme_id, name, max_income FROM schemes;
SELECT scheme_id, name FROM eligible(1);
BEGIN;
UPDATE schemes SET max_income=600000 WHERE scheme_id=1;
SELECT scheme_id, name, max_income FROM schemes WHERE scheme_id=1;
ROLLBACK;
```

## Live SQL while the website runs

Sign in as admin and click SQL console, or open /admin/sql. It shares the running application's database connection. Enter one statement and run it. Preview is enabled by default and rolls back mutations. Uncheck Preview and choose Run and save to commit changes, then refresh the application tab. SQL errors roll back the request. BEGIN/COMMIT/ROLLBACK commands are managed by the server; each request is a separate transaction. Queries have a 5 second statement timeout; results display at most 500 rows. This is a powerful localhost admin demonstration tool, not a public production feature. Students and unauthenticated users are denied by the API. Do not use the standalone npm run sql process while the web server is running.
