/**
 * NamaMedical — Multi-Agent Dispatcher
 *
 * Dispatches parallel sub-agents for:
 * - 1 src + 1 test per sub-agent (V36/V37 token-safe pattern)
 * - 3 depts per batch (optimal)
 * - Each sub-agent returns structured JSON report
 *
 * @module multi-agent
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = process.cwd();
const AI_BRAIN = path.join(ROOT, '.ai-brain');
const TEMPLATES = path.join(AI_BRAIN, '00_SYSTEM');

/**
 * Build sub-agent prompt for a single dept
 */
function buildSubAgentPrompt(dept, files, opts = {}) {
  const { scope = '1src+1test', model = 'sonnet', wave = 'W06', indexHints = {} } = opts;
  const fileList = files.map((f) => `- ${f}`).join('\n');

  return `# NamaMedical — Sub-Agent for ${dept} (${wave})

## Mission
Generate the following files for department **${dept}**:

${fileList}

## Templates Available
Read these templates from \`${TEMPLATES}\`:
- 01_ARCHITECTURE_TEMPLATE_AR.md → docs/01_ARCHITECTURE_AR.md
- 02_DATA_MODEL_TEMPLATE_AR.md → docs/02_DATA_MODEL_AR.md
- 06_OPENAPI_TEMPLATE.yaml → api/openapi.yaml
- 07_USER_STORIES_TEMPLATE_AR.md → api/user_stories.md
- 08_TEST_CASES_TEMPLATE_AR.md → api/test_cases.md
- 10_MIGRATION_TEMPLATE.sql → migrations/migration_NN_up.sql + down
- 11_ENGINE_TEMPLATE.js → engine.js
- 12_ROUTER_TEMPLATE.js → router.js
- 15_PROMPT_REGISTRY_TEMPLATE.json → prompts/registry.json
- 17_LANGCHAIN_TEMPLATE.js → prompts/chaining.md
- 18_RAG_PIPELINE_TEMPLATE.js → vector/retrieval_pipeline.js
- 19_SECURITY_THREAT_MODEL_TEMPLATE_AR.md → docs/04_SECURITY_THREAT_MODEL_AR.md
- 23_DEPLOY_RUNBOOK_TEMPLATE_AR.md → ops/DEPLOY_RUNBOOK.md
- 27_HTML_PAGE_TEMPLATE.html → frontend/index.html
- 28_I18N_KEYS_TEMPLATE.json → frontend/i18n_ar.json + i18n_en.json + i18n_fr.json + i18n_ur.json
- 29_USER_MANUAL_TEMPLATE_AR.md → docs/USER_MANUAL_AR.md
- 03_DESIGN_SYSTEM_TEMPLATE_AR.md → frontend/app.css

## Scope (${scope})
- Generate ONLY the files listed above
- Use the templates as-is, just substitute {{DEPT_*}} placeholders
- Apply NamaMedical conventions: 7-tier RBAC, RLS, audit, i18n 4 locales, Arabic-first

## Placeholders to substitute
- {{DEPT_SLUG}} = "${dept}"
- {{DEPT_NAME_AR}} = "${indexHints.name_ar || dept}"
- {{DEPT_NAME_EN}} = "${indexHints.name_en || dept}"
- {{FACILITY_TYPE}} = "مستشفى"
- {{OWNER}} = "engineering@namamedical.sa"
- {{DATE}} = "2026-08-11"

## Output Paths
Write to: \`${path.join(AI_BRAIN, '02_MODULES_NEW', dept)}/\`

## Required Output (JSON)
After writing all files, return a JSON object:
\`\`\`json
{
  "dept": "${dept}",
  "files_written": ["engine.js", "router.js", ...],
  "lines_written": 1234,
  "tests_passing": 5,
  "build_pass": true,
  "errors": [],
  "warnings": [],
  "tokens_used": 8000
}
\`\`\`

## DO NOT
- ❌ Write any code not in the file list
- ❌ Modify shared files in src/lib/ or backend/
- ❌ Commit to git
- ❌ Run npm install or any global commands
- ❌ Open browser or do E2E

## DO
- ✅ Read templates carefully
- ✅ Write production-quality, no placeholders in code
- ✅ Include real medical knowledge (use UpToDate, NICE, ICD-10 codes)
- ✅ Arabic-first: write Arabic content, translate to EN/FR/UR
- ✅ Test before reporting (run \`npx vitest run tests/${dept}\`)
- ✅ Return the JSON report

## Token Budget
- ~8,000 tokens per dept (1 src + 1 test + 1 doc)
- Total per batch: ~24,000 tokens
- Total per wave (9 depts / 3 batches): ~72,000 tokens

Begin now.`;
}

