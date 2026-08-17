// filepath: gen_tier20.js
const fs = require('fs');

const routes = [
  [132, 'trial', 'trial_enrollment,trial_eligibility,trial_adverse,trial_protocol_deviation,trial_closeout'],
  [133, 'consent', 'consent_obtain,consent_amend,consent_withdrawal,consent_minor,consent_capacity'],
  [134, 'irb', 'irb_submission,irb_continuing_review,irb_adverse_report,irb_review_quorum,irb_decision'],
  [135, 'recruitment', 'recruit_screening,recruit_eligibility_check,recruit_consent_screen,recruit_database_match,recruit_metrics'],
  [136, 'biobank', 'sample_collection,sample_storage,sample_quality,sample_chain_of_custody,sample_disposal'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier20_research_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier20_research_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier20_research_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['t_enroll','/api/research_trial/trial_enrollment',{trial_id:'T1',subject_id:'S1',phase:'phase_2',target_enrollment:100,current_enrollment:50,screening_failures_30d:10,informed_consent_documented:true,consent_type:'study'}],
  ['t_elig','/api/research_trial/trial_eligibility',{subject_id:'S1',inclusion_criteria_met:true,exclusion_criteria_absent:true,consent_signed:true,pregnancy_excluded:true,investigator_signoff:true,number_exclusion_violated:0}],
  ['t_ae','/api/research_trial/trial_adverse',{event_id:'E1',event_type:'sae',causality:'possible',expectedness:'expected',days_from_start:14,reported_to_irb:true,reported_to_sponsor:true,serious_documented:true}],
  ['t_dev','/api/research_trial/trial_protocol_deviation',{deviation_id:'D1',deviation_type:'late_lab',severity:'minor',safety_impact:false,reported_to_irb:false,days_until_documented:1}],
  ['t_close','/api/research_trial/trial_closeout',{trial_id:'T1',queries_resolved:true,database_locked:true,cra_signed_off:true,pi_signed_off:true,biospecimens_finalized:true,irb_closure_letter:true}],

  ['c_obt','/api/research_consent/consent_obtain',{subject_id:'S1',trial_id:'T1',witness_present:true,legally_authorized_representative:false,subject_signed:true,investigator_signed:true,consent_date:'2026-08-01',consent_version:'v1_original',understanding_assessed:true}],
  ['c_amd','/api/research_consent/consent_amend',{amendment_id:'AM1',trial_id:'T1',irb_approved:true,approval_documented:true,active_subjects_reconsented:true,days_since_amendment:10,active_subjects_count:25}],
  ['c_wd','/api/research_consent/consent_withdrawal',{subject_id:'S1',withdrawal_documented:true,subject_notified_investigator:true,withdrawal_type:'full_withdrawal',days_since_withdrawal:2,specimen_disposal_documented:true}],
  ['c_minor','/api/research_consent/consent_minor',{subject_id:'S1',age_years:12,assent_obtained:true,parent_consent_signed:true,second_parent_required:false,second_parent_signed:false,state_min_age_medical:'school_age',mature_minor_documented:false}],
  ['c_cap','/api/research_consent/consent_capacity',{subject_id:'S1',capacity_status:'has_capacity',capability_assessment:true,lar_required:false,lar_present:false,lar_relationship_documented:false}],

  ['i_sub','/api/research_irb/irb_submission',{submission_id:'SUB1',review_type:'expedited',submission_status:'approved',target_review_days:60,study_complete_submitted:true,consent_draft_attached:true,pi_signature_attached:true}],
  ['i_cr','/api/research_irb/irb_continuing_review',{review_id:'CR1',days_until_continuing_review:90,last_continuing_review_days:300,enrollment_to_date:50,last_review_submitted:true,adverse_summary_attached:true,status:'on_track'}],
  ['i_ar','/api/research_irb/irb_adverse_report',{report_id:'R1',report_type:'sae_summary',days_to_report:5,irb_notified:true,acknowledgment_received:true,acknowledgment_status:'acknowledged'}],
  ['i_quo','/api/research_irb/irb_review_quorum',{review_id:'RV1',members_present:8,quorum_required:7,diverse_membership:true,unaffiliated_present:true,scientific_member_present:true,conflict_of_interest_review:true,minutes_recorded:true}],
  ['i_dec','/api/research_irb/irb_decision',{submission_id:'SUB1',decision:'approved',decision_documented:true,decision_letter_sent:true,conditions_count:0,investigator_reviewed:true}],

  ['r_scr','/api/research_recruitment/recruit_screening',{screening_id:'SC1',trial_id:'T1',criteria_count:5,criteria_met_count:5,criteria_violated_count:0,pre_screen_done:true,screening_outcome:'screen_pass',subject_consent_to_contact:true}],
  ['r_ec','/api/research_recruitment/recruit_eligibility_check',{subject_id:'S1',trial_id:'T1',age_match:true,diagnosis_match:true,prior_treatment_match:true,lab_match:true,exclusion_clear:true,mismatch_count:0}],
  ['r_cs','/api/research_recruitment/recruit_consent_screen',{subject_id:'S1',interest_expressed:true,pre_screening_consent_signed:true,privacy_authorization:true,follow_up_contact_agreed:true,contact_method:'phone',pre_screen_questions_asked:true}],
  ['r_db','/api/research_recruitment/recruit_database_match',{subject_id:'S1',ehr_match_available:true,match_type:'comprehensive_query',candidates_count:25,irb_approved_use_of_ehr:true,privacy_reviewed:true}],
  ['r_met','/api/research_recruitment/recruit_metrics',{trial_id:'T1',screened_count:100,enrolled_count:25,active_subjects:20,withdrew_count:3,completed_count:5}],

  ['s_coll','/api/research_biobank/sample_collection',{sample_id:'SM1',subject_id:'S1',specimen_type:'blood_serum',collection_tube:'serum_separator',volume_ml:10,time_to_process_min:60,two_identifier_check:true,informed_consent_signed:true}],
  ['s_store','/api/research_biobank/sample_storage',{sample_id:'SM1',storage_type:'minus_80',temperature_c:-80,time_in_storage_days:30,freezer_monitored:true,last_temperature_excursion_count:0,aliquots_count:'three'}],
  ['s_qual','/api/research_biobank/sample_quality',{sample_id:'SM1',quality_metric:'rna_integrity',value:9.5,threshold_pass:7,sample_status:'pass',repeat_possible:true}],
  ['s_coc','/api/research_biobank/sample_chain_of_custody',{sample_id:'SM1',from_user:'U1',to_user:'U2',transfer_documented:true,temp_maintained:true,electronic_signature:true,humidity_logged:35}],
  ['s_disp','/api/research_biobank/sample_disposal',{sample_id:'SM1',disposal_reason:'study_end',consent_withdrawal_check:true,regulatory_hold_check:true,documented_destruction:true,retention_complete_days:90}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\research_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_research_tier20.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);