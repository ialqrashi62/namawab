// filepath: tier320_hdtix_1501_engine.js
// TIER320_HDTIX-1501: HELPDESK TICKETS (pure, no db)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }

const SLA_MINUTES = { sev1: 15, sev2: 120, sev3: 480 };
const QUEUES = ['L1_ui', 'L2_api_data', 'L3_engine_db'];

function validate_open(req) {
  ensureStr(req.tenant_id, 'tenant_id');
  ensureStr(req.requester, 'requester');
  ensureEnum(req.severity, 'severity', ['sev1', 'sev2', 'sev3']);
  ensureStr(req.subject, 'subject');
  const sla_due_minutes = SLA_MINUTES[req.severity];
  return { tenant_id: req.tenant_id, requester: req.requester, severity: req.severity, subject: req.subject, sla_due_minutes };
}

function validate_triage(req) {
  if (!/^\d+$/.test(String(req.ticket_id))) throw new ValidationError('ticket_id must be int-like', 'ticket_id');
  ensureStr(String(req.ticket_id), 'ticket_id');
  ensureEnum(req.queue, 'queue', QUEUES);
  ensureEnum(req.action, 'action', ['assign', 'escalate', 'resolve']);
  let next_queue = req.queue;
  if (req.action === 'escalate') {
    const idx = QUEUES.indexOf(req.queue);
    next_queue = QUEUES[Math.min(idx + 1, QUEUES.length - 1)];
  }
  return { ticket_id: String(req.ticket_id), queue: req.queue, action: req.action, next_queue };
}

function funcs() { return { validate_open, validate_triage }; }
module.exports = { funcs, ValidationError };
