// filepath: tier58_research_ext_325_res_grant_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function grant_submission(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.grant_id, 'gid');
  ensureEnum(req.funding_agency, 'fa', ['nih','nsf','hrsa','dod','private_foundation','industry','international']);
  ensureStr(req.pi, 'pi');
  ensureNum(req.amount_requested, 'ar');
  ensureStr(req.submission_date, 'sd');
  ensureNum(req.co_investigators, 'ci');
  ensureNum(req.aims_count, 'ac');
  return { grant: req.grant_id };
}
function grant_review_status(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.grant_id, 'gid');
  ensureNum(req.review_round, 'rr');
  ensureStr(req.study_section, 'ss');
  ensureNum(req.score_percentile, 'sp');
  ensureEnum(req.status, 'stat', ['funded','not_funded','pending','revision_submitted','withdrawn']);
  ensureStr(req.funding_start, 'fs');
  ensureNum(req.duration_years, 'dy');
  return { grant: req.grant_id };
}
function budget_justification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.grant_id, 'gid');
  ensureNum(req.year, 'yr');
  ensureNum(req.personnel, 'per');
  ensureNum(req.equipment, 'eq');
  ensureNum(req.supplies, 'sup');
  ensureNum(req.travel, 'trv');
  ensureNum(req.other, 'oth');
  ensureNum(req.total, 'tot');
  return { grant: req.grant_id, total: req.total };
}
function progress_report_grant(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.grant_id, 'gid');
  ensureNum(req.reporting_year, 'ry');
  ensureNum(req.aims_completed, 'ac');
  ensureNum(req.aims_in_progress, 'aip');
  ensureNum(req.publications, 'pubs');
  ensureNum(req.next_year_funding, 'nyf');
  ensureEnum(req.status, 'stat', ['on_track','minor_issues','major_issues','terminated']);
  return { grant: req.grant_id };
}
function no_cost_extension(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.grant_id, 'gid');
  ensureNum(req.extension_months, 'em');
  ensureStr(req.reason, 'reason');
  ensureEnum(req.irb_status, 'irb', ['approved','pending','not_required','rejected']);
  ensureEnum(req.funder_status, 'fs', ['pending','approved','rejected','in_review']);
  ensureStr(req.requested_date, 'rd');
  return { extension: req.extension_months };
}

function funcs() { return { grant_submission, grant_review_status, budget_justification, progress_report_grant, no_cost_extension }; }
module.exports = { funcs, ValidationError };