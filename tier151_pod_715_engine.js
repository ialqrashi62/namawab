// filepath: tier151_pod_715_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.foot_condition, 'fc', ['diabetic_neuropathy','peripheral_artery_disease','Charcot','plantar_fasciitis','achilles_tendinopathy','metatarsalgia','hallux_valgus','hallux_rigidus','flatfoot','cavus_foot','hammertoe','morton_neuroma','ingrown_nail','fungal_nail','athletes_foot','plantar_wart','gout','stress_fracture','other','NA']);
  ensureNum(req.abi_left, 'al');
  ensureNum(req.abi_right, 'ar');
  ensureEnum(req.sensation, 'se', ['normal','reduced_left','reduced_right','reduced_both','absent','NA','unknown']);
  ensureNum(req.monofilament_score, 'mf');
  ensureNum(req.vibration_score, 'vs');
  ensureEnum(req.skin, 'sk', ['normal','dry','callus','ulcer','fissure','fungal','other','NA']);
  ensureEnum(req.deformity, 'df', ['none','hallux_valgus','hammer','claw','Charcot','cavus','flat','bunion','other','NA']);
  ensureEnum(req.risk_category, 'rc', ['low','moderate','high','active_ulcer','amputation_history','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { ax_id: `pod_${Date.now()}`, patient_id: req.patient_id, condition: req.foot_condition };
}
function nail_care(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['trim','debridement_thick','avulsion_partial','avulsion_total','matrixectomy_phenol','matrixectomy_surgical','ingrown_nail_excision','fungal_treatment','PNA_bracing','biopsy','other','NA']);
  ensureStr(req.toe, 'to');
  ensureNum(req.num_toes, 'nt');
  ensureBool(req.bilateral, 'bi');
  ensureEnum(req.anesthesia, 'an', ['none','digital_block','topical','local_infiltration','other','NA']);
  ensureBool(req.antibiotic, 'ab');
  ensureNum(req.healing_weeks, 'hw');
  ensureNum(req.recurrence_pct, 'rc');
  ensureStr(req.provider, 'pr');
  return { nc_id: `ncr_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function orthotic(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['custom_molded','prefabricated','UCBL','AFO','Richie_brace','diabetic_insert','accommodative','functional','heel_cup','arch_support','other','NA']);
  ensureNum(req.shoe_size_us, 'ss');
  ensureNum(req.left_size, 'ls');
  ensureNum(req.right_size, 'rs');
  ensureEnum(req.material, 'mt', ['EVA','polypropylene','carbon_fiber','plastazote','poron','silicone','leather','other','NA']);
  ensureNum(req.cost_usd, 'ct');
  ensureEnum(req.replacement_months, 'rm', ['3','6','9','12','18','24','as_needed','NA']);
  ensureBool(req.billed_to_insurance, 'bi');
  ensureStr(req.provider, 'pr');
  return { or_id: `ort_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function diabetic_foot(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.ulcer_grade, 'ug', ['0_no_ulcer','1_superficial','2_deeper','3_abscess_osteomyelitis','4_gangrene_forefoot','5_gangrene_whole_foot','NA','unknown']);
  ensureEnum(req.wagner_classification, 'wc', ['0','1','2','3','4','5','NA']);
  ensureNum(req.healing_weeks, 'hw');
  ensureBool(req.osteomyelitis, 'os');
  ensureBool(req.revascularization_needed, 'rn');
  ensureNum(req.amputation_level, 'al');
  ensureBool(req.amputation_done, 'ad');
  ensureEnum(req.outcome, 'ot', ['healed','healing','chronic','amputation_minor','amputation_major','death','NA','unknown']);
  ensureBool(req.off_loading, 'of');
  ensureStr(req.provider, 'pr');
  return { df_id: `dft_${Date.now()}`, patient_id: req.patient_id, grade: req.ulcer_grade };
}
function biomech(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.gait_pattern, 'gp', ['normal','antalgic','spastic','steppage','foot_drop','trendelenburg','toe_walking','equinus','other','NA']);
  ensureNum(req.cadence_steps_min, 'cs');
  ensureNum(req.stride_length_m, 'sl');
  ensureNum(req.stance_pct, 'st');
  ensureNum(req.swing_pct, 'sw');
  ensureNum(req.pressure_peak_kpa, 'pp');
  ensureEnum(req.foot_posture, 'fp', ['neutral','pronated','supinated','other','NA']);
  ensureNum(req.fpi_score, 'fi');
  ensureBool(req.recommend_pt, 'pt');
  ensureStr(req.provider, 'pr');
  return { bm_id: `bme_${Date.now()}`, patient_id: req.patient_id, gait: req.gait_pattern };
}

function funcs() { return { assess, nail_care, orthotic, diabetic_foot, biomech }; }
module.exports = { funcs, ValidationError };