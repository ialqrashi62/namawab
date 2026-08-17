// filepath: gen_tier38.js
const fs = require('fs');

const routes = [
  [223, 'psoriasis', 'psoriasis_severity,topical_psoriasis,systemic_psoriasis,biologic_psoriasis,psoriasis_arthritis_screen'],
  [224, 'eczema', 'atopic_dermatitis,eczema_severity,eczema_topical,eczema_systemic,wound_care_eczema'],
  [225, 'skin_cancer', 'melanoma_staging,basal_cell,squamous_cell,actinic_keratosis,mohs_surgery'],
  [226, 'acne', 'acne_severity,acne_topical,acne_systemic,isotretinoin,acne_scar'],
  [227, 'hair_nails', 'alopecia,hair_loss_workup,onychomycosis,paronychia,autoimmune_skin'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier38_dermatology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier38_dermatology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier38_dermatology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['d_pss','/api/derm_psor/psoriasis_severity',{patient_id:'D1',pasi_score:18,bsa_pct:15,dlqi:12,previous_systemic:'methotrexate',biologic_naive:true}],
  ['d_pt','/api/derm_psor/topical_psoriasis',{patient_id:'D2',topical:'high_potency_steroid',frequency:'twice_daily',response:'good',duration_weeks:8,sites:'scalp'}],
  ['d_ps','/api/derm_psor/systemic_psoriasis',{patient_id:'D3',drug:'methotrexate',dose_mg:15,response:'moderate',lfts:35,pregnancy_test:'not_applicable',monitoring_complete:true}],
  ['d_pb','/api/derm_psor/biologic_psoriasis',{patient_id:'D4',biologic:'adalimumab',duration_months:18,response:'clearance',tb_screening:true,infection_signs:false}],
  ['d_par','/api/derm_psor/psoriasis_arthritis_screen',{patient_id:'D5',joint_pain:true,swollen_joints:2,pasi:18,napsi:0,pase_positive:true,refer_rheumatology:true}],

  ['d_ad','/api/derm_ecz/atopic_dermatitis',{patient_id:'E1',age:25,scorad:45,iga:3,eosinophil:500,family_history:'atopy',flaring:false}],
  ['d_es','/api/derm_ecz/eczema_severity',{patient_id:'E2',scorad:30,bsa_pct:30,iga:2,sleep_disruption:'mild',classification:'moderate',quality_of_life:'moderate'}],
  ['d_et','/api/derm_ecz/eczema_topical',{patient_id:'E3',topical:'mid_potency_steroid',sites:'trunk_limbs',frequency:'once_daily',duration_weeks:4,response:'partial'}],
  ['d_eu','/api/derm_ecz/eczema_systemic',{patient_id:'E4',systemic:'dupilumab',duration_months:12,response:'good',side_effects:'none',prior_immunomodulator:true}],
  ['d_ew','/api/derm_ecz/wound_care_eczema',{patient_id:'E5',infected:false,excoriation:'mild',emollient_use:'twice_daily',bleach_bath:false,antibiotic_needed:false}],

  ['d_ms','/api/derm_skin/melanoma_staging',{patient_id:'M1',breslow_mm:2.1,ulceration:true,mitotic_rate:4,sentinel_node:'negative',stage:'t2b_n0_m0'}],
  ['d_bcc','/api/derm_skin/basal_cell',{patient_id:'M2',type:'nodular',location:'face',size_mm:8,depth:'dermal',recurrent:false,subtype:'low_risk'}],
  ['d_scc','/api/derm_skin/squamous_cell',{patient_id:'M3',differentiation:'moderate',location:'forearm',size_mm:18,depth:4,perineural_invasion:false,immunosuppressed:false}],
  ['d_ak','/api/derm_skin/actinic_keratosis',{patient_id:'M4',lesion_count:8,site:'face',treatment_cryo:true,field_treatment:'imiquimod',sun_protection:true}],
  ['d_mohs','/api/derm_skin/mohs_surgery',{patient_id:'M5',indication:'high_risk_scc',location:'nose',pre_op_size_cm:1.5,stages_required:2,clearance:'achieved',reconstruction:'flap'}],

  ['d_acs','/api/derm_acne/acne_severity',{patient_id:'A1',acne_type:'papulopustular',lesion_count:30,comedone_count:25,cysts:0,scar_present:false,severity:'moderate'}],
  ['d_at','/api/derm_acne/acne_topical',{patient_id:'A2',topical:'benzoyl_peroxide_retinoid',duration_weeks:12,response:'good',side_effects:'mild_irritation',adherence:'good'}],
  ['d_as','/api/derm_acne/acne_systemic',{patient_id:'A3',systemic:'doxycycline',dose_mg:100,duration_weeks:16,response:'moderate',pregnancy_test:'negative',phototoxicity_education:true}],
  ['d_aiso','/api/derm_acne/isotretinoin',{patient_id:'A4',dose_mg_per_kg:0.5,cumulative_dose_mg:5000,lipids:'worsened',lfts:'normal',i_pledge_enrolled:true,depression_screen:'negative'}],
  ['d_asc','/api/derm_acne/acne_scar',{patient_id:'A5',scar_type:'atrophic',location:'face',treatment:'laser_resurfacing',number_sessions:3,response:'moderate'}],

  ['d_al','/api/derm_hair/alopecia',{patient_id:'H1',alopecia_type:'androgenic',pattern:'ludwig_ii',duration_years:5,family_history:true,scarring:false}],
  ['d_hl','/api/derm_hair/hair_loss_workup',{patient_id:'H2',tsh:2.5,ferritin:25,vit_d:20,biopsy_done:true,biopsy:'androgenic_pattern',lab_complete:true}],
  ['d_on','/api/derm_hair/onychomycosis',{patient_id:'H3',nail:'toe_hallux',confirmed_mycology:'positive_koh',treatment:'terbinafine',duration_weeks:12,response:'slow'}],
  ['d_pa','/api/derm_hair/paronychia',{patient_id:'H4',acuity:'acute',digit:'thumb',drainage_done:true,antibiotic:'augmentin',culture_done:true,response:'improving'}],
  ['d_ais','/api/derm_hair/autoimmune_skin',{patient_id:'H5',condition:'vitiligo',bsa_pct:8,active:false,nb_uvb:false,topical_tacrolimus:true,monitoring_6_month:true}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\derm_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_derm_tier38.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);