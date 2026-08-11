#!/usr/bin/env node
// Wave 3D: Generate per-dept frontend UIs that call live API
'use strict';
const fs = require('fs');
const path = require('path');

const STAGING_DIR = '.ai-brain/05_ENGINES';
const stubs = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('_engine.js'));
const depts = stubs.map(f => f.replace('_engine.js', ''));

const DEPTS = [
    'family_medicine', 'geriatrics', 'dental', 'ophthalmology', 'ent',
    'sports_medicine', 'neurology', 'orthopedics', 'surgery',
    ...depts
];

const DEPT_NAMES = {
    family_medicine: 'Family Medicine',
    geriatrics: 'Geriatrics',
    dental: 'Dental',
    ophthalmology: 'Ophthalmology',
    ent: 'ENT',
    sports_medicine: 'Sports Medicine',
    neurology: 'Neurology',
    orthopedics: 'Orthopedics',
    surgery: 'Surgery',
    allergy: 'Allergy',
    anesthesia: 'Anesthesia',
    audiology: 'Audiology',
    burn_unit: 'Burn Unit',
    cardiac_rehab: 'Cardiac Rehab',
    ccu: 'CCU',
    chaplaincy: 'Chaplaincy',
    cicu: 'CICU',
    ctu: 'CTU',
    dermatology: 'Dermatology',
    dialysis: 'Dialysis',
    epilepsy: 'Epilepsy',
    fetal_medicine: 'Fetal Medicine',
    genetics: 'Genetics',
    headache: 'Headache',
    hematology: 'Hematology',
    icu: 'ICU',
    immunology: 'Immunology',
    infection_control: 'Infection Control',
    infectious_disease: 'Infectious Disease',
    ivf: 'IVF',
    maternal_fetal: 'Maternal-Fetal',
    memory_clinic: 'Memory Clinic',
    movement: 'Movement',
    movement_disorders: 'Movement Disorders',
    multiple_sclerosis: 'Multiple Sclerosis',
    neonatology: 'Neonatology',
    neuro_oncology: 'Neuro-Oncology',
    neurosurgery: 'Neurosurgery',
    nicu: 'NICU',
    nuclear_medicine: 'Nuclear Medicine',
    nutrition: 'Nutrition',
    occupational_therapy: 'Occupational Therapy',
    pain_management: 'Pain Management',
    palliative_care: 'Palliative Care',
    pathology: 'Pathology',
    physiotherapy: 'Physiotherapy',
    picu: 'PICU',
    plastic_surgery: 'Plastic Surgery',
    psychiatry: 'Psychiatry',
    pulmonary_rehab: 'Pulmonary Rehab',
    radiology: 'Radiology',
    rehabilitation: 'Rehabilitation',
    sleep_medicine: 'Sleep Medicine',
    social_work: 'Social Work',
    speech_therapy: 'Speech Therapy',
    stroke_unit: 'Stroke Unit',
    thoracic_surgery: 'Thoracic Surgery',
    transplant: 'Transplant',
    trauma_surgery: 'Trauma Surgery',
    urology: 'Urology',
    vascular_surgery: 'Vascular Surgery',
    wound_care: 'Wound Care',
};

