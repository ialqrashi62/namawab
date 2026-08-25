// filepath: tier66_lab_diag_358_lab_specimen_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function specimen_collection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.patient_id_field, 'pif');
  ensureEnum(req.specimen_type, 'st', ['serum','plasma','whole_blood','urine','stool','csf','sputum','tissue','biopsy','swab','saline','other']);
  ensureStr(req.tube_type, 'tt');
  ensureNum(req.volume_ml, 'vol');
  ensureStr(req.collected_by, 'cb');
  ensureStr(req.collected_at, 'ca');
  ensureStr(req.site, 'site');
  ensureBool(req.qc_passed, 'qc');
  return { type: req.specimen_type };
}
function specimen_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureStr(req.collection_site, 'cs');
  ensureStr(req.received_at, 'ra');
  ensureStr(req.received_by, 'rb');
  ensureEnum(req.temperature, 'temp', ['ambient','refrigerated','frozen','dry_ice','room_temp','cold_chain','cryo']);
  ensureStr(req.integrity, 'int');
  ensureStr(req.location, 'loc');
  return { spec_id: req.specimen_id };
}
function chain_of_custody(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureBool(req.medi_legal, 'ml');
  ensureStr(req.custodian_chain, 'cc');
  ensureNum(req.gap_count, 'gc');
  ensureBool(req.signature_verified, 'sv');
  ensureBool(req.seal_intact, 'si');
  ensureNum(req.handovers, 'ho');
  return { chain: req.custodian_chain };
}
function specimen_storage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureEnum(req.storage_type, 'st', ['refrigerated','frozen_minus20','frozen_minus80','cryo','ambient','room_temp','short_term','long_term']);
  ensureNum(req.storage_temp_c, 'stc');
  ensureNum(req.storage_duration_days, 'sdd');
  ensureStr(req.disposal_date, 'dd');
  ensureNum(req.access_count, 'ac');
  ensureStr(req.location, 'loc');
  return { storage: req.storage_type };
}
function specimen_disposal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.specimen_id, 'sid');
  ensureEnum(req.disposal_method, 'dm', ['autoclave','incineration','chemical','biohazard_path','pathological_incineration','formaldehyde','medical_waste','return_to_source','release_to_patient','archive']);
  ensureEnum(req.method_compliance, 'mc', ['epa_approved','dot_approved','osha_approved','cap_approved','iso_compliant','state_compliant','institutional_policy']);
  ensureStr(req.disposal_date, 'dd');
  ensureStr(req.witness, 'wit');
  ensureBool(req.documentation_complete, 'dc');
  return { method: req.disposal_method };
}

function funcs() { return { specimen_collection, specimen_tracking, chain_of_custody, specimen_storage, specimen_disposal }; }
module.exports = { funcs, ValidationError };