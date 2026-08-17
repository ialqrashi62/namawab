// filepath: tier53_oncology_ext_301_onc_gu_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function renal_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.histology, 'histo', ['clear_cell','papillary','chromophobe','collecting_duct','translocation']);
  ensureEnum(req.risk, 'rk', ['low','intermediate','high','favorable','unfavorable']);
  ensureStr(req.treatment, 'tx');
  ensureNum(req.follow_up_imaging, 'fu');
  return { stage: req.stage, histology: req.histology };
}
function bladder_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stage, 'stage', ['nmi_low_grade','nmi_high_grade','cis','mi_t1','mi_t2','mi_t3','mi_t4','metastatic']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','complete','partial','stable','recurrence','progression']);
  ensureEnum(req.surveillance_cytology, 'sc', ['planned','normal','atypical','positive','not_applicable']);
  return { stage: req.stage };
}
function prostate_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureNum(req.psa, 'psa');
  ensureNum(req.gleason, 'gle');
  ensureNum(req.pirads, 'pir');
  ensureStr(req.treatment, 'tx');
  ensureNum(req.follow_up, 'fu');
  return { psa: req.psa, gleason: req.gleason };
}
function testicular_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stage, 'stage', ['i_seminoma','i_nsgsct','is','iia','iib','iic','iiia','iiib','iiic']);
  ensureStr(req.tumor_markers_afp, 'afp');
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['good_prognosis','intermediate_prognosis','poor_prognosis','complete_remission','relapse']);
  return { stage: req.stage };
}
function ovarian_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.stage, 'stage');
  ensureEnum(req.brca, 'brca', ['wild_type','brca1_carrier','brca2_carrier','both_carriers','unknown']);
  ensureStr(req.treatment, 'tx');
  ensureEnum(req.response, 'resp', ['planned','complete','partial','stable','progression','recurrence']);
  return { stage: req.stage };
}

function funcs() { return { renal_cancer, bladder_cancer, prostate_cancer, testicular_cancer, ovarian_cancer }; }
module.exports = { funcs, ValidationError };