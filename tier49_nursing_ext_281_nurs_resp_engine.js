// filepath: tier49_nursing_ext_281_nurs_resp_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function oxygen_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.delivery_device, 'dd', ['nasal_cannula','simple_mask','non_rebreather','high_flow','venturi_mask','trach_collar']);
  ensureNum(req.flow_l_min, 'flow');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureNum(req.fio2_estimate, 'fio2');
  ensureEnum(req.humidification, 'hum', ['none','bubbler','heated','hme']);
  return { device: req.delivery_device, flow: req.flow_l_min };
}
function suction_nasotracheal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.route, 'rt', ['nasotracheal','oral','inline','deep']);
  ensureNum(req.catheter_size_fr, 'cs');
  ensureNum(req.depth_cm, 'depth');
  ensureStr(req.secretion, 'sec');
  ensureStr(req.pre_post_oxygen_sat, 'spo2');
  return { catheter: req.catheter_size_fr };
}
function cpap_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.cpap_level_cm_h2o, 'cpap');
  ensureNum(req.oxygen_percent, 'o2');
  ensureEnum(req.leak, 'leak', ['minimal','moderate','severe','none']);
  ensureEnum(req.tolerance, 'tol', ['good','fair','poor']);
  ensureNum(req.hours_on, 'hr');
  return { cpap: req.cpap_level_cm_h2o };
}
function chest_tube_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.chest_tube_type, 'ctt', ['pleur_evac','atrium','digital','thora_seal']);
  ensureEnum(req.water_seal, 'ws', ['tidaling_present','tidaling_absent','bubbling_present','bubbling_absent']);
  ensureNum(req.suction_cm_h2o, 'suc');
  ensureNum(req.output_ml, 'out');
  ensureEnum(req.dressing, 'dr', ['occlusive_intact','loose','soiled','changed']);
  return { chest_tube_type: req.chest_tube_type };
}
function ventilator_alarms(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.alarm_type, 'at', ['high_pressure','low_pressure','high_respiratory_rate','low_respiratory_rate','apnea','disconnect']);
  ensureStr(req.cause_identified, 'cause');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.response, 'resp', ['resolved','ongoing','escalated']);
  ensureStr(req.follow_up, 'fu');
  return { alarm: req.alarm_type, response: req.response };
}

function funcs() { return { oxygen_therapy, suction_nasotracheal, cpap_management, chest_tube_care, ventilator_alarms }; }
module.exports = { funcs, ValidationError };