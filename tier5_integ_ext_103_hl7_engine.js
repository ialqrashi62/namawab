'use strict';
// TIER5_INTEG_EXT-103: HL7 v2 - parsing + composing
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['HL7_V2_5_1', 'HL7_V2_8'];

function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function parse_message(req) {
  ensureStr(req.raw, 'raw');
  const segments = req.raw.split('\r').map(s => s.trim()).filter(Boolean);
  const parsed = [];
  for (const seg of segments) {
    const fields = seg.split('|');
    parsed.push({ segment: fields[0], fields: fields.slice(1) });
  }
  const msh = parsed.find(p => p.segment === 'MSH');
  const pid = parsed.find(p => p.segment === 'PID');
  return {
    segments_count: parsed.length,
    message_type: msh ? msh.fields[8] : null,
    patient_id: pid ? pid.fields[2] : null,
    parsed_first_segments: parsed.slice(0, 5),
    citations: CITATIONS,
  };
}

function compose_message(req) {
  ensureStr(req.message_type, 'message_type'); // ADT_A01 | ORU_R01 | ORM_O01
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_name, 'patient_name');
  ensureStr(req.dob, 'dob');
  ensureStr(req.gender, 'gender');

  const now = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const msh = `MSH|^~\\&|NamaMedical|${req.facility || 'DEFAULT_FACILITY'}|RECEIVER|FACILITY|${now}||${req.message_type}|${Date.now()}|P|2.5.1`;
  const pid = `PID|1||${req.patient_id}^^MRN||${req.patient_name}^^^||${req.dob}|${req.gender}`;
  return {
    message: `${msh}\r${pid}\r`,
    char_count: (msh.length + pid.length + 2),
    encoding: 'ASCII',
    citations: CITATIONS,
  };
}

function validate_message(req) {
  ensureStr(req.raw, 'raw');
  const errors = [];
  if (!req.raw.startsWith('MSH|')) errors.push({ error: 'message_must_start_with_MSH_segment' });
  if (!req.raw.includes('\r')) errors.push({ error: 'segments_must_be_separated_by_carriage_return' });
  if (req.raw.split('|').length < 5) errors.push({ error: 'too_few_fields' });
  return {
    valid: errors.length === 0,
    errors,
    citations: CITATIONS,
  };
}

module.exports = { parse_message, compose_message, validate_message, CITATIONS, ValidationError };