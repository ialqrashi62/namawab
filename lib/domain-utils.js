// Extracted from server.js (behavior-preserving).
function e17IsValidIncidentTransition(from, to) {
    const allowed = E17_INCIDENT_TRANSITIONS[from];
    return Array.isArray(allowed) && allowed.includes(to);
}

function e17IsValidCapaTransition(from, to) {
    const allowed = E17_CAPA_TRANSITIONS[from];
    return Array.isArray(allowed) && allowed.includes(to);
}

function e17ComputeRisk(likelihood, impact) {
    const L = Math.min(5, Math.max(1, parseInt(likelihood, 10) || 1));
    const I = Math.min(5, Math.max(1, parseInt(impact, 10) || 1));
    const score = L * I;
    let level = 'Low';
    if (score >= 15) level = 'Extreme';
    else if (score >= 10) level = 'High';
    else if (score >= 5) level = 'Medium';
    return { likelihood: L, impact: I, score, level };
}

function e11IntId(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

function e11Money(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return null;
    return e11Engine.round2(n);
}

function e11Err(res, e) {
    if (e && e.e11Status) return res.status(e.e11Status).json({ error: e.message });
    console.error('E11 insurance error:', e && e.message);
    return res.status(500).json({ error: 'Server error' });
}

function e11NphiesEnabled() {
    return /^(1|true|on|yes)$/i.test(String(process.env.NPHIES_ENABLED || '').trim());
}

function e10PostingEnabled() {
    return /^(1|true|on|yes)$/i.test(String(process.env.ACCOUNTING_POSTING_ENABLED || '').trim());
}

function e10ZatcaEnabled() {
    return /^(1|true|on|yes)$/i.test(String(process.env.ZATCA_ENABLED || '').trim());
}

function e10IntId(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

function e10Err(res, e) {
    if (e && e.e10Status) return res.status(e.e10Status).json({ error: e.message });
    console.error('E10 finance error:', e && e.message);
    return res.status(500).json({ error: 'Server error' });
}

function e12IntId(v) {
    const n = Number(v);
    return Number.isInteger(n) && n > 0 ? n : null;
}

function e12NormalizeStatus(s) {
    if (s === 'In Progress') return 'InProgress';
    return s;
}

function e12IsValidSurgeryTransition(fromRaw, toRaw) {
    const from = fromRaw || 'Scheduled';
    const to = e12NormalizeStatus(toRaw);
    if (!E12_SURGERY_STATUS.includes(to)) return false;
    const allowed = E12_SURGERY_TRANSITIONS[from] || E12_SURGERY_TRANSITIONS[e12NormalizeStatus(from)] || [];
    return allowed.includes(to);
}

function e12WhoNextState(currentState, phase) {
    // Returns { ok, newState, error }. Enforces strict sequential ordering.
    const target = E12_WHO_PHASE_TO_STATE[phase];
    if (!target) return { ok: false, error: 'Unknown checklist phase' };
    const curIdx = E12_WHO_ORDER.indexOf(currentState || 'Not Started');
    const tgtIdx = E12_WHO_ORDER.indexOf(target);
    if (tgtIdx !== curIdx + 1) {
        return { ok: false, error: `Invalid checklist phase order: cannot move from "${currentState || 'Not Started'}" to "${target}"` };
    }
    // Completing Sign-Out advances the state to Completed.
    const newState = (target === 'Sign-Out') ? 'Completed' : target;
    return { ok: true, newState };
}

function e8CanTransitionBed(from, to) {
    if (!E8_BED_STATUSES.includes(to)) return false;
    const f = from || 'Available';
    if (f === to) return true; // idempotent no-op allowed
    return (E8_BED_TRANSITIONS[f] || []).includes(to);
}

function e8IntId(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

function e9IntId(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

function isHighAlertMed(name) {
    const n = String(name || '').trim().toLowerCase();
    if (!n) return false;
    return MAR_HIGH_ALERT.some(h => n.includes(h));
}

function marNorm(s) { return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' '); }

function e14IntId(v) { const n = parseInt(v, 10); return Number.isInteger(n) ? n : null; }

module.exports = { e17IsValidIncidentTransition, e17IsValidCapaTransition, e17ComputeRisk, e11IntId, e11Money, e11Err, e11NphiesEnabled, e10PostingEnabled, e10ZatcaEnabled, e10IntId, e10Err, e12IntId, e12NormalizeStatus, e12IsValidSurgeryTransition, e12WhoNextState, e8CanTransitionBed, e8IntId, e9IntId, e14IntId, isHighAlertMed, marNorm };
