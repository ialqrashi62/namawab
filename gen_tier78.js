// filepath: gen_tier78.js (v2 - bodies+router+test)
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'ortho_trauma', eng: 413, base: 0,
    eps: ['trauma_initial','fracture_reduction','fracture_orif','soft_tissue_injury','polytrauma'] },
  { name: 'ortho_joint', eng: 414, base: 5,
    eps: ['joint_replacement','arthroscopy','joint_injection','joint_aspiration','joint_clinic'] },
  { name: 'ortho_spine', eng: 415, base: 10,
    eps: ['spine_clinic','discectomy','spinal_fusion','spine_fracture','scoliosis'] },
  { name: 'ortho_sports', eng: 416, base: 15,
    eps: ['acl_reconstruction','rotator_cuff_repair','meniscus_repair','shoulder_impingement','sports_clearance'] },
  { name: 'ortho_pediatric', eng: 417, base: 20,
    eps: ['developmental_dysplasia','clubfoot','scoliosis_juvenile','slipped_capital_femoral','pediatric_fracture'] }
];

const bodies = [
  // === 0-4: trauma ===
  // 0 trauma_initial
  {patient_id:'OT0',visit_id:'ov_00',mechanism:'fall',injuries:'femur_fx',iss_score:18,hemodynamically_stable:true,atls_classification:'yellow',fractures_present:true,fracture_locations:'femur',time_since_injury_min:120,provider:'ortho_001',next_review:7},
  // 1 fracture_reduction
  {patient_id:'OT1',procedure_id:'op_01',fracture_type:'closed',bone:'radius_distal',reduction_method:'closed',anesthesia:'regional',successful:true,complications:'none',imaging_post:'anatomic',provider:'ortho_001',next_review:7},
  // 2 fracture_orif
  {patient_id:'OT2',surgery_id:'os_02',bone:'tibia',fracture_pattern:'comminuted',hardware_used:'nail',operative_time_min:120,ebl_ml:200,complications:'none',hospital_stay_days:3,weight_bearing_status:'non_weight_bearing',provider:'ortho_001',next_review:14},
  // 3 soft_tissue_injury
  {patient_id:'OT3',assessment_id:'oa_03',structure:'achilles',grade:'iii',imaging_findings:'full_tear',treatment:'surgical',expected_recovery_weeks:16,surgical_referral:true,rehab_plan:'protocol_1',provider:'ortho_001',next_review:14},
  // 4 polytrauma
  {patient_id:'OT4',assessment_id:'oa_04',iss_total:34,revised_trauma_score:7.5,injuries:'multiple',massive_transfusion:true,ex_fix_placed:true,damage_control_done:true,icu_admission:true,consult_specialty:'trauma_surgery',family_update:'complete',provider:'ortho_001',next_review:3},
  // === 5-9: joint ===
  // 5 joint_replacement
  {patient_id:'OT5',surgery_id:'os_05',joint:'knee',approach:'anterior',implant:'total_knee_zimmer',operative_time_min:90,ebl_ml:150,bone_quality:'good',hospital_stay_days:3,complications:'none',discharge_destination:'home',provider:'ortho_001',next_review:14},
  // 6 arthroscopy
  {patient_id:'OT6',procedure_id:'op_06',joint:'knee',findings:'meniscus_tear',procedures_performed:'partial_meniscectomy',operative_time_min:45,complications:'none',weight_bearing:100,rehab_plan:'return_sport_3mo',provider:'ortho_001',next_review:14},
  // 7 joint_injection
  {patient_id:'OT7',procedure_id:'op_07',joint:'knee',medication:'cortisone',dose_mg:40,guided_imaging:true,indication:'oa',response_weeks:8,follow_up:'prn',provider:'ortho_001',next_review:12},
  // 8 joint_aspiration
  {patient_id:'OT8',procedure_id:'op_08',joint:'knee',volume_ml:50,fluid_appearance:'cloudy',cell_count_ordered:true,culture_ordered:true,crystal_analysis:true,finding:'gout',provider:'ortho_001',next_review:7},
  // 9 joint_clinic
  {patient_id:'OT9',visit_id:'ov_09',joint:'hip',range_of_motion_deg:90,pain_score:4,crepitus:true,effusion:false,function_score:'le_pain_5min',impression:'moderate_oa',treatment_plan:'cortisone_then_joint_replace',provider:'ortho_001',next_review:14},
  // === 10-14: spine ===
  // 10 spine_clinic
  {patient_id:'OT10',visit_id:'ov_10',spine_level:'l4_l5',pain_score:6,oswestry_index:40,red_flags:false,neurological_exam:'intact',imaging_review:'disc_herniation',treatment:'conservative',follow_up_weeks:6,provider:'ortho_001',next_review:42},
  // 11 discectomy
  {patient_id:'OT11',surgery_id:'os_11',level:'l4_l5_right',approach:'microscopic',operative_time_min:75,ebl_ml:50,neurological_improvement:true,complications:'none',hospital_stay_days:1,discharge_plan:'home',provider:'ortho_001',next_review:14},
  // 12 spinal_fusion
  {patient_id:'OT12',surgery_id:'os_12',levels:'l4_l5',approach:'tlif',hardware:'pedicle_screws',estimated_blood_loss:300,operative_time_min:180,bone_graft:'autograft',complications:'none',hospital_stay_days:4,rehab_plan:'standard_lumbar',provider:'ortho_001',next_review:21},
  // 13 spine_fracture
  {patient_id:'OT13',assessment_id:'oa_13',level:'l1',fracture_type:'compression',neurological_status:'intact',bracing_required:true,surgical_indicated:false,tl_classification:'a1',plan:'tls_boston',provider:'ortho_001',next_review:14},
  // 14 scoliosis
  {patient_id:'OT14',visit_id:'ov_14',cobb_angle:32,skeletal_maturity:'immature',bracing_prescribed:true,brace_hours_per_day:18,surgical_discussed:false,progression_deg_per_year:8,recommendation:'continue_bracing',provider:'ortho_001',next_review:90,scheduled_followup:'6_months'},
  // === 15-19: sports ===
  // 15 acl_reconstruction
  {patient_id:'OT15',surgery_id:'os_15',graft_type:'bptb',technique:'anatomic_single_bundle',fixation_equipment:'interference_screws',operative_time_min:90,menisci_repaired:true,chondroplasty_done:true,complications:'none',brace_duration_weeks:4,rehab_protocol:'accelerated',provider:'ortho_001',next_review:14},
  // 16 rotator_cuff_repair
  {patient_id:'OT16',surgery_id:'os_16',technique:'arthroscopic',cuff_tear_size:'medium',repair_configuration:'double_row',anchors_used:'4_anchors',biceps_tenodesis:true,acromioplasty:true,rehab_phase_weeks:18,complications:'none',sling_required:true,provider:'ortho_001',next_review:14},
  // 17 meniscus_repair
  {patient_id:'OT17',procedure_id:'op_17',tear_pattern:'bucket_handle',zone:'red_white',repair_technique:'inside_out',rehab_protocol_weeks:12,complications:'none',partial_meniscectomy:false,expected_healing_weeks:12,provider:'ortho_001',next_review:7},
  // 18 shoulder_impingement
  {patient_id:'OT18',assessment_id:'oa_18',pain_score:5,neer_test_positive:true,hawkins_test_positive:true,mri_findings:'ac_joint_oa',injections_tried:true,physical_therapy_done:true,surgical_referred:true,treatment_plan:'arthroscopy_referral',provider:'ortho_001',next_review:14},
  // 19 sports_clearance
  {patient_id:'OT19',assessment_id:'oa_19',sport:'basketball',cardiac_clearance:'cleared',musculoskeletal_clear:true,concussion_baseline_done:true,cleared:true,conditions:'no_contact_4wk',recommendation:'progressive_return',provider:'ortho_001',next_review:7},
  // === 20-24: pediatric ===
  // 20 developmental_dysplasia
  {patient_id:'OT20',assessment_id:'oa_20',age_months:3,hip_side:'left',graf_type:'iib',alpha_angle:50,beta_angle:55,treatment:'pavlik',duration_weeks:8,follow_up_imaging:'us_6wk',provider:'ortho_001',next_review:42},
  // 21 clubfoot
  {patient_id:'OT21',assessment_id:'oa_21',side:'right',pirani_score:4.5,ponseti_started:true,casts_to_date:5,tenotomy_done:true,bracing_compliance:'good',relapse:false,treatment_plan:'maintain_brace',provider:'ortho_001',next_review:90},
  // 22 scoliosis_juvenile
  {patient_id:'OT22',visit_id:'ov_22',cobb_angle:25,age_years:10,bracing_prescribed:true,brace_hours:16,menarche_status:false,cobb_progression:true,progression_per_year:5,surgical_referred:false,recommendation:'continue_bracing',provider:'ortho_001',next_review:90},
  // 23 slipped_capital_femoral
  {patient_id:'OT23',assessment_id:'oa_23',age_years:12,side:'left',southwick_angle:'moderate',southwick_angle_measured:true,stability:'stable',surgical_planned:true,treatment_plan:'in_situ_pinning',provider:'ortho_001',next_review:14},
  // 24 pediatric_fracture
  {patient_id:'OT24',assessment_id:'oa_24',age_years:8,bone:'radius_distal',fracture_pattern:'torus',remodeling_potential:80,reduction_needed:false,treatment:'cast',cast_duration_weeks:4,follow_up:'weekly',provider:'ortho_001',next_review:28}
];

// Write bodies
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/ortho_body_${i}.json`, JSON.stringify(bodies[i]));
}

// Write routers
for (const m of mods) {
  const router = `// filepath: tier78_ortho_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier78_ortho_ext_${m.eng}_${m.name}_engine');
const eps = ['${m.eps.join("','")}'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, `tier78_ortho_ext_${m.eng}_${m.name}_router.js`), router);
}

console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
