// filepath: gen_tier93.js
const fs = require('fs');
const mounts = [
  { mount: '/api/rheumatoid_v2', engine: 'tier93_rheumatoid_488_engine', fns: ['ra_assessment','ra_treatment','ra_monitoring','ra_imaging','ra_surgery'] },
  { mount: '/api/spondyloarthropathy_v2', engine: 'tier93_spondyloarthropathy_489_engine', fns: ['ankylosing_spondylitis','psoriatic_arthritis','ibd_arthritis','reactive_arthritis','enthesitis'] },
  { mount: '/api/crystal_arthritis_v2', engine: 'tier93_crystal_arthritis_490_engine', fns: ['gout_acute','gout_chronic','cppd','basic_calcium_phosphate','crystal_synovial'] },
  { mount: '/api/connective_tissue_v2', engine: 'tier93_connective_tissue_491_engine', fns: ['sle_diagnosis','ssc_diagnosis','sjs_diagnosis','myositis_diagnosis','overlap_syndromes'] },
  { mount: '/api/vasculitis_v2', engine: 'tier93_vasculitis_492_engine', fns: ['gca','takayasu','anca_vasculitis','polyarteritis','secondary_vasculitis'] },
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
  {"patient_id":"R0","assessment_id":"ra_0","tender_joints":8,"swollen_joints":6,"das28_esr":4.5,"das28_crp":4.2,"sdai":22,"cdai":20,"disease_activity":"moderate","provider":"rh_001"},
  {"patient_id":"R1","plan_id":"rp_1","csdmard":"methotrexate","mtx_dose":15,"bdmard":"tnf_inhibitor","treat_to_target":1,"time_to_remission":12,"response":"low","provider":"rh_001"},
  {"patient_id":"R2","visit_id":"rv_2","crp":5,"esr":28,"cbc_wbc":6500,"cbc_plt":285,"alt":18,"creatinine":0.9,"tb_screening":1,"hep_b_screening":1,"provider":"rh_001"},
  {"patient_id":"R3","imaging_id":"ri_3","modality":"ultrasound","erosion_score":2,"joint_space_narrowing":1,"synovitis_grade":2,"tenosynovitis":1,"bone_marrow_edema":0,"power_doppler_signal":2,"provider":"rh_001"},
  {"patient_id":"R4","procedure_id":"pr_4","procedure_type":"arthroplasty","joint":"knee","pre_op_das28":4.8,"post_op_oasri":35,"hospital_days":4,"complications":0,"provider":"rh_001"},
  {"patient_id":"R5","assessment_id":"sr_5","axs_as_score":3.5,"basdai_score":5.5,"basfi_score":4.2,"mri_sacroiliitis":true,"hla_b27_positive":true,"enthesitis_present":true,"uveitis_history":true,"provider":"rh_001"},
  {"patient_id":"R6","assessment_id":"sr_6","psoriasis_duration_years":15,"psoriasis_severity":"moderate","arthritis_pattern":"oligoarticular","dapsa_score":22,"caspar_score":4,"mri_sacroiliitis":false,"nail_lesions":true,"provider":"rh_001"},
  {"patient_id":"R7","assessment_id":"sr_7","ibd_type":"crohns","arthritis_pattern":"axial","peripheral_arthritis":true,"sac_iliitis":true,"disease_activity":"moderate","biologic_type":"anti_tnf","clinical_response":4,"provider":"rh_001"},
  {"patient_id":"R8","assessment_id":"sr_8","trigger_organism":"chlamydia","time_to_arthritis_weeks":3,"pattern":"additive","urogenital_infection":true,"reiter_features":2,"hla_b27":true,"provider":"rh_001"},
  {"patient_id":"R9","assessment_id":"sr_9","enthesitis_count":5,"mases_score":8,"dactylitis_count":2,"achilles_involvement":true,"plantar_fasciitis":true,"ultrasound_active":true,"provider":"rh_001"},
  {"patient_id":"R10","visit_id":"gv_10","attack_duration_days":3,"monosodium_urate_crystals":true,"joint":"first_mtp","inflammation_score":7,"pain_score":8,"nsaid_used":true,"colchicine_used":true,"provider":"rh_001"},
  {"patient_id":"R11","visit_id":"gv_11","tophi_count":3,"serum_urate":8.5,"attacks_per_year":4,"imaging_erosions":true,"ult_dosing":true,"allopurinol_dose":300,"provider":"rh_001"},
  {"patient_id":"R12","assessment_id":"ca_12","joint":"knee","cppd_crystals":true,"chondrocalcinosis":true,"secondary_causes":1,"acute_attack":true,"joint_fluid_cells":12000,"treatment":"nsaid","provider":"rh_001"},
  {"patient_id":"R13","assessment_id":"ca_13","joint":"shoulder","bcp_crystals":true,"hydroxapatite":true,"osteoarthritis_severity":3,"mri_edema":true,"treatment":"intraarticular_steroid","provider":"rh_001"},
  {"patient_id":"R14","fluid_id":"cf_14","wbc_count":15000,"crystals":"msu","crystal_appearance":"needle_shaped","polarization":"negatively_birefringent","fluid_culture":"negative","provider":"rh_001"},
  {"patient_id":"R15","assessment_id":"ct_15","ana_titer":640,"anti_dsdna":true,"anti_smith":true,"c3":65,"c4":12,"rash":"malar","serositis":false,"renal_involvement":1,"provider":"rh_001"},
  {"patient_id":"R16","assessment_id":"ct_16","modified_rodnan_score":18,"disease_duration_years":6,"interstitial_lung_disease":true,"pulmonary_hypertension":false,"scl_70_positive":true,"centromere_positive":false,"digital_ulcers":2,"provider":"rh_001"},
  {"patient_id":"R17","assessment_id":"ct_17","sicca_score":7,"scha_gr_test":3,"schirmer_test":4,"anti_ro":true,"anti_la":true,"parotid_enlargement":true,"lymphoma_screening":1,"provider":"rh_001"},
  {"patient_id":"R18","assessment_id":"ct_18","muscle_weakness":true,"ck_level":3500,"aldolase":35,"emg_myopathic":true,"mri_muscle_edema":true,"myositis_specific_antibody":"anti_jo_1","interstitial_lung":true,"provider":"rh_001"},
  {"patient_id":"R19","assessment_id":"ct_19","overlap_features":3,"multiple_antibodies":2,"mixed_diagnosis":"sle_ssc","disease_complexity":"high","specialist_referrals":3,"treatment_complexity":5,"provider":"rh_001"},
  {"patient_id":"R20","assessment_id":"va_20","gca_symptoms":["headache","jaw_claudication","visual_loss"],"esr":85,"crp":80,"temporal_artery_biopsy":"positive","prednisone_dose":60,"toci_use":true,"provider":"rh_001"},
  {"patient_id":"R21","assessment_id":"va_21","type_v":"takayasu","arterial_stenosis":true,"blood_pressure_difference":25,"angiography_pattern":"stenotic","imaging":"cta","activity_score":4,"treatment":"steroids","provider":"rh_001"},
  {"patient_id":"R22","assessment_id":"va_22","type_v":"anca_associated","anca_type":"pr3","bv_as_score":22,"renal_involvement":true,"pulmonay_involvement":true,"induction":"rituximab","maintenance":"azathioprine","provider":"rh_001"},
  {"patient_id":"R23","assessment_id":"va_23","type_v":"polyarteritis","aneurysm_count":4,"microaneurysms":true,"associated_hep_b":false,"skin_ulcers":true,"treatment":"steroids","provider":"rh_001"},
  {"patient_id":"R24","assessment_id":"va_24","associated_condition":"ra","secondary_vasculitis":true,"peripheral_neuropathy":true,"skin_lesions":true,"cryoglobulins":false,"treatment":"dmards","provider":"rh_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
