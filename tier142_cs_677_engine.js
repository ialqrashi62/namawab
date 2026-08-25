// filepath: tier142_cs_677_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cabg(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.urgency, 'ur', ['elective','urgent','emergent','salvage']);
  ensureStr(req.conduit, 'cn');
  ensureNum(req.num_grafts, 'ng');
  ensureNum(req.bypass_time_min, 'bt');
  ensureNum(req.cross_clamp_min, 'cc');
  ensureEnum(req.cannulation, 'cn2', ['on_pump','off_pump','minimally_invasive','robotic','hybrid']);
  ensureStr(req.surgeon, 'sg');
  return { cabg_id: `cabg_${Date.now()}`, patient_id: req.patient_id, grafts: req.num_grafts, mode: req.cannulation };
}
function valve(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.valve, 'va', ['aortic','mitral','tricuspid','pulmonic','mitral_tricuspid','aortic_mitral']);
  ensureEnum(req.procedure, 'pr', ['repair','replacement','redo','valve_in_valve','commissurotomy','annuloplasty','conduit']);
  ensureEnum(req.type, 'tp', ['mechanical','bioprosthetic','homograft','autograft','TAVR','TMVR','sutureless','Ozaki','Ross']);
  ensureStr(req.surgeon, 'sg');
  ensureNum(req.bypass_time, 'bt');
  return { valve_id: `vlv_${Date.now()}`, patient_id: req.patient_id, valve: req.valve, type: req.type };
}
function aortic(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.disease, 'di', ['aneurysm_ascending','aneurysm_arch','aneurysm_descending','dissection_type_A','dissection_type_B','IMH','PAU','rupture','coarctation','intramural_hematoma']);
  ensureEnum(req.procedure, 'pr', ['open_repair','endovascular_REVAR','hybrid','branched_FEVAR','frozen_elephant_trunk','David','Bentall','Wheat','thoracic_endo','fenestrated']);
  ensureStr(req.graft_type, 'gt');
  ensureNum(req.csp_bypass_time_min, 'cs');
  ensureStr(req.surgeon, 'sg');
  return { ao_id: `ao_${Date.now()}`, patient_id: req.patient_id, disease: req.disease, procedure: req.procedure };
}
function lung_resect(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['wedge','segmentectomy','lobectomy','bilobectomy','pneumonectomy','sleeve','extended','VATS','RATS','open','LASER']);
  ensureStr(req.lobe, 'lb');
  ensureBool(req.lymph_node_dissection, 'ln');
  ensureNum(req.fev1_pre, 'fp');
  ensureNum(req.dlco_pre, 'dp');
  ensureStr(req.surgeon, 'sg');
  return { lr_id: `lr_${Date.now()}`, patient_id: req.patient_id, type: req.type, lobe: req.lobe };
}
function congenital(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_years, 'ag');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.diagnosis, 'dx', ['ASD','VSD','PDA','TOF','TGA','HLHS','Truncus','Coarct','TOF','Ebstein','Single_ventricle','Glenn','Fontan','other']);
  ensureEnum(req.approach, 'ap', ['open','transcatheter','hybrid','VATS','RATS','perventricular']);
  ensureNum(req.cpb_time_min, 'cp');
  ensureStr(req.surgeon, 'sg');
  return { cd_id: `cd_${Date.now()}`, patient_id: req.patient_id, diagnosis: req.diagnosis, age: req.age_years };
}

function funcs() { return { cabg, valve, aortic, lung_resect, congenital }; }
module.exports = { funcs, ValidationError };
