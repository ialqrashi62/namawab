-- ============================================================
-- audit_trail_super_admin_view_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT DDL APPROVAL.
-- الهدف: قراءة super-admin العابرة للمستأجر لـ audit_trail (تدقيق/امتثال) عبر دور قارئ مخصص
--   محكوم، **دون** BYPASSRLS، **دون** SUPERUSER، **دون** فتح audit_trail لكل المستأجرين،
--   **دون** تعطيل FORCE RLS، و**دون** إضعاف عزل بقية الجداول.
--
-- الآلية: سياسة SELECT سماحية **مقيّدة بالدور** (TO nama_audit_reader) تُدمج (OR) مع سياسة
--   audit_trail_select_tenant القائمة. النتيجة:
--     * nama_audit_reader  => يرى كل صفوف audit_trail (عابر المستأجر) — للتدقيق فقط (SELECT).
--     * nama_medical_app وأي دور آخر => يبقى مقيّداً بمستأجره (لا تغيير).
--   الدور NOLOGIN/NOSUPERUSER/NOBYPASSRLS، وبلا أي صلاحية على جداول أخرى.
-- ============================================================
BEGIN;

-- دور قارئ تدقيق بأقل امتياز (لا login/super/bypassrls/createdb/createrole)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_audit_reader') THEN
    CREATE ROLE nama_audit_reader NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE;
  END IF;
END $$;

-- صلاحية القراءة فقط على audit_trail (لا INSERT/UPDATE/DELETE) + استخدام المخطط
GRANT USAGE ON SCHEMA public TO nama_audit_reader;
GRANT SELECT ON audit_trail TO nama_audit_reader;

-- سياسة SELECT سماحية مقيّدة بهذا الدور فقط => قراءة عابرة للمستأجر له وحده
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='audit_trail' AND policyname='audit_trail_select_superadmin') THEN
    CREATE POLICY audit_trail_select_superadmin ON audit_trail FOR SELECT TO nama_audit_reader USING (true);
  END IF;
END $$;

COMMIT;

-- ============================================================
-- التفعيل (قرار المالك، خارج هذا الملف — لا يُضمَّن هنا حفاظاً على التحفّظ):
--   الخيار A (الأكثر تحفّظاً): ALTER ROLE nama_audit_reader LOGIN PASSWORD '<سر خارج الشات>';
--       واستخدام اتصال super-admin منفصل للتدقيق. دور التطبيق nama_medical_app لا يكتسب أي قدرة جديدة.
--   الخيار B (الأيسر): GRANT nama_audit_reader TO nama_medical_app؛ ويستدعي التطبيق
--       SET ROLE nama_audit_reader **فقط** داخل مسارات تدقيق مُصرّح بها للسوبر أدمن، ثم RESET ROLE.
--       يتطلب بوابة تفويض على مستوى التطبيق (app-layer gate) + تسجيل وصول.
-- متابعة كود (إن اختير B): مسار/مسارات قراءة تدقيق super-admin فقط تضبط الدور مؤقتاً.
-- ============================================================
