'use strict';
const Cds = require('./tier137_cds_667_engine.js');
const Nlp = require('./tier137_nlp_668_engine.js');
const Img = require('./tier137_img_669_engine.js');
const Pred = require('./tier137_pred_670_engine.js');
const tests = [
  { e: 'cds', f: 'differential_dx', b: { tenant_id: 't1', patient_id: 'P1', symptoms: 'chest pain,shortness of breath', age: 55, sex: 'M', duration: '2 days', comorbidities: 'HTN,DM' } },
  { e: 'cds', f: 'risk_score', b: { tenant_id: 't1', patient_id: 'P2', score_name: 'CHA2DS2-VASc', value: 4, risk_tier: 'high', recommendation: 'anticoagulation', model_version: 'v2.1' } },
  { e: 'cds', f: 'drug_interaction', b: { tenant_id: 't1', patient_id: 'P3', drug_a: 'warfarin', drug_b: 'aspirin', severity: 'major', mechanism: 'bleeding_risk', recommendation: 'avoid_combination' } },
  { e: 'cds', f: 'sepsis_alert', b: { tenant_id: 't1', patient_id: 'P4', qsofa_score: 3, sirs_criteria: 4, lactate: 4.5, suspected_infection: true, severe_sepsis: true, sofa_score: 9 } },
  { e: 'cds', f: 'alert_fatigue', b: { tenant_id: 't1', provider_id: 'PR1', total_alerts: 1250, actionable: 180, overridden: 780, overridden_pct: 62.4, recommendation: 'tune_alert_thresholds' } },
  { e: 'nlp', f: 'ner_extract', b: { tenant_id: 't1', document_id: 'D1', text: 'patient has chest pain radiating to left arm', entity_type: 'finding', confidence: 0.95 } },
  { e: 'nlp', f: 'sentiment', b: { tenant_id: 't1', text: 'patient is concerned and anxious', sentiment: 'concerned', score: 0.78, context: 'subjective' } },
  { e: 'nlp', f: 'summarization', b: { tenant_id: 't1', document_id: 'D2', summary: '65yo M with chest pain, ECG shows STEMI, given aspirin', format: 'SOAP', original_length: 2400, summary_length: 120, model: 'med-llm-v3' } },
  { e: 'nlp', f: 'icd_coding', b: { tenant_id: 't1', document_id: 'D3', icd_code: 'I21.3', description: 'STEMI', confidence: 0.92, coding_system: 'ICD10', primary: true } },
  { e: 'nlp', f: 'transcription', b: { tenant_id: 't1', audio_id: 'A1', transcript: 'patient reports pain 7 out of 10', duration_sec: 45, word_count: 8, speaker: 'patient', language: 'en' } },
  { e: 'img', f: 'cnn_inference', b: { tenant_id: 't1', image_id: 'IMG1', modality: 'XRAY', model: 'chexpert', confidence: 0.91, prediction: 'atelectasis', heatmap_id: 'HM1' } },
  { e: 'img', f: 'lesion_detect', b: { tenant_id: 't1', image_id: 'IMG2', lesion_type: 'nodule', size_mm: 12, confidence: 0.85, malignant: false, location: 'RUL' } },
  { e: 'img', f: 'segmentation', b: { tenant_id: 't1', image_id: 'IMG3', target: 'tumor', volume_ml: 15.4, confidence: 0.88, completed: true, model: 'nnUNet' } },
  { e: 'img', f: 'registration', b: { tenant_id: 't1', image_id: 'IMG4', reference_id: 'REF1', dice_score: 0.92, hausdorff_mm: 3.5, method: 'deformable', duration_sec: 45 } },
  { e: 'img', f: 'triage', b: { tenant_id: 't1', image_id: 'IMG5', priority: 'STAT', confidence: 0.95, finding: 'tension_pneumothorax', worklist: 'critical', assigned_to: 'RAD_001' } },
  { e: 'pred', f: 'readmission', b: { tenant_id: 't1', patient_id: 'P5', days_since_dc: 5, risk_score: 0.72, risk_tier: 'high', lace_score: 11, contributing_factors: 'polypharmacy,poor_support', recommendation: 'phone_followup' } },
  { e: 'pred', f: 'mortality', b: { tenant_id: 't1', patient_id: 'P6', mortality_pct: 18.5, timeframe: '30d', model_used: 'APACHE_IV', saps_score: 45, apache_score: 72 } },
  { e: 'pred', f: 'los_predict', b: { tenant_id: 't1', patient_id: 'P7', predicted_los_days: 4.5, actual_los_days: 5, deviation: 0.5, admission_type: 'pneumonia', comorbidity_score: 3, model: 'ComorbidityLOS' } },
  { e: 'pred', f: 'fall_risk', b: { tenant_id: 't1', patient_id: 'P8', morse_score: 75, risk_tier: 'high', contributing_factors: 'age,history_falls', interventions: 'bed_alarm,fall_bands', risk_score: 0.85, provider: 'RN_001' } },
  { e: 'pred', f: 'deterioration', b: { tenant_id: 't1', patient_id: 'P9', ews_score: 11, mews_score: 7, critical_event: true, recommendation: 'rapid_response', notification_target: 'ICU_team', tier: 'red', provider: 'RN_002' } }
];
const engines = { cds: Cds.funcs(), nlp: Nlp.funcs(), img: Img.funcs(), pred: Pred.funcs() };
let pass = 0, fail = 0;
for (const t of tests) {
  try { const r = engines[t.e][t.f](t.b); if (r && typeof r === 'object') { console.log('PASS ' + t.e + '.' + t.f); pass++; } else { console.log('FAIL ' + t.e + '.' + t.f, r); fail++; } }
  catch (e) { console.log('FAIL ' + t.e + '.' + t.f + ' - ' + e.message); fail++; }
}
console.log('Engine self-test: PASS=' + pass + ' FAIL=' + fail);
process.exit(fail > 0 ? 1 : 0);
