// filepath: gen_tier123.js
const fs = require('fs');
const mounts = [
  { mount: '/api/dental_v2', engine: 'tier123_dental_640_engine', fns: ['dental_exam','restorative','endodontic','periodontal','orthodontic'] },
  { mount: '/api/wound_v2', engine: 'tier123_wound_641_engine', fns: ['wound_assessment','wound_dressing','wound_culture','debridement','wound_closure'] },
  { mount: '/api/skin_v2', engine: 'tier123_skin_642_engine', fns: ['skin_biopsy','dermoscopy','lesion_excision','patch_test','cryotherapy'] },
  { mount: '/api/eye_v2', engine: 'tier123_eye_643_engine', fns: ['visual_acuity','tonometry','fundoscopy','retinal_imaging','oct_scan'] },
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
  {"patient_id":"W0","exam_id":"de_0","tooth_number":14,"caries_present":true,"provider":"dt_001"},
  {"patient_id":"W1","rest_id":"rs_1","tooth_number":14","filling_type":"composite","surface":"occlusal","provider":"dt_001"},
  {"patient_id":"W2","endo_id":"ed_2","tooth_number":30","root_canals":3,"provider":"dt_001"},
  {"patient_id":"W3","perio_id":"pd_3","pocket_depth_mm":5,"bleeding":true","provider":"dt_001"},
  {"patient_id":"W4","ortho_id":"or_4","malocclusion_class":"II","treatment":"braces","provider":"dt_001"},
  {"patient_id":"W5","wound_id":"wa_5","stage":"3","size_cm":"5x3","location":"sacrum","provider":"wn_001"},
  {"patient_id":"W6","dressing_id":"wd_6","wound_id":"wa_5","dressing_type":"hydrocolloid","change_frequency_days":3,"provider":"wn_001"},
  {"patient_id":"W7","culture_id":"wc_7","wound_id":"wa_5","organism":"staph_aureus","provider":"wn_001"},
  {"patient_id":"W8","debride_id":"db_8","wound_id":"wa_5","method":"sharp","tissue_removed_g":3,"provider":"wn_001"},
  {"patient_id":"W9","closure_id":"wcl_9","wound_id":"wa_5","method":"secondary","suture_count":0,"provider":"wn_001"},
  {"patient_id":"W10","biopsy_id":"sb_10","lesion_id":"L1","method":"punch","specimen_size_mm":4,"provider":"sk_001"},
  {"patient_id":"W11","derm_id":"dm_11","lesion_id":"L1","score":3,"abcd_criteria":"asymmetric","provider":"sk_001"},
  {"patient_id":"W12","excise_id":"ex_12","lesion_id":"L1","method":"elliptical","margin_cm":0.5,"provider":"sk_001"},
  {"patient_id":"W13","patch_id":"pt_13","allergens_count":35","reactions":2","provider":"sk_001"},
  {"patient_id":"W14","cryo_id":"cr_14","lesion_id":"L2","freeze_time_sec":15","cycles":2","provider":"sk_001"},
  {"patient_id":"W15","va_id":"va_15","od":"20/20","os":"20/30","method":"snellen","provider":"ey_001"},
  {"patient_id":"W16","tono_id":"tn_16","od_pressure_mmHg":14,"os_pressure_mmHg":16,"method":"nct","provider":"ey_001"},
  {"patient_id":"W17","fundo_id":"fd_17","cup_disc_ratio_od":0.3,"cup_disc_ratio_os":0.4,"provider":"ey_001"},
  {"patient_id":"W18","ret_id":"ri_18","eye":"od","image_quality":"good","finding":"none","provider":"ey_001"},
  {"patient_id":"W19","oct_id":"oct_19","eye":"od","scan_type":"macular","rnfl_um":95,"provider":"ey_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 20 bodies and 4 routers');