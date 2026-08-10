/**
 * cds_http_integration_test.js — Integration test for the HTTP CDS gate on POST /api/prescriptions.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3012;
const TEST_USERNAME = 'cds_doctor';
const TEST_PASSWORD = 'CDS_PASSWORD_PLACEHOLDER';

let serverProcess;

function makeRequest(method, path, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : '';
        const req = http.request({
            hostname: 'localhost',
            port: TEST_PORT,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                ...headers
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, headers: res.headers, rawBody: data });
                }
            });
        });
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function runTests() {
    console.log('--- STARTING CDS HTTP INTEGRATION TESTS ---');

    const patientId = 9991;
    const doctorUserId = 9992;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM pharmacy_prescriptions_queue WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM prescriptions WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'CDS Test Patient', 'مريض فحص التنبيهات']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. CDS Analyst', 'Doctor', 'General', '["patients", "prescriptions"]']
        );

        // Associate doctor with tenant 1
        await client.query(
            'INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1, 1, true)',
            [doctorUserId]
        );

    } finally {
        client.release();
    }

    // Start Express server in staging mode
    console.log('Spawning test server...');
    serverProcess = spawn('node', ['server.js'], {
        env: {
            ...process.env,
            NODE_ENV: 'staging',
            PORT: String(TEST_PORT),
            SKIP_DB_INIT: 'true',
            DB_NAME: 'jumanasoft_staging'
        }
    });

    serverProcess.stdout.on('data', (data) => {
        console.log(`[Server STDOUT] ${data}`);
    });
    serverProcess.stderr.on('data', (data) => {
        console.error(`[Server STDERR] ${data}`);
    });

    // Wait for server to boot
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        // 1. Log in to get session cookie
        console.log('Logging in...');
        const loginRes = await makeRequest('POST', '/api/auth/login', {
            username: TEST_USERNAME,
            password: TEST_PASSWORD
        });

        assert.strictEqual(loginRes.statusCode, 200, 'Login should succeed');
        const cookie = loginRes.headers['set-cookie']?.[0]?.split(';')?.[0];
        assert.ok(cookie, 'Should receive session cookie');
        console.log('✓ Logged in successfully.');

        // 2. Add an active drug to the patient's queue (Sildenafil)
        console.log('Adding Sildenafil to patient active meds...');
        const clientDb = await pool.connect();
        try {
            await clientDb.query("SET app.tenant_id = '1'");
            await clientDb.query(
                `INSERT INTO pharmacy_prescriptions_queue (patient_id, doctor_id, prescription_text, medication_name, dosage, status, tenant_id, branch_id)
                 VALUES ($1, $2, $3, $4, $5, 'Pending', 1, 1)`,
                [patientId, doctorUserId, 'Sildenafil 50mg', 'Sildenafil', '50mg']
            );
        } finally {
            clientDb.release();
        }

        // 3. Try to prescribe a conflicting drug (Nitroglycerin) without override reason
        console.log('Prescribing Nitroglycerin (expecting 422 block)...');
        const blockedRes = await makeRequest('POST', '/api/prescriptions', {
            patient_id: patientId,
            medication_name: 'Nitroglycerin',
            dosage: '0.4 mg',
            quantity_per_day: '1',
            frequency: 'Once daily',
            duration: '5 days'
        }, { 'Cookie': cookie });

        assert.strictEqual(blockedRes.statusCode, 422, 'Should return 422 Unprocessable Entity due to drug conflict');
        assert.strictEqual(blockedRes.body.blocked, true, 'Should have blocked: true in response');
        assert.strictEqual(blockedRes.body.requires_override_reason, true, 'Should require override reason');
        console.log('✓ Conflicting prescription blocked with 422 successfully.');

        // 4. Prescribe with override reason
        console.log('Prescribing Nitroglycerin with override reason...');
        const allowedRes = await makeRequest('POST', '/api/prescriptions', {
            patient_id: patientId,
            medication_name: 'Nitroglycerin',
            dosage: '0.4 mg',
            quantity_per_day: '1',
            frequency: 'Once daily',
            duration: '5 days',
            override_reason: 'Patient monitored closely; cardiology approved.'
        }, { 'Cookie': cookie });

        assert.strictEqual(allowedRes.statusCode, 200, 'Prescription with override reason should succeed');
        assert.ok(allowedRes.body.id, 'Should return the created queue item ID');
        console.log('✓ Prescription with override reason succeeded (200 OK).');

        // 5. Verify in DB
        console.log('Verifying database records...');
        const clientCheck = await pool.connect();
        try {
            await clientCheck.query("SET app.tenant_id = '1'");
            const queueItems = (await clientCheck.query('SELECT * FROM pharmacy_prescriptions_queue WHERE patient_id = $1 ORDER BY id DESC', [patientId])).rows;
            assert.strictEqual(queueItems.length, 2, 'Should have 2 items in pharmacy queue');
            assert.strictEqual(queueItems[0].medication_name, 'Nitroglycerin', 'Latest queue item should be Nitroglycerin');

            const legacyPrescriptions = (await clientCheck.query('SELECT * FROM prescriptions WHERE patient_id = $1 ORDER BY id DESC', [patientId])).rows;
            assert.strictEqual(legacyPrescriptions.length, 1, 'Should have 1 item in legacy prescriptions table');
            assert.ok(legacyPrescriptions[0].dosage.includes('Nitroglycerin'), 'Legacy prescription should match');
            console.log('✓ Database verification passed.');
        } finally {
            clientCheck.release();
        }

    } finally {
        // Clean up test data
        console.log('Cleaning up test data...');
        const clientCleanup = await pool.connect();
        try {
            await clientCleanup.query("SET app.tenant_id = '1'");
            await clientCleanup.query('DELETE FROM pharmacy_prescriptions_queue WHERE patient_id = $1', [patientId]);
            await clientCleanup.query('DELETE FROM prescriptions WHERE patient_id = $1', [patientId]);
            await clientCleanup.query('DELETE FROM patients WHERE id = $1', [patientId]);
            await clientCleanup.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
            await clientCleanup.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        } finally {
            clientCleanup.release();
        }

        // Kill test server
        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ CDS HTTP Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
