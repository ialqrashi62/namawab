// filepath: gen_tier121.js
const fs = require('fs');
const mounts = [
  { mount: '/api/pharm_adv_v2', engine: 'tier121_pharm_advanced_632_engine', fns: ['controlled_substance','compounded_sterile','radiopharmaceutical','biologic_therapy','specialty_med'] },
  { mount: '/api/genomics_v2', engine: 'tier121_genomics_633_engine', fns: ['genetic_test','variant_interpretation','pharmacogenomics','hereditary_cancer','prenatal_screening'] },
  { mount: '/api/biomarkers_v2', engine: 'tier121_biomarkers_634_engine', fns: ['tumor_marker','cardiac_biomarker','inflammatory_marker','infectious_marker','allergy_panel'] },
  { mount: '/api/precision_v2', engine: 'tier121_precision_med_635_engine', fns: ['molecular_tumor_board','targeted_therapy','companion_dx','liquid_biopsy','minimal_residual'] },
];
for (const m of mounts) {
  const e = require('./' + m.engine);
  let r = `const express = require('express');\nconst router = express.Router();\nconst { funcs } = require('./${m.engine}');\nconst f = funcs();\nfunction asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }\n`;
  for (const fn of m.fns) {
    r += `router.post('/${fn}', asyncH((req, res) => { const r = f.${fn}(req.body || {}); res.json({ ok: true, op: '${fn}', result: r }); }));\n`;
  }
  r += `module.exports = router;\n`;
  const routerFile = m.engine.replace('_engine', '_router') + '.js';
  fs.writeFileSync(routerFile, r);
}
const bodies = [
  {"patient_id":"W0","rx_id":"cs_0","drug":"oxycodone","dea_schedule":"2","days_supply":7,"provider":"ph_001"},
  {"patient_id":"W1","rx_id":"cp_1","drug":"morphine_pca","compounding_type":"sterile","iso_class":"5","provider":"ph_001"},
  {"patient_id":"W2","rx_id":"rp_2","isotope":"tc99m","dose_mbq":740,"radiation_mSv":5,"provider":"ph_001"},
  {"patient_id":"W3","rx_id":"bt_3","biologic":"infliximab","infusion_duration_min":120,"provider":"ph_001"},
  {"patient_id":"W4","rx_id":"sm_4","specialty":"hiv","prior_auth":true,"copay_assistance":true,"provider":"ph_001"},
  {"patient_id":"W5","test_id":"gt_5","panel":"comprehensive","method":"ngs","turn_around_days":14,"provider":"gn_001"},
  {"patient_id":"W6","var_id":"vi_6","gene":"BRCA1","variant":"c.5266dupC","pathogenicity":"pathogenic","provider":"gn_001"},
  {"patient_id":"W7","pgx_id":"pg_7","gene":"CYP2C19","diplotype":"*2/*2","phenotype":"poor_metabolizer","provider":"gn_001"},
  {"patient_id":"W8","test_id":"hc_8","panel":"brca_hereditary","genes_tested":34,"positive":true,"provider":"gn_001"},
  {"patient_id":"W9","screen_id":"ps_9","test":"nips","gestational_age_weeks":12,"high_risk":false,"provider":"gn_001"},
  {"patient_id":"W10","marker_id":"tm_10","marker":"CEA","value_ng_ml":4.5,"reference_range":"<3.0","trending":"rising","provider":"bm_001"},
  {"patient_id":"W11","marker_id":"cb_11","marker":"troponin","value_ng_ml":0.05,"time_point":"6h","interpretation":"mild_elevation","provider":"bm_001"},
  {"patient_id":"W12","marker_id":"im_12","marker":"CRP","value_mg_l":15,"severity":"moderate","provider":"bm_001"},
  {"patient_id":"W13","marker_id":"ifm_13","marker":"procalcitonin","value_ng_ml":0.5,"interpretation":"bacterial_likely","provider":"bm_001"},
  {"patient_id":"W14","test_id":"ap_14","allergen_count":20,"positive_count":3,"provider":"bm_001"},
  {"patient_id":"W15","board_id":"mtb_15","case_id":"onco_001","mutations":"EGFR_exon19","therapies_reviewed":3,"recommendation":"osimertinib","provider":"pm_001"},
  {"patient_id":"W16","rx_id":"tt_16","target":"EGFR","drug":"osimertinib","line_of_therapy":"1st","response":"partial","provider":"pm_001"},
  {"patient_id":"W17","dx_id":"cd_17","drug":"trastuzumab","biomarker":"HER2+","required":true,"provider":"pm_001"},
  {"patient_id":"W18","bx_id":"lb_18","sample_type":"blood","ctdna_detected":true,"variant_allele_freq":2.5,"provider":"pm_001"},
  {"patient_id":"W19","mrd_id":"mrd_19","sample_type":"bone_marrow","sensitivity":0.001,"positive":false,"provider":"pm_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 20 bodies and 4 routers');