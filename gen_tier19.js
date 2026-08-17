// filepath: gen_tier19.js
const fs = require('fs');

const routes = [
  [127, 'coding', 'code_icd10cm,code_cpt,code_drg,code_hcc,code_query'],
  [128, 'roi', 'roi_authorization,roi_verify_identity,roi_request_log,roi_third_party,roi_audit'],
  [129, 'deficiency', 'deficiency_list,deficiency_type,deficiency_assignment,deficiency_complete,deficiency_metrics'],
  [130, 'audit', 'audit_concurrent,audit_scoring,audit_focused,audit_trend,audit_correction'],
  [131, 'release', 'doc_release,doc_completeness,doc_amendment,doc_cosign,doc_audit'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier19_him_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier19_him_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier19_him_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['c_icd','/api/him_coding/code_icd10cm',{code:'E11.9',description:'Type 2 DM',code_type:'icd10cm',coding_context:'inpatient_primary',specificity_check:true,is_secondary:false,exclude_flag:'none'}],
  ['c_cpt','/api/him_coding/code_cpt',{cpt_code:'99223',description:'Initial hosp',cpt_category:'category_i',units:1,modifier_count:0,medical_necessity_documented:true,modifier_22:'none'}],
  ['c_drg','/api/him_coding/code_drg',{encounter_id:'E1',drg_class:'medical',drg_weight:1.5,gmlos:4,actual_los:5,complication_or_comorbidity:true,major_cc:false,primary_procedure:false}],
  ['c_hcc','/api/him_coding/code_hcc',{patient_id:'P1',hcc_category:'diabetes_complicated',risk_score:1.2,documented_current_year:true,suspected_hcc:false}],
  ['c_query','/api/him_coding/code_query',{query_id:'Q1',query_type:'principal_dx',query_status:'sent_to_provider',days_open:5,provider_response_required:true,clinical_evidence_attached:true}],

  ['r_auth','/api/him_roi/roi_authorization',{auth_id:'A1',patient_id:'P1',patient_signature:true,sign_date:'2026-08-01',expiration_set:true,days_until_expiration:30,requestor_type:'patient',purpose:'continuing_care'}],
  ['r_id','/api/him_roi/roi_verify_identity',{request_id:'R1',verification_method:'drivers_license',drivers_license_match:true,dob_verified:true,ssn_last4_verified:true,address_verified:true,third_party_authorization_attached:false}],
  ['r_log','/api/him_roi/roi_request_log',{request_id:'R1',patient_id:'P1',request_status:'in_process',days_open:5,statutory_deadline_passing:false,delivery_method:'portal_download',fee_charged:false}],
  ['r_3p','/api/him_roi/roi_third_party',{recipient_id:'RCV1',recipient_type:'insurance',patient_authorization:true,auth_date:'2026-08-01',minimum_necessary_review:true,sensitive_phi_present:false,sensitive_phi_reviewed:false}],
  ['r_aud','/api/him_roi/roi_audit',{audit_id:'A1',user_id:'U1',event_type:'phi_view',records_accessed_count:5,unusual_access:false,self_access:false,investigated:false}],

  ['d_list','/api/him_deficiency/deficiency_list',{chart_id:'C1',total_deficiencies:3,critical_count:0,days_open:15,provider_type:'physician',escalation:'second_notice',hold_billing:false}],
  ['d_type','/api/him_deficiency/deficiency_type',{deficiency_id:'D1',deficiency_type:'history_physical',days_overdue:5,hold_billing:false,priority:'medium',completion_required:true}],
  ['d_asn','/api/him_deficiency/deficiency_assignment',{deficiency_id:'D1',assigned_to:'DR_Smith',assigned_by:'him_director',notification_sent:true,notification_method:'email',days_to_due:7,reminder_set:true}],
  ['d_done','/api/him_deficiency/deficiency_complete',{deficiency_id:'D1',completion_method:'addendum',provider_signed:true,timed_correctly:true,attestation_corrected:true,days_overdue_at_completion:2}],
  ['d_metric','/api/him_deficiency/deficiency_metrics',{department:'Medicine',open_count:50,completed_30d:200,total_charts:500,avg_days_to_complete:8,critical_open:3}],

  ['a_conc','/api/him_audit/audit_concurrent',{encounter_id:'E1',audit_type:'concurrent',dx_documented:true,treatment_plan:true,medication_orders_clear:true,consent_signed:true,coding_quality:true,auditor_id:'him_coder'}],
  ['a_score','/api/him_audit/audit_scoring',{audit_id:'A1',compliance_pct:88,critical_finds:0,total_items_audited:50,threshold:'pass_90',action_plan_attached:true,audit_period:'monthly'}],
  ['a_foc','/api/him_audit/audit_focused',{audit_id:'A1',focus_area:'medication_safety',cases_reviewed:20,findings_count:3,actionable_findings:true,report_to:'quality_council'}],
  ['a_trend','/api/him_audit/audit_trend',{audit_period:'2026-Q3',period_compliance_pct:85,previous_compliance_pct:80,trend_3_periods:-2,direction:'declining',target_pct:90}],
  ['a_corr','/api/him_audit/audit_correction',{finding_id:'F1',correction_status:'open',days_open:30,follow_up_scheduled:true,corrected_documented:false,recurrence_risk:false}],

  ['dr_rel','/api/him_release/doc_release',{doc_id:'DOC1',doc_type:'discharge_summary',release_status:'signed_pending_release',signed:true,days_since_created:5}],
  ['dr_comp','/api/him_release/doc_completeness',{chart_id:'CH1',required_docs_count:10,completed_docs_count:10,missing_docs_count:0,all_signed:true,all_attested:true,discharge_disposition:'home'}],
  ['dr_amend','/api/him_release/doc_amendment',{amendment_id:'AM1',original_doc_id:'DOC1',addendum_attached:true,amendment_reason:'additional_info',timed_correctly:true,signed_correctly:true,original_preserved:true}],
  ['dr_cosign','/api/him_release/doc_cosign',{doc_id:'DOC1',cosign_required_by:'attending',cosign_received:true,days_since_drafted:3,attending_provider_active:true,cosign_overdue:false}],
  ['dr_aud','/api/him_release/doc_audit',{doc_id:'DOC1',timed_correctly:true,authenticated:true,dictated_when_signed:false,signed_within_required_window:true,window_hours:'48h',lag_hours:6}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\him_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_him_tier19.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);