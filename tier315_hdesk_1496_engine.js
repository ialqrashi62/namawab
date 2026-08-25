// tier315_hdesk_1496_engine.js — Helpdesk & Support System
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

const SLA_MIN = { sev1: 15, sev2: 120, sev3: 480 };

function t315_e1_ticket_open(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.requester, 'rq');
  ensureEnum(req.severity, 'sv', ['sev1', 'sev2', 'sev3']);
  ensureStr(req.subject, 'sj');
  return { ticket_id: `hd_${Date.now()}`, severity: req.severity, sla_due_minutes: SLA_MIN[req.severity], status: 'open', opened_at: new Date().toISOString() };
}

function t315_e2_ticket_triage(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.ticket_id, 'tk');
  ensureEnum(req.queue, 'qu', ['L1_ui', 'L2_api_data', 'L3_engine_db']);
  ensureEnum(req.action, 'ac', ['assign', 'escalate', 'resolve']);
  const next = req.action === 'escalate' ? (req.queue === 'L1_ui' ? 'L2_api_data' : 'L3_engine_db') : req.queue;
  return { ticket_id: req.ticket_id, queue: next, action: req.action, triaged_at: new Date().toISOString() };
}

function t315_e3_sla_breach_check(req) {
  ensureStr(req.tenant_id, 'tid'); ensureEnum(req.severity, 'sv', ['sev1', 'sev2', 'sev3']);
  ensureNum(req.opened_minutes_ago, 'mins');
  const breached = req.opened_minutes_ago > SLA_MIN[req.severity];
  return { breached, sla_limit: SLA_MIN[req.severity], overage_minutes: breached ? req.opened_minutes_ago - SLA_MIN[req.severity] : 0 };
}

function t315_e4_kb_search_suggest(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.query_text, 'q');
  const kb = [
    { k: 'login failed', a: 'reset password → check account lockout' },
    { k: 'printer not printing ward', a: 'requeue print spooler → check ward printer IP' },
    { k: 'slow report', a: 'check report window peak hours → schedule off-peak' },
  ];
  const q = req.query_text.toLowerCase();
  const hits = kb.filter(x => q.includes(x.k.split(' ')[0]));
  return { suggestions: hits.length ? hits.map(h => h.a) : ['escalate to L2 with screenshot'] };
}

function t315_e5_ticket_close_report(req) {
  ensureStr(req.tenant_id, 'tid');
  if (!Array.isArray(req.tickets)) throw new ValidationError('tickets[] required', 'tickets');
  const bySev = {};
  for (const t of req.tickets) bySev[t.severity] = (bySev[t.severity] || 0) + 1;
  return { closed_total: req.tickets.length, by_severity: bySev, report_at: new Date().toISOString() };
}

function funcs() { return { t315_e1_ticket_open, t315_e2_ticket_triage, t315_e3_sla_breach_check, t315_e4_kb_search_suggest, t315_e5_ticket_close_report }; }
module.exports = { funcs, ValidationError };
