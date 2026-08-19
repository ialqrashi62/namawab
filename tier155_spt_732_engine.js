// filepath: tier155_spt_732_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function injury(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.sport, 'sp', ['soccer','basketball','football','baseball','tennis','golf','running','cycling','swimming','volleyball','rugby','hockey','skiing','snowboarding','wrestling','gymnastics','crossfit','climbing','surfing','other','NA']);
  ensureEnum(req.type, 'tp', ['sprain','strain','contusion','fracture','dislocation','laceration','concussion','tendon','ligament','meniscus','muscle','other','NA']);
  ensureStr(req.body_part, 'bp');
  ensureEnum(req.side, 'si', ['left','right','bilateral','midline','NA','unknown']);
  ensureEnum(req.severity, 'sv', ['G1_mild','G2_moderate','G3_severe','complete_tear','NA']);
  ensureEnum(req.mechanism, 'me', ['contact','non_contact','overuse','traumatic','fall','twist','unknown','NA']);
  ensureNum(req.mri_finding, 'mf');
  ensureBool(req.need_surgery, 'ns');
  ensureNum(req.recovery_weeks, 'rw');
  ensureStr(req.provider, 'pr');
  return { ij_id: `inj_${Date.now()}`, patient_id: req.patient_id, sport: req.sport, type: req.type };
}
function concussion(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.scid_score, 'sc');
  ensureNum(req.headache, 'hd');
  ensureNum(req.burke_score, 'bu');
  ensureBool(req.loss_of_consciousness, 'lc');
  ensureNum(req.loc_duration_min, 'lt');
  ensureBool(req.post_traumatic_amnesia, 'pt');
  ensureNum(req.pta_duration_hr, 'pd');
  ensureEnum(req.ct_finding, 'cf', ['normal','hemorrhage','edema','fracture','SAH','other','NA','pending','not_done']);
  ensureNum(req.scat5_score, 'ss');
  ensureNum(req.imPACT_score, 'ip');
  ensureBool(req.neurologist_consult, 'nc');
  ensureNum(req.recovery_days, 'rd');
  ensureEnum(req.protocol, 'pr', ['graded_return','strict_rest','modified_return','other','NA']);
  ensureBool(req.cleared_return, 'cr');
  ensureStr(req.provider, 'pr');
  return { cc_id: `ccn_${Date.now()}`, patient_id: req.patient_id, scat: req.scat5_score };
}
function surgical(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.procedure, 'pr', ['ACL_recon','PCL_recon','MCL_repair','LCL_repair','meniscus_repair','meniscectomy','labral_repair_rotator_cuff','shoulder_stabilization','Achilles_repair','hip_arthroscopy','ankle_ligament_recon','cartilage_restoration','microfracture','OATS','ACI','other','NA']);
  ensureEnum(req.graft, 'gr', ['BTB_autograft','HT_autograft','QT_autograft','allograft_BTB','allograft_HT','allograft_QT','LARS','synthetic','NA']);
  ensureNum(req.duration_min, 'du');
  ensureNum(req.ebl_ml, 'eb');
  ensureNum(req.fixation_devices, 'fd');
  ensureEnum(req.approach, 'ap', ['open','arthroscopic','mini_open','percutaneous','other','NA']);
  ensureBool(req.bracing_postop, 'br');
  ensureNum(req.pt_visits, 'pv');
  ensureNum(req.expected_return_months, 'er');
  ensureStr(req.surgeon, 'sg');
  ensureStr(req.provider, 'pr');
  return { sg_id: `sgs_${Date.now()}`, patient_id: req.patient_id, procedure: req.procedure };
}
function rehab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.week, 'wk');
  ensureNum(req.rom_active_deg, 'ro');
  ensureNum(req.rom_passive_deg, 'rp');
  ensureNum(req.strength_pct, 'st');
  ensureNum(req.swelling, 'sw');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.gait, 'ga', ['normal','antalgic','limp','non_wb','partial_wb','full_wb','NA']);
  ensureEnum(req.criteria_passed, 'cp', ['no','quad_strength','single_leg_hop','y_balance','hop_tests','LSI_90','LSI_80','all','NA']);
  ensureNum(req.lsi_pct, 'ls');
  ensureBool(req.cleared_rts, 'cl');
  ensureStr(req.provider, 'pr');
  return { rb_id: `reb_${Date.now()}`, patient_id: req.patient_id, week: req.week };
}
function prp(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['tendinopathy','OA','muscle_strain','ligament','cartilage','wound','hair_loss','sexual','other','NA']);
  ensureStr(req.body_part, 'bp');
  ensureNum(req.platelet_count, 'pc');
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.concentration, 'cn');
  ensureNum(req.activations, 'ac');
  ensureNum(req.injection_count, 'ic');
  ensureNum(req.weeks_to_response, 'wr');
  ensureEnum(req.outcome, 'ot', ['excellent','good','fair','poor','NA','unknown']);
  ensureNum(req.pre_score, 'ps');
  ensureNum(req.post_score, 'po');
  ensureStr(req.provider, 'pr');
  return { pr_id: `prp_${Date.now()}`, patient_id: req.patient_id, indication: req.indication };
}

function funcs() { return { injury, concussion, surgical, rehab, prp }; }
module.exports = { funcs, ValidationError };