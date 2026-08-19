// filepath: tier83_derm_ext_438_derm_general_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function skin_exam(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.skin_type, 'st');
  ensureNum(req.lesion_count, 'lc');
  ensureStr(req.lesion_distribution, 'ld');
  ensureBool(req.moles_present, 'mp');
  ensureBool(req.abcde_suspicious, 'as');
  ensureEnum(req.fitzpatrick, 'fit', ['i','ii','iii','iv','v','vi','unknown']);
  ensureStr(req.impression, 'imp');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function rash_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.rash_type, 'rt', ['macular','papular','vesicular','pustular','urticarial','petechial','purpuric','bullous','nodular','plaque','other','unknown']);
  ensureNum(req.duration_days, 'dur');
  ensureStr(req.distribution, 'dist');
  ensureBool(req.fever, 'fev');
  ensureBool(req.pruritus, 'pru');
  ensureStr(req.triggers, 'trig');
  ensureBool(req.contact_history, 'ch');
  ensureEnum(req.diagnosis, 'dx', ['contact_dermatitis','atopic','drug_reaction','viral_exanthem','bacterial','fungal','urticaria','psoriasis','unknown','other']);
  ensureStr(req.treatment, 'tx');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function skin_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureStr(req.site, 'site');
  ensureEnum(req.biopsy_type, 'bt', ['shave','punch','excisional','incisional','saucerization','mohs','other']);
  ensureNum(req.size_mm, 'sz');
  ensureBool(req.local_anesthesia, 'la');
  ensureEnum(req.indication, 'ind', ['nevus','mole_eval','r/o_melanoma','r/o_bcc','r/o_scc','r/o_lymphoma','unknown','other']);
  ensureEnum(req.path_result, 'pr', ['benign_nevus','dysplastic_nevus','melanoma_in_situ','melanoma','bcc','scc','benign_other','atypical','unknown','other','pending']);
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.hospital_stay_hours, 'hsh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function derm_visit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.patient_age, 'pa');
  ensureEnum(req.consult_type, 'ct', ['new','followup','urgent','telemedicine','other','unknown']);
  ensureStr(req.chief_complaint, 'cc');
  ensureStr(req.exam_findings, 'ef');
  ensureEnum(req.derm_score, 'ds', ['dlqi','pasi','scorad','pasqol','none','other','unknown']);
  ensureNum(req.score_value, 'sv');
  ensureStr(req.impression, 'imp');
  ensureStr(req.treatment_plan, 'tp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function topical_prescription(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'mid');
  ensureEnum(req.medication, 'med', ['steroid_class1','steroid_class2','steroid_class3','steroid_class4','steroid_class5','steroid_class6','steroid_class7','calcipotriene','tacrolimus','pimecrolimus','retinoid','benzoyl_peroxide','clindamycin','erythromycin','salicylic_acid','antifungal','antiviral','other']);
  ensureNum(req.dosage, 'dose');
  ensureEnum(req.frequency, 'freq', ['qd','bid','tid','qid','prn','other']);
  ensureNum(req.duration_weeks, 'dw');
  ensureBool(req.body_surface_area, 'bsa');
  ensureEnum(req.location, 'loc', ['face','scalp','trunk','arm','leg','hand','foot','multiple','other','unknown']);
  ensureStr(req.indication, 'ind');
  ensureBool(req.insurance_covered, 'ic');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { mid: req.medication_id };
}

function funcs() { return { skin_exam, rash_eval, skin_biopsy, derm_visit, topical_prescription }; }
module.exports = { funcs, ValidationError };