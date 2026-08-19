// filepath: tier136_tox_695_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function tox_screen(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.specimen, 'sp', ['urine','serum','blood','stool','gastric','saliva','hair']);
  ensureStr(req.substances_tested, 'st');
  ensureNum(req.detected_count, 'dc');
  ensureStr(req.substances_detected, 'sd');
  ensureStr(req.provider, 'pr');
  ensureEnum(req.method, 'mt', ['immunoassay','GC_MS','LC_MS','point_of_care','HPLC','confirmatory']);
  return { tox_id: `tox_${Date.now()}`, patient_id: req.patient_id, specimen: req.specimen, detected: req.substances_detected };
}
function poisoning(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.toxin, 'tx', ['acetaminophen','salicylate','opioid','benzodiazepine','CO','methanol','ethylene_glycol','organophosphate','beta_blocker','CCB','TCA','SSRI','warfarin','digoxin','theophylline','lithium','iron','cyanide','local_anesthetic','heavy_metal','other']);
  ensureNum(req.ingestion_time_min, 'it');
  ensureNum(req.dose_amount, 'da');
  ensureStr(req.intent, 'in');
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','fatal','unknown']);
  ensureStr(req.provider, 'pr');
  return { pois_id: `pos_${Date.now()}`, patient_id: req.patient_id, toxin: req.toxin, severity: req.severity };
}
function antidote(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.pois_id, 'pi');
  ensureEnum(req.antidote, 'ad', ['NAC','naloxone','flumazenil','atropine','pralidoxime','ethanol','fomepizole','sodium_bicarbonate','vitamin_K','glucagon','digibind','deferoxamine','hydroxycobalamin','lipid_emulsion','activated_charcoal','dantrolene','insulin','atropine']);
  ensureNum(req.dose_mg, 'ds');
  ensureBool(req.effective, 'ef');
  ensureStr(req.provider, 'pr');
  return { antid_id: `ant_${Date.now()}`, patient_id: req.patient_id, antidote: req.antidote, dose: req.dose_mg };
}
function decon(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.pois_id, 'pi');
  ensureEnum(req.method, 'mt', ['activated_charcoal','whole_bowel','gastric_lavage','ipecac','cathartic','chelation','hemodialysis','hemoperfusion','lipid_emulsion','ECMO','plasma_exchange','whole_blood_exchange']);
  ensureNum(req.start_min, 'sm');
  ensureBool(req.contraindicated, 'ct');
  ensureStr(req.provider, 'pr');
  return { dec_id: `dec_${Date.now()}`, patient_id: req.patient_id, method: req.method, start_min: req.start_min };
}
function tox_follow(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.pois_id, 'pi');
  ensureNum(req.hour_post, 'hp');
  ensureNum(req.lab_value, 'lv');
  ensureEnum(req.trend, 'tr', ['improving','stable','worsening','resolved','chronic','unknown']);
  ensureStr(req.provider, 'pr');
  ensureBool(req.complications, 'cp');
  return { foll_id: `fol_${Date.now()}`, patient_id: req.patient_id, hour: req.hour_post, trend: req.trend };
}

function funcs() { return { tox_screen, poisoning, antidote, decon, tox_follow }; }
module.exports = { funcs, ValidationError };
