// filepath: tier40_ophthalmology_ext_236_oculoplast_engine.js
// TIER40_OPHTHALMOLOGY-236: Oculoplastics
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ptosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.side, 'side', ['left','right','bilateral','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','other']);
  ensureNumber(req.mr_distance, 'mr');
  ensureEnum(req.etiology, 'etio', ['aponeurotic','myogenic','neurogenic','mechanical','congenital','other']);
  ensureEnum(req.surgery_planned, 'sx', ['levator_resection','mullerectomy','frontalis_suspension','fasanella','observation','other']);
  ensureBool(req.functional_visual_loss, 'functional');
  let status;
  if (req.functional_visual_loss && req.severity !== 'mild') status = 'visual_axis_obstruction_surgery_indicated';
  else if (req.etiology === 'myogenic' && req.surgery_planned === 'levator_resection') status = 'myogenic_ptosis_levator_caution';
  else if (req.etiology === 'congenital' && req.surgery_planned === 'frontalis_suspension') status = 'congenital_ptosis_frontalis_appropriate';
  else if (req.severity === 'severe' && req.surgery_planned === 'mullerectomy') status = 'severe_ptosis_mullerectomy_may_undercorrect';
  else status = 'ptosis_review';
  return { status, sev: req.severity };
}

function blepharitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['anterior','posterior','mixed','angular','ulcerative','squamous','demodex','other']);
  ensureEnum(req.lid_hygiene, 'lh', ['none','warm_compress','lid_scrub','hypochlorous_acid','tea_tree_oil','warm_compress_and_lid_scrub','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','other']);
  ensureBool(req.rosacea, 'rosa');
  ensureEnum(req.ointment, 'ointment', ['erythromycin','bacitracin','azithromycin','metronidazole','steroid','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','partial','stable','poor','unknown']);
  let status;
  if (req.type === 'demodex' && req.lid_hygiene === 'warm_compress') status = 'demodex_blepharitis_tea_tree_oil';
  else if (req.severity === 'severe' && req.ointment === 'none') status = 'severe_blepharitis_initiate_ointment';
  else if (req.rosacea && req.ointment === 'metronidazole') status = 'rosacea_blepharitis_metronidazole';
  else if (req.response === 'partial') status = 'blepharitis_partial_review_lid_hygiene';
  else status = 'blepharitis_review';
  return { status, t: req.type };
}

function orbital_tumor(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.location, 'loc', ['intraconal','extraconal','muscle_cone','lacrimal_gland','optic_nerve','diffuse','other']);
  ensureEnum(req.imaging, 'img', ['ct','mri','ultrasound','pet','none','other']);
  ensureEnum(req.biopsy, 'bx', ['cavernous_hemangioma','lymphoma','pleomorphic_adenoma','malignant','metastasis','inflammatory_pseudotumor','rhabdomyosarcoma','unknown','pending','not_done','other']);
  ensureEnum(req.surgery_planned, 'sx', ['orbitotomy','decompression','exenteration','observation','none','other']);
  ensureEnum(req.complications, 'comp', ['none','optic_neuropathy','diplopia','vision_loss','pain','other']);
  let status;
  if (req.biopsy === 'malignant' && req.surgery_planned !== 'exenteration') status = 'orbital_malignancy_wide_resection_refer';
  else if (req.biopsy === 'lymphoma' && req.surgery_planned === 'orbitotomy') status = 'lymphoma_chemo_first_not_surgery';
  else if (req.complications === 'optic_neuropathy') status = 'compressive_optic_neuropathy_urgent_decompression';
  else if (req.location === 'lacrimal_gland' && req.biopsy === 'pleomorphic_adenoma') status = 'pleomorphic_adenoma_complete_excision';
  else status = 'orbital_tumor_review';
  return { status, b: req.biopsy };
}

function thyroid_eye_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.activity, 'act', ['active','stable','inactive','burnt_out','other']);
  ensureNumber(req.cas_score, 'cas');
  ensureEnum(req.treatment, 'rx', ['observation','iv_steroid','oral_steroid','tepezza','tepezza_iv_steroid','radiation','decompression','combination','none','other']);
  ensureBool(req.tepezza_consideration, 'tep');
  ensureBool(req.orbital_decompression_planned, 'decomp');
  let status;
  if (req.activity === 'active' && req.cas_score >= 5 && req.treatment === 'observation') status = 'active_ted_high_cas_iv_steroid_indicated';
  else if (req.activity === 'active' && req.tepezza_consideration && req.treatment !== 'tepezza' && req.treatment !== 'tepezza_iv_steroid') status = 'tepezza_active_consider';
  else if (req.cas_score < 3 && req.activity === 'stable') status = 'inactive_ted_maintain';
  else if (req.orbital_decompression_planned) status = 'decompression_planned_for_rehab_optic_neuropathy';
  else status = 'ted_review';
  return { status, act: req.activity };
}

function lacrimal_obstruction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['congenital_nldo','adult_nldo','canalicular_obstruction','punctal_stenosis','common_canaliculus','multiple','other']);
  ensureBool(req.probing_done, 'probe');
  ensureBool(req.success, 'succ');
  ensureBool(req.dacryocystorhinostomy_planned, 'dcr');
  ensureEnum(req.follow_up, 'fup', ['1_week','1_month','3_months','6_months','other']);
  let status;
  if (req.type === 'congenital_nldo' && req.success) status = 'congenital_nldo_resolved';
  else if (req.type === 'adult_nldo' && req.success === false && !req.dacryocystorhinostomy_planned) status = 'adult_nldo_dcr_indicated';
  else if (req.dacryocystorhinostomy_planned) status = 'dcr_planned';
  else if (req.success === false && req.probing_done) status = 'probing_failed_dcr_review';
  else status = 'lacrimal_review';
  return { status, t: req.type };
}

function funcs() { return { ptosis, blepharitis, orbital_tumor, thyroid_eye_disease, lacrimal_obstruction }; }
module.exports = { funcs, ValidationError };