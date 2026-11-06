-- Versioned migration; applied to existing data without resetting student work.
DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='scholar_student') THEN
  CREATE ROLE scholar_student NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='scholar_admin') THEN
  CREATE ROLE scholar_admin NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
 END IF;
END $$;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO scholar_student,scholar_admin;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC,scholar_student,scholar_admin;
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO scholar_admin;
GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO scholar_admin;
GRANT SELECT ON schemes,eligibility_criteria,required_documents,scheme_faqs,scheme_embeddings TO scholar_student;
GRANT SELECT(user_id,full_name,email,role) ON users TO scholar_student;
GRANT SELECT,INSERT,UPDATE ON student_profiles TO scholar_student;
GRANT SELECT,INSERT,UPDATE,DELETE ON applications TO scholar_student;
GRANT SELECT,INSERT ON query_logs TO scholar_student;
GRANT USAGE ON SEQUENCE applications_application_id_seq,query_logs_log_id_seq TO scholar_student;
REVOKE ALL ON FUNCTION eligible(INT),require_admin(INT),touch_updated() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION eligible(INT) TO scholar_student,scholar_admin;
GRANT EXECUTE ON FUNCTION require_admin(INT),touch_updated() TO scholar_admin;
-- The view must use caller privileges rather than its owner's access.
ALTER VIEW v_scheme_application_stats SET (security_invoker=true);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_self ON users TO scholar_student
 USING(user_id=NULLIF(current_setting('app.user_id',true),'')::INT);
CREATE POLICY profile_self ON student_profiles TO scholar_student
 USING(user_id=NULLIF(current_setting('app.user_id',true),'')::INT)
 WITH CHECK(user_id=NULLIF(current_setting('app.user_id',true),'')::INT);
CREATE POLICY application_self ON applications TO scholar_student
 USING(user_id=NULLIF(current_setting('app.user_id',true),'')::INT)
 WITH CHECK(user_id=NULLIF(current_setting('app.user_id',true),'')::INT);
CREATE POLICY query_self ON query_logs TO scholar_student
 USING(user_id=NULLIF(current_setting('app.user_id',true),'')::INT)
 WITH CHECK(user_id=NULLIF(current_setting('app.user_id',true),'')::INT);
CREATE POLICY admin_users ON users TO scholar_admin USING(true) WITH CHECK(true);
CREATE POLICY admin_profiles ON student_profiles TO scholar_admin USING(true) WITH CHECK(true);
CREATE POLICY admin_applications ON applications TO scholar_admin USING(true) WITH CHECK(true);
CREATE POLICY admin_queries ON query_logs TO scholar_admin USING(true) WITH CHECK(true);
