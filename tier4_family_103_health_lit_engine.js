'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { ahrq_health_lit: 'AHRQ Health Literacy Universal Precautions 2015' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function healthLitQuickScreen(input) {
  ensureObj(input, 'input');
  const confidence_with_forms = ensureNumber(input.confidence_with_forms, 'confidence_with_forms');
  const read_medical_materials = ensureNumber(input.read_medical_materials, 'read_medical_materials');
  const needs_help_reading = !!input.needs_help_reading;
  const teachBack_success = !!input.teachBack_success;
  const preference = ensureEnum(input.preference, ['learn_by_doing','learn_by_reading','learn_by_video','learn_by_conversation'], 'preference');
  const total = (needs_help_reading?0:1) + (teachBack_success?1:0) + (confidence_with_forms >= 4 ? 1 : 0) + (read_medical_materials >= 4 ? 1 : 0);
  let level;
  if (total >= 4) { level = 'adequate'; }
  else if (total >= 2) { level = 'marginal'; }
  else { level = 'low_address_with_teach_back'; }
  return { confidence_with_forms, read_medical_materials, needs_help_reading, teachBack_success, preference, total, level, citations:['ahrq_health_lit'] };
}

function patientCommunication(input) {
  ensureObj(input, 'input');
  const teach_back_used = !!input.teach_back_used;
  const write_instructions = !!input.write_instructions;
  const plain_language = !!input.plain_language;
  const supportive_environment = !!input.supportive_environment;
  const total = (teach_back_used?1:0) + (write_instructions?1:0) + (plain_language?1:0) + (supportive_environment?1:0);
  let quality;
  if (total >= 4) { quality = 'excellent'; }
  else if (total >= 2) { quality = 'good'; }
  else { quality = 'needs_improvement'; }
  return { teach_back_used, write_instructions, plain_language, supportive_environment, total, quality };
}

module.exports = { healthLitQuickScreen, patientCommunication, CITATIONS, ValidationError };
