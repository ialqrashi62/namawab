-- filepath: namaweb/migrations/e83_patient_feedback_surveys_up.sql
-- Wave 33: Patient Feedback + Satisfaction Surveys
-- Tables: patient_feedback, patient_surveys, survey_responses
DO $$ BEGIN
    CREATE TABLE IF NOT EXISTS patient_feedback (
        id BIGSERIAL PRIMARY KEY,
        tenant_id BIGINT NOT NULL,
        patient_id BIGINT,
        encounter_id BIGINT,
        department TEXT DEFAULT '',
        feedback_type TEXT DEFAULT 'general',
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT DEFAULT '',
        comment_ar TEXT DEFAULT '',
        is_resolved BOOLEAN DEFAULT false,
        resolved_by BIGINT,
        resolved_at TIMESTAMPTZ,
        resolution_notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'patient_feedback create skipped'; END $$;

DO $$ BEGIN
    CREATE TABLE IF NOT EXISTS patient_surveys (
        id BIGSERIAL PRIMARY KEY,
        tenant_id BIGINT NOT NULL,
        survey_code TEXT NOT NULL,
        title TEXT NOT NULL,
        title_ar TEXT DEFAULT '',
        description TEXT DEFAULT '',
        description_ar TEXT DEFAULT '',
        survey_type TEXT DEFAULT 'satisfaction',
        questions_json TEXT DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (tenant_id, survey_code)
    );
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'patient_surveys create skipped'; END $$;

DO $$ BEGIN
    CREATE TABLE IF NOT EXISTS survey_responses (
        id BIGSERIAL PRIMARY KEY,
        tenant_id BIGINT NOT NULL,
        survey_id BIGINT NOT NULL,
        patient_id BIGINT,
        overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 5),
        nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
        answers_json TEXT DEFAULT '{}',
        comments TEXT DEFAULT '',
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'survey_responses create skipped'; END $$;

DO $$ BEGIN ALTER TABLE patient_feedback ENABLE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'rls skip'; END $$;
DO $$ BEGIN ALTER TABLE patient_surveys ENABLE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'rls skip'; END $$;
DO $$ BEGIN ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'rls skip'; END $$;

DO $$ BEGIN
    EXECUTE 'ALTER TABLE patient_feedback FORCE ROW LEVEL SECURITY';
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'force_rls patient_feedback skip'; END $$;
DO $$ BEGIN
    EXECUTE 'ALTER TABLE patient_surveys FORCE ROW LEVEL SECURITY';
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'force_rls patient_surveys skip'; END $$;
DO $$ BEGIN
    EXECUTE 'ALTER TABLE survey_responses FORCE ROW LEVEL SECURITY';
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'force_rls survey_responses skip'; END $$;

DO $$ BEGIN
    EXECUTE 'CREATE POLICY tenant_isolation_pf ON patient_feedback USING (tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'policy patient_feedback exists'; END $$;
DO $$ BEGIN
    EXECUTE 'CREATE POLICY tenant_isolation_ps ON patient_surveys USING (tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'policy patient_surveys exists'; END $$;
DO $$ BEGIN
    EXECUTE 'CREATE POLICY tenant_isolation_sr ON survey_responses USING (tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'policy survey_responses exists'; END $$;
