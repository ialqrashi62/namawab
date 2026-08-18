// filepath: gen_tier71.js
const fs = require('fs');

const routes = [
  [383, 'nut_assess', 'nutrition_screening,malnutrition_assessment,anthropometric_measurements,dietary_intake_assessment,food_allergy_assessment'],
  [384, 'nut_intervention', 'nutrition_counseling,medical_nutrition_therapy,supplement_recommendation,enteral_feeding,parenteral_nutrition'],
  [385, 'nut_clinical', 'diabetes_medical_nutrition,renal_diet_education,cardiac_diet_education,oncology_nutrition_support,weight_management'],
  [386, 'nut_pediatric', 'breast_feeding_support,infant_formula,intolerance_assessment_pediatric,pediatric_growth_assessment,pediatric_nutrition_counseling'],
  [387, 'nut_admin', 'tpn_compounding,formula_room,diet_office_orders,food_service_isolation,catering_therapeutic'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier71_nut_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier71_nut_${n}_${name}_engine');
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
  fs.writeFileSync('tier71_nut_' + n + '_' + name + '_router.js', code);
  total++;
});

const smokeCases = [
  ['n_ns','/api/nut_assess/nutrition_screening',{patient_id:'N1','screen_type':'mst','score':3,'risk_level':'high','re_screening_due':'2026-09-01','registered_dietitian_notified':true,'nutrition_order_entered':true,'screen_completed_by':'rn_admit_22','screening_date':'2026-08-15'}],
  ['n_ma','/api/nut_assess/malnutrition_assessment',{patient_id:'N2','assessment_type':'sga','overall_rating':'severely_malnourished','weight_change_kg':-8,'intake_change':'significantly_decreased','gastrointestinal_symptoms':true,'functional_capacity':'bedridden','physician_reviewed':true,'rd_name':'rd_001','reassessment_due':7}],
  ['n_am','/api/nut_assess/anthropometric_measurements',{patient_id:'N3','height_cm':165,'weight_kg':62,'bmi':22.8,'mid_arm_circumference_cm':28,'triceps_skinfold_mm':15,'grip_strength_kg':25,'weight_history_6mo':'-3_kg','measurements_taken_by':'rd_002','measurement_date':'2026-08-15'}],
  ['n_dia','/api/nut_assess/dietary_intake_assessment',{patient_id:'N4','assessment_method':'24hr_recall','total_kcal':1800,'protein_g':70,'carb_pct':55,'fat_pct':30,'fiber_g':22,'sodium_mg':2400,'fluid_ml':1500,'diet_quality':'adequate','counseling_needed':false}],
  ['n_faa','/api/nut_assess/food_allergy_assessment',{patient_id:'N5','allergy_test':'ige_panel','allergens_positive':'peanut_shellfish','allergens_negative':'milk_egg','severity':'moderate','reaction_type':'anaphylaxis','epi_prescribed':true,'diet_modification':'strict_avoidance','follow_up_days':90}],
  ['n_nc','/api/nut_intervention/nutrition_counseling',{patient_id:'N6','session_type':'individual','topics_covered':'carbohydrate_counting','duration_min':45,'patient_engagement':'high','understanding_verified':true,'goal_setting':'consistent_meal_times','follow_up_due':14,'rd_name':'rd_003','documentation_complete':true}],
  ['n_mnt','/api/nut_intervention/medical_nutrition_therapy',{patient_id:'N7','dx':'diabetes_type2','kcal_target':1900,'protein_target_g':90,'carb_target_g':210,'fat_target_g':70,'meal_plan':'3meals_2snacks','monitoring':'glucose_log','rd_name':'rd_004','reassessment':30}],
  ['n_sr','/api/nut_intervention/supplement_recommendation',{patient_id:'N8','supplement_type':'oral_nutrition_supplement','product_name':'ensure_plus','dose_ml':250,'frequency':'twice_daily','duration_days':30,'indication':'malnutrition','monitoring_parameters':'weight_intake','rd_name':'rd_005'}],
  ['n_ef','/api/nut_intervention/enteral_feeding',{patient_id:'N9','feeding_type':'nasoenteric','formula':'peptamen_1_5','rate_ml_hr':60,'total_volume_ml':1440,'residual_check_q4h':true,'residual_threshold_ml':250,'flushes_ml':30,'flush_frequency':'q4h','tube_placement_verified':true}],
  ['n_pn','/api/nut_intervention/parenteral_nutrition',{patient_id:'N10','pn_type':'tpn_central','volume_ml':2400,'amino_acids_pct':4,'dextrose_pct':25,'lipid_pct':20,'additives':'multivitamins_trace','caloric_target_kcal':2400,'catheter_care_performed':true,'rd_name':'rd_006','lab_due':7}],
  ['n_dmn','/api/nut_clinical/diabetes_medical_nutrition',{patient_id:'N11','a1c_pct':7.5,'carb_counting_taught':true,'glycemic_target_range':'80_180','meal_pattern':'3_meals_2_snacks','registered_dietitian':'rd_007','monitoring_plan':'continuous_glucose_monitor','follow_up_months':3}],
  ['n_rde','/api/nut_clinical/renal_diet_education',{patient_id:'N12','ckd_stage':3,'protein_g_per_kg':0.8,'sodium_mg':2000,'potassium_mg':2500,'phosphorus_mg':1000,'fluid_restricted':true,'fluid_limit_ml':1500,'renally_appropriate_foods':'apple_rice_bread','education_completed':true}],
  ['n_cde','/api/nut_clinical/cardiac_diet_education',{patient_id:'N13','cardiac_dx':'chf','sodium_mg':2000,'fluid_ml':1500,'saturated_fat_pct':6,'cholesterol_mg':200,'fiber_g':30,'dash_compliance':true,'patient_understanding_verified':true,'rd_name':'rd_008','follow_up_due':14}],
  ['n_ons','/api/nut_clinical/oncology_nutrition_support',{patient_id:'N14','cancer_treatment':'chemo','symptoms_affecting_intake':'nausea_mucositis','nutrition_support':'tube_feeding','nsaid_antiemetic':true,'high_calorie_density':true,'rd_name':'rd_009','quality_of_life_score':60,'next_session':7}],
  ['n_wm','/api/nut_clinical/weight_management',{patient_id:'N15','bmi':35,'current_weight_kg':102,'goal_weight_kg':85,'weight_change_per_week':-0.5,'program_type':'medifast_shakes','physical_activity_min':150,'behavioral_counseling':true,'monitoring_log':'daily_food','rd_name':'rd_010'}],
  ['n_bfs','/api/nut_pediatric/breast_feeding_support',{patient_id:'N16','infant_age_days':7,'feeding_frequency_per_day':8,'latch_score':7,'infant_weight_change_gr':-50,'mother_support_needed':true,'lactation_consultant':'lc_001','plan':'continue_supplement','follow_up_days':2}],
  ['n_if','/api/nut_pediatric/infant_formula',{patient_id:'N17','formula_type':'extensively_hydrolyzed','brand':'alimentum','concentration_kcal_oz':20,'volume_per_feed_oz':3,'feeds_per_day':8,'specialty_formula_indication':'cow_milk_protein_allergy','preparation_education_completed':true,'dietician_review':'rd_011'}],
  ['n_iap','/api/nut_pediatric/intolerance_assessment_pediatric',{patient_id:'N18','symptoms':'vomiting_diarrhea','severity':'moderate','formula_change':'started_neocate','response':'improving','milk_protein_intolerance':true,'lactose_intolerance':false,'other_intolerances':'soy','resolved_days':14}],
  ['n_pga','/api/nut_pediatric/pediatric_growth_assessment',{patient_id:'N19','age_months':24,'weight_percentile':25,'height_percentile':50,'bmi_percentile':15,'head_circumference_cm':48,'weight_for_height':'normal','stunting':false,'wasting':false,'intervention_initiated':false}],
  ['n_pnc','/api/nut_pediatric/pediatric_nutrition_counseling',{patient_id:'N20','parent_education':'healthy_plate','food_aversions':'vegetables','meal_plan':'family_meals','follow_up_date':'2026-09-01','nutritionist':'rd_012','compliance_pct':70,'supplements_recommended':'multivitamin_vit_d','growth_chart':true}],
  ['n_tpn','/api/nut_admin/tpn_compounding',{patient_id:'N21','compounding_id':'tpn_001','patient_weight_kg':70,'volume_ml':2300,'base_solution':'standard_chw','amino_acids_g':85,'dextrose_g':300,'lipid_ml':75,'additives':'multivitamins','compounder':'pharm_001','sterility_check':'pass','ph_check':5.5}],
  ['n_fr','/api/nut_admin/formula_room',{patient_id:'N22','formula_id':'form_001','formula_type':'pediatric','volume_ml':500,'concentration_kcal_oz':24,'preparation_date':'2026-08-15','expiration_date':'2026-08-17','prepared_by':'formula_tech_1','qc_doc_complete':true,'dispensing_unit':'nicu_3'}],
  ['n_doo','/api/nut_admin/diet_office_orders',{patient_id:'N23','order_id':'diet_001','diet_type':'cardiac','texture':'regular','fluid_consistency':'thin','special_instructions':'low_sodium','notes':'no_added_salt','entered_by':'rd_013','effective_date':'2026-08-15','review_due':7}],
  ['n_fsi','/api/nut_admin/food_service_isolation',{patient_id:'N24','isolation_type':'neutropenic','food_safety_check':'passed','no_raw_fruits':true,'well_cooked_meats':true,'pasteurized_juice':true,'restricted_foods':'raw_vegetables','staff_educated':true,'monitoring_log_clean':true,'rd_name':'rd_014'}],
  ['n_ct','/api/nut_admin/catering_therapeutic',{patient_id:'N25','meal_id':'meal_001','diet':'diabetic','calories':600,'carbohydrate_g':45,'protein_g':25,'fat_g':20,'sodium_mg':600,'served_at':'2026-08-15','patient_acceptable':true,'kitchen_safety_check':'pass','recommendation':'continue_diet'}],
];

let sh = '#!/bin/bash\nH=http://127.0.0.1:3000\nP=0;F=0\n';
smokeCases.forEach(([nm, ep, body], i) => {
  fs.writeFileSync(`C:/tmp/nut_body_${i}.json`, JSON.stringify(body));
  sh += `C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_${i}.json "$H${ep}")\nif [ "$C" = "200" ]; then echo "OK ${nm}"; P=$((P+1)); else echo "FAIL ${nm} ($C)"; fi\n`;
});
sh += 'echo PASS=$P FAIL=$F\n';
fs.writeFileSync('sm_nut_tier71.sh', sh);
console.log('Created', total, 'routers');
console.log('Smoke cases:', smokeCases.length);
