// filepath: gen_tier88.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'id_general', eng: 463, base: 0,
    eps: ['id_clinic','fever_workup','sepsis','tb','hiv_visit'] },
  { name: 'id_syndromes', eng: 464, base: 5,
    eps: ['endocarditis','meningitis','osteomyelitis','skin_infection','uti_id'] },
  { name: 'gi_luminal', eng: 465, base: 10,
    eps: ['endoscopy','colonoscopy','ercp','ercp_therapeutic','capsule_endoscopy'] },
  { name: 'gi_liver', eng: 466, base: 15,
    eps: ['hepatitis_clinic_gi','cirrhosis','liver_mass','liver_transplant','portal_htn'] },
  { name: 'id_specialty', eng: 467, base: 20,
    eps: ['hiv_specialist','hepatitis_clinic','travel_medicine','fever_unknown_origin','antimicrobial_stewardship'] }
];

const bodies = [
  // 0 id_clinic
  {patient_id:'ID0',visit_id:'iv_00',chief_complaint:'fever',location:'general',duration_days:5,max_temp_c:39,associated_symptoms:'chills',imaging_done:false,cultures_done:true,empiric_antibiotics:true,follow_up_weeks:2,provider:'id_001',next_review:7},
  // 1 fever_workup
  {patient_id:'ID1',visit_id:'iv_01',workup_id:'fw_01',fever_days:7,max_temp_c:38.5,measured:true,symptoms:'headache',travel_history:false,exposure_history:true,cultures_done:true,imaging_done:true,biomarkers:'crp_elevated',dx:'infection',provider:'id_001',next_review:14},
  // 2 sepsis
  {patient_id:'ID2',assessment_id:'ia_02',qsofa_score:2,sirs_score:3,lactate:2.5,source:'pneumonia',organ_dysfunction:true,antibiotics_within_hour:true,culture_drawn:true,fluid_resuscitation_ml:2000,vasopressor_started:true,follow_up_weeks:1,provider:'id_001',next_review:3},
  // 3 tb
  {patient_id:'ID3',assessment_id:'ia_03',disease_type:'pulmonary',sputum_smear_positive:true,naat_done:true,rif_resistance:false,chest_xray_findings:'cavitary',treatment_phase:'intensive',tb_drug_type:'hrze',contact_tracing_done:true,follow_up_months:6,provider:'id_001',next_review:30},
  // 4 hiv_visit
  {patient_id:'ID4',visit_id:'iv_04',cd4_count:450,viral_load:50,art_regimen:'biktarvy',adherence_pct:95,opportunistic_infection:false,coinfection_hbv:'negative',coinfection_hcv:'negative',vaccinations_updated:true,pap_smear_done:true,follow_up_months:3,provider:'id_001',next_review:90},
  // 5 endocarditis
  {patient_id:'ID5',assessment_id:'ia_05',duke_criteria_met:2,echo_findings:'vegetation',organism:'staph_aureus',antibiotic_type:'narrow_spectrum',duration_weeks:6,valve_surgery_consult:true,complications:'none',follow_up_weeks:4,provider:'id_001',next_review:30},
  // 6 meningitis
  {patient_id:'ID6',visit_id:'iv_06',gcs_score:12,cerebrospinal_fluid:'cloudy',csf_cell_count:1000,csf_glucose:30,csf_protein:250,blood_culture_positive:true,organism:'strep_pneumoniae',antibiotic_type:'broad_spectrum',steroids_given:true,follow_up_weeks:2,provider:'id_001',next_review:14},
  // 7 osteomyelitis
  {patient_id:'ID7',visit_id:'iv_07',bone_involved:'tibia',organism:'staph_aureus',source:'diabetic_foot',imaging_done:'mri',debridement_done:true,antibiotic_type:'narrow_spectrum',duration_weeks:6,follow_up_weeks:4,provider:'id_001',next_review:30},
  // 8 skin_infection
  {patient_id:'ID8',visit_id:'iv_08',infection_type:'cellulitis',severity:'mild',location:'right_leg',organism:'strep_pyogenes',antibiotic_type:'narrow_spectrum',oral_switched:true,follow_up_days:5,provider:'id_001',next_review:7},
  // 9 uti_id
  {patient_id:'ID9',visit_id:'iv_09',uti_type:'complicated',organism:'e_coli',urine_culture_count:100000,blood_culture_positive:false,antibiotic_type:'narrow_spectrum',source_control:true,imaging_done:true,follow_up_weeks:1,provider:'id_001',next_review:7},
  // 10 endoscopy
  {patient_id:'G10',visit_id:'gv_10',procedure_type:'egd',indication:'dyspepsia',findings:'gerd',biopsies_taken:true,complications:'none',sedation:'moderate',follow_up_weeks:4,provider:'gi_001',next_review:30},
  // 11 colonoscopy
  {patient_id:'G11',visit_id:'gv_11',bowel_prep_quality:'good',cecum_reached:true,polyps_found:1,polyp_size_mm:5,polypectomy_done:true,complications:'none',biopsies_taken:true,findings:'adenoma',follow_up_weeks:4,provider:'gi_001',next_review:30},
  // 12 ercp
  {patient_id:'G12',procedure_id:'gp_12',indication:'choledocholithiasis',stones_extracted:true,stent_placed:false,sphincterotomy_done:true,complications:'none',sedation:'deep',duration_min:45,follow_up_weeks:2,provider:'gi_001',next_review:14},
  // 13 ercp_therapeutic
  {patient_id:'G13',procedure_id:'gp_13',indication:'stricture',stent_placed:true,stent_type:'plastic',sphincterotomy_done:true,biopsies_taken:true,complications:'none',duration_min:60,follow_up_weeks:4,provider:'gi_001',next_review:30},
  // 14 capsule_endoscopy
  {patient_id:'G14',visit_id:'gv_14',indication:'gi_bleeding_unknown',study_duration_hours:8,findings:'angiodysplasia',capsule_reached_cecum:true,battery_depleted_normal:true,retention:false,follow_up_weeks:2,provider:'gi_001',next_review:14},
  // 15 hepatitis_clinic_gi
  {patient_id:'G15',visit_id:'gv_15',virus_type:'hbsag',al_t:80,ast:60,hbv_dna:5000,hcv_rna:0,bilirubin:1.0,albumin:4.0,inr:1.0,fibroscan:7,treatment_status:'on_treatment',provider:'gi_001',next_review:30},
  // 16 cirrhosis
  {patient_id:'G16',visit_id:'gv_16',meld_score:18,child_pugh_score:7,ascites_present:true,encephalopathy_grade:1,variceal_bleed_history:false,alcohol_cessation:1,lactulose_started:true,follow_up_weeks:4,provider:'gi_001',next_review:30},
  // 17 liver_mass
  {patient_id:'G17',visit_id:'gv_17',lesion_count:1,size_cm:2.5,mri_li_rads:3,afp_level:8,biopsy_done:false,surveillance_period:6,risk_score:'low',recommendation:'imaging_followup',provider:'gi_001',next_review:24},
  // 18 liver_transplant
  {patient_id:'G18',visit_id:'gv_18',days_post_txp:365,immunosuppression:'tac_mmf',graft_function:'normal',rejection_episodes:0,infection_history:1,biliary_complications:'none',liver_function:'normal',oncology_screened:true,follow_up_weeks:4,provider:'gi_001',next_review:30},
  // 19 portal_htn
  {patient_id:'G19',visit_id:'gv_19',hepatic_pressure_gradient_mmHg:12,varices_present:true,variceal_grade:2,bleeding_history:false,nonselective_beta_blocker:true,bands_done:0,follow_up_weeks:12,provider:'gi_001',next_review:90},
  // 20 hiv_specialist
  {patient_id:'ID20',visit_id:'iv_20',cd4_count:500,viral_load:50,art_regimen:'tld',adherence_pct:95,opportunistic_infection:false,coinfection_hbv:'negative',coinfection_hcv:'negative',prophylaxis_infections:0,ten_year_cd4_response:200,provider:'id_001',next_review:90},
  // 21 hepatitis_clinic
  {patient_id:'ID21',assessment_id:'ia_21',virus_type:'hcv',al_t:40,ast:35,hbv_dna:0,hcv_rna:200000,bilirubin:0.8,albumin:4.2,inr:1.0,fibroscan:8,treatment_status:'on_treatment',provider:'id_001',next_review:30},
  // 22 travel_medicine
  {patient_id:'ID22',visit_id:'iv_22',destination:'east_africa',duration_days:14,travel_purpose:'leisure',vaccinations_updated:'typhoid_hav',malaria_prophylaxis:'doxycycline',travelers_diarrhea_rx:1,pre_existing_conditions:false,altitude_preparation:false,medication_supply:'adequate',provider:'id_001',next_review:30},
  // 23 fever_unknown_origin
  {patient_id:'ID23',assessment_id:'ia_23',fever_days:21,max_temp_c:39.5,measured:true,symptoms:'chills_weight_loss',travel_history:true,exposure_history:false,wbc_count:12000,crp:80,cultures_done:true,imaging_done:true,dx:'infection',provider:'id_001',next_review:14},
  // 24 antimicrobial_stewardship
  {patient_id:'ID24',assessment_id:'ia_24',antibiotic_type:'broad_spectrum',duration_days:5,culture_directed:false,deescalation:false,iv_to_oral:false,renal_dose_adjusted:true,allergy_checked:true,clinical_response:'improving',crp_change:-50,procalcitonin:0.5,provider:'id_001',next_review:7}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier88_${m.name}_${m.eng}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier88_${m.name}_${m.eng}_engine');
const eps = ['${m.eps.join("','")}'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, `tier88_${m.name}_${m.eng}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
