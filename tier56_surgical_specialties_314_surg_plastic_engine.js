// filepath: tier56_surgical_specialties_314_surg_plastic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function reconstruction_free_flap(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['anterolateral_thigh','radial_forearm','fibula','scapular','gracilis','latissimus_dorsi','rectus_abdominis']);
  ensureStr(req.indication, 'ind');
  ensureEnum(req.donor_morbidity, 'dm', ['minimal','moderate','severe','none']);
  ensureStr(req.recipient_vessels, 'rv');
  ensureEnum(req.flap_viability, 'fv', ['complete','partial_loss','total_loss']);
  ensureNum(req.follow_up_weeks, 'fu');
  return { type: req.type };
}
function cosmetic_rhinoplasty(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'app', ['open','closed','endonasal']);
  ensureEnum(req.type, 'typ', ['primary_reduction','primary_augmentation','revision','ethnic','functional_cosmetic']);
  ensureStr(req.grafts, 'gr');
  ensureBool(req.functional_improvement, 'fi');
  ensureBool(req.cosmetic_improvement, 'ci');
  ensureStr(req.complications, 'comp');
  return { type: req.type };
}
function breast_reconstruction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['diep_flap_unilateral','diep_flap_bilateral','tram_pedicle','tram_free','latissimus_implant','implant_only','autologous_fat']);
  ensureEnum(req.timing, 'tim', ['immediate','delayed','staged']);
  ensureStr(req.mastectomy_type, 'mt');
  ensureBool(req.sentinel_node, 'sn');
  ensureBool(req.success, 'succ');
  ensureNum(req.follow_up_months, 'fu');
  return { type: req.type };
}
function hand_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.procedure, 'proc');
  ensureStr(req.side, 'sd');
  ensureEnum(req.functional_outcome, 'fo', ['excellent','good','fair','poor']);
  ensureStr(req.complications, 'comp');
  return { procedure: req.procedure };
}
function burn_reconstruction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.timing, 'tim', ['acute','subacute','chronic','delayed']);
  ensureStr(req.defect_location, 'loc');
  ensureEnum(req.technique, 'tech', ['split_thickness_skin_graft','full_thickness_skin_graft','flap','dermal_matrix','tissue_expansion']);
  ensureNum(req.graft_take_pct, 'gt');
  ensureStr(req.complications, 'comp');
  return { technique: req.technique };
}

function funcs() { return { reconstruction_free_flap, cosmetic_rhinoplasty, breast_reconstruction, hand_surgery, burn_reconstruction }; }
module.exports = { funcs, ValidationError };