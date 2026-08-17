// filepath: tier56_surgical_specialties_317_surg_thoracic_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function lobectomy_lung(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'app', ['vats','robotic','thoracotomy','hybrid']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.lobe, 'lobe');
  ensureNum(req.lymph_nodes_stations, 'lns');
  ensureStr(req.complications, 'comp');
  ensureNum(req.length_of_stay_days, 'los');
  return { lobe: req.lobe };
}
function pneumonectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.side, 'sd', ['left','right','completion']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.approach, 'app');
  ensureNum(req.lymph_nodes_stations, 'lns');
  ensureStr(req.complications, 'comp');
  return { side: req.side };
}
function wedge_resection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.approach, 'app');
  ensureStr(req.indication, 'ind');
  ensureNum(req.lesion_count, 'lc');
  ensureStr(req.location, 'loc');
  ensureEnum(req.margins, 'mg', ['negative','positive','close']);
  ensureStr(req.complications, 'comp');
  return { indication: req.indication };
}
function mediastinoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.indication, 'ind');
  ensureStr(req.stations_sampled, 'ss');
  ensureStr(req.complications, 'comp');
  ensureStr(req.follow_up_pathology, 'fup');
  return { stations: req.stations_sampled };
}
function esophagectomy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.approach, 'app', ['ivor_lewis','mckeown','transhiatal','thoracolaparoscopic','robotic']);
  ensureStr(req.indication, 'ind');
  ensureStr(req.reconstruction, 'recon');
  ensureEnum(req.anastomosis, 'an', ['intrathoracic','cervical','both','none']);
  ensureStr(req.complications, 'comp');
  return { approach: req.approach };
}

function funcs() { return { lobectomy_lung, pneumonectomy, wedge_resection, mediastinoscopy, esophagectomy }; }
module.exports = { funcs, ValidationError };