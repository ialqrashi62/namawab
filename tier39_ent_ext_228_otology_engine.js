// filepath: tier39_ent_ext_228_otology_engine.js
// TIER39_ENT-228: Otology
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function hearing_loss(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['conductive','sensorineural','mixed','functional','central','other']);
  ensureEnum(req.side, 'side', ['left','right','bilateral','asymmetric','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','profound','unknown']);
  ensureNumber(req.audiogram_pta, 'pta');
  ensureBool(req.tinnitus, 'tin');
  ensureBool(req.hearing_aid, 'ha');
  let status;
  if (req.severity === 'profound' && !req.hearing_aid) status = 'profound_loss_cochlear_implant_evaluate';
  else if (req.type === 'sensorineural' && req.audiogram_pta >= 40 && !req.hearing_aid) status = 'sensorineural_aid_refer';
  else if (req.type === 'conductive' && req.severity === 'moderate') status = 'conductive_loss_ossicular_review';
  else if (req.tinnitus && req.type === 'sensorineural') status = 'snhl_with_tinnitus_combined_hearing_aid';
  else status = 'hearing_loss_review';
  return { status, sev: req.severity };
}

function otitis_media(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['acute','chronic','serous','effusion','recurrent','acute_on_chronic','other']);
  ensureEnum(req.side, 'side', ['left','right','bilateral','other']);
  ensureBool(req.effusion, 'eff');
  ensureBool(req.tm_perforation, 'tmp');
  ensureEnum(req.antibiotic, 'abx', ['amoxicillin','amoxicillin_clavulanate','cefdinir','azithromycin','observation','none','other']);
  ensureBool(req.follow_up_4_weeks, 'fup');
  let status;
  if (req.tm_perforation) status = 'tm_perforation_refer_ent';
  else if (req.effusion && req.type !== 'serous') status = 'om_with_effusion_antibiotic';
  else if (req.type === 'chronic' && !req.follow_up_4_weeks) status = 'chronic_om_follow_up';
  else if (req.antibiotic === 'amoxicillin' && req.effusion) status = 'om_first_line_antibiotic';
  else status = 'om_review';
  return { status, t: req.type };
}

function vertigo(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['bppv','vestibular_neuritis','meniere','labyrinthitis','central','migraine_associated','cervicogenic','psychogenic','other']);
  ensureEnum(req.dix_hallpike, 'dh', ['positive','negative','inconclusive','not_done','other']);
  ensureEnum(req.nystagmus, 'nys', ['torsional_upbeating','torsional_downbeating','horizontal','vertical','central_pattern','none','other']);
  ensureEnum(req.treatment, 'rx', ['epley_maneuver','semont_maneuver','vestibular_rehab','meclizine','steroid','observation','none','other']);
  ensureEnum(req.response, 'resp', ['resolved','improving','resolving','stable','worsening','unknown']);
  let status;
  if (req.type === 'bppv' && req.dix_hallpike === 'positive' && req.treatment === 'epley_maneuver') status = 'bppv_epley_treatment_appropriate';
  else if (req.type === 'meniere' && req.treatment === 'meclizine') status = 'meniere_meclizine_diuretic_refer';
  else if (req.nystagmus === 'central_pattern') status = 'central_vertigo_imaging_review';
  else if (req.response === 'resolving') status = 'vertigo_improving_continue';
  else status = 'vertigo_review';
  return { status, t: req.type };
}

function tinnitus(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['subjective','pulsatile','objective','musical','other']);
  ensureEnum(req.side, 'side', ['left','right','bilateral','head','other']);
  ensureNumber(req.duration_months, 'dur');
  ensureBool(req.hearing_loss, 'hl');
  ensureBool(req.audiogram_done, 'audi');
  ensureEnum(req.management, 'mgmt', ['observation','sound_therapy','cbt','hearing_aid','antidepressant','none','other']);
  let status;
  if (req.type === 'pulsatile') status = 'pulsatile_tinnitus_imaging_review';
  else if (!req.audiogram_done) status = 'tinnitus_audiogram_required';
  else if (req.hearing_loss && req.management === 'observation') status = 'hearing_loss_with_tinnitus_hearing_aid_consider';
  else if (req.duration_months >= 6 && req.management === 'cbt') status = 'chronic_tinnitus_cbt_continue';
  else status = 'tinnitus_review';
  return { status, t: req.type };
}

function cholesteatoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.location, 'loc', ['attic','middle_ear','mastoid','extensive','other']);
  ensureEnum(req.stage, 'stage', ['modified_sade_1','modified_sade_2','modified_sade_3','modified_sade_4','unknown','other']);
  ensureEnum(req.surgery_planned, 'sx', ['tympanoplasty_with_mastoidectomy','tympanoplasty_alone','atticotomy','radical_mastoidectomy','none','other']);
  ensureNumber(req.hearing_baseline, 'hear');
  ensureBool(req.complication_known, 'comp');
  let status;
  if (req.stage === 'modified_sade_3' && req.surgery_planned !== 'tympanoplasty_with_mastoidectomy') status = 'extensive_cholesteatoma_full_mastoid';
  else if (req.stage === 'modified_sade_1' && req.surgery_planned === 'atticotomy') status = 'limited_atticotomy_appropriate';
  else if (req.hearing_baseline >= 40 && req.complication_known) status = 'hearing_baseline_low_preop_assess';
  else status = 'cholesteatoma_review';
  return { status, s: req.stage };
}

function funcs() { return { hearing_loss, otitis_media, vertigo, tinnitus, cholesteatoma }; }
module.exports = { funcs, ValidationError };