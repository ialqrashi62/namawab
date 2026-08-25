// filepath: tier35_rheumatology_ext_210_vasculitis_engine.js
// TIER35_RHEUMATOLOGY-210: Vasculitis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function anca_vasculitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.anca_type, 'anca', ['pr3','mpo','negative','h_anca','p_anca','other']);
  ensureNumber(req.creatinine, 'cr');
  ensureEnum(req.organ_invasion, 'organ', ['kidney_only','lung_only','kidney_lung','ent_only','neuro','multiple','other']);
  ensureEnum(req.induction, 'ind', ['rituximab','cyclophosphamide','combination','plasma_exchange','none','other']);
  ensureEnum(req.response, 'resp', ['remission','improving','stable','relapsed','refractory','unknown']);
  ensureNumber(req.bv_score, 'bv');
  let status;
  if (req.bv_score >= 15 && req.induction === 'none') status = 'severe_anca_induction_urgent';
  else if (req.creatinine >= 4 && req.induction !== 'rituximab') status = 'severe_renal_anca_plasma_exchange';
  else if (req.response === 'relapsed') status = 'anca_relapse_re_induction';
  else if (req.response === 'remission') status = 'anca_remission_maintenance';
  else status = 'anca_review_appropriate';
  return { status, anca: req.anca_type };
}

function giant_cell_arteritis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age, 'age');
  ensureNumber(req.esr, 'esr');
  ensureBool(req.prednisone_started, 'pred');
  ensureNumber(req.dose_mg, 'dose');
  ensureEnum(req.temporal_biopsy, 'bx', ['positive','negative','equivocal','not_done','other']);
  ensureBool(req.vision_symptoms, 'vision');
  let status;
  if (req.vision_symptoms && !req.prednisone_started) status = 'gca_vision_loss_iv_steroids_immediate';
  else if (req.prednisone_started && req.dose_mg < 40) status = 'gca_prednisone_dose_too_low_increase';
  else if (req.temporal_biopsy === 'not_done' && req.prednisone_started) status = 'temporal_biopsy_within_2_weeks';
  else if (req.age < 50) status = 'gca_age_inconclusive_alternative_dx';
  else status = 'gca_review_appropriate';
  return { status, age: req.age };
}

function takayasu(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.involved_vessels, 'ves', ['aorta_only','aorta_subclavian','aorta_renal','pulmonary','carotid_vertebral','multiple','other']);
  ensureEnum(req.imaging, 'img', ['mra','cta','pet','doppler','angiography','unknown','other']);
  ensureEnum(req.disease_activity, 'act', ['active','stable','remission','relapse','other']);
  ensureEnum(req.treatment, 'rx', ['tocilizumab','prednisone','mycophenolate','azathioprine','combination','none','other']);
  ensureEnum(req.response, 'resp', ['remission','stable','improving','worsening','unknown']);
  let status;
  if (req.disease_activity === 'active' && req.treatment === 'none') status = 'active_takayasu_initiate_immunosuppression';
  else if (req.disease_activity === 'relapse') status = 'takayasu_relapse_escalate';
  else if (req.response === 'worsening') status = 'takayasu_worsening_revascularization_review';
  else if (req.response === 'remission' && req.treatment === 'tocilizumab') status = 'takayasu_remission_continue';
  else status = 'takayasu_review';
  return { status, act: req.disease_activity };
}

function behcet(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.oral_ulcers, 'oral');
  ensureBool(req.genital_ulcers, 'gen');
  ensureBool(req.uveitis, 'eye');
  ensureEnum(req.pathergy, 'path', ['positive','negative','not_done','other']);
  ensureBool(req.hla_b51, 'hla');
  ensureEnum(req.treatment, 'rx', ['azathioprine','colchicine','thalidomide','tnf_inhibitor','interferon','cyclosporine','combination','none','other']);
  let status;
  if (req.uveitis && req.treatment === 'azathioprine') status = 'behcet_uveitis_intensify_review';
  else if (req.uveitis && req.treatment === 'none') status = 'behcet_uveitis_urgent_treatment';
  else if (req.oral_ulcers && req.genital_ulcers && req.uveitis) status = 'complete_behcet_immunosuppression';
  else status = 'behcet_review_appropriate';
  return { status, e: req.uveitis };
}

function iga_vasculitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.palpable_purpura, 'purpura');
  ensureBool(req.arthralgia, 'arth');
  ensureBool(req.abdominal_pain, 'abd');
  ensureBool(req.renal_involvement, 'renal');
  ensureBool(req.biospy_done, 'bx');
  ensureEnum(req.treatment, 'rx', ['observation','nsaids','steroids','immunosuppression','none','other']);
  let status;
  if (req.renal_involvement) status = 'iga_vasculitis_renal_follow_close';
  else if (req.abdominal_pain && !req.biospy_done) status = 'severe_gi_involvement_steroids';
  else if (req.palpable_purpura && !req.arthralgia && !req.renal_involvement) status = 'isolated_cutaneous_iga_observation';
  else status = 'iga_vasculitis_review';
  return { status, r: req.renal_involvement };
}

function funcs() { return { anca_vasculitis, giant_cell_arteritis, takayasu, behcet, iga_vasculitis }; }
module.exports = { funcs, ValidationError };