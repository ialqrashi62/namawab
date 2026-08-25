// filepath: tier151_pls_713_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function consult(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['rhinoplasty','blepharoplasty','facelift','necklift','browlift','liposuction','abdominoplasty','breast_aug','breast_reduction','breast_lift','gynecomastia','brachioplasty','thighplasty','body_lift','BBL','mommy_makeover','otoplasty','mentoplasty','genital_aesthetic','hair_transplant','scar_revision','other']);
  ensureNum(req.bmi, 'bm');
  ensureEnum(req.smoker, 'sm', ['never','former','current','unknown']);
  ensureBool(req.medical_clearance, 'mc');
  ensureBool(req.psych_eval, 'pe');
  ensureStr(req.goals, 'go');
  ensureNum(req.asa, 'as');
  ensureStr(req.provider, 'pr');
  return { cn_id: `pls_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function recon(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['trauma','cancer_resection','burn','pressure_sore','diabetic_wound','congenital','post_infection','lymphedema','contracture','tumor','other','NA']);
  ensureEnum(req.reconstruct_type, 'rt', ['primary_closure','skin_graft','local_flap','regional_flap','free_flap','implant','tissue_expander','vacuum_assisted','secondary_intention','other','NA']);
  ensureStr(req.donor_site, 'ds');
  ensureNum(req.flap_size_cm, 'fs');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_hr, 'dh');
  ensureBool(req.microvascular_anastomosis, 'ma');
  ensureEnum(req.outcome, 'ou', ['healing_well','partial_loss','complete_loss','infection','dehiscence','hematoma','other','pending','NA']);
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { rc_id: `rcn_${Date.now()}`, patient_id: req.patient_id, indication: req.indication };
}
function hand_surg(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['carpal_tunnel_release','cubital_tunnel_release','trigger_finger_release','de_quervain_release','ganglion_excision','tendon_repair','tendon_transfer','nerve_repair','microvascular_replant','arthroplasty','arthrodesis','Dupytren_release','thumb_reconstruction','fracture_fixation','tumor_excision','amputation','other']);
  ensureStr(req.hand_involved, 'hi');
  ensureStr(req.fingers_involved, 'fi');
  ensureNum(req.duration_min, 'du');
  ensureBool(req.tourniquet, 'to');
  ensureNum(req.tourniquet_min, 'tm');
  ensureEnum(req.nerve_conduction, 'nc', ['normal','mild','moderate','severe','NA','pending','unknown']);
  ensureEnum(req.immobilization, 'im', ['splint','cast','sling','early_motion','other','NA']);
  ensureNum(req.hand_therapy_visits, 'ht');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { hs_id: `hnd_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function laser(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.laser_type, 'lt', ['CO2','Er_YAG','Nd_YAG','diode','alexandrite','PDL','IPL','fractional_non_ablative','fractional_ablative','Q_switched','tattoo','hair_removal','vascular','other']);
  ensureStr(req.indication, 'in');
  ensureEnum(req.fitzpatrick, 'fi', ['1','2','3','4','5','6','unknown']);
  ensureNum(req.fluence_j_cm2, 'fl');
  ensureNum(req.pulse_duration_ms, 'pd');
  ensureNum(req.spot_size_mm, 'ss');
  ensureNum(req.session_number, 'sn');
  ensureEnum(req.complications, 'cp', ['none','burn','scar','pigment_change','hypo_pigmentation','hyper_pigmentation','blister','erythema','crusting','other']);
  ensureStr(req.provider, 'pr');
  return { ls_id: `lsr_${Date.now()}`, patient_id: req.patient_id, laser: req.laser_type };
}
function cmo(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.complication, 'cp', ['none','hematoma','seroma','infection','dehiscence','necrosis','flap_loss','DVT','PE','asymmetry','nerve_injury','lymphedema','capsular_contracture','implant_rupture','scar_pigment','other']);
  ensureNum(req.days_post_op, 'dp');
  ensureEnum(req.clavien_dindo, 'cd', ['1','2','3a','3b','4a','4b','5','NA','unknown']);
  ensureEnum(req.treatment, 'tr', ['observation','conservative','antibiotics','I_D','OR_return','revision','removal_implant','debridement','other','NA']);
  ensureBool(req.recovered, 'rc');
  ensureStr(req.management, 'mg');
  ensureStr(req.provider, 'pr');
  return { cm_id: `cmo_${Date.now()}`, patient_id: req.patient_id, complication: req.complication };
}

function funcs() { return { consult, recon, hand_surg, laser, cmo }; }
module.exports = { funcs, ValidationError };