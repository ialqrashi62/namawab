// filepath: gen_tier64.js
const fs = require('fs');

const routes = [
  [348, 'pop_registries', 'diabetes_registry,hypertension_registry,ckd_registry,asthma_registry,heart_failure_registry'],
  [349, 'pop_screen', 'cancer_screening,preventive_care_gaps,immunization_gaps,wellness_visit,social_determinants'],
  [350, 'pop_cohort', 'risk_cohort_build,high_risk_panel,care_gap_panel,outreach_panel,disenrollment_panel'],
  [351, 'pop_outreach', 'outreach_call,outreach_message,outreach_visit,outreach_education,outreach_reminder'],
  [352, 'pop_metrics', 'hEDIS_measure,quality_pay_performance,metric_trend,benchmark_comparison,intervention_roi'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier64_pop_health_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier64_pop_health_${n}_${name}_engine');
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
  fs.writeFileSync('tier64_pop_health_' + n + '_' + name + '_router.js', code);
  total++;
});

const smokeCases = [
  ['p_dr','/api/pop_registries/diabetes_registry',{patient_id:'PR1','registry_type':'diabetes_type2','enrollment_date':'2025-01-15','last_a1c':7.2,'last_a1c_date':'2026-06-01','complications':'none','active':true,'next_due':'2026-12-01'}],
  ['p_hr','/api/pop_registries/hypertension_registry',{patient_id:'PR2','registry_type':'hypertension','avg_bp':'140_90','control_status':'uncontrolled','medication_adherence':0.85,'follow_up_months':3,'active':true}],
  ['p_cr','/api/pop_registries/ckd_registry',{patient_id:'PR3','registry_type':'ckd_stage3','egfr':42,'proteinuria':'moderate','nephrology_referral':true,'kdigo_category':'g3a_a3','active':true}],
  ['p_ar','/api/pop_registries/asthma_registry',{patient_id:'PR4','registry_type':'asthma_persistent','act_score':18,'controller_med':'ics_laba','er_visits_year':2,'step_therapy':'step_3','active':true}],
  ['p_hfr','/api/pop_registries/heart_failure_registry',{patient_id:'PR5','registry_type':'hfref','ef_pct':30,'nyha_class':2,'gdmt':'beta_bloker_arni_mra_diuretic','active':true,'device':'icd'}],
  ['p_cas','/api/pop_screen/cancer_screening',{patient_id:'PS1','screening_type':'mammography','due_date':'2026-09-01','overdue':false,'last_completed':'2024-08-15','results':'normal','follow_up_plan':'annual'}],
  ['p_pcg','/api/pop_screen/preventive_care_gaps',{patient_id:'PS2','gaps_identified':'flu_vaccine_colorectal','priority':'high','gap_count':2,'pcp_assigned':true,'closing_plan':'flu_offered_ter_fobt_ordered'}],
  ['p_img','/api/pop_screen/immunization_gaps',{patient_id:'PS3','missing_vaccines':'tdap_shingles','contraindications':'none','recommendation':'imm_office_visit','priority':'moderate','due_date':'2026-12-01'}],
  ['p_wv','/api/pop_screen/wellness_visit',{patient_id:'PS4','visit_type':'annual_wellness','scheduled':'2026-09-15','completed':false,'preventive_items':'mam_due_colon_counsel','awv_billed':true,'awv_code':'G0438'}],
  ['p_sdh','/api/pop_screen/social_determinants',{patient_id:'PS5','food_insecurity':false,'housing_instability':false,'transportation_barrier':true,'financial_strain':false,'referral':'medicaid_transport','language':'english'}],
  ['p_rcb','/api/pop_cohort/risk_cohort_build',{patient_id:'PC1','cohort_name':'high_risk_diabetic_2026','criteria':'a1c_over_9_or_edema','size':248,'refresh_date':'2026-08-01','owner':'population_health','consent':true}],
  ['p_hrp','/api/pop_cohort/high_risk_panel',{patient_id:'PC2','panel_id':'hr_2026_q3','patients_count':35,'risk_avg':0.78,'top_conditions':'hf_copd_diabetes','assigned_navigator':'nav_007','intervention':'weekly_calls'}],
  ['p_cgp','/api/pop_cohort/care_gap_panel',{patient_id:'PC3','panel_id':'cg_2026_q3','patients_count':120,'gap_count_total':340,'top_gaps':'mam_a1c_due','closure_rate_target':0.6,'reviewed':true}],
  ['p_op','/api/pop_cohort/outreach_panel',{patient_id:'PC4','panel_id':'op_2026_q3','patients_count':85,'channel_preference':'phone_sms','language':'spanish','best_time':'evening','campaign_id':'c_2026_mam'}],
  ['p_dp','/api/pop_cohort/disenrollment_panel',{patient_id:'PC5','panel_id':'dp_2026_q3','patients_count':42,'reason':'moved_out_of_network','insurance_change':'commercial_to_medicaid','reach_attempt':3,'highest_cohort_to_attempt':2}],
  ['p_oc','/api/pop_outreach/outreach_call',{patient_id:'PO1','patient_to_contact':'PR001','channel':'phone','agent':'navigator_007','outcome':'spoke_appointment','duration_min':8,'callback_scheduled':true,'notes':'agreed_to_mam'}],
  ['p_om','/api/pop_outreach/outreach_message',{patient_id:'PO2','patient_to_contact':'PR002','channel':'sms','message':'flu_clinic_reminder','response_received':true,'patient_response':'will_attend','opt_out':false,'delivered_timestamp':'2026-08-15'}],
  ['p_ov','/api/pop_outreach/outreach_visit',{patient_id:'PO3','patient_to_contact':'PR003','visit_type':'home_visit','visit_date':'2026-08-20','completed':true,'provider':'chw_022','barriers':'transport','notes':'provided_ride_assistance'}],
  ['p_oe','/api/pop_outreach/outreach_education',{patient_id:'PO4','patient_to_contact':'PR004','topic':'diabetes_self_care','materials':'pdf_video_web','language':'english','reading_level':'grade_6','quiz_score':85,'engagement_pct':0.7}],
  ['p_or','/api/pop_outreach/outreach_reminder',{patient_id:'PO5','patient_to_contact':'PR005','reminder_type':'appointment','appointment_date':'2026-08-25','lead_time_days':3,'delivery_method':'sms','confirmed':true,'response_action':'reminder_cnf'}],
  ['p_hm','/api/pop_metrics/hEDIS_measure',{patient_id:'PM1','measure':'CDC_a1c_test','denominator':120,'numerator':85,'rate':0.708,'target':0.85,'benchmark':0.78,'gap':'needs_improvement'}],
  ['p_qpp','/api/pop_metrics/quality_pay_performance',{patient_id:'PM2','program':'MIPS_2026','composite_score':78,'target':75,'incentive':'positive_adjustment','measures_passed':6,'measures_failed':2,'estimated_payout':12000}],
  ['p_mt','/api/pop_metrics/metric_trend',{patient_id:'PM3','metric':'controlling_high_bp','periods':12,'direction':'improving','change_pct':-0.12,'statistical_significance':true,'latest_value':0.65,'baseline_value':0.74}],
  ['p_bc','/api/pop_metrics/benchmark_comparison',{patient_id:'PM4','metric':'breast_cancer_screening','our_value':0.72,'p25':0.65,'p50':0.74,'p75':0.82,'p90':0.91,'national_top_10':0.93}],
  ['p_ir','/api/pop_metrics/intervention_roi',{patient_id:'PM5','intervention_id':'int_2026_copd','cost_per_patient':250,'savings_per_patient':1850,'roi':6.4,'patients_enrolled':120,'total_savings':222000,'conclusion':'highly_recommended'}],
];

let sh = '#!/bin/bash\nH=http://127.0.0.1:3000\nP=0;F=0\n';
smokeCases.forEach(([nm, ep, body], i) => {
  fs.writeFileSync(`C:/tmp/pop_body_${i}.json`, JSON.stringify(body));
  sh += `C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_${i}.json "$H${ep}")\nif [ "$C" = "200" ]; then echo "OK ${nm}"; P=$((P+1)); else echo "FAIL ${nm} ($C)"; fi\n`;
});
sh += 'echo PASS=$P FAIL=$F\n';
fs.writeFileSync('sm_pop_tier64.sh', sh);
console.log('Created', total, 'routers');
console.log('Smoke cases:', smokeCases.length);
