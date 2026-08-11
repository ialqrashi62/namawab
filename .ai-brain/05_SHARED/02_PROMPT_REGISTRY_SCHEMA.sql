-- ============================================================
-- NamaMedical — Prompt Registry
-- Versioned, A/B testable, multi-locale prompts
-- ============================================================

CREATE SCHEMA IF NOT EXISTS prompts;

-- 1. Prompts (versions)
CREATE TABLE IF NOT EXISTS prompts.registry (
  id text PRIMARY KEY,                         -- e.g., 'cardiology.system.v1'
  category text NOT NULL CHECK (category IN ('system', 'user', 'rag', 'tool', 'chain')),
  name text NOT NULL,
  description text,
  version text NOT NULL,                       -- semver
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'deprecated', 'archived')),
  locales jsonb NOT NULL DEFAULT '{}',         -- { ar: { template, tokens_estimate }, en: {...} }
  model_preferences jsonb NOT NULL DEFAULT '{}',  -- { primary, fallback, local_fallback }
  parameters jsonb NOT NULL DEFAULT '{}',      -- { temperature, max_tokens, top_p, ... }
  guardrails text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id)
);

CREATE INDEX idx_registry_status ON prompts.registry (status) WHERE status = 'active';
CREATE INDEX idx_registry_category ON prompts.registry (category);
CREATE INDEX idx_registry_name ON prompts.registry (name);

-- 2. A/B test assignments (10% of traffic to B, 90% to A)
CREATE TABLE IF NOT EXISTS prompts.ab_assignments (
  prompt_id text REFERENCES prompts.registry(id) ON DELETE CASCADE,
  variant text NOT NULL CHECK (variant IN ('A', 'B')),
  traffic_pct real NOT NULL CHECK (traffic_pct BETWEEN 0 AND 1),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'won')),
  PRIMARY KEY (prompt_id, variant)
);

-- 3. Evaluation runs
CREATE TABLE IF NOT EXISTS prompts.eval_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id text NOT NULL REFERENCES prompts.registry(id) ON DELETE CASCADE,
  variant text NOT NULL,
  test_set_id text NOT NULL,
  metrics jsonb NOT NULL,                       -- { accuracy, citation_rate, safety_violations, ... }
  sample_count integer NOT NULL,
  model text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  evaluator text
);

CREATE INDEX idx_eval_runs_prompt ON prompts.eval_runs (prompt_id);
CREATE INDEX idx_eval_runs_started ON prompts.eval_runs (started_at DESC);

-- 4. Render history (every prompt use, for audit + cost analysis)
CREATE TABLE IF NOT EXISTS prompts.render_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id text NOT NULL,
  variant text,
  tenant_id uuid NOT NULL,
  user_id uuid,
  model text,
  rendered_template text NOT NULL,
  output_tokens integer,
  cost_usd real,
  latency_ms integer,
  success boolean,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_render_history_tenant ON prompts.render_history (tenant_id, created_at DESC);
CREATE INDEX idx_render_history_prompt ON prompts.render_history (prompt_id, created_at DESC);

-- RLS on render_history (tenant-scoped)
ALTER TABLE prompts.render_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts.render_history FORCE ROW LEVEL SECURITY;
CREATE POLICY render_history_tenant_isolation ON prompts.render_history
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 5. Helper: get active prompt with optional A/B variant
CREATE OR REPLACE FUNCTION prompts.fn_get_active(
  p_id text,
  p_locale text,
  p_user_id uuid DEFAULT NULL
) RETURNS TABLE (
  template text,
  variant text,
  model_preferences jsonb,
  parameters jsonb,
  guardrails text[]
) AS $$
DECLARE
  v_variant text;
  v_record record;