// Pull engine names from stubs
function getEngines(dept) {
    const stubPath = path.join(STAGING_DIR, `${dept}_engine.js`);
    if (!fs.existsSync(stubPath)) return [];
    const content = fs.readFileSync(stubPath, 'utf8');
    const matches = [...content.matchAll(/^function\s+(\w+)\s*\(/gm)];
    return matches.map(m => m[1]).filter(fn => fn !== 'main' && !fn.startsWith('_'));
}

function buildPage(dept) {
    const engines = getEngines(dept);
    const name = DEPT_NAMES[dept] || dept;
    return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name} — NamaMedical</title>
  <link rel="stylesheet" href="/css/tailwind-compiled.css">
  <style>
    body { font-family: system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .header { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .engine-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .engine-card h3 { margin: 0 0 12px 0; color: #0f172a; }
    .engine-card textarea { width: 100%; min-height: 80px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: monospace; font-size: 13px; box-sizing: border-box; }
    .engine-card button { padding: 8px 16px; background: #0f766e; color: white; border: 0; border-radius: 6px; cursor: pointer; margin-top: 8px; }
    .engine-card button:hover { background: #14b8a6; }
    .result { background: #f1f5f9; padding: 12px; border-radius: 6px; margin-top: 12px; font-family: monospace; font-size: 12px; white-space: pre-wrap; max-height: 300px; overflow-y: auto; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-healthy { background: #d1fae5; color: #065f46; }
    .status-unhealthy { background: #fee2e2; color: #991b1b; }
    .status-unknown { background: #fef3c7; color: #78350f; }
    .breadcrumb { margin-bottom: 16px; font-size: 14px; color: #64748b; }
    .breadcrumb a { color: #0f766e; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <div class="container">
      <div class="breadcrumb"><a href="/">Home</a> / <a href="/departments/hub.html">Departments</a> / ${name}</div>
      <h1 style="margin: 0 0 8px 0;">${name}</h1>
      <p style="margin: 0; opacity: 0.9;">Clinical assessments for ${name.toLowerCase()} department</p>
      <p style="margin: 8px 0 0 0;"><span id="statusBadge" class="status-badge status-unknown">checking...</span></p>
    </div>
  </div>

  <div class="container">
    <h2>Available Assessments</h2>
    <p style="color: #64748b; margin-bottom: 24px;">Click "Run" to execute an assessment engine. Input is JSON.</p>
    ${engines.map(fn => `
    <div class="engine-card">
      <h3>${fn}</h3>
      <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0;">POST /api/${dept}/assessments/${fn}</p>
      <textarea id="input-${fn}" placeholder='{"patientId": "p1", "age": 45}'></textarea>
      <button onclick="runEngine('${fn}')">Run ${fn}</button>
      <div class="result" id="result-${fn}" style="display:none"></div>
    </div>
    `).join('\n')}
    ${engines.length === 0 ? '<p style="color: #64748b;">No assessment engines available yet.</p>' : ''}
  </div>

  <script>
    async function checkHealth() {
      try {
        const res = await fetch('/api/${dept}/health', { credentials: 'include' });
        const badge = document.getElementById('statusBadge');
        if (res.ok) {
          badge.className = 'status-badge status-healthy';
          badge.textContent = '✓ API online';
        } else {
          badge.className = 'status-badge status-unhealthy';
          badge.textContent = '✗ API error: ' + res.status;
        }
      } catch (e) {
        const badge = document.getElementById('statusBadge');
        badge.className = 'status-badge status-unhealthy';
        badge.textContent = '✗ Connection failed';
      }
    }

    async function runEngine(engineName) {
      const inputEl = document.getElementById('input-' + engineName);
      const resultEl = document.getElementById('result-' + engineName);
      let input;
      try {
        input = JSON.parse(inputEl.value || '{}');
      } catch (e) {
        resultEl.textContent = 'Invalid JSON: ' + e.message;
        resultEl.style.display = 'block';
        return;
      }
      resultEl.textContent = 'Running...';
      resultEl.style.display = 'block';
      try {
        const res = await fetch('/api/${dept}/assessments/' + engineName, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(input)
        });
        const data = await res.json();
        resultEl.textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        resultEl.textContent = 'Error: ' + e.message;
      }
    }

    checkHealth();
  </script>
</body>
</html>
`;
}

const OUT_DIR = 'namaweb/public/departments';
fs.mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const dept of DEPTS) {
    const html = buildPage(dept);
    fs.writeFileSync(path.join(OUT_DIR, `${dept}.html`), html);
    count++;
}
console.log(`Generated ${count} dept UI pages`);
console.log(`Output: ${OUT_DIR}/`);
