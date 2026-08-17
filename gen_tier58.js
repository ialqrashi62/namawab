// filepath: gen_tier58.js
const fs = require('fs');

const routes = [
  [323, 'res_trial', 'clinical_trial_enroll,clinical_trial_followup,clinical_trial_closeout,adverse_event_reporting,protocol_deviation'],
  [324, 'res_pub', 'manuscript_submission,peer_review_status,abstract_submission,poster_presentation,author_contribution'],
  [325, 'res_grant', 'grant_submission,grant_review_status,budget_justification,progress_report_grant,no_cost_extension'],
  [326, 'res_data', 'data_collection_form,data_quality_review,interim_analysis,data_lock,database_lock'],
  [327, 'res_ethics', 'irb_submission,irb_amendment,irb_continuing_review,consent_form_revision,subject_withdrawal'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier58_research_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier58_research_ext_${n}_${name}_engine');
const eps = [${epsArr}];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
`;
  fs.writeFileSync('tier58_research_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['r_cte','/api/res_trial/clinical_trial_enroll',{patient_id:'RT1','trial_id':'NCT12345678','phase':'phase_3','arm':'experimental','eligibility':'met','consent_signed':true,'enrollment_date':'2026-01-15','randomized':true}],
  ['r_ctf','/api/res_trial/clinical_trial_followup',{patient_id:'RT2','trial_id':'NCT12345678','visit':'month_6','adherence':'good','ae_grade':1,'status':'on_study','next_visit_planned':true}],
  ['r_ctc','/api/res_trial/clinical_trial_closeout',{patient_id:'RT3','trial_id':'NCT12345678','completion_reason':'protocol_complete','final_visit_done':true,'data_complete':true,'sponsor_closeout_submitted':true}],
  ['r_aer','/api/res_trial/adverse_event_reporting',{patient_id:'RT4','trial_id':'NCT12345678','ae_term':'grade_3_neutropenia','causality':'possibly_related','expected':true,'reported_to_sponsor':true,'reported_to_irb':true}],
  ['r_pdv','/api/res_trial/protocol_deviation',{patient_id:'RT5','trial_id':'NCT12345678','deviation_type':'visit_window_violation','severity':'minor','impact_on_safety':'none','documented':true,'reported_to_sponsor':false}],

  ['r_msu','/api/res_pub/manuscript_submission',{patient_id:'RB1','manuscript_id':'MS_2026_001','journal':'nejm','study_type':'rct','cohort_size':1200,'submission_date':'2026-02-15','status':'under_review','corresponding_author':'smith_j'}],
  ['r_prs','/api/res_pub/peer_review_status',{patient_id:'RB2','manuscript_id':'MS_2026_001','review_round':1,'reviewers_count':3,'decision':'minor_revision','revision_due_date':'2026-04-15','authors_responded':false}],
  ['r_abs','/api/res_pub/abstract_submission',{patient_id:'RB3','conference':'asco_2026','abstract_id':'AB_2026_012','submission_date':'2026-01-10','status':'accepted','presentation_format':'poster','authors_count':8}],
  ['r_pst','/api/res_pub/poster_presentation',{patient_id:'RB4','conference':'asco_2026','poster_id':'P_2026_012','presented_date':'2026-06-01','attendees_engaged':120,'feedback_received':true,'follow_up_contacts':12}],
  ['r_aco','/api/res_pub/author_contribution',{patient_id:'RB5','manuscript_id':'MS_2026_001','author_order':1,'contribution':'study_design_data_collection_manuscript_writing','criteric_acquisition':true,'final_approval':true}],

  ['r_gsu','/api/res_grant/grant_submission',{patient_id:'RG1','grant_id':'NIH_R01_2026','funding_agency':'nih','pi':'jones_a','amount_requested':1500000,'submission_date':'2026-02-10','co_investigators':5,'aims_count':3}],
  ['r_grs','/api/res_grant/grant_review_status',{patient_id:'RG2','grant_id':'NIH_R01_2026','review_round':1,'study_section':'clinical_oncology','score_percentile':12,'status':'funded','funding_start':'2026-09-01','duration_years':5}],
  ['r_bju','/api/res_grant/budget_justification',{patient_id:'RG3','grant_id':'NIH_R01_2026','year':1,'personnel':350000,'equipment':150000,'supplies':75000,'travel':25000,'other':100000,'total':700000}],
  ['r_prg','/api/res_grant/progress_report_grant',{patient_id:'RG4','grant_id':'NIH_R01_2026','reporting_year':2,'aims_completed':1,'aims_in_progress':2,'publications':5,'next_year_funding':700000,'status':'on_track'}],
  ['r_nce','/api/res_grant/no_cost_extension',{patient_id:'RG5','grant_id':'NIH_R01_2026','extension_months':12,'reason':'unexpected_data_collection_delay','irb_status':'approved','funder_status':'pending','requested_date':'2026-08-01'}],

  ['r_dcf','/api/res_data/data_collection_form',{patient_id:'RD1','form_id':'DCF_001','study':'NCT12345678','fields_total':45,'fields_completed':45,'completion_pct':100,'verified':true,'signed_by':'pi'}],
  ['r_dqr','/api/res_data/data_quality_review',{patient_id:'RD2','study':'NCT12345678','queries_open':12,'queries_resolved':120,'resolution_rate_pct':91,'audit_findings':'none','next_review_date':'2026-03-01'}],
  ['r_ina','/api/res_data/interim_analysis',{patient_id:'RD3','study':'NCT12345678','enrolled_target':300,'enrolled_current':156,'safety_review':'planned','efficacy_interim':'planned','dsmb_meeting_date':'2026-06-15','recommendation':'continue'}],
  ['r_dlk','/api/res_data/data_lock',{patient_id:'RD4','study':'NCT12345678','lock_type':'interim','database_clean_status':'completed','queries_resolved':true,'signatures_collected':true,'lock_date':'2026-05-01','unlock_allowed':false}],
  ['r_dbl','/api/res_data/database_lock',{patient_id:'RD5','study':'NCT12345678','lock_type':'final','database_clean_status':'completed','statistical_analysis_plan':'final','signatures_collected':true,'lock_date':'2026-12-15','unlock_allowed':false}],

  ['r_irb','/api/res_ethics/irb_submission',{patient_id:'RE1','irb_number':'IRB_2026_001','study':'novel_oncology_trial','risk_level':'greater_than_minimal','review_type':'full_board','approval_status':'approved','approval_date':'2026-01-10','expiration_date':'2027-01-10'}],
  ['r_ira','/api/res_ethics/irb_amendment',{patient_id:'RE2','irb_number':'IRB_2026_001','amendment_number':1,'amendment_type':'protocol_modification','changes_summary':'added_new_arm','approval_status':'approved','approval_date':'2026-03-15','implementation_date':'2026-04-01'}],
  ['r_irc','/api/res_ethics/irb_continuing_review',{patient_id:'RE3','irb_number':'IRB_2026_001','reporting_period':'year_1','enrolled_total':48,'sae_count':2,'protocol_deviations':1,'status':'approved','next_review_due':'2027-01-10'}],
  ['r_cfr','/api/res_ethics/consent_form_revision',{patient_id:'RE4','irb_number':'IRB_2026_001','version':2,'revision_reason':'updated_risk_section','changes_summary':'added_new_risk','translation_languages':['arabic','english'],'reconsent_required':true,'approval_status':'approved'}],
  ['r_swd','/api/res_ethics/subject_withdrawal',{patient_id:'RE5','irb_number':'IRB_2026_001','subject_id':'S_001','withdrawal_reason':'patient_choice','data_to_be_retained':true,'samples_to_be_destroyed':false,'documented_in_chart':true,'reported_to_irb':false}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\res_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_res_tier58.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);