// filepath: tier88_gi_luminal_465_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function endoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.procedure_type, 'pt', ['egd','upper_endoscopy','ercp','colonoscopy','flexible_sigmoidoscopy','push_enteroscopy','other']);
  ensureEnum(req.indication, 'ind', ['dyspepsia','gerd','bleeding','ulcer','mass','barretts_screening','unknown','other']);
  ensureEnum(req.findings, 'find', ['normal','ulcer','cancer','gerd','varices','polyp','mass','stricture','other','unknown']);
  ensureBool(req.biopsies_taken, 'biot');
  ensureEnum(req.complications, 'comp', ['none','bleeding','perforation','aspiration','other','unknown']);
  ensureEnum(req.sedation, 'sed', ['none','minimal','moderate','deep','general','other']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function colonoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.bowel_prep_quality, 'bpq', ['adequate','good','fair','poor','inadequate','unknown','other']);
  ensureBool(req.cecum_reached, 'cr');
  ensureNum(req.polyps_found, 'pf');
  ensureNum(req.polyp_size_mm, 'ps');
  ensureBool(req.polypectomy_done, 'pd');
  ensureEnum(req.complications, 'comp', ['none','bleeding','perforation','other','unknown']);
  ensureBool(req.biopsies_taken, 'biot');
  ensureEnum(req.findings, 'find', ['normal','adenoma','hyperplastic','cancer','ibd','other','unknown']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function ercp(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['choledocholithiasis','bile_duct_stricture','pancreatic_cancer','jaundice','sphincter_of_odd_dysfunction','other']);
  ensureBool(req.stones_extracted, 'se');
  ensureBool(req.stent_placed, 'sp');
  ensureBool(req.sphincterotomy_done, 'sd');
  ensureEnum(req.complications, 'comp', ['none','bleeding','perforation','pancreatitis','cholangitis','other','unknown']);
  ensureEnum(req.sedation, 'sed', ['none','minimal','moderate','deep','general','other']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function ercp_therapeutic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.indication, 'ind', ['stricture','stones','leak','tumor_masses','other']);
  ensureBool(req.stent_placed, 'sp');
  ensureEnum(req.stent_type, 'st', ['plastic','metal','covered_metal','biodegradable','unknown']);
  ensureBool(req.sphincterotomy_done, 'sd');
  ensureBool(req.biopsies_taken, 'biot');
  ensureEnum(req.complications, 'comp', ['none','bleeding','perforation','pancreatitis','cholangitis','stent_migration','other','unknown']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function capsule_endoscopy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.indication, 'ind', ['gi_bleeding_unknown','iron_def_anemia','cd_surveillance','sb_polyp_surveillance','celiac_screen','other','unknown']);
  ensureNum(req.study_duration_hours, 'sdh');
  ensureEnum(req.findings, 'find', ['normal','angiodysplasia','small_bowel_mass','celiac','crohns','bleeding_source','other','unknown']);
  ensureBool(req.capsule_reached_cecum, 'crc');
  ensureBool(req.battery_depleted_normal, 'bdn');
  ensureBool(req.retention, 'ret');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { endoscopy, colonoscopy, ercp, ercp_therapeutic, capsule_endoscopy }; }
module.exports = { funcs, ValidationError };