// tier319_evx_1500_engine.js — Event Analytics Persistence Validation (pure helpers, NO db)
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }

const EVENTS = ['login', 'open_dept', 'create_entry', 'save', 'print', 'search', 'export'];
const FUNNEL_STEPS = ['login', 'open_dept', 'create_entry', 'save', 'print'];

function validate_event(req) {
  ensureStr(req.tenant_id, 'tenant_id');
  ensureEnum(req.event, 'event', EVENTS);
  ensureStr(req.user_role, 'user_role');
  return { tenant_id: req.tenant_id.trim(), user_role: req.user_role.trim(), event: String(req.event) };
}

function shape_funnel_query(req) {
  if (!Array.isArray(req.counts) || req.counts.length !== FUNNEL_STEPS.length) throw new ValidationError(`counts[] of ${FUNNEL_STEPS.length} numbers required`, 'counts');
  const counts = req.counts.map((c, i) => { ensureNum(c, `counts[${i}]`); return c; });
  return { steps: FUNNEL_STEPS.slice(), counts };
}

function funcs() { return { validate_event, shape_funnel_query }; }
module.exports = { funcs, ValidationError };
