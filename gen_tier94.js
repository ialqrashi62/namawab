// filepath: gen_tier94.js
const fs = require('fs');
const mounts = [
  { mount: '/api/pulm_function_v2', engine: 'tier94_pulm_function_493_engine', fns: ['spirometry','lung_volumes','dlco','six_min_walk','mip_mep'] },
  { mount: '/api/pulm_sleep_v2', engine: 'tier94_pulm_sleep_494_engine', fns: ['osa_assessment','cpap_titration','polysomnography','sleep_hygiene','narcolepsy'] },
  { mount: '/api/pulm_interstitial_v2', engine: 'tier94_pulm_interstitial_495_engine', fns: ['ild_diagnosis','ipf_diagnosis','sarcoidosis','hypersensitivity_pneumonitis','connective_tissue_ild'] },
  { mount: '/api/pulm_vascular_v2', engine: 'tier94_pulm_vascular_496_engine', fns: ['pah_diagnosis','cteph','pulmonary_edema','pulmonary_embolism','pulmonary_hypertension'] },
  { mount: '/api/pulm_pleural_v2', engine: 'tier94_pulm_pleural_497_engine', fns: ['pleural_effusion','thoracentesis','chest_tube','pleurodesis','empyema'] },
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
  {"patient_id":"P0","test_id":"pt_0","fev1":2.5,"fev1_pred":80,"fvc":3.2,"fvc_pred":85,"fev1_fvc":0.78,"peak_flow":420,"bronchodilator_response":12,"pattern":"obstructive","provider":"pl_001"},
  {"patient_id":"P1","test_id":"pt_1","tlc":7.5,"tlc_pred":110,"rv":3.0,"rv_pred":140,"frc":4.5,"frc_pred":120,"rv_tlc":0.40,"pattern":"hyperinflation","provider":"pl_001"},
  {"patient_id":"P2","test_id":"pt_2","dlco":18,"dlco_pred":75,"kco":4.0,"kco_pred":85,"severity":"moderate","cause":"smoking","provider":"pl_001"},
  {"patient_id":"P3","test_id":"pt_3","distance_meters":450,"baseline_spo2":97,"nadir_spo2":88,"distance_pred":96,"desaturation":true,"stopped_early":false,"dyspnea_borg":4,"provider":"pl_001"},
  {"patient_id":"P4","test_id":"pt_4","mip_cmH2o":-60,"mip_normal":-80,"mep_cmH2o":80,"mep_normal":100,"sniff_test":40,"cough_pressure":70,"weakness_pattern":"diaphragm","provider":"pl_001"},
  {"patient_id":"P5","assessment_id":"sa_5","stopbang_score":5,"a_hi":15,"ess_score":14,"neck_circumference":42,"bmi":35,"history_hypertension":true,"osa_classification":"moderate","provider":"ps_001"},
  {"patient_id":"P6","titration_id":"st_6","machine":"auto_cpap","initial_pressure":5,"final_pressure":10,"ahi_after":3,"mask_type":"full_face","leak_score":1,"compliance_pct":85,"provider":"ps_001"},
  {"patient_id":"P7","study_id":"ps_7","sleep_efficiency":82,"rem_pct":18,"n1_pct":8,"n2_pct":52,"n3_pct":12,"ahi_supine":25,"ahi_rem":15,"arousal_index":28,"provider":"ps_001"},
  {"patient_id":"P8","assessment_id":"sa_8","caffeine_intake":3,"alcohol_intake":2,"screen_time":4,"exercise_hours_week":3,"bedtime_regular":true,"sleep_duration":7,"sleep_quality_score":6,"provider":"ps_001"},
  {"patient_id":"P9","assessment_id":"sa_9","ess_score":18,"sleep_latency_min":5,"sleep_paralysis":true,"hypnagogic_hallucinations":true,"cataplexy":true,"mslt_sleep_latency":3,"mslt_soremp":3,"provider":"ps_001"},
  {"patient_id":"P10","assessment_id":"ip_10","ild_pattern":"usual_interstitial_pneumonia","hrct_findings":"reticulation_honeycombing","biopsy_done":false,"crp":25,"esr":45,"oxygen_required":true,"provider":"pi_001"},
  {"patient_id":"P11","assessment_id":"ip_11","fvc_pred":62,"dlco_pred":48,"progression":"slow","fvc_decline_pct":8,"honeycombing":true,"tractions_bronchiectasis":true,"antifibrotic":true,"provider":"pi_001"},
  {"patient_id":"P12","assessment_id":"sa_12","scadding_stage":2,"serum_ace":80,"calcium":11.5,"vdrt_negative":true,"cd4_ratio_normal":false,"lymphocytosis_broncho":true,"extrathoracic_involvement":3,"provider":"pi_001"},
  {"patient_id":"P13","assessment_id":"hp_13","antigen_exposure":"bird_proteins","exposure_history":true,"lymphocytosis":true,"centrilobular_nodules":true,"ground_glass":false,"serum_igg":500,"antigen_avoidance":true,"provider":"pi_001"},
  {"patient_id":"P14","assessment_id":"ip_14","ctd_type":"ssc","fvc_pred":58,"dlco_pred":45,"anti_scl70":true,"ground_glass":true,"fibrosis_present":true,"immunosuppression":true,"provider":"pi_001"},
  {"patient_id":"P15","assessment_id":"pa_15","mean_pap":42,"pulmonary_capillary_wedge":9,"cardiac_output":4.5,"pulmonary_vascular_resistance":8,"who_functional_class":3,"six_min_walk":320,"ntprobnp":1500,"provider":"pv_001"},
  {"patient_id":"P16","assessment_id":"pa_16","cteph_present":true,"perfusion_defects":4,"segmental_defects":6,"pulmonary_angiogram_done":true,"riociguat":true,"endarterectomy_candidate":true,"duration_months":9,"provider":"pv_001"},
  {"patient_id":"P17","assessment_id":"pe_17","edema_type":"cardiogenic","bnp":1200,"ejection_fraction":25,"edema_onset":"acute","weight_gain_kg":4,"diuretic_response":2,"fluid_balance":-1.5,"provider":"pv_001"},
  {"patient_id":"P18","assessment_id":"pa_18","wells_score":6,"d_dimer":4.5,"imaging":"cta","location":"bilateral","right_ventricular_dysfunction":true,"troponin":0.4,"treatment":"thrombolytics","provider":"pv_001"},
  {"patient_id":"P19","assessment_id":"pa_19","mean_pap":35,"pulmonary_capillary_wedge":12,"pulmonary_vascular_resistance":5,"who_functional_class":2,"treatment":"vasodilator","reversal_therapy":true,"provider":"pv_001"},
  {"patient_id":"P20","assessment_id":"pe_20","side":"right","fluid_type":"exudate","protein_fluid":4.5,"ldh_fluid":250,"glucose_fluid":60,"cell_count":1500,"cell_differential":"lymphocytes","wbc_fluid":1200,"provider":"pp_001"},
  {"patient_id":"P21","procedure_id":"pr_21","side":"right","volume_ml":1200,"fluid_appearance":"straw","ultrasound_guided":true,"complications":0,"symptom_relief":true,"provider":"pp_001"},
  {"patient_id":"P22","procedure_id":"pr_22","indication":"pneumothorax","size_fr":20,"side":"left","duration_days":3,"suction":"-20","underwater_seal":true,"complications":false,"provider":"pp_001"},
  {"patient_id":"P23","procedure_id":"pr_23","agent":"talc","success_rate":85,"recurrence":false,"follow_up_imaging":"resolved","hospital_days":4,"provider":"pp_001"},
  {"patient_id":"P24","assessment_id":"pe_24","empyema_present":true,"fluid_ph":6.8,"glucose":25,"loculations":true,"treatment":"chest_tube_fibrinolytics","surgery_required":false,"hospital_days":12,"provider":"pp_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