BEGIN
  -- Check for active A/B test
  SELECT variant INTO v_variant
  FROM prompts.ab_assignments
  WHERE prompt_id = p_id AND status = 'active'
    AND now() BETWEEN started_at AND COALESCE(ended_at, now() + interval '1 day')
  ORDER BY traffic_pct DESC
  LIMIT 1;

  -- For simplicity: just pick 'A' if multiple, use deterministic hash on user_id
  IF v_variant IS NULL AND p_user_id IS NOT NULL THEN
    -- 10% of users get 'B' if any A/B exists
    SELECT variant INTO v_variant
    FROM prompts.ab_assignments
    WHERE prompt_id = p_id AND status = 'active'
      AND now() BETWEEN started_at AND COALESCE(ended_at, now() + interval '1 day')
    LIMIT 1;

    IF v_variant IS NOT NULL THEN
      v_variant := CASE WHEN (abs(hashtext(p_user_id::text)) % 10) = 0 THEN 'B' ELSE 'A' END;
    END IF;
  END IF;

  -- Get the prompt
  IF v_variant IS NOT NULL THEN
    SELECT
      (r.locales -> p_locale ->> 'template')::text,
      v_variant,
      r.model_preferences,
      r.parameters,
      r.guardrails
    INTO v_record
    FROM prompts.registry r
    WHERE r.id = p_id || '.' || v_variant AND r.status = 'active';
  END IF;

  IF v_record IS NULL THEN
    SELECT
      (r.locales -> p_locale ->> 'template')::text,
      'A'::text,
      r.model_preferences,
      r.parameters,
      r.guardrails
    INTO v_record
    FROM prompts.registry r
    WHERE r.id = p_id AND r.status = 'active';
  END IF;

  RETURN QUERY SELECT v_record.template, v_record.variant, v_record.model_preferences, v_record.parameters, v_record.guardrails;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. Trigger: keep updated_at fresh
CREATE OR REPLACE FUNCTION prompts.fn_set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_registry_updated ON prompts.registry;
CREATE TRIGGER trg_registry_updated
  BEFORE UPDATE ON prompts.registry
  FOR EACH ROW EXECUTE FUNCTION prompts.fn_set_updated_at();

-- 7. Seed example prompts
INSERT INTO prompts.registry (id, category, name, description, version, status, locales, model_preferences, parameters, guardrails, metadata) VALUES
  (
    'cardiology.system.v1',
    'system',
    'Cardiology System Prompt',
    'System prompt for cardiology AI co-pilot',
    '1.0.0',
    'active',
    '{
      "ar": {"template": "أنت طبيب قلب متخصص. أجب بالعربية. استشهد بـ UpToDate، NICE، AHA. لا تشخيص بدون تأكيد.", "tokens_estimate": 80},
      "en": {"template": "You are a cardiology specialist AI. Cite UpToDate, NICE, AHA. No diagnosis without confirmation.", "tokens_estimate": 60},
      "fr": {"template": "Vous êtes un cardiologue IA. Citez UpToDate, NICE, AHA.", "tokens_estimate": 60}
    }'::jsonb,
    '{"primary": "gpt-4-turbo", "fallback": ["claude-3-5-sonnet-20241022"], "local_fallback": "llama3-70b"}'::jsonb,
    '{"temperature": 0.3, "max_tokens": 1000, "top_p": 0.95}'::jsonb,
    ARRAY['no_phi_disclosure', 'no_diagnosis_without_confirmation', 'must_cite_sources'],
    '{"dept": "cardiology", "tags": ["core", "cardiology"]}'::jsonb
  ),
  (
    'pharmacy.system.v1',
    'system',
    'Pharmacy System Prompt',
    'System prompt for pharmacy AI co-pilot',
    '1.0.0',
    'active',
    '{
      "ar": {"template": "أنت صيدلي سريري. تحقق من الجرعات، التداخلات، الحساسيات. أجب بالعربية. استشهد بـ Lexicomp, Micromedex, SFDA.", "tokens_estimate": 100}
    }'::jsonb,
    '{"primary": "gpt-4-turbo", "fallback": ["claude-3-5-sonnet-20241022"]}'::jsonb,
    '{"temperature": 0.2, "max_tokens": 1000}'::jsonb,
    ARRAY['check_dosage', 'check_interactions', 'check_allergies'],
    '{"dept": "pharmacy", "tags": ["core", "pharmacy", "safety-critical"]}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

GRANT USAGE ON SCHEMA prompts TO nama_app, nama_readonly;
GRANT SELECT, INSERT, UPDATE ON prompts.registry TO nama_app;
GRANT SELECT, INSERT, UPDATE ON prompts.ab_assignments TO nama_app;
GRANT SELECT, INSERT ON prompts.eval_runs TO nama_app;
GRANT SELECT, INSERT, UPDATE ON prompts.render_history TO nama_app;
GRANT SELECT ON prompts.registry, prompts.ab_assignments, prompts.eval_runs, prompts.render_history TO nama_readonly;
GRANT EXECUTE ON FUNCTION prompts.fn_get_active TO nama_app;
