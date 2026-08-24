// Extracted from server.js (behavior-preserving). Pure helpers, no closures.

function mfaB32Encode(buf) { let bits = 0, val = 0, out = ''; for (const b of buf) { val = (val << 8) | b; bits += 8; while (bits >= 5) { out += MFA_B32[(val >>> (bits - 5)) & 31]; bits -= 5; } } if (bits > 0) out += MFA_B32[(val << (5 - bits)) & 31]; return out; }
function mfaB32Decode(str) { let bits = 0, val = 0; const out = []; for (const c of String(str).replace(/=+$/, '').toUpperCase()) { const idx = MFA_B32.indexOf(c); if (idx < 0) continue; val = (val << 5) | idx; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } } return Buffer.from(out); }
function mfaGenSecret() { return mfaB32Encode(require('crypto').randomBytes(20)); }
function mfaCodeAt(secret, counter) { const key = mfaB32Decode(secret); const buf = Buffer.alloc(8); buf.writeBigUInt64BE(BigInt(counter)); const h = require('crypto').createHmac('sha1', key).update(buf).digest(); const o = h[h.length - 1] & 0xf; const n = ((h[o] & 0x7f) << 24) | ((h[o + 1] & 0xff) << 16) | ((h[o + 2] & 0xff) << 8) | (h[o + 3] & 0xff); return (n % 1000000).toString().padStart(6, '0'); }
function mfaVerify(secret, token, window = 1) { if (!secret || !token) return false; const t = Math.floor(Date.now() / 1000 / 30); const tok = String(token).trim(); for (let i = -window; i <= window; i++) { if (mfaCodeAt(secret, t + i) === tok) return true; } return false; }
function mfaMatchCounter(secret, token, window = 1) { if (!secret || !token) return null; const t = Math.floor(Date.now() / 1000 / 30); const tok = String(token).trim(); for (let i = -window; i <= window; i++) { if (mfaCodeAt(secret, t + i) === tok) return t + i; } return null; }
function mfaConsume(uid, secret, token) {
    const ctr = mfaMatchCounter(secret, token);
    if (ctr === null) return false;
    const last = mfaLastCounter.get(uid);
    if (last !== undefined && ctr <= last) return false;   // replay
    mfaLastCounter.set(uid, ctr);
    return true;
}

module.exports = { 
mfaB32Encode, mfaB32Decode, mfaGenSecret, mfaCodeAt, mfaVerify, mfaMatchCounter, mfaConsume
 };
