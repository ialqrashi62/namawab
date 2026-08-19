// filepath: tier161_max_757_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function facial_trauma(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mechanism, 'me', ['MVC','assault','fall','sport','work','pedestrian','firearm','other','NA']);
  ensureEnum(req.fracture_type, 'ft', ['LeFort_I','LeFort_II','LeFort_III','zygoma','mandible','orbital','nasal','complex','NA']);
  ensureNum(req.gcs_score, 'gc'); ensureNum(req.bp_systolic, 'bs');
  ensureBool(req.airway_compromise, 'ac'); ensureBool(req.eye_injury, 'ei');
  ensureNum(req.loss_of_consciousness_min, 'lo'); ensureEnum(req.disposition, 'di', ['discharge','OR','observation','ICU','transfer','NA']);
  ensureStr(req.provider, 'pr');
  return { ft_id: `ft_${Date.now()}`, patient_id: req.patient_id, fracture: req.fracture_type, mechanism: req.mechanism };
}

function orthognathic_impl(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.surgery_type, 'st', ['LeFort_I','BSSO','genio','double_jaw','segmental','other','NA']);
  ensureNum(req.surgery_duration_min, 'sd'); ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.plate_count, 'pc'); ensureEnum(req.fixation_type, 'fx', ['rigid','semi_rigid','resorbable','other','NA']);
  ensureNum(req.hospital_days, 'hd'); ensureBool(req.dental_occlusion_ok, 'do');
  ensureEnum(req.complication, 'co', ['none','infection','hemorrhage','neural','relapse','other','NA']);
  ensureStr(req.provider, 'pr');
  return { on_id: `on_${Date.now()}`, patient_id: req.patient_id, surgery: req.surgery_type, duration: req.surgery_duration_min };
}

function tmj(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.diagnosis, 'dx', ['disc_displacement','osteoarthritis','myofascial','capsulitis','arthritic','congenital','other','NA']);
  ensureNum(req.mouth_opening_mm, 'mo'); ensureNum(req.pain_score, 'ps');
  ensureBool(req.joint_sounds, 'js'); ensureEnum(req.sound_type, 'sn', ['click','crepitus','pop','none','NA']);
  ensureBool(req.bruxism, 'bx'); ensureBool(req.clenching, 'cl');
  ensureEnum(req.treatment, 'tr', ['NSAID','physio','splint','injection','surgery','combination','other','NA']);
  ensureNum(req.improvement_pct, 'ip'); ensureStr(req.provider, 'pr');
  return { tm_id: `tm_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, mo: req.mouth_opening_mm };
}

function sleep_apnea_oral(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.bmi, 'bm');
  ensureEnum(req.mandibular_advance, 'ma', ['none','mild','moderate','max','custom','NA']);
  ensureNum(req.aHI, 'ah'); ensureNum(req.ahi_baseline, 'ab');
  ensureBool(req.tongue_retainer, 'tr'); ensureEnum(req.device_type, 'dt', ['MAD','TRD','combination','positional','NA']);
  ensureNum(req.adherence_pct, 'ad'); ensureBool(req.comfortable, 'co');
  ensureNum(req.epworth_score, 'es'); ensureStr(req.provider, 'pr');
  return { sa_id: `sa_${Date.now()}`, patient_id: req.patient_id, ahi: req.aHI, device: req.device_type };
}

function cleft_care(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.cleft_type, 'ct', ['cleft_lip','cleft_palate','cleft_lip_palate','submucous','alveolar','other','NA']);
  ensureEnum(req.laterality, 'lt', ['left','right','bilateral','midline','NA']);
  ensureNum(req.surgeries_count, 'sc'); ensureNum(req.age_first_surgery_months, 'as');
  ensureEnum(req.speech_score, 'ss', ['normal','mild','moderate','severe','profound','NA']);
  ensureBool(req.feeding_issues, 'fi'); ensureBool(req.dental_issues, 'di');
  ensureEnum(req.team_stage, 'ts', ['initial','pre_op','post_op','rehabilitation','maintenance','NA']);
  ensureStr(req.provider, 'pr');
  return { cl_id: `cl_${Date.now()}`, patient_id: req.patient_id, type: req.cleft_type, surgeries: req.surgeries_count };
}

function funcs() { return { facial_trauma, orthognathic_impl, tmj, sleep_apnea_oral, cleft_care }; }
module.exports = { funcs, ValidationError };