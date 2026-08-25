// filepath: tier154_ent_725_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ent_exam(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.chief_complaint, 'cc', ['hearing_loss','tinnitus','vertigo','ear_pain','ear_discharge','nasal_obstruction','epistaxis','sinusitis','sore_throat','hoarseness','dysphagia','neck_mass','snoring','sleep_apnea','otitis_media','other','NA']);
  ensureNum(req.pure_tone_avg_left, 'ptl');
  ensureNum(req.pure_tone_avg_right, 'ptr');
  ensureEnum(req.tympanogram, 'tm', ['A_normal','B_flat','C_negative_pressure','As_shallow','Ad_deep','NA','unknown','not_done']);
  ensureEnum(req.nasal_endoscopy, 'ne', ['normal','polyps','deviated_septum','turbinate_hypertrophy','mass','bleeding','discharge','other','NA','not_done']);
  ensureEnum(req.throat_exam, 'th', ['normal','erythema','exudate','mass','ulcer','other','NA','not_done']);
  ensureEnum(req.neck_exam, 'nk', ['normal','lymphadenopathy','mass','thyromegaly','other','NA','not_done']);
  ensureStr(req.provider, 'pr');
  return { ee_id: `eex_${Date.now()}`, patient_id: req.patient_id, cc: req.chief_complaint };
}
function audiology(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ay');
  ensureNum(req.ac_500_left, 'a5l');
  ensureNum(req.ac_1000_left, 'a1l');
  ensureNum(req.ac_2000_left, 'a2l');
  ensureNum(req.ac_4000_left, 'a4l');
  ensureNum(req.ac_500_right, 'a5r');
  ensureNum(req.ac_1000_right, 'a1r');
  ensureNum(req.ac_2000_right, 'a2r');
  ensureNum(req.ac_4000_right, 'a4r');
  ensureNum(req.srt_left, 'sl');
  ensureNum(req.srt_right, 'sr');
  ensureNum(req.word_recognition_left_pct, 'wl');
  ensureNum(req.word_recognition_right_pct, 'wr');
  ensureEnum(req.hearing_loss_type, 'hl', ['normal','conductive','sensorineural','mixed','profound','NA','unknown']);
  ensureEnum(req.grade_left, 'gl', ['normal','mild','moderate','severe','profound','NA']);
  ensureEnum(req.grade_right, 'gr', ['normal','mild','moderate','severe','profound','NA']);
  ensureStr(req.provider, 'pr');
  return { au_id: `aud_${Date.now()}`, patient_id: req.patient_id };
}
function surgery_ent(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['T_and_A','adenoidectomy','tonsillectomy','myringotomy','PE_tubes','septoplasty','turbinate_reduction','FESS','sinus_surgery','tympanoplasty','mastoidectomy','stapedectomy','cochlear_implant','BAHA','thyroidectomy','parotidectomy','neck_dissection','laryngoscopy','bronchoscopy','esophagoscopy','other','NA']);
  ensureNum(req.duration_min, 'du');
  ensureNum(req.ebl_ml, 'eb');
  ensureBool(req.bilateral, 'bi');
  ensureBool(req.outpatient, 'op');
  ensureNum(req.los_days, 'lo');
  ensureEnum(req.complications, 'cp', ['none','bleeding','infection','perforation','CSF_leak','facial_nerve','vocal_cord','dysphagia','other']);
  ensureBool(req.pathology_sent, 'ps');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { es_id: `ens_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function voice(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.disorder, 'di', ['vocal_nodule','vocal_polyp','vocal_cyst','vocal_atrophy','sulcus','Reinkes_edema','leukoplakia','vocal_paralysis','spasmodic_dysphonia','muscle_tension','functional','conversion','other','NA']);
  ensureNum(req.vhi_10_score, 'vh');
  ensureNum(req.f0_hz, 'f0');
  ensureNum(req.jitter_pct, 'jt');
  ensureNum(req.shimmer_db, 'sh');
  ensureNum(req.breathiness_index, 'bi');
  ensureNum(req.max_phonation_time, 'mp');
  ensureBool(req.smoker, 'sm');
  ensureNum(req.voice_rest_days, 'vr');
  ensureBool(req.voice_therapy, 'vt');
  ensureStr(req.provider, 'pr');
  return { vc_id: `vcp_${Date.now()}`, patient_id: req.patient_id, disorder: req.disorder };
}
function sinus(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.condition, 'cn', ['acute_rhinosinusitis','chronic_rhinosinusitis','recurrent_acute','acute_on_chronic','fungal_ball','invasive_fungal','sinus_tumor','nasal_polyps','silent_sinus','NA','other']);
  ensureNum(req.lund_mackay_score, 'lm');
  ensureBool(req.polyp_present, 'pp');
  ensureNum(req.ct_findings, 'cf');
  ensureBool(req.allergy_present, 'ap');
  ensureBool(req.aspirin_exacerbated, 'ae');
  ensureEnum(req.treatment, 'tr', ['observation','saline_irrigation','antibiotics','intranasal_steroid','oral_steroid','biologics','FESS','revision_FESS','extended_endoscopic','open_sinus','other','NA']);
  ensureNum(req.duration_weeks, 'du');
  ensureStr(req.provider, 'pr');
  return { sn_id: `sns_${Date.now()}`, patient_id: req.patient_id, condition: req.condition };
}

function funcs() { return { ent_exam, audiology, surgery_ent, voice, sinus }; }
module.exports = { funcs, ValidationError };