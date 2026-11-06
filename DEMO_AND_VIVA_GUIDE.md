# ScholarMatch demonstration and viva guide

Start: extract ScholarMatch, open a terminal in it, run npm ci, npm run build, npm start. Visit http://127.0.0.1:3000.

1. Sign in: student@demo.local / Student@123.
2. Show the profile and three matching fictional schemes. Explain why the research fellowship is excluded: its CGPA threshold is 9.
3. Set income to 999999. Save the profile and show no eligible schemes. Restore 250000.
4. Search engineering tuition. Explain that eligibility is SQL filtering and ranking is pgvector cosine distance.
5. Save or apply to a scheme. Show My applications and remove the demo entry.
6. Sign out. Sign in: admin@demo.local / Admin@123. Inspect application counts. Deactivate a scheme, then reactivate it.
7. Show sql/schema.sql, scripts/evidence.mjs, and tests/core.test.mjs. Explain PK, FK, UNIQUE, CHECK, transactions, trigger and CTE examples.

## Questions to rehearse

- Why PostgreSQL? Relational constraints, joins and transactional integrity.
- Why pgvector? Vector storage and cosine ranking in the same database; it satisfies the vector database alternative, not a separate NoSQL service.
- What is PGlite? A PostgreSQL engine compiled to WebAssembly, persisted locally and accessed by the trusted Next.js server.
- Is the encoder trained AI? No. It is a deterministic 384-dimensional hashed lexical baseline. It demonstrates vector mechanics, not reliable semantic understanding.
- Can similarity override eligibility? No. SQL filters first, vector ranking follows.
- Why a unique user/scheme pair? It prevents duplicate applications, including repeated button clicks.
- How are passwords stored? A random salt and scrypt derived hash; passwords are compared using a timing-safe comparison.
- How is role access controlled? Session identity is loaded on the server; admin endpoints check the stored role and invoke a database guard. Business requests now use scholar_student and scholar_admin PostgreSQL roles with GRANT privileges and RLS ownership policies. The roles are NOLOGIN because the database is embedded.
- What does the trigger do? It refreshes updated_at before a scheme or application update.
- Why compute application totals in a view? Counts remain consistent with actual records and avoid duplicated counter state.
- What did you modify? Eligibility now checks course, CGPA, state, category, dates and supported numeric criteria. Duplicate writes are constrained; totals are derived. Both students must be able to explain these changes.
- What remains for production? Hardened authentication, trained embeddings, verified scheme sources, production database hardening, deployment and monitoring.

## Individual contribution

Record your actual contributions before the viva. Assigned responsibility split: Sasyak — interface, vector search and testing; Shriya — database design, SQL, security and backend. This is a responsibility allocation, not a verified record of past work. Both students should explain the whole project. The project was prepared with AI assistance; no fabricated authorship history is included.

The supplied template did not identify faculty names or class section. Faculty details remain excluded as requested.

## Live database change during the demonstration

Sign in as admin and open SQL console. Run SELECT current_user; to show scholar_admin. Use Preview first, then uncheck Preview and save an UPDATE. Refresh the student application in a separate browser profile or private window. The web server stays running. A student SQL API call is rejected; direct database tests also prove that scholar_student cannot update schemes or access another student's records. Run npm test against DB_PATH=memory:// for the four test groups. The offline npm run sql console still requires stopping the server first.
