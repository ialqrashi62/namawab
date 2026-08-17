// filepath: gen_tier51.js
const fs = require('fs');

const routes = [
  [288, 'derm_infla', 'atopic_dermatitis,psoriasis_severe,lichen_planus,vitiligo,hidradenitis_suppurativa'],
  [289, 'derm_inf', 'bacterial_cellulitis,fungal_skin,parasitic_skin,viral_herpes,warts_molluscum'],
  [290, 'derm_neo', 'melanoma_skin,bcc_skin,scc_skin,lymphoma_cutaneous,kaposi'],
  [291, 'derm_pig', 'melasma,post_inflammatory_hyperpig,alopecia_areata,hyperpig_workup,hypopig_workup'],
  [292, 'derm_proced', 'excisional_biopsy,shave_biopsy,punch_biopsy,cryotherapy,phototherapy'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier51_dermatology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier51_dermatology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier51_dermatology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['d_atp','/api/derm_infla/atopic_dermatitis',{patient_id:'D1',age:7,severity:'moderate',easi_score:18,iga_score:3,trigger:'allergens',therapy:'topical_steroid_oral_antihistamine'}],
  ['d_psv','/api/derm_infla/psoriasis_severe',{patient_id:'D2',pas:18,bsa_pct:25,comorbidities:'psoriatic_arthritis',therapy:'biologic_adalimumab',response:'improving'}],
  ['d_lp','/api/derm_infla/lichen_planus',{patient_id:'D3',type:'cutaneous',sites:'wrists_ankles',symptom:'intense_pruritus',therapy:'topical_steroid',response:'partial'}],
  ['d_vtl','/api/derm_infla/vitiligo',{patient_id:'D4',type:'segmental',bsa_pct:8,stability:'stable_2_years',therapy:'nb_uvb_narrowband',response:'repigmentation_partial'}],
  ['d_hs','/api/derm_infla/hidradenitis_suppurativa',{patient_id:'D5',hurley_stage:2,active_sites:'axillae_groin',refractory_antibiotics:true,biologic_adalimumab:true,response:'improving'}],

  ['d_cel','/api/derm_inf/bacterial_cellulitis',{patient_id:'DI1',site:'right_lower_leg',severity:'moderate',microbial_etiology:'likely_strep',antibiotic:'cephalexin',duration_days:10,complications:'none'}],
  ['d_fun','/api/derm_inf/fungal_skin',{patient_id:'DI2',type:'tinea_corporis',site:'trunk',diagnostic:'koh_positive',therapy:'topical_antifungal',duration_weeks:4}],
  ['d_par','/api/derm_inf/parasitic_skin',{patient_id:'DI3',parasite:'scabies',family_members_affected:true,therapy:'permethrin_5_percent',household_treatment:true,follow_up_weeks:2}],
  ['d_hsv','/api/derm_inf/viral_herpes',{patient_id:'DI4',type:'hsv2_genital',episode:'recurrent',severity:'moderate',antiviral:'valacyclovir',suppressive_therapy:'daily',response:'well_controlled'}],
  ['d_war','/api/derm_inf/warts_molluscum',{patient_id:'DI5',lesion_type:'verruca_vulgaris',count:5,location:'hands',therapy:'cryotherapy',response:'clearing'}],

  ['d_mel','/api/derm_neo/melanoma_skin',{patient_id:'DN1',type:'superficial_spreading',breslow_mm:0.8,clark_level:'ii','sentinel_node':'planned','ulceration':false,'mitotic_rate':1,'follow_up':3}],
  ['d_bcc','/api/derm_neo/bcc_skin',{patient_id:'DN2',type:'nodular',site:'nose',size_mm:8,high_risk_features:false,treatment:'ed_c_adequate',follow_up_months:6}],
  ['d_scc','/api/derm_neo/scc_skin',{patient_id:'DN3',site:'forehead',size_mm:12,depth_invasion_mm:3,high_risk:true,treatment:'Mohs_surgery_planned',lymph_node:'palpable_imaging_planned'}],
  ['d_lym','/api/derm_neo/lymphoma_cutaneous',{patient_id:'DN4',type:'mfctcl_suspected','stage':'t2_n0_m0_b0',biopsy_planned:'multiple_sites','follow_up':'derm_onc_team'}],
  ['d_kap','/api/derm_neo/kaposi',{patient_id:'DI5',hiv_status:'positive_aids_defined','type':'cutaneous_patches_plaques','chemo':'liposomal_doxorubicin','follow_up':'hiv_onc_clinic'}],

  ['d_mel','/api/derm_pig/melasma',{patient_id:'DP1','fitzpatrick':'iv','type':'epidermal_mixed','trigger':'pregnancy_uv','therapy':'triple_combination_topical_sunscreen','response':'partial_improvement'}],
  ['d_pih','/api/derm_pig/post_inflammatory_hyperpig',{patient_id:'DP2','cause':'acne_resolved','sites':'face','therapy':'tretinoin_hydroquinone','duration_months':4,'response':'gradual_fading'}],
  ['d_al','/api/derm_pig/alopecia_areata',{patient_id:'DP3','type':'patchy','extent_pct':25,'severity':'s2_b0',therapy:'topical_steroid_intralesional','response':'partial_regrowth'}],
  ['d_hyp','/api/derm_pig/hyperpig_workup',{patient_id:'DP4','distribution':'generalized','onset':'adult','causes_considered':'endocrinopathy_drug_reaction','workup':'thyroid_hba1c_adrenal_planned'}],
  ['d_hyp','/api/derm_pig/hypopig_workup',{patient_id:'DP5','distribution':'focal','onset':'childhood','causes_considered':'vitiligo_piebaldism_tinea_versicolor','workup':'woods_lamp_biopsy_planned'}],

  ['d_exc','/api/derm_proced/excisional_biopsy',{patient_id:'PR1','indication':'pigmented_lesion_rule_out_melanoma','site':'back','margins_mm':3,'suture':'interrupted_nylon','follow_up':'1_2_weeks_pathology'}],
  ['d_sha','/api/derm_proced/shave_biopsy',{patient_id:'PR2','indication':'raised_benign_appearing_lesion','site':'forearm','blade':'flexible_15','hemostasis':'electrocautery','follow_up':'pathology_results_1_week'}],
  ['d_pun','/api/derm_proced/punch_biopsy',{patient_id:'PR3','indication':'inflammatory_dermatosis_diagnosis','site':'trunk','size_mm':4,'suture':'single_nylon','follow_up':'pathology_results_2_weeks'}],
  ['d_cry','/api/derm_proced/cryotherapy',{patient_id:'PR4','indication':'warts_akt','freeze_time_sec':5,'cycles':2,'site':'forehead','complications':'expected_blister_healing'}],
  ['d_pht','/api/derm_proced/phototherapy',{patient_id:'PR5','modality':'nb_uvb','frequency':'3x_week','total_sessions':30,'response':'psoriasis_improved_75_percent','monitoring':'photos_eye_exam_q6_months'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\der_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_der_tier51.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);