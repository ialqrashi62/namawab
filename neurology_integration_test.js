/**
 * neurology_integration_test.js — Integration test for the Neurology module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3013;
const TEST_USERNAME = 'neuro_doctor';
const TEST_PASSWORD = 'NEURO_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING NEUROLOGY MODULE INTEGRATION TESTS ---');

    const patientId = 9995;
    const doctorUserId = 9996;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM neurology_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Neuro Test Patient', 'مريض فحص الأعصاب']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Neuro Specialist', 'Doctor', 'Neurology', '["patients", "prescriptions"]']
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

        // 1. Test POST /api/neurology/assessments (Create assessment)
        console.log('Testing create neurology assessment...');
        const neuroCreateRes = await makeRequest('POST', '/api/neurology/assessments', {
            patient_id: patientId,
            gcs_eye: 4,
            gcs_verbal: 5,
            gcs_motor: 6,
            nihss_score: 3,
            reflexes_status: 'Normal',
            notes: 'Neurological status stable.'
        }, { 'Cookie': cookie });

        assert.strictEqual(neuroCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(neuroCreateRes.body.success, true, 'Should return success true');
        assert.ok(neuroCreateRes.body.id, 'Should return assessment ID');
        const assessmentId = neuroCreateRes.body.id;
        console.log(`✓ Neurology assessment created successfully. ID: ${assessmentId}`);

        // 2. Test GET /api/neurology/assessments/patient/:patient_id
        console.log('Testing get patient neurology assessments...');
        const neuroGetRes = await makeRequest('GET', `/api/neurology/assessments/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(neuroGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(neuroGetRes.body.length, 1, 'Should return exactly 1 assessment');
        assert.strictEqual(neuroGetRes.body[0].id, assessmentId, 'Assessment ID should match');
        assert.strictEqual(parseInt(neuroGetRes.body[0].gcs_eye), 4, 'GCS eye should match');
        assert.strictEqual(parseInt(neuroGetRes.body[0].gcs_verbal), 5, 'GCS verbal should match');
        assert.strictEqual(parseInt(neuroGetRes.body[0].gcs_motor), 6, 'GCS motor should match');
        assert.strictEqual(parseInt(neuroGetRes.body[0].gcs_total_score), 15, 'GCS total should be 15');
        assert.strictEqual(parseInt(neuroGetRes.body[0].nihss_score), 3, 'NIHSS score should match');
        assert.strictEqual(neuroGetRes.body[0].reflexes_status, 'Normal', 'Reflexes should match');
        console.log('✓ Patient neurology assessments retrieved successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM neurology_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Neurology Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
