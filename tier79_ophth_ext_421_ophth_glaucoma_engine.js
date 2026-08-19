// filepath: tier79_ophth_ext_421_ophth_glaucoma_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function glaucoma_initial(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.laterality, 'lat', ['right','left','bilateral','unknown']);
  ensureNum(req.iop_right, 'ipr');
  ensureNum(req.iop_left, 'ipl');
  ensureNum(req.cct_right, 'ctr');
  ensureNum(req.cct_left, 'ctl');
  ensureEnum(req.cup_ratio_right, 'crr', ['normal','enlarged','notching','unknown','other','p0_3','p0_4','p0_5','p0_6','p0_7','p0_8','p0_9','p1_0']);
  ensureEnum(req.cup_ratio_left, 'crl', ['normal','enlarged','notching','unknown','other','p0_3','p0_4','p0_5','p0_6','p0_7','p0_8','p0_9','p1_0']);
  ensureEnum(req.gla_type, 'glt', ['poag','pacg','ntg','secondary','congenital','juvenile','pigmentary','pseudo_exfoliation','unknown','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function visual_field(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureNum(req.md, 'md');
  ensureNum(req.psd, 'psd');
  ensureEnum(req.reliability, 'rel', ['reliable','borderline','unreliable','unknown','other']);
  ensureEnum(req.pattern, 'pat', ['normal','nasal_step','arcuate','altitudinal','cecocentral','diffuse','unknown','other']);
  ensureBool(req.progression, 'prog');
  ensureStr(req.impression, 'imp');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.test_duration_min, 'tdm');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.study_id };
}
function oct_rnfl(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureNum(req.rnfl_avg, 'ra');
  ensureNum(req.rnfl_sup, 'rs');
  ensureNum(req.rnfl_inf, 'ri');
  ensureEnum(req.classification, 'clf', ['green','yellow','red','outside_norm','unknown','other']);
  ensureBool(req.progression, 'prog');
  ensureNum(req.image_quality, 'iq');
  ensureStr(req.impression, 'imp');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.study_id };
}
function glaucoma_medication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'mid');
  ensureEnum(req.medication, 'med', ['timolol','latanoprost','bimatoprost','travoprost','brimonidine','dorzolamide','brinzolamide','pilocarpine','combination','other','unknown']);
  ensureNum(req.dosage_drop, 'dose');
  ensureEnum(req.frequency, 'freq', ['qd','bid','tid','qhs','prn','other']);
  ensureNum(req.iop_baseline, 'ipbl');
  ensureNum(req.iop_current, 'ipcr');
  ensureEnum(req.side_effects, 'se', ['none','redness','itching','stinging','hyperemia','lash_growth','darkening','pseudomembranous','other','unknown']);
  ensureStr(req.adherence, 'adh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { mid: req.medication_id };
}
function glaucoma_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.surgery_id, 'sid');
  ensureEnum(req.procedure, 'proc', ['trabeculectomy','tube_shunt','migs','gonioplasty','laser_trabeculoplasty','laser_iridotomy','canaloplasty','deep_sclerectomy','other','unknown']);
  ensureEnum(req.laterality, 'lat', ['right','left','unknown']);
  ensureNum(req.iop_pre, 'ipp');
  ensureNum(req.iop_target, 'ipt');
  ensureBool(req.bleb_formation, 'bleb');
  ensureBool(req.needling_required, 'needling');
  ensureEnum(req.complications, 'comp', ['none','hypotony','bleb_leak','encapsulated_bleb','endophthalmitis','suprachoroidal_hemorrhage','other']);
  ensureNum(req.hospital_stay_hours, 'hsh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.surgery_id };
}

function funcs() { return { glaucoma_initial, visual_field, oct_rnfl, glaucoma_medication, glaucoma_surgery }; }
module.exports = { funcs, ValidationError };