// filepath: test_tier147_engines.js
const modules = [
  { mod: 'tier147_rad_697', fns: ['ct','mri','us','xray','mammo'] },
  { mod: 'tier147_pat_698', fns: ['gross','micro','frozen','cyto','molecular'] },
  { mod: 'tier147_pha_699', fns: ['pharmacokinetics','pharmacogenomics','stewardship','compounding','clinical_pharm'] },
  { mod: 'tier147_pal_700', fns: ['consult','pain','symptom','goals_care','hospice'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier147_rad_697') {
    if (fn === 'ct') return { ...base, body_part: 'chest', contrast: 'IV', dose_mgy: 7, slice_mm: 3, findings_severity: 'normal', indication: 'PE', contrast_reaction: false };
    if (fn === 'mri') return { ...base, body_part: 'brain', contrast: 'gadolinium', field_strength: '3.0T', dose_mgy: 0, contrast_nephrogenic: false, claustrophobia: false, findings: 'WNL' };
    if (fn === 'us') return { ...base, type: 'abdominal', ga_weeks: 0, fetal_heart_activity: false, efw_grams: 0, bpd_mm: 0, ac_mm: 0, findings: 'normal' };
    if (fn === 'xray') return { ...base, view: 'PA', body_part: 'chest', kvp: 110, mas: 2, findings: 'normal', portable: false };
    if (fn === 'mammo') return { ...base, view: 'CC', breast_density: 'B_scattered', birads: '2', tomosynthesis: true, num_lesions: 0, recommendation: 'routine' };
  }
  if (modName === 'tier147_pat_698') {
    if (fn === 'gross') return { ...base, specimen_type: 'resection', size_cm: 3, weight_g: 50, num_blocks: 8, num_slides: 12, margins: 'negative', clinical_history: 'mass' };
    if (fn === 'micro') return { ...base, diagnosis: 'malignant', mitotic_rate: 5, ki67_pct: 30, lvi: false, pni: false, tumor_grade: 'G2', lymph_nodes_positive: '0', ihc: 'ER+' };
    if (fn === 'frozen') return { ...base, case_id: 'c1', frozen_to_permanent_time_min: 20, diagnosis: 'benign', margin_status: false, specimen_type: 'lumpectomy', discrepancy: false };
    if (fn === 'cyto') return { ...base, specimen: 'FNA_thyroid', bethesda: 'II_benign', thyroid_category: 'II', paris: 'negative', cell_count: 100, adequacy: 'adequate' };
if (fn === 'cyto_pap') return { ...base, specimen: 'Pap', bethesda: 'NA', thyroid_category: 'NA', paris: 'negative', cell_count: 100, adequacy: 'adequate' };
    if (fn === 'molecular') return { ...base, panel: 'lung', num_mutations: 3, tmb_high: false, msi: 'stable', pdl1_tps: '50+', actionable: true, driver_mutation: 'EGFR L858R' };
  }
  if (modName === 'tier147_pha_699') {
    if (fn === 'pharmacokinetics') return { ...base, drug: 'vancomycin', dose_mg: 1000, dose_interval_hr: 12, cmax: 30, tmax_hr: 2, auc: 400, half_life_hr: 6, clearance: 50, vd: 30, route: 'IV' };
    if (fn === 'pharmacogenomics') return { ...base, gene: 'CYP2C19', phenotype: 'poor', activity_score: '0', drug: 'clopidogrel', recommendation: 'alternative', dose_adjust_pct: 0 };
    if (fn === 'stewardship') return { ...base, antibiotic: 'vancomycin', days_of_therapy: 5, ddd: 2, appropriate: true, de_escalated: true, iv_to_po: 'switched', cost_usd: 100 };
    if (fn === 'compounding') return { ...base, type: 'sterile', iso_class: 'ISO_5', bud_days: 14, sterility_test: true, stability_test: true, ingredients: 'morphine,baclofen' };
    if (fn === 'clinical_pharm') return { ...base, activity: 'vanco_dosing', num_drugs_reviewed: 10, num_interventions: 3, num_problems: 1, severity: 'moderate', recommendation: 'adjust dose' };
  }
  if (modName === 'tier147_pal_700') {
    if (fn === 'consult') return { ...base, pps_pct: 60, disease_stage: 'advanced', prognosis_months: 6, pain_score: 4, goals: 'comfort', advance_directive: true, code_status: 'DNR' };
    if (fn === 'pain') return { ...base, type: 'neuropathic', pain_score: 6, morphine_equiv_mg_day: 60, route: 'PO', adverse_effects: false, laxative: 2, antiemetic: 1 };
    if (fn === 'symptom') return { ...base, symptom: 'dyspnea', severity: 5, treatment: 'pharmacologic', response_pct: 70, family_meeting: true, notes: 'OK' };
    if (fn === 'goals_care') return { ...base, code_status: 'DNR', advance_directive: true, healthcare_proxy: true, polst: true, meeting_count: 2, decision_maker: 'spouse', values: 'comfort' };
    if (fn === 'hospice') return { ...base, level: 'routine_home', eligible: true, referral: 'family', days_enrolled: 30, death_at_home: false, family_burden: 'moderate' };
  }
  return base;
}
let pass = 0, fail = 0;
for (const { mod, fns } of modules) {
  const m = require(`./${mod}_engine.js`);
  const F = m.funcs();
  for (const fn of fns) {
    try {
      F[fn](makeBody(mod, fn));
      console.log(`OK ${mod}.${fn}`);
      pass++;
    } catch (e) {
      console.error(`FAIL ${mod}.${fn}: ${e.message}`);
      fail++;
    }
  }
}
console.log(`TOTALS: pass=${pass} fail=${fail}`);
process.exit(fail > 0 ? 1 : 0);