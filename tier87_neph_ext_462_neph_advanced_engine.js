// filepath: tier87_neph_ext_462_neph_advanced_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function peritoneal_dialysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.pd_type, 'pdt', ['capd','ccpd','dwell','nocturnal_iad','unknown','other']);
  ensureNum(req.kt_v, 'ktv');
  ensureNum(req.urine_volume_ml_day, 'uvd');
  ensureNum(req.dialysate_volume_per_exchange, 'dve');
  ensureNum(req.exchanges_per_day, 'epd');
  ensureNum(req.last_peritonitis_episodes, 'lpe');
  ensureEnum(req.exit_site_status, 'ess', ['clean','infected','erythema','discharge','unknown','other']);
  ensureBool(req.pet_present, 'petp');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr, 'gfr');
  ensureEnum(req.anemia_status, 'ans', ['treated_esa','untreated','related_inflammation','combination','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function transplant_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.days_post_transplant, 'dpt');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr, 'gfr');
  ensureNum(req.tacrolimus_level, 'tle');
  ensureNum(req.egfr, 'egfr');
  ensureEnum(req.biopsy_results, 'br', ['no_rejection','borderline','iatc_rejection','abmr','chronic_antibody','recurrent_disease','other','unknown']);
  ensureBool(req.recent_rejection, 'rec');
  ensureNum(req.fluids_urine_output, 'fuo');
  ensureStr(req.immunosuppression, 'is');
  ensureBool(req.infection_present, 'infp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function dialysis_vascular_access(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.access_type, 'at', ['av_fistula','av_graft','tunneled_catheter','non_tunneled_catheter','unknown','other']);
  ensureStr(req.access_location, 'loc');
  ensureNum(req.access_age_months, 'aam');
  ensureNum(req.flow_rate_ml_min, 'frm');
  ensureBool(req.steal_syndrome, 'ssx');
  ensureBool(req.thrombosis_history, 'thx');
  ensureEnum(req.complication, 'comp', ['none','stenosis','thrombosis','infection','aneurysm','seroma','bleeding','other','unknown']);
  ensureNum(req.last_fistulagram_months_ago, 'lfm');
  ensureStr(req.intervention_needed, 'in');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function anemia_ckd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.hemoglobin, 'hg');
  ensureNum(req.ferritin, 'fer');
  ensureNum(req.tsat, 'tsat');
  ensureBool(req.esa_started, 'esa');
  ensureStr(req.esa_type, 'et');
  ensureNum(req.esa_dose, 'ed');
  ensureEnum(req.iron_status, 'is', ['absolute_deficiency','functional_deficiency','adequate','unknown','other']);
  ensureNum(req.retic_count, 'rc');
  ensureEnum(req.depression_score, 'ds', ['none','mild','moderate','severe','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function bone_metabolism_ckd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.calcium, 'ca');
  ensureNum(req.phosphorus, 'ph');
  ensureNum(req.pth, 'pth');
  ensureNum(req.bap_alk_phos, 'bap');
  ensureEnum(req.vitamin_d, 'vd', ['deficient','insufficient','sufficient','adequate','unknown']);
  ensureBool(req.cinacalcet, 'cinc');
  ensureBool(req.calcium_carbonate, 'cac');
  ensureEnum(req.femoral_status, 'fs', ['normal','osteopenia','osteoporosis','adynamic_bone','unknown']);
  ensureNum(req.last_dexa_t_score, 'dts');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { peritoneal_dialysis, transplant_clinic, dialysis_vascular_access, anemia_ckd, bone_metabolism_ckd }; }
module.exports = { funcs, ValidationError };