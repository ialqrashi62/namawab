// filepath: gen_tier52.js
const fs = require('fs');

const routes = [
  [293, 'rehab_pt', 'stroke_rehab,spinal_cord_injury_rehab,amputee_rehab,balance_vestibular,gait_training'],
  [294, 'rehab_ot', 'adl_training,hand_therapy_upper_limb,cognitive_rehab,splinting,work_hardening'],
  [295, 'rehab_slp', 'dysphagia_swallow,aphasia,apraxia_of_speech,voice_therapy,trach_speaking_valve'],
  [296, 'rehab_prosth', 'upper_limb_prosthetic,lower_limb_prosthetic,orthotic_bracing,spinal_orthosis,wheelchair_seating'],
  [297, 'rehab_pain', 'chronic_pain_program,low_back_pain,fibromyalgia_program,lymphedema,headache_migraine'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier52_rehabilitation_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier52_rehabilitation_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier52_rehabilitation_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['r_str','/api/rehab_pt/stroke_rehab',{patient_id:'R1',stroke_type:'ischemic_right_mca',days_since_onset:14,fugl_meyer:35,berg_balance:25,therapy_focus:'mobility_ue_task',discharge_plan:'home_with_outpatient'}],
  ['r_sci','/api/rehab_pt/spinal_cord_injury_rehab',{patient_id:'R2',level:'c5',ais:'a',time_since_injury_months:3,fim_score:55,goals:'wheelchair_mobility_self_care',pressure_relief_q_hours:2}],
  ['r_amp','/api/rehab_pt/amputee_rehab',{patient_id:'R3',level:'below_knee',side:'right',time_since_amp_months:2,prosthesis_fitting:'planned',gait_training_intensity:'daily_pre_prosthetic',complications:'wound_healed'}],
  ['r_bal','/api/rehab_pt/balance_vestibular',{patient_id:'R4',condition:'bppv',side:'right_posterior',dix_hallpike:'positive',treatment:'epley_repositioning',response:'resolved',follow_up:1}],
  ['r_gai','/api/rehab_pt/gait_training',{patient_id:'R5',assistive_device:'rolling_walker',distance_m:150,symmetry_index:18,fall_risk:'moderate',surface_varied:true,outcome:'progressing'}],

  ['r_adl','/api/rehab_ot/adl_training',{patient_id:'O1',area:'bathing_dressing',level_assistance:'min_assist',goal:'independent_with_adaptive_equipment',progress:'steady',discharge_weeks:4}],
  ['r_hnd','/api/rehab_ot/hand_therapy_upper_limb',{patient_id:'O2',condition:'distal_radius_fracture_post_orif',weeks_post_op:6,rom_wrist:'flexion_40_extension_30',grip_strength_kg:12,edema:'mild',therapy:'mobilization_strengthening'}],
  ['r_cog','/api/rehab_ot/cognitive_rehab',{patient_id:'O3',cognition_domain:'memory_attention',mmse:24,deficits:'short_term_memory_work_memory',intervention:'compensatory_strategy_external_aid',response:'improving'}],
  ['r_spl','/api/rehab_ot/splinting',{patient_id:'O4',splint_type:'resting_hand_splint',indication:'cva_spasticity',fabrication_date:'today',wear_schedule:'night_full_time',follow_up_weeks:2}],
  ['r_wrk','/api/rehab_ot/work_hardening',{patient_id:'O5',program_weeks:6,simulated_duties:'lifting_pushing_carrying',fce_passed:true,return_to_work:'full_unrestricted',outcome:'successful_completion'}],

  ['r_dys','/api/rehab_slp/dysphagia_swallow',{patient_id:'SL1',stroke_phase:'subacute',mbbs:'modified_evans_blue_dye_3oz_thin_negative',fees:'penetration_aspiration_score_2',recommendation:'thin_liquids_with_compensatory_strategy',follow_up:2}],
  ['r_aph','/api/rehab_slp/aphasia',{patient_id:'SL2',type:'broca',severity:'moderate',wab_aq:55,therapy_focus:'sentence_production',progress:'improving_with_melodic_intonation',home_program:'yes'}],
  ['r_apx','/api/rehab_slp/apraxia_of_speech',{patient_id:'SL3',severity:'mild_moderate',articulatory_accuracy_pct:65,treatment:'sound_production_therapy',response:'improving_words_to_phrases',follow_up_weeks:4}],
  ['r_vce','/api/rehab_slp/voice_therapy',{patient_id:'SL4',condition:'muscle_tension_dysphonia',vhi_score:55,therapy_focus:'vocal_hygiene_resonant_voice',sessions_completed:6,response:'improving'}],
  ['r_tsv','/api/rehab_slp/trach_speaking_valve',{patient_id:'SL5',trach_type:'cuffed',valve_placement:'in_line',tolerated_duration_min:30,phonation:'achieved',follow_up:1}],

  ['r_ulp','/api/rehab_prosth/upper_limb_prosthetic',{patient_id:'P1',level:'transradial',side:'left',terminal_device:'myoelectric_hand',control:'two_site_myoelectric',socket_suspension:'suction',training_hours_completed:35}],
  ['r_llp','/api/rehab_prosth/lower_limb_prosthetic',{patient_id:'P2',level:'transfemoral',side:'right',foot_type:'energy_storing',socket:'ischial_containment',knee_unit:'microprocessor',gait_deviation:'valgus_late_stance'}],
  ['r_ort','/api/rehab_prosth/orthotic_bracing',{patient_id:'P3',type:'ankle_foot_orthosis',side:'left',condition:'foot_drop',material:'carbon_fiber',custom_or_off_shelf:'custom',response:'good_stability'}],
  ['r_spo','/api/rehab_prosth/spinal_orthosis',{patient_id:'P4',type:'tlsso',indication:'compression_fracture_t12',wear_schedule:'18_22_hours_day','duration_weeks':12}],
  ['r_whl','/api/rehab_prosth/wheelchair_seating',{patient_id:'P5',chair_type:'manual_rear_wheel',cushion:'roho_quadtro',back:'adjustable_tension',fit_score:'good',training_hours:4}],

  ['r_cpp','/api/rehab_pain/chronic_pain_program',{patient_id:'PR1',pain_duration_months:18,program_type:'interdisciplinary',weeks_completed:6,outcome_measures_improvement:'30_percent',discharge_plan:'maintenance_home_program'}],
  ['r_lbp','/api/rehab_pain/low_back_pain',{patient_id:'PR2',classification:'chronic_nonspecific',oswestry:32,psychosocial_yellow_flags:false,treatment:'mckenzie_graded_activity',response:'partial_improvement'}],
  ['r_fib','/api/rehab_pain/fibromyalgia_program',{patient_id:'PR3',fiq_score:65,tender_points:11,program:'graded_exercise_education_cbt',weeks:8,response:'improved_quality_of_life'}],
  ['r_lym','/api/rehab_pain/lymphedema',{patient_id:'PR4',stage:'2',limb:'right_upper',cause:'post_mastectomy',treatment:'cdt_complete_decongestive_therapy',volume_reduction_pct:30}],
  ['r_hd','/api/rehab_pain/headache_migraine',{patient_id:'PR5',type:'episodic_migraine',frequency_per_month:6,headache_days:8,trigger:'stress_sleep','prevention':'topiramate_trigger_avoidance_cbt',response:'reduced_50_percent'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\rha_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_rha_tier52.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);