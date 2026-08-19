// filepath: tier156_hpb_736_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function liver_resection(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['HCC','cholangiocarcinoma','metastases','adenoma','focal_nodular','hemangioma','abscess','trauma','living_donor','other','NA']);
  ensureEnum(req.type, 'tp', ['wedge','segmentectomy','bisegmentectomy','left_hepatectomy','right_hepatectomy','extended_right','extended_left','central','caudate','ALPPS','NA']);
  ensureNum(req.tumor_size_cm, 'ts');
  ensureNum(req.tumor_count, 'tc');
  ensureNum(req.segments_resected, 'sr');
  ensureNum(req.cpb_min, 'cp');
  ensureNum(req.pringle_min, 'pm');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.bilirubin_pre, 'bp');
  ensureNum(req.liver_remnant_pct, 'lr');
  ensureEnum(req.complication, 'cp', ['none','bile_leak','bleeding','liver_failure','ascites','PVT','infection','death','other']);
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { lr_id: `liv_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function pancreas(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['whipple','distal_pancreatectomy','enucleation','total_pancreatectomy','central','pancreatic_drainage','frey','beger','NA']);
  ensureEnum(req.approach, 'ap', ['open','lap','robotic','NA']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_hr, 'dh');
  ensureEnum(req.complication, 'cp', ['none','pancreatic_fistula','POPF','DGE','bleeding','infection','death','other','NA']);
  ensureNum(req.drain_output_d1_ml, 'do');
  ensureNum(req.drain_amylase_d1, 'da');
  ensureNum(req.drain_amylase_d3, 'da2');
  ensureNum(req.los_days, 'lo');
  ensureBool(req.readmission_30d, 'rd');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { pn_id: `pnc_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function biliary(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['laparoscopic_chole','open_chole','chole_with_ERCP','hepaticojejunostomy','choledochal_cyst_excision','stone_extraction','bile_duct_resection','NA']);
  ensureEnum(req.findings, 'fi', ['cholelithiasis','cholecystitis_acute','cholecystitis_chronic','gallstone_pancreatitis','cholangitis','choledocholithiasis','mass','other','NA']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.conversion_rate, 'cr');
  ensureNum(req.bile_leak, 'bl');
  ensureNum(req.cbds_injury, 'cb');
  ensureNum(req.operative_time_min, 'ot');
  ensureNum(req.los_days, 'lo');
  ensureBool(req.same_day_discharge, 'sd');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { bi_id: `bil_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function spleen(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['trauma','ITP','TTP','AIHA','HS','spenic_abscess','cyst','tumor','hypersplenism','NA']);
  ensureEnum(req.type, 'tp', ['open','laparoscopic','partial','hand_assist','robotic','NA']);
  ensureNum(req.weight_grams, 'wg');
  ensureNum(req.accessory_spleens, 'as');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.duration_min, 'du');
  ensureNum(req.los_days, 'lo');
  ensureEnum(req.complication, 'cp', ['none','bleeding','infection','pancreatitis','VTE','death','other','NA']);
  ensureBool(req.vaccines_done, 'vd');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { sp_id: `spl_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function hernia(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['inguinal_open','inguinal_lap','inguinal_robotic','umbilical','ventral','incisional','hiatal','femoral','spigelian','obturator','parastomal','diaphragmatic','lumbar','NA']);
  ensureEnum(req.size, 'sz', ['S_small','M_medium','L_large','XL_giant','NA','unknown']);
  ensureNum(req.duration_min, 'du');
  ensureEnum(req.mesh_used, 'me', ['none','polypropylene','polyester','biologic','synthetic_absorbable','composite','NA']);
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.los_hours, 'lo');
  ensureNum(req.recurrence_pct, 'rc');
  ensureEnum(req.complication, 'cp', ['none','seroma','hematoma','infection','mesh_exposure','recurrence','chronic_pain','other','NA']);
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { hn_id: `hrn_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}

function funcs() { return { liver_resection, pancreas, biliary, spleen, hernia }; }
module.exports = { funcs, ValidationError };