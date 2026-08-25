// filepath: tier154_ort_729_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function consult(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.angle_class, 'ac', ['I','II_division_1','II_division_2','III','NA','unknown']);
  ensureEnum(req.malocclusion, 'ml', ['crowding','spacing','overbite','overjet','crossbite','openbite','deepbite','edge_to_edge','reversed','other','combination','NA','unknown']);
  ensureNum(req.overjet_mm, 'oj');
  ensureNum(req.overbite_mm, 'ob');
  ensureNum(req.midline_deviation_mm, 'md');
  ensureNum(req.arch_length_discrepancy_mm, 'al');
  ensureNum(req.par_index, 'pi');
  ensureBool(req.skeletal, 'sk');
  ensureStr(req.goals, 'go');
  ensureStr(req.provider, 'pr');
  return { cn_id: `ort_${Date.now()}`, patient_id: req.patient_id, class: req.angle_class };
}
function braces(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.system, 'sy', ['metal_brackets','ceramic_brackets','self_ligating','lingual','clear_aligners','Invisalign','SureSmile','other','NA']);
  ensureEnum(req.stage, 'st', ['placement','active','finishing','retention','complete','NA']);
  ensureNum(req.treatment_months, 'tm');
  ensureNum(req.appointments_count, 'ac');
  ensureNum(req.last_adjustment_days, 'la');
  ensureBool(req.elastics, 'el');
  ensureBool(req.headgear, 'hg');
  ensureBool(req.expander, 'ex');
  ensureEnum(req.complications, 'cp', ['none','bracket_breakage','wire_breakage','decay','demineralization','root_resorption','gingival_inflammation','TMJ','other']);
  ensureStr(req.provider, 'pr');
  return { br_id: `brc_${Date.now()}`, patient_id: req.patient_id, system: req.system };
}
function aligner(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.brand, 'br', ['Invisalign','SureSmile','ClearCorrect','SmileDirectClub','3M_Clarity','other','NA']);
  ensureNum(req.aligner_count, 'ac');
  ensureNum(req.treatment_weeks, 'tw');
  ensureNum(req.weeks_per_aligner, 'wa');
  ensureBool(req.compliance_good, 'cg');
  ensureEnum(req.attachment_count, 'at', ['0','1_5','6_10','11_15','16_20','over_20','unknown']);
  ensureBool(req.refinement_done, 'rd');
  ensureNum(req.refinement_count, 'rc');
  ensureEnum(req.completion, 'co', ['on_track','ahead','behind','complete','refinement','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { al_id: `aln_${Date.now()}`, patient_id: req.patient_id, brand: req.brand };
}
function retention(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.retainer_type, 'rt', ['Hawley','Essix','clear_vacuum','fixed_bonded','spring','combination','none','NA']);
  ensureNum(req.maxillary_retainer, 'mr');
  ensureNum(req.mandibular_retainer, 'mn');
  ensureEnum(req.wear_schedule, 'ws', ['full_time','night_only','every_other_night','few_nights_week','PRN','NA']);
  ensureNum(req.retention_months, 'rm');
  ensureNum(req.breakage_count, 'bc');
  ensureBool(req.lost_retainer, 'lr');
  ensureBool(req.replacement_retainer, 'rr');
  ensureBool(req.stable_occlusion, 'so');
  ensureStr(req.provider, 'pr');
  return { rt_id: `rtn_${Date.now()}`, patient_id: req.patient_id, type: req.retainer_type };
}
function ortho_progress(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.months_in_treatment, 'mi');
  ensureNum(req.overjet_mm, 'oj');
  ensureNum(req.overbite_mm, 'ob');
  ensureNum(req.arch_alignment_score, 'aa');
  ensureNum(req.space_closure_pct, 'sc');
  ensureEnum(req.progress_assessment, 'pa', ['excellent','on_track','delayed','stalled','regressing','NA']);
  ensureNum(req.estimated_months_remaining, 'em');
  ensureBool(req.need_extractions, 'ne');
  ensureBool(req.need_surgery, 'ns');
  ensureEnum(req.complications, 'cp', ['none','decay','demineralization','root_shortening','soft_tissue','TMJ','other']);
  ensureStr(req.provider, 'pr');
  return { op_id: `orp_${Date.now()}`, patient_id: req.patient_id };
}

function funcs() { return { consult, braces, aligner, retention, ortho_progress }; }
module.exports = { funcs, ValidationError };