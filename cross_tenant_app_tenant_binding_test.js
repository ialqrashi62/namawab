/**
 * cross_tenant_app_tenant_binding_test.js
 * ==========================================
 * اختبار ربط app.tenant_id بالتطبيق (P0 RLS Binding)
 * يتحقق DB-backed (قاعدة dev المحلية) من أن آلية AsyncLocalStorage + wrapper لـ pool.query
 * تضبط app.tenant_id بشكل صحيح لكل طلب، دون تسرّب بين الطلبات، وعلى مسار pool.connect أيضاً.
 *
 * ملاحظة: قاعدة dev المحلية تتصل كـ superuser (يتجاوز RLS)، لذا يثبت هذا الاختبار آلية الربط
 * (قيمة app.tenant_id) لا إنفاذ RLS نفسه — إنفاذ RLS يُثبَت على الإنتاج بمستخدم التطبيق (Gate 4).
 *
 * الاستخدام: node cross_tenant_app_tenant_binding_test.js
 */
const { pool, runWithTenant, getCurrentTenantId, tenantStore } = require('./db_postgres');

const RED = '\x1b[31m', GREEN = '\x1b[32m', BLUE = '\x1b[34m', RESET = '\x1b[0m', BOLD = '\x1b[1m';
let passed = 0, failed = 0; const failures = [];
function assert(cond, name, details = '') {
    if (cond) { console.log(`  ${GREEN}✅ PASS${RESET} — ${name}`); passed++; }
    else { console.log(`  ${RED}❌ FAIL${RESET} — ${name}${details ? ' | ' + details : ''}`); failed++; failures.push(name); }
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function readGuc() {
    const r = await pool.query("SELECT current_setting('app.tenant_id', true) AS t");
    return r.rows[0].t;
}

(async () => {
    console.log(`\n${BOLD}${BLUE}===== App Tenant Binding Test (P0 RLS Wiring) =====${RESET}\n`);

    // 1) بدون سياق → app.tenant_id فارغ (السلوك الأصلي، لا GUC)
    const noCtx = await readGuc();
    assert(!noCtx, 'بدون سياق مستأجر: app.tenant_id فارغ (لا ضبط)', `got="${noCtx}"`);

    // 2) داخل runWithTenant: ALS + pool.query يضبطان السياق
    await runWithTenant({ tenantId: 7 }, async () => {
        assert(getCurrentTenantId() === 7, 'getCurrentTenantId يعيد 7 داخل السياق');
        const v = await readGuc();
        assert(v === '7', 'pool.query يضبط app.tenant_id=7 على الاتصال', `got="${v}"`);
    });

    // 3) بعد الخروج من السياق: لا تسرّب (إعادة ضبط)
    const afterCtx = await readGuc();
    assert(!afterCtx, 'بعد السياق: app.tenant_id أُعيد ضبطه (لا تسرّب)', `got="${afterCtx}"`);

    // 4) سياقان متتاليان مختلفان لا يتداخلان
    let s1, s2;
    await runWithTenant({ tenantId: 1 }, async () => { s1 = await readGuc(); });
    await runWithTenant({ tenantId: 2 }, async () => { s2 = await readGuc(); });
    assert(s1 === '1' && s2 === '2', 'سياقان متتاليان معزولان (1 ثم 2)', `s1=${s1} s2=${s2}`);

    // 5) سياقات متزامنة معزولة (لا تسرّب بين الطلبات المتوازية)
    const res = await Promise.all([
        runWithTenant({ tenantId: 11 }, async () => { await sleep(30); return readGuc(); }),
        runWithTenant({ tenantId: 22 }, async () => { await sleep(10); return readGuc(); }),
        runWithTenant({ tenantId: 33 }, async () => { return readGuc(); }),
    ]);
    assert(res[0] === '11' && res[1] === '22' && res[2] === '33',
        'سياقات متزامنة معزولة (11/22/33 بلا تداخل)', `got=${JSON.stringify(res)}`);

    // 6) مسار pool.connect (نمط معاملة الإفراغ): SET LOCAL يضبط السياق داخل المعاملة
    await runWithTenant({ tenantId: 5 }, async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query("SELECT set_config('app.tenant_id', $1, true)", ['5']);
            const r = await client.query("SELECT current_setting('app.tenant_id', true) AS t");
            assert(r.rows[0].t === '5', 'pool.connect + SET LOCAL يضبط app.tenant_id=5 داخل المعاملة', `got="${r.rows[0].t}"`);
            await client.query('COMMIT');
        } finally { client.release(); }
    });

    // 7) بعد الإفراج عن اتصال المعاملة: لا تسرّب لاستعلام لاحق
    const afterTxn = await readGuc();
    assert(!afterTxn, 'بعد معاملة pool.connect: لا تسرّب للسياق', `got="${afterTxn}"`);

    // 8) قيمة tenantId غير رقمية/صفرية لا تُفعّل الضبط (حماية)
    await runWithTenant({ tenantId: null }, async () => {
        const v = await readGuc();
        assert(!v, 'tenantId=null لا يضبط السياق (يستخدم المسار الأصلي)', `got="${v}"`);
    });

    console.log(`\n${BOLD}النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed ? RED : GREEN}${failed} FAIL${RESET}\n`);
    await pool.end();
    if (failed) { failures.forEach(f => console.log(`${RED} - ${f}${RESET}`)); process.exit(1); }
    process.exit(0);
})().catch(e => { console.error('ERR', e.message); process.exit(2); });
