/**
 * nephrology_integration_test.js — Integration test for the Nephrology module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3014;
const TEST_USERNAME = 'nephro_doctor';
const TEST_PASSWORD = 'NEPHRO_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING NEPHROLOGY MODULE INTEGRATION TESTS ---');

    const patientId = 9993;
    const doctorUserId = 9994;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM dialysis_sessions WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Nephro Test Patient', 'مريض فحص الكلى']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Nephro Specialist', 'Doctor', 'Nephrology', '["patients", "prescriptions"]']
        );

        // Associate doctor with tenant 1
        await client.query(
            'INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1, 1, true)',
            [doctorUserId]
        );

        console.log('Spawning test server...');
        serverProcess = spawn('node', ['server.js'], {
            env: { ...process.env, PORT: TEST_PORT, NODE_ENV: 'staging', SKIP_DB_INIT: 'true' },
            stdio: 'inherit'
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

        // 1. Test POST /api/nephrology/dialysis (Create session)
        console.log('Testing create dialysis session...');
        const createRes = await makeRequest('POST', '/api/nephrology/dialysis', {
            patient_id: patientId,
            dialysis_type: 'Hemodialysis',
            duration_hours: 4.0,
            ultrafiltration_target_liters: 2.5,
            blood_flow_rate_ml_min: 300,
            dialysate_flow_rate_ml_min: 500,
            pre_weight_kg: 75.2,
            post_weight_kg: 72.8,
            notes: 'AV fistula working well.'
        }, { 'Cookie': cookie });

        assert.strictEqual(createRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(createRes.body.success, true, 'Should return success true');
        assert.ok(createRes.body.id, 'Should return session ID');
        const sessionId = createRes.body.id;
        console.log(`✓ Dialysis session created successfully. ID: ${sessionId}`);

        // 2. Test GET /api/nephrology/dialysis/patient/:patient_id
        console.log('Testing get patient dialysis sessions...');
        const getRes = await makeRequest('GET', `/api/nephrology/dialysis/patient/${patientId}`, null, { 'Cookie': cookie });
        console.log('DIAGNOSTIC - GET RESPONSE BODY:', getRes.body[0]);
        assert.strictEqual(getRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(getRes.body.length, 1, 'Should return exactly 1 session');
        assert.strictEqual(getRes.body[0].id, sessionId, 'Session ID should match');
        assert.strictEqual(getRes.body[0].dialysis_type, 'Hemodialysis', 'Type should match');
        assert.strictEqual(parseFloat(getRes.body[0].duration_hours), 4.0, 'Duration should match');
        assert.strictEqual(parseFloat(getRes.body[0].ultrafiltration_target_liters), 2.5, 'UF Target should match');
        assert.strictEqual(parseInt(getRes.body[0].blood_flow_rate_ml_min), 300, 'Blood flow should match');
        assert.strictEqual(parseFloat(getRes.body[0].pre_weight_kg), 75.2, 'Pre weight should match');
        assert.strictEqual(parseFloat(getRes.body[0].post_weight_kg), 72.8, 'Post weight should match');
        console.log('✓ Patient dialysis sessions retrieved successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM dialysis_sessions WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Nephrology Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
