// filepath: gen_tier124.js
const fs = require('fs');
const mounts = [
  { mount: '/api/rad_adv_v2', engine: 'tier124_rad_advanced_644_engine', fns: ['mri_advanced','ct_advanced','pet_imaging','mammography','bone_density'] },
  { mount: '/api/cardio_img_v2', engine: 'tier124_cardio_imaging_645_engine', fns: ['echo_complete','stress_test','cardiac_mri','holter','event_monitor'] },
  { mount: '/api/endo_img_v2', engine: 'tier124_endoscopy_646_engine', fns: ['colonoscopy','egd','bronchoscopy','cystoscopy','laparoscopy'] },
  { mount: '/api/us_v2', engine: 'tier124_ultrasound_647_engine', fns: ['abdominal_us','vascular_us','obstetric_us','echo_us','msk_us'] },
];
for (const m of mounts) {
  const e = require('./' + m.engine);
  let r = `const express = require('express');\nconst router = express.Router();\nconst { funcs } = require('./${m.engine}');\nconst f = funcs();\nfunction asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }\n`;
  for (const fn of m.fns) {
    r += `router.post('/${fn}', asyncH((req, res) => { const r = f.${fn}(req.body || {}); res.json({ ok: true, op: '${fn}', result: r }); }));\n`;
  }
  r += `module.exports = router;\n`;
  fs.writeFileSync(m.engine.replace('_engine', '_router') + '.js', r);
}
const bodies = [
  {patient_id:'W0',study_id:'mri_0',modality:'mri_brain',contrast_used:true,findings:'normal',provider:'rd_001'},
  {patient_id:'W1',study_id:'ct_1',modality:'ct_chest_pe',findings:'negative',provider:'rd_001'},
  {patient_id:'W2',study_id:'pet_2',tracer:'fdg',suv_max:8.5,findings:'hypermetabolic_lesion',provider:'rd_001'},
  {patient_id:'W3',study_id:'mg_3',birads:2,findings:'benign',provider:'rd_001'},
  {patient_id:'W4',study_id:'bmd_4',t_score:-1.5,diagnosis:'osteopenia',provider:'rd_001'},
  {patient_id:'W5',echo_id:'ec_5',ef_pct:55,wall_motion:'normal',valves:'normal',provider:'cd_001'},
  {patient_id:'W6',stress_id:'st_6',protocol:'treadmill',mets:10,ischemia:false,provider:'cd_001'},
  {patient_id:'W7',cmri_id:'cm_7',ef_pct:60,scar_present:false,provider:'cd_001'},
  {patient_id:'W8',holter_id:'hl_8',duration_hours:24,min_hr:55,max_hr:120,afib_burden_pct:0,provider:'cd_001'},
  {patient_id:'W9',event_id:'em_9',symptoms_documented:3,correlated:true,provider:'cd_001'},
  {patient_id:'W10',scope_id:'co_10',prep_quality:'excellent',withdrawal_time_min:8,polyps_found:1,provider:'en_001'},
  {patient_id:'W11',scope_id:'eg_11',findings:'gastritis',biopsies_taken:3,provider:'en_001'},
  {patient_id:'W12',scope_id:'br_12',lavage:'performed',bal_done:true,provider:'en_001'},
  {patient_id:'W13',scope_id:'cy_13',bladder_appearance:'normal',biopsies:2,provider:'en_001'},
  {patient_id:'W14',scope_id:'lp_14',procedure_type:'diagnostic',findings:'endometriosis',provider:'en_001'},
  {patient_id:'W15',us_id:'ab_15',findings:'normal_liver',gallbladder:'normal',provider:'us_001'},
  {patient_id:'W16',us_id:'va_16',vessel:'carotid',stenosis_pct:30,plaque:false,provider:'us_001'},
  {patient_id:'W17',us_id:'ob_17',gestational_age_weeks:28,fetal_weight_g:1100,position:'cephalic',provider:'us_001'},
  {patient_id:'W18',us_id:'ec_18',ef_pct:55,wall_motion:'normal',provider:'us_001'},
  {patient_id:'W19',us_id:'ms_19',joint:'shoulder',finding:'rotator_cuff_tear',provider:'us_001'}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 20 bodies and 4 routers');