// filepath: tier145_ed_689_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function triage(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.acuity, 'ac', ['1_resuscitation','2_emergent','3_urgent','4_less_urgent','5_non_urgent']);
  ensureNum(req.esi, 'es');
  ensureNum(req.news2, 'n2');
  ensureNum(req.pain_score, 'ps');
  ensureStr(req.chief_complaint, 'cc');
  ensureBool(req.esi_alert, 'ea');
  ensureStr(req.provider, 'pr');
  return { tr_id: `tr_${Date.now()}`, patient_id: req.patient_id, acuity: req.acuity, esi: req.esi };
}
function trauma(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mechanism, 'me', ['MVC','fall','gunshot','stab','burn','crush','blast','pedestrian','sport','work','assault','other']);
  ensureNum(req.iss, 'is');
  ensureBool(req.gcs_intubated, 'gi');
  ensureNum(req.gcs_total, 'gt');
  ensureEnum(req.tier, 'ti', ['1','2','3','unknown']);
  ensureNum(req.lactate, 'la');
  ensureBool(req.massive_transfusion, 'mt');
  ensureStr(req.provider, 'pr');
  return { tt_id: `trt_${Date.now()}`, patient_id: req.patient_id, mechanism: req.mechanism, iss: req.iss };
}
function toxicology(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.toxin, 'tx', ['acetaminophen','opioid','benzodiazepine','CO','methanol','ethylene_glycol','organophosphate','beta_blocker','CCB','digoxin','tricyclic','SSRI','warfarin','lithium','iron','theophylline','plant','mushroom','other']);
  ensureNum(req.peak_level, 'pl');
  ensureNum(req.ingestion_time, 'it');
  ensureBool(req.activated_charcoal, 'ac');
  ensureBool(req.antidote_given, 'ag');
  ensureNum(req.epi_doses, 'ep');
  ensureStr(req.provider, 'pr');
  return { tx_id: `txt_${Date.now()}`, patient_id: req.patient_id, toxin: req.toxin, ingestion_min: req.ingestion_time };
}
function proc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.ed_procedure, 'pr', ['central_line','arterial_line','intubation','chest_tube','thoracentesis','paracentesis','LP','extubation','cricothyroidotomy','needle_decompression','cardioversion','transcutaneous_pacing','pericardiocentesis','suture','I_D','FB_removal','joint_reduction','splint','cast','other']);
  ensureNum(req.attempts, 'at');
  ensureBool(req.successful, 'su');
  ensureEnum(req.difficulty, 'df', ['easy','moderate','difficult','very_difficult','failed','unknown']);
  ensureNum(req.duration_min, 'du');
  ensureStr(req.provider, 'pr');
  return { pc_id: `prc_${Date.now()}`, patient_id: req.patient_id, procedure: req.ed_procedure, success: req.successful };
}
function disposition(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.disposition, 'dp', ['discharge','admit','ICU','OR','transfer','AMA','expired','observation','psych_hold','left_without_treatment','eloped','other']);
  ensureNum(req.los_hours, 'lo');
  ensureNum(req.los_min, 'lo2');
  ensureNum(req.consult_count, 'cc');
  ensureStr(req.return_precaution, 'rp');
  ensureBool(req.referral, 'rf');
  ensureStr(req.followup, 'fu');
  ensureStr(req.provider, 'pr');
  return { ds_id: `dsp_${Date.now()}`, patient_id: req.patient_id, disposition: req.disposition, los_hours: req.los_hours };
}

function funcs() { return { triage, trauma, toxicology, proc, disposition }; }
module.exports = { funcs, ValidationError };
