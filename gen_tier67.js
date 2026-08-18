// filepath: gen_tier67.js
const fs = require('fs');

const routes = [
  [363, 'surg_pre_admit', 'pre_admission_testing,anesthesia_eval,pre_op_orders,pre_op_education,pre_admission_clearance'],
  [364, 'surg_intraop', 'operative_note,timed_out,time_out,positioning,anesthesia_record'],
  [365, 'surg_postop', 'pacu_phase1,pacu_phase2,post_op_orders,discharge_recovery,post_op_followup'],
  [366, 'surg_complications', 'intraop_complication,postop_complication,readmission_30d,reoperation,ssi_tracking'],
  [367, 'surg_quality', 'or_efficiency,case_duration_review,instrument_count,sponge_count,sharps_count'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier67_surg_periop_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier67_surg_periop_${n}_${name}_engine');
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
  fs.writeFileSync('tier67_surg_periop_' + n + '_' + name + '_router.js', code);
  total++;
});

const smokeCases = [
  ['s_pat','/api/surg_pre_admit/pre_admission_testing',{patient_id:'SU1','case_id':'case_001','scheduled_date':'2026-09-01','labs_ordered':'cbc_bmp_coags','ekg_ordered':true,'imaging_reviewed':'none','cleared':true,'cleared_by':'nurse_preadmit'}],
  ['s_ae','/api/surg_pre_admit/anesthesia_eval',{patient_id:'SU2','case_id':'case_001','asa_class':2,'airway':'mallampati_2','cardiac_risk':'low','renal_function':'normal','anesthesia_plan':'general','anesthesiologist':'dr_anes','consent_obtained':true}],
  ['s_po','/api/surg_pre_admit/pre_op_orders',{patient_id:'SU3','case_id':'case_001','npo_status':'npo_midnight','pre_op_meds':'cefazolin_2g_iv','vte_prophylaxis':'heparin_5000','skin_prep':'chlorhexidine','antibiotic_timing':'within_60_min','ordered_by':'dr_surg'}],
  ['s_pe','/api/surg_pre_admit/pre_op_education',{patient_id:'SU4','case_id':'case_001','education_topics':'procedure_wound_care_pain','language':'english','method':'in_person_video','patient_consent':'verbal','questions_answered':true,'literacy_level':'grade_6_8'}],
  ['s_pac','/api/surg_pre_admit/pre_admission_clearance',{patient_id:'SU5','case_id':'case_001','clearance_status':'cleared','cardiac_clearance':'low_risk','pulm_clearance':'baseline','endocrine_clearance':'well_controlled','hematology_clearance':'normal','finalized_by':'pre_admit_clinic'}],
  ['s_on','/api/surg_intraop/operative_note',{patient_id:'SU6','case_id':'case_002','procedure_cpt':'49505','diagnosis_pre':'inguinal_hernia','findings':'indirect_hernia_3cm','technique':'open_mesh_repair','ebl_ml':50,'specimens':'none','surgeon':'dr_surg_primary','duration_min':85}],
  ['s_to','/api/surg_intraop/timed_out',{patient_id:'SU7','case_id':'case_002','time_out_completed':true,'patient_id_verified':true,'site_marked':true,'procedure_confirmed':true,'allergy_reviewed':true,'antibiotic_given':true,'team_intro':true,'final_check':'go'}],
  ['s_tos','/api/surg_intraop/time_out',{patient_id:'SU8','case_id':'case_002','patient_id_verified':true,'site_verified':true,'laterality_correct':'right','procedure_correct':true,'implants_available':true,'specimen_labeled':true,'documented_by':'circulator','timestamp':'2026-09-01_08_15'}],
  ['s_po2','/api/surg_intraop/positioning',{patient_id:'SU9','case_id':'case_002','position':'supine','padding_used':'foam_positioners','pressure_points_checked':true,'time_in_position_min':85,'complications':'none','repositioned':false,'documented_by':'circulator_2'}],
  ['s_ar','/api/surg_intraop/anesthesia_record',{patient_id:'SU10','case_id':'case_002','anesthesia_type':'general','induction':'propofol_fentanyl','airway':'ett','maintenance':'sevo_remi','vital_signs_summary':'stable','fluid_io':'crystalloid_1500','ebl_ml':50,'reversal':'neostigmine_glycopyrrolate','duration_min':85}],
  ['s_p1','/api/surg_postop/pacu_phase1',{patient_id:'SU11','case_id':'case_002','aldrete_score':9,'pain_score':3,'vitals_stable':true,'post_op_nausea':false,'emergence_agitation':false,'time_in_p1_min':35,'transfer_to_p2':true,'documented_by':'pac_u_nurse_3'}],
  ['s_p2','/api/surg_postop/pacu_phase2',{patient_id:'SU12','case_id':'case_002','padss_score':9,'ambulation_distance_ft':40,'tolerated_oral':true,'urination':true,'pain_controlled':true,'estimated_discharge_time':'2026-09-01_13_00','discharged':true}],
  ['s_poo','/api/surg_postop/post_op_orders',{patient_id:'SU13','case_id':'case_002','diet':'clear_liquids','activity':'ambulate_3x','pain_meds':'oxycodone_5mg_q4h','antiemetic':'ondansetron_4mg','wound_care':'dry_sterile_dressing','follow_up':'2_weeks','ordered_by':'dr_surg'}],
  ['s_dr','/api/surg_postop/discharge_recovery',{patient_id:'SU14','case_id':'case_002','discharge_status':'home','discharge_hr':'13_30','instructions_given':'written_oral','responsible_adult':true,'prescriptions_filled':true,'transportation':'family','follow_up_scheduled':true}],
  ['s_pof','/api/surg_postop/post_op_followup',{patient_id:'SU15','case_id':'case_002','follow_up_day':7,'wound_healing':'well','pain_score':2,'activity_resumed':'partial','complications':'none','patient_satisfaction':5,'next_follow_up':14}],
  ['s_ic','/api/surg_complications/intraop_complication',{patient_id:'SU16','case_id':'case_003','complication_type':'bleeding','severity':'moderate','intervention':'additional_suture','ebl_total_ml':350,'anesthesia_change':true,'case_terminated_early':false,'documented_by':'surgeon_primary'}],
  ['s_pc','/api/surg_complications/postop_complication',{patient_id:'SU17','case_id':'case_003','complication_type':'wound_infection','severity':'minor','post_op_day':7,'intervention':'antibiotics_wound_care','culture_taken':true,'readmit_required':false,'clavien_dindo':2}],
  ['s_r30','/api/surg_complications/readmission_30d',{patient_id:'SU18','case_id':'case_003','readmit_date':'2026-09-15','days_to_readmit':14,'reason':'surgical_site_infection','severity':'moderate','length_of_stay_days':3,'intervention':'iv_antibiotics','outcome':'discharged_home'}],
  ['s_reop','/api/surg_complications/reoperation',{patient_id:'SU19','case_id':'case_003','reoperation_id':'reop_001','original_case_id':'case_003','days_to_reop':4,'reason':'hemorrhage','procedure_cpt':'35840','urgent':true,'outcome':'successful','complications':'none'}],
  ['s_ssi','/api/surg_complications/ssi_tracking',{patient_id:'SU20','case_id':'case_003','ssi_type':'superficial','detected_day':9,'culture':'staph_aureus','treatment':'antibiotics_wound_open','readmit':false,'cdc_defined':true,'reported_to_nhsn':true}],
  ['s_oe','/api/surg_quality/or_efficiency',{patient_id:'SU21','case_id':'case_004','or_room':'or_3','scheduled_start':'08_00','actual_start':'08_15','scheduled_duration_min':90,'actual_duration_min':110,'turnover_min':25,'delay_reason':'prep_delay','first_case_start_on_time':true}],
  ['s_cdr','/api/surg_quality/case_duration_review',{patient_id:'SU22','case_id':'case_004','case_type':'laparoscopic_chole','actual_min':105,'bench_min':75,'delta_min':30,'surgeon_experience':'attending','difficulty':'complex','review_action':'documentation_complete'}],
  ['s_icnt','/api/surg_quality/instrument_count',{patient_id:'SU23','case_id':'case_004','instrument_count_before':125,'instrument_count_after':125,'count_correct':true,'discrepancy_resolved':true,'verified_by':'scrub_tech_2','surgeon_signoff':true}],
  ['s_scnt','/api/surg_quality/sponge_count',{patient_id:'SU24','case_id':'case_004','sponges_in':50,'sponges_out':50,'count_correct':true,'discrepancy_resolved':true,'verified_by':'circulator_3','surgeon_signoff':true}],
  ['s_shcnt','/api/surg_quality/sharps_count',{patient_id:'SU25','case_id':'case_004','sharps_in':40,'sharps_out':40,'needles_accounted':true,'blades_accounted':true,'count_correct':true,'verified_by':'scrub_tech_2','surgeon_signoff':true}],
];

let sh = '#!/bin/bash\nH=http://127.0.0.1:3000\nP=0;F=0\n';
smokeCases.forEach(([nm, ep, body], i) => {
  fs.writeFileSync(`C:/tmp/surg_body_${i}.json`, JSON.stringify(body));
  sh += `C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_${i}.json "$H${ep}")\nif [ "$C" = "200" ]; then echo "OK ${nm}"; P=$((P+1)); else echo "FAIL ${nm} ($C)"; fi\n`;
});
sh += 'echo PASS=$P FAIL=$F\n';
fs.writeFileSync('sm_surg_tier67.sh', sh);
console.log('Created', total, 'routers');
console.log('Smoke cases:', smokeCases.length);
