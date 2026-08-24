// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeVatHelpers({ pool }) {
    async function calcVAT(patientId) {
        if (!patientId) return { rate: 0, vatAmount: 0, applyVAT: false };
        const p = (await pool.query('SELECT nationality FROM patients WHERE id=$1', [patientId])).rows[0];
        const nat = (p && p.nationality) || '';
        const isSaudi = nat === 'سعودي' || nat.toLowerCase() === 'saudi';
        return { rate: isSaudi ? 0 : 0.15, applyVAT: !isSaudi };
    }
    function addVAT(amount, vatRate) {
        const vat = Math.round(amount * vatRate * 100) / 100;
        return { total: Math.round((amount + vat) * 100) / 100, vatAmount: vat };
    }
    return { calcVAT, addVAT };
};
