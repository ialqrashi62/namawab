// filepath: gen_tier17.js
const fs = require('fs');

const routes = [
  [117, 'auth', 'portal_register,portal_login,portal_session,portal_password_reset,portal_audit'],
  [118, 'records', 'portal_lab_results,portal_radiology,portal_visit_summary,portal_medications,portal_immunization'],
  [119, 'appointments', 'portal_book_appt,portal_reschedule,portal_cancel,portal_checkin,portal_telehealth'],
  [120, 'billing', 'portal_view_balance,portal_payment,portal_payment_plan,portal_statement,portal_dispute'],
  [121, 'messaging', 'portal_message,portal_refill_request,portal_referral_request,portal_proxy_access,portal_consent'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier17_portal_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier17_portal_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier17_portal_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['a_reg','/api/portal_auth/portal_register',{patient_id:'P1',invite_method:'email',email:'a@b.com',phone:'555',identity_verified:true,id_method:'drivers_license',consent_signed:true}],
  ['a_login','/api/portal_auth/portal_login',{username:'a@b.com',mfa_method:'totp',attempts_30d:1,account_locked:false,password_expired:false,login_context:'web',geo_anomaly:false}],
  ['a_sess','/api/portal_auth/portal_session',{session_id:'S1',idle_minutes:5,max_idle_minutes:15,total_minutes:30,max_total_minutes:480,phi_accessed:true,idle_logout_enforced:true}],
  ['a_reset','/api/portal_auth/portal_password_reset',{user_id:'U1',reset_method:'email_link',identity_verified:true,resets_30d:1,password_strength_ok:true}],
  ['a_audit','/api/portal_auth/portal_audit',{user_id:'U1',event_type:'phi_view',phi_involved:true,ip_address:'1.2.3.4',unusual_pattern:false,severity:'info'}],

  ['r_lab','/api/portal_records/portal_lab_results',{patient_id:'P1',test_class:'cbc',abnormal_flag:false,critical_value:'none',provider_review_required:false,release_delay_hours:0,release_status:'released'}],
  ['r_rad','/api/portal_records/portal_radiology',{patient_id:'P1',study_type:'xray',report_signed:true,report_final:true,release_status:'released',sensitive_finding:false,addendum_present:false}],
  ['r_visit','/api/portal_records/portal_visit_summary',{patient_id:'P1',encounter_id:'E1',ccda_generated:true,ccda_signed:true,visit_lag_days:0,visit_type:'outpatient',patient_education_attached:true}],
  ['r_med','/api/portal_records/portal_medications',{patient_id:'P1',list_type:'active',reconciled_with_provider:true,prescriber_verified:true,dose_verified:true,medication_count:5}],
  ['r_imz','/api/portal_records/portal_immunization',{patient_id:'P1',vaccine_status:'current',forecast_generated:true,days_until_next_due:300,vaccine_class:'flu'}],

  ['ap_book','/api/portal_appointments/portal_book_appt',{patient_id:'P1',specialty:'primary_care',visit_mode:'in_person',urgency:'routine',preferred_days_ahead:14,patient_language:'english'}],
  ['ap_re','/api/portal_appointments/portal_reschedule',{appointment_id:'A1',reason:'patient_request',within_same_week:true,original_lead_days:7,rescheduled_lead_days:14}],
  ['ap_cxl','/api/portal_appointments/portal_cancel',{appointment_id:'A1',hours_until_appt:48,reason:'patient_sick',cancellation_count_30d:0,late_cancel:false}],
  ['ap_chk','/api/portal_appointments/portal_checkin',{appointment_id:'A1',id_confirmed:true,insurance_card_uploaded:true,consent_signed:true,questionnaire_completed:true,copay_paid:false,checkin_mode:'mobile'}],
  ['ap_tele','/api/portal_appointments/portal_telehealth',{appointment_id:'A1',platform:'zoom',device_test_passed:true,camera_works:true,microphone_works:true,bandwidth:'good',provider_join_min:2}],

  ['b_bal','/api/portal_billing/portal_view_balance',{patient_id:'P1',balance_total:250,balance_after_insurance:50,balance_status:'medium_balance_100_500',payment_plan_active:false,days_overdue:0}],
  ['b_pay','/api/portal_billing/portal_payment',{patient_id:'P1',amount:50,payment_method:'credit_card',card_tokenized:true,pci_compliant:true,transactions_24h:1}],
  ['b_plan','/api/portal_billing/portal_payment_plan',{patient_id:'P1',balance_total:500,monthly_payment:100,number_of_months:6,monthly_income:3000,hardship_review:false,plan_type:'standard'}],
  ['b_stmt','/api/portal_billing/portal_statement',{patient_id:'P1',statement_type:'summary',gfe_required:false,no_surprise_billing_compliant:true,days_until_send:5}],
  ['b_disp','/api/portal_billing/portal_dispute',{dispute_id:'D1',reason:'incorrect_charge',amount_disputed:200,days_since_charge:10,dispute_status:'open'}],

  ['m_msg','/api/portal_messaging/portal_message',{thread_id:'T1',message_type:'medication_question',urgency:'routine_3day',attachments_count:0,urgent_symptoms_flag:false,patient_id:'P1'}],
  ['m_rx','/api/portal_messaging/portal_refill_request',{patient_id:'P1',medication_id:'lisinopril_10mg',has_active_prescription:true,refills_remaining:true,request_source:'patient',last_fill_within_90d:true,days_since_last_fill:30}],
  ['m_ref','/api/portal_messaging/portal_referral_request',{patient_id:'P1',referral_specialty:'cardiology',urgency:'routine',insurance_auth_required:true,in_network:true,attempts_30d:0}],
  ['m_prx','/api/portal_messaging/portal_proxy_access',{proxy_id:'PR1',patient_id:'P1',proxy_type:'spouse',legal_doc_uploaded:true,identity_verified:true,patient_consent_signed:true,expiration_date_days:365}],
  ['m_cons','/api/portal_messaging/portal_consent',{patient_id:'P1',consent_type:'data_sharing_hie',consent_signed:true,revoked:false,withdrawn_documented:false,consent_date:'2026-01-01'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\portal_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_portal_tier17.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);