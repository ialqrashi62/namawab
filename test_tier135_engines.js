'use strict';
const Gen = require('./tier135_gen_689_engine.js');
const Pcu = require('./tier135_pcu_690_engine.js');
const Rob = require('./tier135_rob_691_engine.js');
const Irc = require('./tier135_irc_688_engine.js');
const tests = [
  { e: 'gen', f: 'genetic_test', b: { tenant_id: 't1', patient_id: 'P1', panel: 'BRCA', specimen: 'blood', indications: 'family history', provider: 'gc_001' } },
  { e: 'gen', f: 'variant_call', b: { tenant_id: 't1', test_id: 'T1', gene: 'BRCA1', variant: 'c.5266dupC', classification: 'pathogenic', zygosity: 'heterozygous', clinical_significance: 'high_risk' } },
  { e: 'gen', f: 'counseling', b: { tenant_id: 't1', patient_id: 'P1', test_id: 'T1', counselor: 'gc_001', duration_min: 60, results_discussion: 'positive_pathogenic', recommendations: 'high_risk_screening' } },
  { e: 'gen', f: 'family_history', b: { tenant_id: 't1', patient_id: 'P2', relative: 'mother', relationship: 'mother', condition: 'breast_cancer', age_onset: 45, dna_confirmed: true } },
  { e: 'gen', f: 'risk_calc', b: { tenant_id: 't1', patient_id: 'P3', variant: 'BRCA1', condition: 'breast_cancer', lifetime_risk_pct: 72, relative_risk: 4.5, screening_rec: 'annual MRI+MMG' } },
  { e: 'pcu', f: 'picu_admission', b: { tenant_id: 't1', patient_id: 'P4', age_years: 8, weight_kg: 28, admission_type: 'respiratory', prism_score: 12, diagnosis: 'asthma_exacerbation' } },
  { e: 'pcu', f: 'vent_mgmt', b: { tenant_id: 't1', patient_id: 'P5', mode: 'PRVC', tidal_volume_ml: 180, peep: 8, fio2: 40, rate: 18, provider: 'picu_001' } },
  { e: 'pcu', f: 'sedation', b: { tenant_id: 't1', patient_id: 'P6', drug: 'dexmedetomidine', dose_mcg_kg_min: 0.7, sedation_score: -2, target_sedation_score: -1, provider: 'picu_001' } },
  { e: 'pcu', f: 'ecmo', b: { tenant_id: 't1', patient_id: 'P7', mode: 'VV', indication: 'ARDS', flow_l_min: 4.2, cannulation: 'femoral', provider: 'ecmo_001' } },
  { e: 'pcu', f: 'code_event', b: { tenant_id: 't1', patient_id: 'P8', type: 'asystole', duration_min: 15, rosc_achieved: true, outcome: 'ICU_admission', provider: 'picu_001' } },
  { e: 'rob', f: 'preop', b: { tenant_id: 't1', patient_id: 'P9', asa: '2', airway: 'Mallampati2', consent_signed: 1, surgical_site: 'abdomen', planned_proc: 'robotic_prostatectomy' } },
  { e: 'rob', f: 'console', b: { tenant_id: 't1', patient_id: 'P10', system: 'DaVinci', procedure: 'prostatectomy', dock_time_min: 15, console_time_min: 150, surgeon: 'sg_001' } },
  { e: 'rob', f: 'outcomes', b: { tenant_id: 't1', patient_id: 'P11', endpoint: 'margin_status', value: 'negative', timeframe: '30d', reporting: 'pathology' } },
  { e: 'rob', f: 'training', b: { tenant_id: 't1', surgeon_id: 'sg_002', system: 'DaVinci', module: 'advanced', hours: 40, sim_score: 92, evaluator: 'sg_001' } },
  { e: 'rob', f: 'complication', b: { tenant_id: 't1', patient_id: 'P12', clavien_dindo: '2', event: 'UTI', intraop_postop: 'postop_7d', management: 'antibiotics', outcome: 'resolved' } },
  { e: 'irc', f: 'angio', b: { tenant_id: 't1', patient_id: 'P13', vessel: 'coronary', access: 'radial', contrast_ml: 75, provider: 'irc_001' } },
  { e: 'irc', f: 'stenting', b: { tenant_id: 't1', patient_id: 'P14', vessel: 'LAD', stent_size_mm: 3.0, stent_length_mm: 18, stent_type: 'DES', provider: 'irc_001' } },
  { e: 'irc', f: 'embolization', b: { tenant_id: 't1', patient_id: 'P15', target: 'fibroid', agent: 'beads', dose_mg: 500, provider: 'irc_001' } },
  { e: 'irc', f: 'thrombectomy', b: { tenant_id: 't1', patient_id: 'P16', location: 'stroke', technique: 'stent_retriever', tici_score: 3, provider: 'irc_001' } },
  { e: 'irc', f: 'ablation', b: { tenant_id: 't1', patient_id: 'P17', target: 'liver', modality: 'MWA', session_duration_min: 45, provider: 'irc_001' } }
];
const engines = { gen: Gen.funcs(), pcu: Pcu.funcs(), rob: Rob.funcs(), irc: Irc.funcs() };
let pass = 0, fail = 0;
for (const t of tests) {
  try { const r = engines[t.e][t.f](t.b); if (r && typeof r === 'object') { console.log('PASS ' + t.e + '.' + t.f); pass++; } else { console.log('FAIL ' + t.e + '.' + t.f, r); fail++; } }
  catch (e) { console.log('FAIL ' + t.e + '.' + t.f + ' - ' + e.message); fail++; }
}
console.log('Engine self-test: PASS=' + pass + ' FAIL=' + fail);
process.exit(fail > 0 ? 1 : 0);
