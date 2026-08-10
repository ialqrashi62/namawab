/**
 * cardiology_integration_test.js — Integration test for the Cardiology module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3012;
const TEST_USERNAME = 'cardio_doctor';
const TEST_PASSWORD = 'CARDIO_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING CARDIOLOGY MODULE INTEGRATION TESTS ---');

    const patientId = 9981;
    const doctorUserId = 9982;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM cardiology_procedures WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM ecg_records WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Cardiology Test Patient', 'مريض فحص القلب']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Cardio Consultant', 'Doctor', 'Cardiology', '["patients", "prescriptions"]']
        );

        // Associate doctor with tenant 1
        await client.query(
            'INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1, 1, true)',
            [doctorUserId]
        );

        console.log('Spawning test server...');
        serverProcess = spawn('node', ['server.js'], {
            env: { ...process.env, PORT: TEST_PORT, NODE_ENV: 'staging', SKIP_DB_INIT: 'true' }
        });

        // Pipe stdout/stderr for logging
        serverProcess.stdout.on('data', (data) => {
            console.log(`[Server STDOUT] ${data.toString().trim()}`);
        });
        serverProcess.stderr.on('data', (data) => {
            console.error(`[Server STDERR] ${data.toString().trim()}`);
        });

        // Wait 3 seconds for server to boot
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Logging in...');
        const loginRes = await makeRequest('POST', '/api/auth/login', {
            username: TEST_USERNAME,
            password: TEST_PASSWORD
        });

        assert.strictEqual(loginRes.statusCode, 200, 'Login should succeed');
        console.log('✓ Logged in successfully.');

        // Extract session cookie
        const setCookie = loginRes.headers['set-cookie'];
        assert.ok(setCookie, 'Should receive session cookie');
        const cookie = setCookie[0].split(';')[0];

        // 1. Test POST /api/cardiology/procedures (Create procedure report)
        console.log('Testing create cardiology procedure report...');
        const procCreateRes = await makeRequest('POST', '/api/cardiology/procedures', {
            patient_id: patientId,
            procedure_type: 'Echocardiography',
            findings: 'Normal chamber sizes. LVEF 60%. No significant valvular disease.',
            recommendations: 'Follow up in 1 year.'
        }, { 'Cookie': cookie });

        assert.strictEqual(procCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(procCreateRes.body.success, true, 'Should return success true');
        assert.ok(procCreateRes.body.id, 'Should return procedure ID');
        const procedureId = procCreateRes.body.id;
        console.log(`✓ Procedure report created successfully. ID: ${procedureId}`);

        // 2. Test GET /api/cardiology/procedures/patient/:patient_id
        console.log('Testing get patient cardiology procedures...');
        const procGetRes = await makeRequest('GET', `/api/cardiology/procedures/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(procGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(procGetRes.body.length, 1, 'Should return exactly 1 procedure report');
        assert.strictEqual(procGetRes.body[0].id, procedureId, 'Procedure ID should match');
        assert.strictEqual(procGetRes.body[0].procedure_type, 'Echocardiography', 'Procedure type should match');
        console.log('✓ Patient procedure reports retrieved successfully.');

        // 3. Test POST /api/cardiology/ecg (Save ECG record)
        console.log('Testing save ECG record...');
        const ecgCreateRes = await makeRequest('POST', '/api/cardiology/ecg', {
            patient_id: patientId,
            leads_data: { I: [0.1, 0.2, 0.3], II: [0.2, 0.4, 0.6] },
            heart_rate: 72,
            interpretation: 'Normal sinus rhythm.'
        }, { 'Cookie': cookie });

        assert.strictEqual(ecgCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(ecgCreateRes.body.success, true, 'Should return success true');
        assert.ok(ecgCreateRes.body.id, 'Should return ECG record ID');
        const ecgRecordId = ecgCreateRes.body.id;
        console.log(`✓ ECG record saved successfully. ID: ${ecgRecordId}`);

        // 4. Test GET /api/cardiology/ecg/patient/:patient_id
        console.log('Testing get patient ECG records...');
        const ecgGetRes = await makeRequest('GET', `/api/cardiology/ecg/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(ecgGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(ecgGetRes.body.length, 1, 'Should return exactly 1 ECG record');
        assert.strictEqual(ecgGetRes.body[0].id, ecgRecordId, 'ECG ID should match');
        console.log('✓ Patient ECG records retrieved successfully.');

        // 5. Test GET /api/cardiology/ecg/:id
        console.log('Testing get single ECG record...');
        const ecgGetSingleRes = await makeRequest('GET', `/api/cardiology/ecg/${ecgRecordId}`, null, { 'Cookie': cookie });
        assert.strictEqual(ecgGetSingleRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(ecgGetSingleRes.body.id, ecgRecordId, 'ECG ID should match');
        assert.strictEqual(ecgGetSingleRes.body.heart_rate, 72, 'Heart rate should match');
        console.log('✓ Single ECG record retrieved successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM cardiology_procedures WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM ecg_records WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Cardiology Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
