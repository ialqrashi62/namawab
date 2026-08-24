// Extracted from server.js (behavior-preserving).
function isOptionalReadSchemaError(e) {
    return e && (e.code === '42P01' || e.code === '42703');
}

function optionalReadFallback(res, e, fallback = []) {
    if (!isOptionalReadSchemaError(e)) return false;
    return res.json(fallback), true;
}

module.exports = { isOptionalReadSchemaError, optionalReadFallback };
