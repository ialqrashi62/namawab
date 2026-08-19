// filepath: gen_tier125.js
const fs = require('fs');
const mounts = [
  { mount: '/api/lab_adv_v2', engine: 'tier125_lab_advanced_648_engine', fns: ['cbc_differential','metabolic_panel','coag_study','urinalysis','microalbumin'] },
  { mount: '/api/path_v2', engine: 'tier125_pathology_649_engine', fns: ['histology_report','cytology','frozen_section','immuno_stain','molecular_path'] },
  { mount: '/api/micro_v2', engine: 'tier125_microbiology_650_engine', fns: ['culture_growth','gram_stain','sensitivity','parasitology','mycology'] },
  { mount: '/api/trans_v2', engine: 'tier125_transfusion_651_engine', fns: ['type_screen','crossmatch','transfuse_unit','reaction_investigation','apheresis'] },
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
  {patient_id:'W0',cbc_id:'cbc_0',wbc:7.5,rbc:4.5,hgb:14,hct:42,plt:250,provider:'lb_001'},
  {patient_id:'W1',bmp_id:'bmp_1',sodium:140,potassium:4.0,chloride:100,bicarb:24,bun:15,creatinine:1.0,glucose:90,provider:'lb_001'},
  {patient_id:'W2',coag_id:'coag_2',pt:11,ptt:30,inr:1.0,fibrinogen:300,provider:'lb_001'},
  {patient_id:'W3',ua_id:'ua_3',ph:6.0,protein:'neg',glucose:'neg',ketones:'neg',blood:'neg',provider:'lb_001'},
  {patient_id:'W4',malb_id:'malb_4',acr:30,ratio:30,severity:'moderately_increased',provider:'lb_001'},
  {patient_id:'W5',path_id:'hr_5',specimen_type:'biopsy',diagnosis:'benign',provider:'pt_001'},
  {patient_id:'W6',cyt_id:'cy_6',specimen:'fn_a',diagnosis:'negative',provider:'pt_001'},
  {patient_id:'W7',fs_id:'fs_7',intraop_consult:true,margin:'clear',provider:'pt_001'},
  {patient_id:'W8',ihc_id:'ih_8',stain:'er',result:'positive',percent:90,provider:'pt_001'},
  {patient_id:'W9',mol_id:'mol_9',test:'pdl1',result:'high_expression',tps:75,provider:'pt_001'},
  {patient_id:'W10',culture_id:'cu_10',specimen:'blood',organism:'staph_aureus',day_to_positive:2,provider:'mc_001'},
  {patient_id:'W11',gram_id:'gr_11',specimen:'sputum',organism_type:'gram_pos_cocci',provider:'mc_001'},
  {patient_id:'W12',sens_id:'se_12',antibiotic:'vancomycin',sensitive:true,mic:1.0,provider:'mc_001'},
  {patient_id:'W13',para_id:'pa_13',specimen:'stool',parasite:'giardia',provider:'mc_001'},
  {patient_id:'W14',myc_id:'my_14',specimen':'skin',fungus':'candida',provider':'mc_001'},
  {patient_id:'W15',type_id':'ty_15','blood_type':'A_pos','antibody_screen':'negative',provider':'tr_001'},
  {patient_id:'W16',xm_id':'xm_16','unit_id':'U12345','compatible':true,'provider':'tr_001'},
  {patient_id:'W17',tx_id':'tx_17','unit_id':'U12345','volume_ml':250,'reaction':false,'provider':'tr_001'},
  {patient_id':'W18','rxn_id':'rx_18','severity':'mild','febrile':true,'workup_complete':true,'provider':'tr_001'},
  {patient_id':'W19','aph_id':'ap_19','type':'plasmapheresis','volume_ml':3000,'provider':'tr_001'}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 20 bodies and 4 routers');