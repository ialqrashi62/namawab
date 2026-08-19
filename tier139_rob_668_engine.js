// filepath: tier139_rob_668_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function surgical_plan(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.plan_id, 'pl');
  ensureEnum(req.platform, 'pl2', ['DaVinci_Xi','DaVinci_SP','Mako','Stryker_Mako','Rosa','Brainlab','Medtronic_Mazor','Globus_Excelsius','TINavi','HUGO','Versius','Senhance','Ion','custom']);
  ensureEnum(req.procedure, 'pr', ['prostatectomy','hysterectomy','nephrectomy','partial_neph','cystectomy','mitral_repair','TAVR','SAVR','bariatric','gastric_bypass','gastric_sleeve','fundoplication','colectomy','thyroid','spine','TKA','THA','craniotomy','brain_biopsy','lobectomy']);
  ensureNum(req.estimated_time_min, 'et');
  ensureStr(req.surgeon, 'sg');
  ensureBool(req.ai_assisted, 'ai');
  ensureStr(req.provider, 'pr');
  return { sp_id: `sp_${Date.now()}`, plan_id: req.plan_id, platform: req.platform, procedure: req.procedure };
}
function instrument_track(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.session_id, 'si');
  ensureStr(req.instrument_id, 'ii');
  ensureEnum(req.instrument, 'is', ['grasper','scissors','cautery','clip_applier','needle_driver','stapler','suction','irrigator','retractor','camera','scope','catheter','drill','saw','probe','forceps','EEG','ion','cryoprobe','laser']);
  ensureBool(req.used, 'us');
  ensureNum(req.duration_used_min, 'dm');
  ensureStr(req.surgeon_id, 'su');
  ensureEnum(req.status, 'st', ['clean','sterilized','in_use','returned','missing','damaged','retired']);
  ensureBool(req.rfid_tracked, 'rt');
  ensureStr(req.provider, 'pr');
  return { it_id: `it_${Date.now()}`, session_id: req.session_id, instrument: req.instrument, status: req.status };
}
function ai_assist(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.session_id, 'si2');
  ensureEnum(req.task, 'ts', ['anatomy_detect','instrument_localize','tissue_segment','vessel_detect','nerve_avoid','tumor_outline','guide_placement','suturing_assist','clip_recommend','safety_warn','hemostasis_check','count_check']);
  ensureNum(req.confidence, 'cf');
  ensureStr(req.guidance, 'gd');
  ensureBool(req.accepted, 'ac');
  ensureBool(req.override, 'ov');
  ensureStr(req.provider, 'pr');
  ensureStr(req.timestamp, 'tm');
  return { ai_id: `ai_${Date.now()}`, session_id: req.session_id, task: req.task, accepted: req.accepted };
}
function motion_analyze(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.session_id, 'si3');
  ensureNum(req.tremor_amplitude_mm, 'ta');
  ensureNum(req.path_length_mm, 'pl');
  ensureNum(req.smoothness_score, 'ss');
  ensureEnum(req.hand, 'hd', ['left','right','bimanual']);
  ensureStr(req.surgeon_id, 'su2');
  ensureNum(req.skill_score, 'sk');
  ensureStr(req.feedback, 'fb');
  ensureStr(req.provider, 'pr');
  return { ma_id: `ma_${Date.now()}`, session_id: req.session_id, skill_score: req.skill_score, smoothness: req.smoothness_score };
}
function post_op(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.session_id, 'si4');
  ensureNum(req.ebl_ml, 'ebl');
  ensureNum(req.los_days, 'lo');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.clavien_dindo, 'cd', ['0','1','2','3a','3b','4a','4b','5']);
  ensureNum(req.console_time_min, 'ct');
  ensureNum(req.robot_dock_time_min, 'rd');
  ensureStr(req.surgeon_id, 'su3');
  ensureStr(req.provider, 'pr');
  return { po_id: `po_${Date.now()}`, session_id: req.session_id, ebl: req.ebl_ml, clavien: req.clavien_dindo };
}

function funcs() { return { surgical_plan, instrument_track, ai_assist, motion_analyze, post_op }; }
module.exports = { funcs, ValidationError };
