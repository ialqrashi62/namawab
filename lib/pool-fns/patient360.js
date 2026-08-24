// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.

const { getRequestTenantContext } = require('../tenant-context');
const { isOptionalReadSchemaError } = require('../read-fallback');

module.exports = function makePoolFns({ 
pool
 }) {
// ===== Gate 3: HTTP perimeter hardening (CODE-ONLY; activates on next PM2 restart) =====
// CORS allowlist: the SPA is same-origin and needs NO cross-origin CORS. Same-origin requests
// carry no Origin (or a matching one) and never require ACAO. Set CORS_ALLOWED_ORIGINS
// (comma-separated) only if a trusted cross-origin client must call the API with credentials.
const corsAllowlist = (process.env.CORS_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
// Extra headers not covered by helmet defaults: Permissions-Policy + CSP.
// CSP mode is controlled by CSP_ENFORCE (default unset -> Report-Only). Enforcing stays OFF until a
// separate approved deploy sets CSP_ENFORCE=true: the SPA still relies on inline handlers/styles + CDN
// assets, so observe report-uri violations first. img-src/media-src cover the login page's external
// avatar (googleusercontent) + promo video (cloudinary); report-uri points at the sanitized collector below.
    return { 
centerPatient360
 };
}
