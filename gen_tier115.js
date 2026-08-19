// filepath: gen_tier115.js
const fs = require('fs');
const mounts = [
  { mount: '/api/neurosurgery_v2', engine: 'tier115_neurosurgery_605_engine', fns: ['craniotomy','spine_fusion','tumor_resection','vp_shunt','cervical_decompression'] },
  { mount: '/api/orthopedics_ext_v2', engine: 'tier115_orthopedics_extended_606_engine', fns: ['joint_replacement','arthroscopy','fracture_fixation','spinal_decompression','ligament_repair'] },
  { mount: '/api/otolaryngology_v2', engine: 'tier115_otolaryngology_607_engine', fns: ['sinus_surgery','hearing_aid','cochlear_implant','tonsillectomy','thyroidectomy'] },
  { mount: '/api/ophthalmology_v2', engine: 'tier115_ophthalmology_608_engine', fns: ['cataract_surgery','retinal_detachment','glaucoma_surgery','refractive_surgery','corneal_transplant'] },
  { mount: '/api/dentistry_v2', engine: 'tier115_dentistry_609_engine', fns: ['extraction','root_canal','implant','orthodontic','periodontal'] },
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
  {"patient_id":"S0","procedure_id":"cr_0","indication":"hemorrhage","approach":"pterional","duration_min":240,"blood_loss_ml":500,"outcome":"successful","complications":0,"provider":"ns_001"},
  {"patient_id":"S1","procedure_id":"sf_1","levels":"l4_l5","approach":"posterior","graft":"autograft","duration_min":300,"blood_loss_ml":600,"outcome":"successful","provider":"ns_001"},
  {"patient_id":"S2","procedure_id":"tr_2","tumor_type":"meningioma","location":"frontal","approach":"pterional","extent":"gross_total","duration_min":280,"complications":0,"provider":"ns_001"},
  {"patient_id":"S3","procedure_id":"vs_3","indication":"hydrocephalus","valve_setting":1,"pressure_cm":15,"outcome":"successful","revisions_count":0,"provider":"ns_001"},
  {"patient_id":"S4","procedure_id":"cd_4","level":"c5_c6","approach":"anterior","discectomy":true,"fusion":true,"outcome":"successful","complications":0,"provider":"ns_001"},
  {"patient_id":"S5","procedure_id":"jr_5","joint":"hip","prosthesis":"cementless","approach":"posterior","duration_min":90,"blood_loss_ml":300,"outcome":"successful","provider":"or_001"},
  {"patient_id":"S6","procedure_id":"ar_6","joint":"knee","type":"diagnostic","findings":"meniscal_tear","treatment":"meniscectomy","duration_min":45,"outcome":"successful","provider":"or_001"},
  {"patient_id":"S7","procedure_id":"ff_7","fracture_type":"tibial","location":"distal","fixation":"plate_screw","healing_weeks":12,"weight_bearing_status":"partial","provider":"or_001"},
  {"patient_id":"S8","procedure_id":"sd_8","level":"l5_s1","approach":"posterior","discectomy":true,"duration_min":120,"outcome":"successful","hospital_days":2,"provider":"or_001"},
  {"patient_id":"S9","procedure_id":"lr_9","joint":"knee","ligament":"acl","graft":"bptb","technique":"arthroscopic","outcome":"successful","rehab_weeks":24,"provider":"or_001"},
  {"patient_id":"S10","procedure_id":"sn_10","indication":"chronic_sinusitis","approach":"endoscopic","extent":"maxillary","duration_min":90,"outcome":"successful","provider":"ot_001"},
  {"patient_id":"S11","fitting_id":"ha_11","hearing_aid_type":"bte","ear":"right","fitting_date":"2026-09-01","aided_threshold":35,"satisfaction":8,"provider":"ot_001"},
  {"patient_id":"S12","procedure_id":"ci_12","ear":"left","implant_type":"ci24","activation_weeks":4,"outcomes":"improved","rehabilitation":"active","provider":"ot_001"},
  {"patient_id":"S13","procedure_id":"ts_13","indication":"recurrent_tonsillitis","technique":"coblation","duration_min":30,"blood_loss_ml":50,"complications":0,"provider":"ot_001"},
  {"patient_id":"S14","procedure_id":"ty_14","type":"total","extent":"thyroid","duration_min":120,"blood_loss_ml":100,"outcome":"successful","calcium_normal":true,"provider":"ot_001"},
  {"patient_id":"S15","procedure_id":"ct_15","eye":"left","lens":"multifocal","technique":"phaco","duration_min":20,"visual_acuity_post":20,"complications":0,"provider":"op_001"},
  {"patient_id":"S16","procedure_id":"rd_16","eye":"right","type":"rhegmatogenous","procedure":"vitrectomy","tamponade":"sf6","anatomic_success":true,"vision_improvement":3,"provider":"op_001"},
  {"patient_id":"S17","procedure_id":"gl_17","eye":"left","type":"trabeculectomy","target_iop":15,"outcome":"controlled","bleb_status":"functioning","provider":"op_001"},
  {"patient_id":"S18","procedure_id":"rs_18","eye":"right","type":"lasik","preop_refraction":-3.5,"postop_refraction":-0.25,"visual_acuity_post":20,"satisfaction":9,"provider":"op_001"},
  {"patient_id":"S19","procedure_id":"ct_19","eye":"left","graft":"penetrating","indication":"keratoconus","donor_age":35,"rejection":false,"visual_acuity_post":20,"provider":"op_001"},
  {"patient_id":"S20","procedure_id":"ex_20","tooth":"36","type":"simple","complications":0,"healing_days":7,"analgesics":"ibuprofen","provider":"de_001"},
  {"patient_id":"S21","procedure_id":"rc_21","tooth":"26","canal":"mesiobuccal","files":"rotary","filling":"gutta_percha","outcome":"successful","provider":"de_001"},
  {"patient_id":"S22","procedure_id":"im_22","tooth":"46","implant_type":"titanium","healing_months":4,"osseointegration":true,"prosthesis":"crown","provider":"de_001"},
  {"patient_id":"S23","procedure_id":"or_23","type":"fixed","duration_months":18,"appliance":"brackets","extractions_needed":4,"outcome":"in_progress","provider":"de_001"},
  {"patient_id":"S24","procedure_id":"pd_24","diagnosis":"periodontitis","pocket_depth_mm":5,"bleeding_on_probing":true,"treatment":"scaling_root_planing","reassessment_weeks":6,"provider":"de_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');