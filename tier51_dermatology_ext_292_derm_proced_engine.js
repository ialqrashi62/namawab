// filepath: tier51_dermatology_ext_292_derm_proced_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function excisional_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.site, 'site');
  ensureNum(req.margins_mm, 'mg');
  ensureStr(req.suture, 'su');
  ensureEnum(req.follow_up, 'fu', ['1_2_weeks_pathology','wound_check_3_days','suture_removal_2_weeks','standard_pathology_review']);
  return { site: req.site, margins: req.margins_mm };
}
function shave_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.site, 'site');
  ensureStr(req.blade, 'blade');
  ensureStr(req.hemostasis, 'hemo');
  ensureEnum(req.follow_up, 'fu', ['pathology_results_1_week','pathology_results_2_weeks','wound_check_2_weeks','pathology_and_excision_planned']);
  return { site: req.site };
}
function punch_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.site, 'site');
  ensureNum(req.size_mm, 'sz');
  ensureStr(req.suture, 'su');
  ensureEnum(req.follow_up, 'fu', ['pathology_results_2_weeks','suture_removal_2_weeks','wound_check_1_week','direct_immunofluorescence_planned']);
  return { site: req.site };
}
function cryotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureNum(req.freeze_time_sec, 'ft');
  ensureNum(req.cycles, 'cy');
  ensureStr(req.site, 'site');
  ensureStr(req.complications, 'comp');
  return { site: req.site, cycles: req.cycles };
}
function phototherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.modality, 'mod', ['nb_uvb','bb_uvb','puva','excimer_308','uva1']);
  ensureStr(req.frequency, 'freq');
  ensureNum(req.total_sessions, 'ts');
  ensureEnum(req.response, 'resp', ['improved_75_percent','improved_50_percent','stable','worsening','cleared']);
  ensureStr(req.monitoring, 'mon');
  return { modality: req.modality, sessions: req.total_sessions };
}

function funcs() { return { excisional_biopsy, shave_biopsy, punch_biopsy, cryotherapy, phototherapy }; }
module.exports = { funcs, ValidationError };