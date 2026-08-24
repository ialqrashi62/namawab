// Extracted from server.js (behavior-preserving). Pure helpers, no closures.

function requireAuth(req, res, next) {
    if (req.session && req.session.user) return next();
    res.status(401).json({ error: 'Unauthorized' });
}
const requireCatalogAccess = (req, res, next) => {
    const role = (req.session.user?.role || '').toLowerCase();
    if (['admin', 'manager', 'administrator'].includes(role)) return next();
    return res.status(403).json({ error: 'Access denied. Only Admin/Manager can edit catalog items.' });
};
function sendBillingError(res, e) {
    if (e && e.statusCode) return res.status(e.statusCode).json({ error: e.message });
    console.error('Billing error:', e && e.message);
    return res.status(500).json({ error: 'Server error' });
}

module.exports = { 
requireAuth, requireCatalogAccess, sendBillingError
 };
