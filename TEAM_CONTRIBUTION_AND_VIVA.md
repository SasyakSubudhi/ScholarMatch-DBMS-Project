# Team contribution and viva preparation

Sasyak Subudhi — PES1UG24AM256 — GitHub SasyakSubudhi
Shriya Vasundhara Singh — PES1UG24AM269 — GitHub vasun26shriya

This is a proposed preparation and responsibility allocation. It is not a signed claim about who historically implemented the AI-assisted project. Confirm actual work before presenting it as individual contribution. The individual viva remains a faculty assessment.

| Student | Responsibility to prepare and demonstrate | Source/evidence |
|---|---|---|
| Sasyak | Relational design, SQL integrity, roles and RLS, API transactions | sql/schema.sql, sql/002_roles.sql, lib/access.mjs, tests/roles.test.mjs |
| Shriya | User interface, vector ranking, live SQL workflow, browser verification | app/page.js, lib/embedding.mjs, app/admin/sql/page.js, evidence/ |
| Both | Full application setup, schema relationships, SQL commands, security and limitations | README.md, report, demo guide |

## Sasyak rehearsal

Explain the primary and foreign keys and why the application pair is unique. Show a transaction and a constraint violation. Explain GRANT versus RLS: grants control operations; RLS controls which rows. Demonstrate that scholar_student cannot update schemes and can see only its own profile. Explain that SET LOCAL ROLE and user identity last only for the transaction. Explain the versioned migration and why it preserves existing data.

## Shriya rehearsal

Demonstrate login, profile filtering, ranking and the application tracker. Explain that vector cosine score ranks eligible schemes, not the student's probability of receiving funding. Demonstrate live SQL Preview versus Run and save. Explain the 384-dimensional lexical encoder limitation. Show the recorded browser and query evidence and explain how a failed authorization request was tested.

## Questions both students should answer

1. What problem does the project solve? Finding matching funding opportunities using structured eligibility and ranked retrieval.
2. Is pgvector a separate NoSQL server? No; it is a PostgreSQL vector extension and fulfills the vector option in the assignment.
3. Is matching trained AI? No; the current encoder is a deterministic hashed lexical baseline. Do not claim reliable semantic understanding.
4. What prevents duplicate applications? UNIQUE(user_id,scheme_id) and an upsert.
5. What happens when SQL Preview runs an UPDATE? The update executes, RETURNING rows are displayed, then the transaction rolls back.
6. How do saved changes reach the application? Both routes use the same running database; refresh the application after committing.
7. Why does a SQL console fail after signing in as Student in another tab? Cookies share the session across tabs on the same host. Use separate profiles for simultaneous roles.
8. Are database roles real? Yes; restricted PostgreSQL NOLOGIN roles are selected inside the embedded engine. No separate network logins are required.
9. What is not claimed? Real scheme eligibility, trained semantic AI, production deployment, measured scalability, or a completed individual viva.

## Actual contribution record

Record only work personally completed: what changed, which file/query it affected, how it was tested, and the result. Each member should be able to reproduce and explain their recorded work. No fabricated contributor commits or signatures are included.
