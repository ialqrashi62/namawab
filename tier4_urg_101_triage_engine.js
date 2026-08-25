'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aces: 'Emergency Severity Index 5-Level Triage 2012' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function esi(input) {
  ensureObj(input, 'input');
  const life_threatening = !!input.life_threatening;
  const severe_pain = !!input.severe_pain;
  const resources = ensureNumber(input.resources, 'resources');
  const vitals_abnormal = !!input.vitals_abnormal;
  let level;
  if (life_threatening) { level = 'esi_1_resuscitation'; }
  else if (severe_pain || vitals_abnormal || resources >= 2) { level = 'esi_2_emergent'; }
  else if (resources >= 1) { level = 'esi_3_urgent'; }
  else if (resources === 0) { level = 'esi_4_less_urgent'; }
  else { level = 'esi_5_non_urgent'; }
  return { life_threatening, severe_pain, resources, vitals_abnormal, level, citations:['aces'] };
}

function chiefComplaint(input) {
  ensureObj(input, 'input');
  const complaint = ensureEnum(input.complaint, ['chest_pain','shortness_of_breath','abdominal_pain','headache','trauma','fever','back_pain','nausea_vomiting','pediatric','psych','other'], 'complaint');
  const onset_hours = ensureNumber(input.onset_hours, 'onset_hours');
  const severity = ensureNumber(input.severity, 'severity');
  let priority;
  const red_flags = ['chest_pain','shortness_of_breath','abdominal_pain','headache'];
  if (red_flags.includes(complaint) && severity >= 7 && onset_hours < 24) { priority = 'urgent'; }
  else if (severity >= 5) { priority = 'moderate'; }
  else { priority = 'low'; }
  return { complaint, onset_hours, severity, priority };
}

module.exports = { esi, chiefComplaint, CITATIONS, ValidationError };
