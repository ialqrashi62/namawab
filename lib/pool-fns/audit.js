// Extracted from server.js (behavior-preserving). Factory DI for pool-bound helpers.

module.exports = function makePoolFns({ 
pool
 }) {
const CSP_ENFORCE = process.env.CSP_ENFORCE === 'true';   // default false => Content-Security-Policy-Report-Only
// avatar (googleusercontent) + promo video (cloudinary); report-uri points at the sanitized collector below.
// assets, so observe report-uri violations first. img-src/media-src cover the login page's external
// separate approved deploy sets CSP_ENFORCE=true: the SPA still relies on inline handlers/styles + CDN
// CSP mode is controlled by CSP_ENFORCE (default unset -> Report-Only). Enforcing stays OFF until a
// Extra headers not covered by helmet defaults: Permissions-Policy + CSP.
const corsAllowlist = (process.env.CORS_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
// (comma-separated) only if a trusted cross-origin client must call the API with credentials.
// carry no Origin (or a matching one) and never require ACAO. Set CORS_ALLOWED_ORIGINS
    return { 
logAudit
 };
}
