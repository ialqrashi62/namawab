// filepath: gen_tier113.js
const fs = require('fs');
const mounts = [
  { mount: '/api/ob_extended_v2', engine: 'tier113_ob_extended_595_engine', fns: ['lactation_consult','breastfeeding_assessment','nipple_pain','mastitis','low_milk_supply'] },
  { mount: '/api/maternal_med_v2', engine: 'tier113_maternal_medicine_596_engine', fns: ['preeclampsia_management','gestational_diabetes','thyroid_pregnancy','cardiac_pregnancy','antepartum_assessment'] },
  { mount: '/api/reproductive_endocrine_v2', engine: 'tier113_reproductive_endocrine_597_engine', fns: ['pcos','amenorrhea','hirsutism','menopause_eval','androgen_excess'] },
  { mount: '/api/fertility_v2', engine: 'tier113_fertility_598_engine', fns: ['fertility_workup','ovulation_tracking','iui_cycle','embryo_transfer','fertility_outcome'] },
  { mount: '/api/gyne_onc_extended_v2', engine: 'tier113_gyne_oncology_extended_599_engine', fns: ['tumor_marker','genetic_counseling','chemotherapy_cyc','radiation_planning','palliative_care_onc'] },
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
  {"patient_id":"W0","consult_id":"lc_0","days_postpartum":7,"feeding_method":"breast","feeding_frequency_hr":2,"latching_score":7,"pain_level":3,"provider":"lact_001"},
  {"patient_id":"W1","assessment_id":"bf_1","days_postpartum":5,"feeding_method":"breast","milk_intake":"adequate","weight_loss_pct":5,"feeding_count_24hr":10,"wet_diapers":6,"provider":"lact_001"},
  {"patient_id":"W2","consult_id":"np_2","days_postpartum":3,"pain_score":6,"latching_correct":false,"position":"cradle","nipple_condition":"cracked","intervention":"latch_correction","provider":"lact_001"},
  {"patient_id":"W3","diagnosis_id":"ma_3","days_postpartum":14,"redness":true,"swelling":true,"fever":101.5,"antibiotic":"cephalexin","provider":"lact_001"},
  {"patient_id":"W4","consult_id":"lm_4","days_postpartum":7,"feeding_method":"breast","milk_supply":"low","supplementation":"formula","interventions":"pumping","provider":"lact_001"},
  {"patient_id":"W5","assessment_id":"pe_5","gestational_age":32,"bp_systolic":155,"bp_diastolic":105,"proteinuria":"2_plus","severity":"severe","magnesium":true,"provider":"mm_001"},
  {"patient_id":"W6","management_id":"gd_6","gestational_age":28,"ogtt":"abnormal","glucose_load_50g":160,"diet":"diabetic","insulin":true,"fetal_growth":"appropriate","provider":"mm_001"},
  {"patient_id":"W7","assessment_id":"tp_7","gestational_age":18,"tsh":0.05,"free_t4":2.0,"diagnosis":"hyperthyroid","treatment":"propylthiouracil","fetal_impact":"monitored","provider":"mm_001"},
  {"patient_id":"W8","assessment_id":"cp_8","gestational_age":20,"heart_disease":"ms","functional_class":"II","anticoagulation":true,"monitoring":"echo","delivery_plan":"vaginal","provider":"mm_001"},
  {"patient_id":"W9","assessment_id":"ap_9","gestational_age":36,"presentation":"vertex","fetal_heart_tone":"reassuring","movements":"good","edema":"1_plus","provider":"mm_001"},
  {"patient_id":"W10","assessment_id":"pc_10","age":28,"menstrual_irregular":true,"hirsutism_score":12,"obesity":true,"ovary_volume_ml":12,"diagnosis":"pcos","provider":"re_001"},
  {"patient_id":"W11","assessment_id":"am_11","age":24,"last_period":"2025-12-01","amenorrhea_months":4,"workup":"initiated","diagnosis":"workup_pending","provider":"re_001"},
  {"patient_id":"W12","assessment_id":"hi_12","age":35,"hirsutism_score":15,"androgens":"elevated","ferritin":"normal","thyroid":"normal","treatment":"spironolactone","provider":"re_001"},
  {"patient_id":"W13","assessment_id":"me_13","age":52,"fsh":85,"estradiol":25,"symptoms":"hot_flashes","bone_density":"osteopenia","treatment":"hrt_consider","provider":"re_001"},
  {"patient_id":"W14","assessment_id":"ae_14","age":28,"testosterone":"elevated","dheas":"elevated","ultrasound":"pcos_pattern","diagnosis":"androgen_excess","provider":"re_001"},
  {"patient_id":"W15","workup_id":"fw_15","age":34,"cycle_length_days":30,"semen_analysis":"normal","tubal_patency":"patent","ovulation":"confirmed","diagnosis":"unexplained","provider":"ft_001"},
  {"patient_id":"W16","tracking_id":"ot_16","cycle":"natural","ovulation_day":14,"lh_surge":true,"timing":"optimal","intercourse_recommended":true,"provider":"ft_001"},
  {"patient_id":"W17","cycle_id":"iu_17","cycle":"iui","sperm_count_million":15,"motility_pct":50,"wash_method":"density_gradient","outcome":"completed","provider":"ft_001"},
  {"patient_id":"W18","transfer_id":"et_18","cycle":"fet","embryos_transferred":1,"stage":"blastocyst","quality":"good","outcome":"completed","provider":"ft_001"},
  {"patient_id":"W19","outcome_id":"fo_19","cycle":"ivf","outcome":"pregnant","beta_hcg":250,"ultrasound":"scheduled","follow_up_weeks":4,"provider":"ft_001"},
  {"patient_id":"W20","marker_id":"tm_20","cancer_type":"ovarian","ca_125":45,"he4":"normal","risk_index":"moderate","follow_up":"3_months","provider":"go_001"},
  {"patient_id":"W21","counseling_id":"gc_21","indication":"family_history","genes_tested":"brca1_brca2","result":"negative","provider":"go_001"},
  {"patient_id":"W22","cycle_id":"ch_22","cycle":1,"regimen":"taxol_carb","dose_mg":150,"premedication":"given","toxicity":"grade_2","next_cycle":"scheduled","provider":"go_001"},
  {"patient_id":"W23","planning_id":"rp_23","modality":"imrt","site":"pelvis","dose_cgy":5040,"fractions":28,"tolerance":"good","provider":"go_001"},
  {"patient_id":"W24","palliative_id":"po_24","cancer_type":"ovarian","stage":"IV","karnofsky":60,"symptoms":"pain_fatigue","goals":"comfort","hospice_referred":true,"provider":"go_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');