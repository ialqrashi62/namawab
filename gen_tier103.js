// filepath: gen_tier103.js
const fs = require('fs');
const mounts = [
  { mount: '/api/pathology_v2', engine: 'tier103_pathology_538_engine', fns: ['histology_review','cytology','frozen_section','molecular_path','autopsy'] },
  { mount: '/api/radiology_extended_v2', engine: 'tier103_radiology_extended_539_engine', fns: ['ct_protocol','mri_protocol','interventional_radiology','contrast_reaction','image_guided_biopsy'] },
  { mount: '/api/nuclear_medicine_v2', engine: 'tier103_nuclear_medicine_540_engine', fns: ['pet_ct','bone_scan','thyroid_scan','myocardial_perfusion','therapy_radionuclide'] },
  { mount: '/api/lab_management_v2', engine: 'tier103_lab_management_541_engine', fns: ['specimen_collection','critical_value','lab_quality','turn_around_time','lab_error'] },
  { mount: '/api/blood_bank_v2', engine: 'tier103_blood_bank_542_engine', fns: ['type_and_cross','transfusion_reaction','plasma_exchange','platelet_transfusion','autologous_donation'] },
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
  {"patient_id":"D0","study_id":"hr_0","tissue_type":"breast","diagnosis":"fibroadenoma","grade":1,"stage":"0","immunohistochemistry":"pending","recommendation":"surgical","provider":"pa_001"},
  {"patient_id":"D1","study_id":"cy_1","specimen_type":"fluid","atypia":false,"malignancy_suspicious":false,"adequacy":"adequate","recommendation":"followup","provider":"pa_001"},
  {"patient_id":"D2","procedure_id":"fs_2","intraoperative_finding":"benign","permanent_section":"benign","discrepancy":false,"turnaround_min":18,"provider":"pa_001"},
  {"patient_id":"D3","test_id":"mp_3","test_type":"fish","genes_tested":50,"mutations_found":2,"tumor_fraction":0.45,"interpretation":"actionable","treatment_target":"identified","provider":"pa_001"},
  {"patient_id":"D4","report_id":"au_4","autopsy_type":"full","cause_of_death":"mi","contributing":"diabetes","clinical_correction":true,"consent":"yes","turnaround_days":30,"provider":"pa_001"},
  {"patient_id":"D5","study_id":"cp_5","modality":"ct_chest","contrast":"with","slice_thickness":1.5,"dose_reduction":true,"findings":"nodule","radiation_dose":3.5,"provider":"rd_001"},
  {"patient_id":"D6","study_id":"mp_6","sequence":"t1_t2_flair","contrast":"gadolinium","slice_thickness":3,"findings":"mass","field_strength":3,"provider":"rd_001"},
  {"patient_id":"D7","procedure_id":"ir_7","procedure_type":"angiography","vascular_access":"femoral","complications":0,"catheter_size_fr":5,"contrast_volume_ml":80,"provider":"rd_001"},
  {"patient_id":"D8","episode_id":"cr_8","contrast_type":"iodinated","reaction_severity":"mild","treatment":"diphenhydramine","hospitalization":false,"premedication":1,"provider":"rd_001"},
  {"patient_id":"D9","procedure_id":"ib_9","modality":"ct","target":"lung","needle_gauge":18,"core_samples":4,"pathology":"benign","complications":0,"provider":"rd_001"},
  {"patient_id":"D10","study_id":"ps_10","tracer":"fdg","indication":"cancer_staging","suv_max":7.5,"findings":"hypermetabolic_lymph_nodes","stage":"III","provider":"nm_001"},
  {"patient_id":"D11","study_id":"bs_11","tracer":"methylene_diphosphonate","indication":"bone_pain","findings":"metastases","follow_up_weeks":4,"provider":"nm_001"},
  {"patient_id":"D12","study_id":"ts_12","tracer":"i123","uptake_pattern":"homogeneous","tsh":0.05,"diagnosis":"hyperthyroidism","treatment":"rai","provider":"nm_001"},
  {"patient_id":"D13","study_id":"mp_13","stress":"exercise","rest":"normal","reversibility":true,"ef":55,"perfusion_defect":"anterior","provider":"nm_001"},
  {"patient_id":"D14","therapy_id":"th_14","isotope":"i131","dose_mci":30,"indication":"thyroid_cancer","side_effects":1,"follow_up_weeks":4,"provider":"nm_001"},
  {"patient_id":"D15","specimen_id":"sp_15","specimen_type":"blood","collection_time":"08:00","tube_type":"serum","volume_ml":5,"patient_identification":true,"lab_errors":0,"provider":"lm_001"},
  {"patient_id":"D16","alert_id":"cv_16","test_name":"potassium","value":6.8,"critical_range":6.5,"acknowledged":true,"notification_time":15,"provider":"lm_001"},
  {"patient_id":"D17","assessment_id":"lq_17","test_count":25,"error_rate_pct":0.5,"qc_failures":1,"specimen_rejections":0,"instrument_drift":0,"provider":"lm_001"},
  {"patient_id":"D18","metric_id":"ta_18","test_name":"cbc","tat_min":45,"target_tat":60,"performance":"excellent","monthly_volume":1500,"provider":"lm_001"},
  {"patient_id":"D19","incident_id":"le_19","error_type":"pre_analytic","specimen_id":"S123","error_description":"mislabeling","discovered_by":"lab","corrected":true,"patient_impact":"none","provider":"lm_001"},
  {"patient_id":"D20","order_id":"tc_20","patient_id":"P20","abo":"o_pos","rh":"positive","antibody_screen":"negative","crossmatch_compatible":true,"units_ordered":2,"component":"prbc","provider":"bb_001"},
  {"patient_id":"D21","episode_id":"tr_21","product":"prbc","reaction_type":"febrile","severity":"moderate","time_to_reaction":30,"treatment":"antipyretic","hemolysis_check":"no","provider":"bb_001"},
  {"patient_id":"D22","procedure_id":"pe_22","exchange_volume_l":4,"replacement_fluid":"albumin","frequency":"every_other_day","complications":0,"response":3,"provider":"bb_001"},
  {"patient_id":"D23","transfusion_id":"pt_23","product":"plt","dose_per_apheresis":1,"platelet_count_pre":15,"platelet_count_post":45,"ccr":35,"provider":"bb_001"},
  {"patient_id":"D24","donation_id":"ad_24","donor_id":"D24","hemoglobin":14,"donation_type":"preop","autologous_units":2,"iron_supplementation":true,"reaction":0,"provider":"bb_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
