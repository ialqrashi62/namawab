// billing_integrity.js — PHASE 1 C-2/C-3 server-side billing integrity (pure, testable).
// No DB, no Express. Functions throw Error objects carrying `.statusCode` (400/403) so the
// caller can translate them into HTTP responses. Money is treated as SAR with 2 decimals.

// Per-role discount cap expressed as a PERCENT of the gross (pre-discount) amount.
// Unknown roles get an implicit 0% cap (fail closed).
const MAX_DISCOUNT_BY_ROLE = { admin: 100, manager: 50, cashier: 10, receptionist: 10, doctor: 20 };

function badRequest(msg) { const e = new Error(msg); e.statusCode = 400; return e; }
function forbidden(msg) { const e = new Error(msg); e.statusCode = 403; return e; }

// parseMoney: coerce a client-supplied monetary value and FAIL CLOSED on anything unsafe.
// Rejects NaN / Infinity / non-numeric / negative / absurdly large values. Never silently
// coerces to 0. Returns a Number rounded to 2 decimals to avoid float drift.
function parseMoney(v, opts = {}) {
    const { field = 'amount', allowZero = true, max = 1e9 } = opts;
    const n = (typeof v === 'number') ? v : (v === '' || v === null || v === undefined ? NaN : Number(v));
    if (!Number.isFinite(n)) throw badRequest(`Invalid ${field}: must be a finite number`);
    if (n < 0) throw badRequest(`Invalid ${field}: must not be negative`);
    if (!allowZero && n === 0) throw badRequest(`Invalid ${field}: must be greater than zero`);
    if (n > max) throw badRequest(`Invalid ${field}: exceeds maximum allowed`);
    return Math.round(n * 100) / 100;
}

// enforceDiscountCap: discount (absolute SAR) must not exceed the caller role's % cap of the
// gross amount. Throws 403 on violation, 400 on an invalid gross / over-100% discount. No-op
// when the discount is zero/negative-after-parse.
function enforceDiscountCap(role, discountAmount, grossAmount) {
    if (!discountAmount || discountAmount <= 0) return;
    const r = String(role || '').toLowerCase();
    const capPct = Object.prototype.hasOwnProperty.call(MAX_DISCOUNT_BY_ROLE, r) ? MAX_DISCOUNT_BY_ROLE[r] : 0;
    if (!grossAmount || grossAmount <= 0) throw badRequest('Discount requires a positive invoice amount');
    if (discountAmount > grossAmount) throw badRequest('Discount cannot exceed the invoice amount');
    const pct = (discountAmount / grossAmount) * 100;
    if (pct > capPct + 1e-6) {
        throw forbidden(`Discount ${pct.toFixed(1)}% exceeds the ${capPct}% limit for role '${role || 'unknown'}'`);
    }
}

module.exports = { MAX_DISCOUNT_BY_ROLE, parseMoney, enforceDiscountCap };