/**
 * Dispatch a batch of sub-agents in parallel
 * In real use, this would use the mavis tool with agent_name: 'general' + run_in_background: true
 */
async function dispatchBatch(batch, opts = {}) {
  const { model = 'sonnet', wave = 'W06' } = opts;
  console.log(`\n[multi-agent] Dispatching batch ${batch.id} (${batch.departments.length} depts)`);

  const subAgents = batch.departments.map((dept, i) => ({
    id: `${batch.id}-${dept}`,
    dept,
    prompt: buildSubAgentPrompt(dept, batch.files_per_dept, { model, wave }),
    task: `sub-agent-${dept}`,
  }));

  return subAgents;
}

/**
 * Build file list per dept (51 files)
 */
function filesPerDept() {
  return [
    'engine.js',
    'engine_test.js',
    'router.js',
    'router_test.js',
    'route_schemas.js',
    'rbac_policies.js',
    'audit_instrumentation.js',
    'error_codes.js',
    'fixtures.js',
    'migrations/migration_01_up.sql',
    'migrations/migration_01_down.sql',
    'migrations/migration_01_test.js',
    'migrations/migration_02_up.sql',
    'migrations/migration_02_down.sql',
    'migrations/migration_02_test.js',
    'seeders/sample_data.json',
    'vector/embed_pipeline.js',
    'vector/retrieval_pipeline.js',
    'api/openapi.yaml',
    'api/user_stories.md',
    'api/test_cases.md',
    'frontend/index.html',
    'frontend/queue.html',
    'frontend/detail.html',
    'frontend/form.html',
    'frontend/settings.html',
    'frontend/app.js',
    'frontend/app.css',
    'frontend/icon.svg',
    'frontend/i18n_ar.json',
    'frontend/i18n_en.json',
    'frontend/i18n_fr.json',
    'frontend/i18n_ur.json',
    'prompts/system_prompt.md',
    'prompts/context_template.md',
    'prompts/workflow.md',
    'prompts/chaining.md',
    'prompts/vector_query.md',
    'prompts/registry.json',
    'prompts/co_pilot_router.js',
    'prompts/co_pilot_test.js',
    'docs/00_README.md',
    'docs/01_ARCHITECTURE_AR.md',
    'docs/02_DATA_MODEL_AR.md',
    'docs/04_SECURITY_THREAT_MODEL_AR.md',
    'docs/05_PERFORMANCE_BUDGET_AR.md',
    'docs/06_I18N_KEYS_AR.md',
    'docs/07_COMPLIANCE_MATRIX_AR.md',
    'docs/USER_MANUAL_AR.md',
    'docs/CHANGELOG_entry.md',
    'docs/EHR_BENCHMARK_AR.md',
    'legal/AUDIT_TRAIL_AR.md',
    'ops/DEPLOY_RUNBOOK.md',
    'ops/INCIDENT_PLAYBOOK.md',
    'ops/QA_TEST_PLAN.md',
  ];
}

module.exports = {
  buildSubAgentPrompt,
  dispatchBatch,
  filesPerDept,
};

if (require.main === module) {
  const waveId = process.argv[2] || 'W06';
  const deptsArg = process.argv[3] || 'family,geriatric,sports';
  const departments = deptsArg.split(',');
  const BATCH_SIZE = 3;
  const files = filesPerDept();

  for (let i = 0; i < departments.length; i += BATCH_SIZE) {
    const batchDepts = departments.slice(i, i + BATCH_SIZE);
    const batch = { id: `${waveId}-batch-${Math.floor(i / BATCH_SIZE) + 1}`, departments: batchDepts, files_per_dept: files };
    dispatchBatch(batch, { wave: waveId });
  }
}
