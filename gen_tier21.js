// filepath: gen_tier21.js
const fs = require('fs');

const routes = [
  [137, 'provider', 'provider_availability,provider_preference,provider_timeoff,provider_panel,provider_credential'],
  [138, 'call', 'call_assign,call_coverage,call_swap,call_locums,call_pay'],
  [139, 'template', 'template_create,template_apply,template_block,template_override,template_metrics'],
  [140, 'waitlist', 'waitlist_add,waitlist_match,waitlist_purge,noshow_track,patient_access'],
  [141, 'appointment', 'appt_book,appt_conflict,appt_reschedule,appt_cancel,appt_slot_optimize'],
  [142, 'staff', 'staff_assign_shift,staff_coverage,staff_request,staff_overtime,staff_competency'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier21_sched_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier21_sched_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier21_sched_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['p_avail','/api/sched_provider/provider_availability',{provider_id:'P1',day_of_week:'mon',session:'morning',sessions_per_week:8,max_daily_visits:25,max_weekly_visits:150,telehealth_included:true,active:true}],
  ['p_pref','/api/sched_provider/provider_preference',{provider_id:'P1',preference_type:'continuity',start_date:'2026-08-01',days_applied:60,approved:true,manager_reviewed:true}],
  ['p_to','/api/sched_provider/provider_timeoff',{request_id:'TO1',provider_id:'P1',days_requested:5,pto_type:'vacation',coverage_planned:true,patients_notified:true,approval:'approved',pto_balance_days:20}],
  ['p_panel','/api/sched_provider/provider_panel',{provider_id:'P1',panel_size:1500,target_panel:2000,new_patients_accepted:50,panel_status:'open',age_distribution_under_18_pct:20,age_distribution_over_65_pct:25}],
  ['p_cred','/api/sched_provider/provider_credential',{provider_id:'P1',medical_license_current:true,dea_license_current:true,board_certification_current:true,malpractice_current:true,hospital_privileges_current:true,days_until_license_renewal:180}],

  ['c_asn','/api/sched_call/call_assign',{call_id:'C1',provider_id:'P1',call_type:'primary',call_duration:'weekday_night',backup_documented:true,avg_responses_30d:5,avg_callback_min:15}],
  ['c_cov','/api/sched_call/call_coverage',{date:'2026-08-15',call_slots_required:3,call_slots_filled:3,primary_filled:true,backup_filled:true,coverage_period:'weekday',avg_response_min:15}],
  ['c_swap','/api/sched_call/call_swap',{swap_id:'SW1',from_provider:'P1',to_provider:'P2',days_until_call:7,peer_approval:true,scheduler_approval:true,credential_verified:true}],
  ['c_loc','/api/sched_call/call_locums',{locums_id:'L1',provider_id:'PL1',days_required:30,license_in_state:true,privileges_granted:true,credentialed:true,hourly_rate:250}],
  ['c_pay','/api/sched_call/call_pay',{call_id:'C1',pay_basis:'per_call',pay_amount:300,holiday_pay:true,calls_taken_30d:5,hours_on_call_30d:50}],

  ['t_cre','/api/sched_template/template_create',{template_id:'T1',template_name:'Standard Week',recurrence:'weekly',duration_weeks:13,sessions_per_template:5,clinical_lead_approved:true,admin_approved:true}],
  ['t_app','/api/sched_template/template_apply',{template_id:'T1',slots_generated:100,slots_conflicts:5,total_provider_availability:8,apply_mode:'additive',approved_to_publish:true}],
  ['t_blk','/api/sched_template/template_block',{block_id:'B1',provider_id:'P1',block_type:'clinic',duration_min:240,recurrence_weeks:13,color_assigned:true}],
  ['t_ovr','/api/sched_template/template_override',{override_id:'OV1',original_block_id:'B1',override_type:'cancel',advance_notice_24h:true,notified_patients:true,affected_patients_count:10}],
  ['t_met','/api/sched_template/template_metrics',{period:'2026-Q3',slots_total:500,slots_filled:425,slots_no_show:50,slots_cancelled:25,target_fill_rate_pct:80}],

  ['w_add','/api/sched_waitlist/waitlist_add',{waitlist_id:'W1',patient_id:'P1',provider_id:'PR1',urgency:'routine',days_waiting:14,contact_preference:'phone',special_needs:false}],
  ['w_mat','/api/sched_waitlist/waitlist_match',{waitlist_id:'W1',opening_slots:3,match_score:'high_match',urgency_compatibility:'exact',special_needs_compatible:true,contacted:true}],
  ['w_pur','/api/sched_waitlist/waitlist_purge',{purge_id:'PR1',days_inactive:400,contact_attempts:4,contact_reached:false,purge_reason:'patient_unreachable',removal_letter_sent:true}],
  ['w_ns','/api/sched_waitlist/noshow_track',{patient_id:'P1',no_show_count_12m:2,appointments_count_12m:10,cancellations_24h_12m:1,reminder_sent:true,confirmation_24h:true}],
  ['w_acc','/api/sched_waitlist/patient_access',{unit_id:'PCP',third_next_available_days:5,target_tna_days:7,new_patient_visits_30d:30,established_wait_days:5,access_band:'good',extended_hours_offered:true}],

  ['a_book','/api/sched_appointment/appt_book',{appointment_id:'A1',provider_id:'PR1',slot_start:'2026-08-20T10:00',duration_min:30,slot_available:true,provider_available:true,patient_available:true,double_book:false,overbook_allowed:false}],
  ['a_con','/api/sched_appointment/appt_conflict',{provider_id:'PR1',existing_appointments_count:5,conflicting_count:0,overlapping_minutes:0,conflict_type:'none',resolved:false}],
  ['a_re','/api/sched_appointment/appt_reschedule',{appointment_id:'A1',original_lead_days:7,new_lead_days:10,reason:'patient_request',new_slot_available:true,notice_24h:true}],
  ['a_can','/api/sched_appointment/appt_cancel',{appointment_id:'A1',hours_until_appt:48,cancelled_by:'patient',late_cancel:false,reason:'patient_sick',fee_charged:false,cancellation_count_30d:1}],
  ['a_opt','/api/sched_appointment/appt_slot_optimize',{schedule_id:'SCH1',total_slots:200,filled_slots:170,no_show:15,cancellations:15,overbook_slots:10,target_utilization_pct:85}],

  ['s_asn','/api/sched_staff/staff_assign_shift',{staff_id:'RN1',shift_id:'S1',shift_type:'day',role:'rn',hours_in_shift:12,certifications_current:true,competencies_verified:true,hours_worked_7d:48}],
  ['s_cov','/api/sched_staff/staff_coverage',{unit_id:'MEDSURG',required_rn:6,assigned_rn:6,required_total:8,assigned_total:8,charge_nurse_present:true,acuity:'medium',patient_count:24}],
  ['s_req','/api/sched_staff/staff_request',{request_id:'SR1',staff_id:'RN1',request_type:'time_off',request_date:'2026-09-01',priority:'medium',approved:false,coverage_considered:true}],
  ['s_ot','/api/sched_staff/staff_overtime',{staff_id:'RN1',hours_regular:40,hours_overtime:5,pay_period:'weekly',union_member:true,pre_approved:true,hours_total_7d:45}],
  ['s_comp','/api/sched_staff/staff_competency',{staff_id:'RN1',competency_area:'critical_care',orientation_complete:true,annual_competency_done:true,last_competency_date_days:180,preceptor_assigned:false,assigned_to_patient_population:true}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\sched_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_sched_tier21.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);