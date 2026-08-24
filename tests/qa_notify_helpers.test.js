// QA smoke: notifyHelpers extraction — mocked deps, no DB/network
const assert = require('assert');
const makeNotifyHelpers = require('../lib/notifications/notifyHelpers');

const calls = { sms: [], email: [], sql: [] };
const mockPool = {
    query: async (sql, params) => {
        calls.sql.push(sql);
        if (sql.includes('FROM lab_samples')) return { rows: [{ patient_id: 7 }] };
        if (sql.includes('FROM patients')) return { rows: [{ phone: '0500000000' }] };
        if (sql.includes('FROM portal_users')) return { rows: [{ email: 'p@x.com' }] };
        if (sql.includes('FROM system_users')) return { rows: [{ display_name: 'Dr. Test' }] };
        if (sql.includes('FROM hr_employees')) return { rows: [{ phone: '0511111111', email: 'd@x.com' }] };
        return { rows: [] };
    },
};
const deps = {
    pool: mockPool,
    smsService: { sendSMS: async (phone, text, type) => { calls.sms.push({ phone, type }); return true; } },
    emailService: { sendEmail: async (to, subject) => { calls.email.push(to); return true; } },
};
const h = makeNotifyHelpers(deps);

(async () => {
    // 1. exports contract
    for (const k of ['sendLabResultNotification', 'sendDoctorSMS', 'sendRadiologyResultNotification', 'sendPatientEmail', 'sendDoctorEmail'])
        assert.strictEqual(typeof h[k], 'function', k);

    // 2. lab notification flow: resolves patient -> SMS sent + flag updated
    await h.sendLabResultNotification(11, 22, 5);
    assert.ok(calls.sql.some(s => s.includes('SET sms_sent = 1')), 'sms_sent flag');
    assert.strictEqual(calls.sms[0].type, 'LAB_RESULT_READY');
    assert.ok(calls.email.includes('p@x.com'), 'patient emailed');

    // 3. guard clauses (no crash on falsy)
    await h.sendDoctorSMS(null, 'x', 'E');
    await h.sendRadiologyResultNotification(1, null, 5);
    await h.sendPatientEmail(null, 's', '<b/>', 5);

    // 4. doctor SMS via hr lookup
    await h.sendDoctorSMS(3, 'schedule', 'APPT');
    assert.ok(calls.sms.some(c => c.phone === '0511111111'), 'doctor sms');

    console.log('QA PASS: 4/4 groups (contract, lab flow+flag+email, guards, doctor-sms)');
})().catch(e => { console.error('QA FAIL:', e.message); process.exit(1); });
