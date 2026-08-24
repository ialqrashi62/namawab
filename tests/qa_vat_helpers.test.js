// QA smoke: vatHelpers extraction — pure math + mocked pool
const assert = require('assert');
const makeVatHelpers = require('../lib/billing/vatHelpers');

const { addVAT } = makeVatHelpers({ pool: null });
const mkPool = (nationality) => ({ query: async () => ({ rows: [{ nationality }] }) });

(async () => {
    // 1. addVAT rounding (15%)
    assert.deepStrictEqual(addVAT(100, 0.15), { total: 115, vatAmount: 15 });
    assert.deepStrictEqual(addVAT(33.33, 0.15), { total: 38.33, vatAmount: 5 });   // 4.9995 -> 5
    assert.deepStrictEqual(addVAT(0, 0.15), { total: 0, vatAmount: 0 });
    assert.deepStrictEqual(addVAT(50, 0), { total: 50, vatAmount: 0 });

    // 2. guard: no patientId -> zero VAT
    const h0 = makeVatHelpers({ pool: mkPool('سعودي') });
    assert.deepStrictEqual(await h0.calcVAT(null), { rate: 0, vatAmount: 0, applyVAT: false });

    // 3. Saudi (ar/en) -> rate 0
    assert.strictEqual((await h0.calcVAT(1)).rate, 0);
    const h1 = makeVatHelpers({ pool: mkPool('SAUDI') });
    assert.strictEqual((await h1.calcVAT(1)).applyVAT, false);

    // 4. Non-Saudi -> 15%
    const h2 = makeVatHelpers({ pool: mkPool('Egyptian') });
    const r = await h2.calcVAT(2);
    assert.strictEqual(r.rate, 0.15); assert.ok(r.applyVAT);

    // 5. Missing row / empty nationality -> treated as non-Saudi
    const h3 = makeVatHelpers({ pool: { query: async () => ({ rows: [] }) } });
    assert.strictEqual((await h3.calcVAT(3)).rate, 0.15);

    console.log('QA PASS: 5/5 groups (rounding, guard, saudi-ar/en, non-saudi, missing-row)');
})().catch(e => { console.error('QA FAIL:', e.message); process.exit(1); });
