// filepath: gen_tier108.js
const fs = require('fs');
const mounts = [
  { mount: '/api/ct_advanced_v2', engine: 'tier108_ct_advanced_566_engine', fns: ['ct_cardiac','ct_pulmonary_angiogram','ct_perfusion','ct_enterography','ct_virtual_colonoscopy'] },
  { mount: '/api/mri_advanced_v2', engine: 'tier108_mri_advanced_567_engine', fns: ['mri_brain','mri_spine','functional_mri','mr_angiography','mr_spectroscopy'] },
  { mount: '/api/ultrasound_advanced_v2', engine: 'tier108_ultrasound_advanced_568_engine', fns: ['echo_complete','vascular_duplex','point_of_care_us','elastography','contrast_echo'] },
  { mount: '/api/imaging_ai_v2', engine: 'tier108_imaging_ai_569_engine', fns: ['ai_detection','image_segmentation','classification','computer_aided_diagnosis','radiomics'] },
  { mount: '/api/imaging_quality_v2', engine: 'tier108_imaging_quality_570_engine', fns: ['accreditation','dose_monitoring','image_quality','report_turnaround','peer_review'] },
];
for (const m of mounts) {
  const e = require('./' + m.engine);
  const fns = e.funcs();
  let r = `const express = require('express');\nconst router = express.Router();\nconst { funcs } = require('./${m.engine}');\nconst f = funcs();\nfunction asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }\n`;
  for (const fn of m.fns) {
    r += `router.post('/${fn}', asyncH((req, res) => { const r = f.${fn}(req.body || {}); res.json({ ok: true, op: '${fn}', result: r }); }));\n`;
  }
  r += `module.exports = router;\n`;
  const routerFile = m.engine.replace('_engine', '_router') + '.js';
  fs.writeFileSync(routerFile, r);
  console.log('Wrote', routerFile);
}
const bodies = [
  {"patient_id":"R0","study_id":"cc_0","indication":"chest_pain","heart_rate_bpm":65,"beta_blocker_given":true,"ct_dose":"low","calcium_score":150,"findings":"mild_coronary_disease","provider":"rd_001"},
  {"patient_id":"R1","study_id":"pa_1","indication":"pe_rule_out","contrast":"iodinated","scan_time_min":5,"bolus_timing":"pulmonary","findings":"negative","pe_risk_score":"low","provider":"rd_001"},
  {"patient_id":"R2","study_id":"cp_2","indication":"stroke","scan_time_min":10,"brain_volume_ml":1400,"cbf_abnormal_regions":2,"time_to_perfusion":15,"findings":"ischemia","provider":"rd_001"},
  {"patient_id":"R3","study_id":"ce_3","indication":"crohns","contrast":"oral_iv","slice_thickness":1,"bowel_segments_imaged":6,"findings":"terminal_ileitis","provider":"rd_001"},
  {"patient_id":"R4","study_id":"vc_4","indication":"screening","preparation":"adequate","polyp_count":1,"polyp_size_mm":5,"colonic_segments_imaged":6,"provider":"rd_001"},
  {"patient_id":"R5","study_id":"mb_5","indication":"stroke","slices_count":120,"scan_time_min":25,"contrast":"gadolinium","findings":"stroke","provider":"rd_001"},
  {"patient_id":"R6","study_id":"ms_6","spine_region":"lumbar","indication":"pain","slices_count":90,"scan_time_min":20,"findings":"disc_herniation","provider":"rd_001"},
  {"patient_id":"R7","study_id":"fm_7","cognitive_task":"finger_tapping","activation_regions":4,"bold_signal_change":0.85,"motion_correction":true,"findings":"activation_pattern","provider":"rd_001"},
  {"patient_id":"R8","study_id":"ma_8","vascular_region":"head_neck","contrast_volume_ml":15,"scan_time_min":22,"contrast_used":true,"findings":"stenosis","provider":"rd_001"},
  {"patient_id":"R9","study_id":"mr_9","brain_region":"frontal","metabolites_analyzed":4,"cho_creatine_ratio":1.5,"nmr_quality_score":85,"findings":"elevated_cho","provider":"rd_001"},
  {"patient_id":"R10","study_id":"ec_10","ef":55,"wall_motion_abnormalities":2,"valve_function":"mild_mr","diastolic_dysfunction":1,"right_ventricular_function":"normal","provider":"rd_001"},
  {"patient_id":"R11","study_id":"vd_11","vessel":"carotid","stenosis_pct":60,"plaque_characterization":"mixed","peak_systolic_velocity":120,"findings":"significant_stenosis","provider":"rd_001"},
  {"patient_id":"R12","study_id":"po_12","location":"fast","view":"subxiphoid","indication":"shock","tamponade_signs":0,"ivc_diameter":1.5,"fluid_responsiveness":"yes","provider":"rd_001"},
  {"patient_id":"R13","study_id":"el_13","organ":"liver","fibrosis_stage":"f2","stiffness_kpa":7.5,"probe_used":"shear_wave","fat_fraction":0.18,"provider":"rd_001"},
  {"patient_id":"R14","study_id":"ce_14","agent":"definity","indication":"cardiac","chamber_visualization":"enhanced","perfusion_imaging":true,"left_atrial_thrombus":false,"provider":"rd_001"},
  {"patient_id":"R15","finding_id":"ai_15","modality":"ct","ai_model":"lung_nodule","detection_count":3,"confidence":0.92,"true_positives":3,"false_positives":1,"provider":"ai_001"},
  {"patient_id":"R16","segment_id":"sg_16","modality":"mri","anatomy":"prostate","target_volume_ml":35,"dice_score":0.88,"hausdorff_mm":3.5,"reviewer_corrections":2,"provider":"ai_001"},
  {"patient_id":"R17","class_id":"cl_17","task":"benign_vs_malignant","classifier":"random_forest","accuracy":0.92,"sensitivity":0.88,"specificity":0.94,"auc":0.93,"provider":"ai_001"},
  {"patient_id":"R18","diagnosis_id":"cd_18","modality":"ct_chest","type":"nodule_classification","likelihood_cancer":0.65,"biopsy_recommended":true,"follow_up_months":3,"provider":"ai_001"},
  {"patient_id":"R19","report_id":"rm_19","lesion_id":"L001","features_extracted":45,"imaging_features_pyradiomics":85,"model_performance":0.89,"validation_dataset":"external","provider":"ai_001"},
  {"patient_id":"R20","accreditation_id":"ac_20","agency":"acr","modality":"ct","status":"accredited","next_renewal":"2027-06-15","deficiencies":0,"provider":"iq_001"},
  {"patient_id":"R21","dose_id":"dm_21","modality":"ct","dose_metric":"ctdi","threshold":3,"current_dose":2.5,"dose_trend":"decreasing","alert_triggered":false,"provider":"iq_001"},
  {"patient_id":"R22","quality_id":"iq_22","study_id":"R5","image_quality_score":85,"motion_artifact":"minimal","contrast_timing":"optimal","interpretation_quality":"excellent","provider":"iq_001"},
  {"patient_id":"R23","turnaround_id":"ta_23","modality":"mri","target_turnaround":24,"actual_turnaround":18,"priority":"routine","status":"completed","provider":"iq_001"},
  {"patient_id":"R24","peer_review_id":"pr_24","study_id":"R0","reviewer":"dr_lee","original_interpretation":"mild_coronary_disease","review_finding":"agree","discrepancy_score":1,"learning_points":2,"provider":"iq_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');