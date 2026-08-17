// filepath: gen_tier14.js
const fs = require('fs');

const routes = [
  [101, 'order', 'pharm_prescribe,pharm_dispense,pharm_administer,pharm_refill,pharm_discontinue'],
  [102, 'compounding', 'compound_recipe_validate,compound_iso_environment,compound_hazardous,compound_batching,compound_release'],
  [103, 'interaction', 'drug_interaction_check,drug_allergy_check,dose_range_check,renal_dose_adjust,pgx_alert'],
  [104, 'formulary', 'formulary_lookup,formulary_interchange,prior_auth_check,formulary_therapeutic_class,formulary_drug_shortage'],
  [105, 'inventory', 'stock_receive,par_level_check,expiration_check,recall_check,narcotic_inventory'],
  [106, 'stewardship', 'abx_review,abx_iv_to_oral,opioid_stewardship,stewardship_metric,stewardship_dashboard'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier14_pharm_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier14_pharm_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier14_pharm_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['rx_prescribe','/api/pharm_order/pharm_prescribe',{patient_id:'P1',medication_id:'amoxicillin_500mg',dose_mg:500,route:'PO',frequency:'TID',duration_days:7,priority:'Routine',allergy_checked:true,drug_interaction_checked:true}],
  ['rx_dispense','/api/pharm_order/pharm_dispense',{order_id:'O1',pharmacy_id:'PH1',dispense_type:'Initial',quantity_dispensed:21,unit:'Capsule',days_supply:7,patient_counseled:true,controlled_substance_logged:true}],
  ['rx_admin','/api/pharm_order/pharm_administer',{order_id:'O1',patient_id:'P1',medication_id:'amoxicillin_500mg',route_given:'PO',dose_given:500,given_by:'N1',verification:'Barcode_BCMA',patient_refused:false,reaction_observed:false}],
  ['rx_refill','/api/pharm_order/pharm_refill',{order_id:'O1',refills_requested:1,refills_remaining:2,request_source:'Patient',last_fill_within_30d:true,lab_review_required:false,lab_review_current:true}],
  ['rx_disc','/api/pharm_order/pharm_discontinue',{order_id:'O1',discontinue_reason:'Completed',discontinued_by:'D1',taper_required:false,alternative_ordered:false}],

  ['cpt_recipe','/api/pharm_compounding/compound_recipe_validate',{recipe_id:'R1',compounding_type:'sterile_low_risk',ingredients_count:3,final_volume_ml:100,concentration_mg_ml:5,stability_documented:true,master_formula_documented:true,beyond_use_date_days:14}],
  ['cpt_iso','/api/pharm_compounding/compound_iso_environment',{compounding_id:'C1',iso_class:'iso_class_5',pressure_differential_pa:15,air_changes_per_hour:'30_to_60',particle_count_per_m3:2000,temp_celsius:21,humidity_pct:45,viable_particle_test_passed:true}],
  ['cpt_haz','/api/pharm_compounding/compound_hazardous',{compounding_id:'C1',hazardous_class:'antineoplastic',cppe_required:true,cabinet_certified:true,spill_kit_available:true,eye_wash_within_10s:true,disposal:'yellow_hazardous',negative_pressure_pa:-15}],
  ['cpt_batch','/api/pharm_compounding/compound_batching',{batch_id:'B1',batch_size_units:50,master_formula_ref:'MF1',pre_approval_attached:true,compounder_certified:true,compounder_years_experience:5,qa_sample_retained:true,environmental_monitoring_pass:true}],
  ['cpt_rel','/api/pharm_compounding/compound_release',{compounding_id:'C1',test_results:'passing',endotoxin_level_eu_ml:0.05,sterility_test_days:14,visual_inspection_pass:true,labeling_complete:true,verified_drug_name_correct:true}],

  ['rx_inter','/api/pharm_interaction/drug_interaction_check',{patient_id:'P1',medication_id_new:'warfarin',medication_count_current:3,interactions_found_count:1,max_maxseverity:'moderate',major_interactions_count:0,alert_overridden_by_provider:true,recent_lab_review:true}],
  ['rx_allergy','/api/pharm_interaction/drug_allergy_check',{patient_id:'P1',medication_id:'penicillin',allergy_match_level:'no_match',reaction_history_severity:'none_documented',allergy_count_total:1,cross_sensitivity_checked:true}],
  ['rx_dose','/api/pharm_interaction/dose_range_check',{patient_id:'P1',medication_id:'acetaminophen',dose_proposed:500,dose_min_per_kg:10,dose_max_per_kg:15,patient_weight_kg:70,patient_age_years:35,route:'PO'}],
  ['rx_renal','/api/pharm_interaction/renal_dose_adjust',{patient_id:'P1',creatinine_mg_dl:2.5,age_years:70,weight_kg:70,sex:'male',crcl_ml_min:35,proposed_dose_mg:500,crcl_band:'mild_30_to_60'}],
  ['rx_pgx','/api/pharm_interaction/pgx_alert',{patient_id:'P1',gene:'CYP2C19',phenotype:'poor_metabolizer',medication_id:'clopidogrel',action_type:'avoid'}],

  ['fm_lookup','/api/pharm_formulary/formulary_lookup',{medication_id:'lisinopril_10mg',formulary_status:'formulary_open',tier:'tier_1_generic',requires_prior_auth:false,has_quantity_limit:false,quantity_limit_per_30d:30}],
  ['fm_inter','/api/pharm_formulary/formulary_interchange',{prescribed_medication_id:'name_brand_x',interchange_rule:'automatic_therapeutic_substitution',alternative_medication_id:'generic_x',same_class:true,same_dose:true,bioequivalent:true,cost_savings_pct:60}],
  ['fm_pa','/api/pharm_formulary/prior_auth_check',{order_id:'O1',medication_id:'biologic_x',pa_status:'pending_review',days_to_decision:5,documented_medical_necessity:true,diagnosis_match:'pa_match'}],
  ['fm_class','/api/pharm_formulary/formulary_therapeutic_class',{medication_id:'lisinopril_10mg',therapeutic_class:'antihypertensive_ace',within_class_count:5,first_line_band:'first_line',guideline_concordant:true}],
  ['fm_short','/api/pharm_formulary/formulary_drug_shortage',{medication_id:'gentamicin',shortage_status:'shortage_active',days_supply_remaining:14,backorder_days:60,alternative_medication_id:'tobramycin'}],

  ['inv_recv','/api/pharm_inventory/stock_receive',{lot_id:'L1',medication_id:'amoxicillin_500mg',quantity_received:1000,manufacturer:'SBX',expiration_date:'2027-08-01',ndc:'00093-4155-73',days_to_expiration:700,refrigerated_storage:false,chain_of_custody_verified:true}],
  ['inv_par','/api/pharm_inventory/par_level_check',{medication_id:'acetaminophen_500mg',current_stock:200,min_par:100,max_par:500,burn_rate_per_day:50,lead_time_days:3,class_name:'essential'}],
  ['inv_exp','/api/pharm_inventory/expiration_check',{lot_id:'L1',days_to_expiration:60,quantity_remaining:50,storage_condition:'room_temp',already_recalled:false,already_extended:false}],
  ['inv_rec','/api/pharm_inventory/recall_check',{medication_id:'drug_x',lot_id:'L1',recall_class:'class_ii_temp_problem',lots_affected_count:5,units_in_stock_affected:100,units_administered_30d:50,days_since_recall:7}],
  ['inv_narc','/api/pharm_inventory/narcotic_inventory',{medication_id:'morphine_10mg',schedule_class:2,units_counted:100,units_expected:100,two_person_count:true,days_since_last_count:7,storage:'safe_dual_lock'}],

  ['st_review','/api/pharm_stewardship/abx_review',{order_id:'O1',antibiotic_class:'cephalosporin',days_on_antibiotic:5,culture_obtained:true,culture_results_available:true,indication_class:'uti',iv_to_oral_eligible:true,de_escalation_opportunity:true}],
  ['st_iv','/api/pharm_stewardship/abx_iv_to_oral',{patient_id:'P1',current_antibiotic_id:'iv_levofloxacin',oral_alternative_id:'po_levofloxacin',afebrile_24h:true,tolerating_oral_intake:true,normal_gastrointestinal:true,culture_specific:true}],
  ['st_op','/api/pharm_stewardship/opioid_stewardship',{patient_id:'P1',opioid_class:'oxycodone_mg_per_day',mme_per_day:120,days_on_opioid:45,pain_agreement_signed:true,urine_drug_screen_current:true,pdmp_reviewed:true,naloxone_co_prescribed:false}],
  ['st_metric','/api/pharm_stewardship/stewardship_metric',{period:'2026-Q3',ddot_ant:0.85,days_therapy_per_1000:300,iv_to_oral_conversions:50,iv_to_oral_eligible_count:80,antibiotic_cost_per_100d:250}],
  ['st_dash','/api/pharm_stewardship/stewardship_dashboard',{period:'2026-Q3',prescriptions_total:500,reviews_completed:350,interventions_total:80,interventions_accepted:65,antibiotic_days_saved:200,dollars_saved:15000}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = '/tmp/pharm_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @' + fn + ' "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_pharm_tier14.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);