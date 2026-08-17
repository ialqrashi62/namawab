// filepath: tier42_psychiatry_ext_247_neurodev_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function adhd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.asrs_score, 'asrs');
  ensureEnum(req.presentation, 'pres', ['inattentive','hyperactive','combined','unspecified']);
  ensureNum(req.onset_age, 'onset');
  ensureBool(req.comorbid_anxiety, 'anx');
  ensureEnum(req.medication, 'med', ['none','methylphenidate_36mg','amphetamine_20mg','atomoxetine','lisdexamfetamine','non_stimulant']);
  ensureEnum(req.response, 'resp', ['improving','stable','poor','not_yet_evaluated']);
  return { presentation: req.presentation, medication: req.medication, response: req.response };
}
function autism_spectrum(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.ados_score, 'ados');
  ensureEnum(req.language_level, 'lang', ['nonverbal','verbal','preverbal','fluent']);
  ensureBool(req.sensory_issues, 'sens');
  ensureEnum(req.intellectual_functioning, 'iq', ['below_average','average','above_average']);
  ensureEnum(req.support_level, 'sup', ['level_1','level_2','level_3']);
  return { support_level: req.support_level, ados: req.ados_score };
}
function tourette(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.motor_tics, 'mt', ['absent','present','mild','moderate','severe']);
  ensureEnum(req.vocal_tics, 'vt', ['absent','present','mild','moderate','severe']);
  ensureNum(req.duration_years, 'dur');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe']);
  ensureEnum(req.medication, 'med', ['none','risperidone_low_dose','aripiprazole_low_dose','clonidine','guanfacine','behavior_therapy_only']);
  ensureEnum(req.behavior_therapy, 'bt', ['none','cbpt','erp','habit_reversal','supportive']);
  return { severity: req.severity, medication: req.medication };
}
function intellectual_disability(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.iq_score, 'iq');
  ensureEnum(req.adaptive_functioning, 'af', ['limited','fair','adequate']);
  ensureEnum(req.support_needed, 'sup', ['intermittent','limited','substantial','pervasive']);
  ensureStr(req.genetic_workup, 'gw');
  ensureEnum(req.behavior_plan, 'bp', ['none','positive_behavior_support','functional_behavior_assessment','restraint_reduction']);
  return { iq: req.iq_score, support: req.support_needed };
}
function learning_disorder(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['dyslexia','dyscalculia','dysgraphia','auditory_processing','language_processing','mixed']);
  ensureStr(req.reading_score, 'rs');
  ensureEnum(req.accommodations, 'acc', ['none','extended_time_audio','extended_time_only','small_group','one_on_one_aide']);
  ensureEnum(req.intervention, 'int', ['none','structured_literacy','math_intervention','writing_intervention','mixed']);
  return { type: req.type, intervention: req.intervention };
}

function funcs() { return { adhd, autism_spectrum, tourette, intellectual_disability, learning_disorder }; }
module.exports = { funcs, ValidationError };