# Final verification

- Four automated test groups passed, including direct PostgreSQL GRANT and RLS checks against two student identities.
- Production build passed with Next.js 16.4.5 using webpack.
- Browser/API checks passed: student profile updates, application save, admin application funnel, student SQL rejection, admin SQL role, preview rollback, persisted SQL update, and recovery after SQL error.
- SQL role screenshots and executed permission evidence are included in the source evidence directory.
- Existing-database migration was verified separately: the stored student profile was retained and the roles migration was applied without reseeding.
- The report is updated with database roles, RLS, the live SQL console, screenshots, and the rubric status.
- Individual responsibility and viva materials are prepared. Team responsibilities have been assigned at the team request. Historical authorship is not asserted; the viva is performed by the students and assessed by faculty.
- The vector encoder remains a documented lexical baseline. No trained semantic model, real scholarship rules, production deployment or awarded marks are claimed.

To use this update: stop the current project server, run npm run build and npm start from the ScholarMatch folder. The first request applies the database roles migration automatically to existing data. Do not run multiple server processes against the same PGlite data folder.
