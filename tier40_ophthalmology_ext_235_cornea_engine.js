// filepath: tier40_ophthalmology_ext_235_cornea_engine.js
// TIER40_OPHTHALMOLOGY-235: Cornea
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function keratitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['infectious','non_infectious','viral','bacterial','fungal','parasitic','contact_lens_related','other']);
  ensureEnum(req.organism, 'org', ['bacterial','fungal','viral','acanthamoeba','mycobacteria','unknown','none','other']);
  ensureBool(req.contact_lens, 'cl');
  ensureBool(req.corneal_infiltrate, 'inf');
  ensureEnum(req.treatment, 'rx', ['moxifloxacin','gatifloxacin','fortified_antibiotics','antifungal','antiviral','observation','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','improving','stable','worsening','unknown','other']);
  let status;
  if (req.organism === 'acanthamoeba') status = 'acanthamoeba_keratitis_biguanide_polyhexa';
  else if (req.organism === 'fungal') status = 'fungal_keratitis_natamycin_voriconazole';
  else if (req.contact_lens && req.corneal_infiltrate && req.organism === 'bacterial') status = 'cl_related_bacterial_keratitis_fluoroquinolone';
  else if (req.response === 'worsening') status = 'keratitis_worsening_culture_adjust';
  else status = 'keratitis_review';
  return { status, o: req.organism };
}

function corneal_ulcer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.depth, 'depth', ['superficial_epithelial','superficial_stromal','deep_stromal','descemetocele','perforated','other']);
  ensureBool(req.culture_done, 'cx');
  ensureEnum(req.organism, 'org', ['pseudomonas','staph','strep','fungus','acanthamoeba','mixed','unknown','other']);
  ensureEnum(req.antibiotic, 'abx', ['fortified_gentamicin','fortified_cefazolin','fortified_combination','moxifloxacin','natamycin','polyhexamethylene','observation','none','other']);
  ensureEnum(req.scarring_risk, 'risk', ['low','moderate','high','perforation_risk','other']);
  let status;
  if (req.depth === 'perforated') status = 'corneal_perforation_emergency_patch_graft';
  else if (req.culture_done === false) status = 'culture_required_before_antibiotic';
  else if (req.organism === 'pseudomonas' && req.antibiotic === 'fortified_gentamicin') status = 'pseudomonas_fortified_appropriate';
  else if (req.scarring_risk === 'high') status = 'high_scarring_risk_refer_corneal';
  else status = 'corneal_ulcer_review';
  return { status, dep: req.depth };
}

function dry_eye(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','other']);
  ensureNumber(req.schirmer, 'sch');
  ensureNumber(req.tbut, 'tbut');
  ensureEnum(req.treatment, 'rx', ['artificial_tears','artificial_tears_cyclosporine','lifitegrast','punctal_plugs','warm_compress','omega3','combination','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','partial','stable','poor','none','unknown']);
  let status;
  if (req.severity === 'severe' && req.treatment === 'artificial_tears') status = 'severe_dry_eye_add_cyclosporine';
  else if (req.tbut < 5 && req.treatment === 'artificial_tears_cyclosporine') status = 'evaporative_dry_eye_continue';
  else if (req.response === 'poor' && req.treatment === 'artificial_tears') status = 'artificial_tears_only_insufficient';
  else status = 'dry_eye_review';
  return { status, s: req.severity };
}

function keratoconus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','forme_fruste','other']);
  ensureNumber(req.steepest_k, 'k');
  ensureBool(req.corneal_crosslinking_done, 'cxl');
  ensureStr(req.visual_acuity, 'va');
  ensureEnum(req.contact_lens, 'cl', ['none','soft','rigid_gas_permeable','scleral','hybrid','other']);
  let status;
  if (req.severity === 'severe' && req.contact_lens === 'soft') status = 'severe_keratoconus_rigid_or_scleral';
  else if (req.corneal_crosslinking_done === false && req.steepest_k >= 48) status = 'progression_k_48_crosslinking_indicated';
  else if (req.steepest_k >= 60) status = 'severe_k_consider_transplant';
  else if (req.severity === 'mild' && req.corneal_crosslinking_done) status = 'mild_crosslinking_done_monitor';
  else status = 'keratoconus_review';
  return { status, k: req.steepest_k };
}

function corneal_transplant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['pk','dmek','dsaek','dmek_plus','keratoprosthesis','limbal_stem_cell','other']);
  ensureEnum(req.indication, 'ind', ['fuchs_dystrophy','keratoconus','scar','bullous_keratopathy','regraft','trauma','infection','other']);
  ensureEnum(req.donor_tissue, 'donor', ['available','pending','unavailable','other']);
  ensureEnum(req.rejection_risk, 'risk', ['low','moderate','high','other']);
  ensureEnum(req.post_op_drops, 'drops', ['pred_fk506','pred_mm','pred_alone','combination','none','other']);
  let status;
  if (req.indication === 'fuchs_dystrophy' && req.type === 'dmek') status = 'fuchs_dmek_optimal_choice';
  else if (req.donor_tissue === 'unavailable' && req.type !== 'observation') status = 'donor_unavailable_review';
  else if (req.rejection_risk === 'high') status = 'high_rejection_risk_intensify_immuno';
  else status = 'corneal_transplant_review';
  return { status, t: req.type };
}

function funcs() { return { keratitis, corneal_ulcer, dry_eye, keratoconus, corneal_transplant }; }
module.exports = { funcs, ValidationError };