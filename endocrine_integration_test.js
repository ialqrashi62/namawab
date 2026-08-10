/**
 * endocrine_integration_test.js — Integration test for the Endocrinology module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3012;
const TEST_USERNAME = 'endocrine_doctor';
const TEST_PASSWORD = 'ENDOCRINE_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING ENDOCRINOLOGY MODULE INTEGRATION TESTS ---');

    const patientId = 9985;
    const doctorUserId = 9986;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM diabetes_glucose_logs WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM insulin_regimens WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Endocrine Test Patient', 'مريض فحص الغدد']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Endocrine Consultant', 'Doctor', 'Endocrinology', '["patients", "prescriptions"]']
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

        // 1. Test POST /api/endocrine/glucose (Create glucose log)
        console.log('Testing create glucose log...');
        const glucoseCreateRes = await makeRequest('POST', '/api/endocrine/glucose', {
            patient_id: patientId,
            glucose_value: 120.5,
            log_type: 'Fasting',
            notes: 'Fasting blood sugar'
        }, { 'Cookie': cookie });

        assert.strictEqual(glucoseCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(glucoseCreateRes.body.success, true, 'Should return success true');
        assert.ok(glucoseCreateRes.body.id, 'Should return glucose log ID');
        const glucoseLogId = glucoseCreateRes.body.id;
        console.log(`✓ Glucose log created successfully. ID: ${glucoseLogId}`);

        // 2. Test GET /api/endocrine/glucose/patient/:patient_id
        console.log('Testing get patient glucose logs...');
        const glucoseGetRes = await makeRequest('GET', `/api/endocrine/glucose/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(glucoseGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(glucoseGetRes.body.length, 1, 'Should return exactly 1 glucose log');
        assert.strictEqual(glucoseGetRes.body[0].id, glucoseLogId, 'Glucose log ID should match');
        assert.strictEqual(parseFloat(glucoseGetRes.body[0].glucose_value), 120.5, 'Glucose value should match');
        console.log('✓ Patient glucose logs retrieved successfully.');

        // 3. Test POST /api/endocrine/insulin (Create insulin regimen)
        console.log('Testing prescribe insulin regimen...');
        const insulinCreateRes = await makeRequest('POST', '/api/endocrine/insulin', {
            patient_id: patientId,
            insulin_type: 'Long-acting (Lantus)',
            dosage: '10 units at bedtime'
        }, { 'Cookie': cookie });

        assert.strictEqual(insulinCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(insulinCreateRes.body.success, true, 'Should return success true');
        assert.ok(insulinCreateRes.body.id, 'Should return insulin regimen ID');
        const insulinId = insulinCreateRes.body.id;
        console.log(`✓ Insulin regimen prescribed successfully. ID: ${insulinId}`);

        // 4. Test GET /api/endocrine/insulin/patient/:patient_id
        console.log('Testing get patient active insulin regimens...');
        const insulinGetRes = await makeRequest('GET', `/api/endocrine/insulin/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(insulinGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(insulinGetRes.body.length, 1, 'Should return exactly 1 active insulin regimen');
        assert.strictEqual(insulinGetRes.body[0].id, insulinId, 'Insulin regimen ID should match');
        assert.strictEqual(insulinGetRes.body[0].is_active, true, 'Insulin regimen should be active');
        console.log('✓ Patient active insulin regimens retrieved successfully.');

        // 5. Test PUT /api/endocrine/insulin/:id/deactivate (Deactivate insulin regimen)
        console.log('Testing deactivate insulin regimen...');
        const insulinDeactivateRes = await makeRequest('PUT', `/api/endocrine/insulin/${insulinId}/deactivate`, null, { 'Cookie': cookie });
        assert.strictEqual(insulinDeactivateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(insulinDeactivateRes.body.success, true, 'Should return success true');
        console.log('✓ Insulin regimen deactivated successfully.');

        // 6. Verify insulin regimen is no longer returned in active list
        console.log('Verifying active insulin regimens are empty...');
        const insulinVerifyRes = await makeRequest('GET', `/api/endocrine/insulin/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(insulinVerifyRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(insulinVerifyRes.body.length, 0, 'Should return 0 active insulin regimens');
        console.log('✓ Insulin regimen deactivation verified successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM diabetes_glucose_logs WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM insulin_regimens WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Endocrinology Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
