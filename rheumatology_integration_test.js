/**
 * rheumatology_integration_test.js — Integration test for the Rheumatology module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3012;
const TEST_USERNAME = 'rheum_doctor';
const TEST_PASSWORD = 'RHEUM_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING RHEUMATOLOGY MODULE INTEGRATION TESTS ---');

    const patientId = 9991;
    const doctorUserId = 9992;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM joint_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Rheum Test Patient', 'مريض فحص الروماتيزم']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Rheum Consultant', 'Doctor', 'Rheumatology', '["patients", "prescriptions"]']
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

        // 1. Test POST /api/rheumatology/joints (Create joint assessment)
        console.log('Testing create joint assessment...');
        const jointCreateRes = await makeRequest('POST', '/api/rheumatology/joints', {
            patient_id: patientId,
            tender_joint_count: 4,
            swollen_joint_count: 2,
            vas_pain: 45,
            das28_score: 2.15,
            notes: 'Rheumatoid arthritis evaluation.'
        }, { 'Cookie': cookie });

        assert.strictEqual(jointCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(jointCreateRes.body.success, true, 'Should return success true');
        assert.ok(jointCreateRes.body.id, 'Should return joint assessment ID');
        const assessmentId = jointCreateRes.body.id;
        console.log(`✓ Joint assessment created successfully. ID: ${assessmentId}`);

        // 2. Test GET /api/rheumatology/joints/patient/:patient_id
        console.log('Testing get patient joint assessments...');
        const jointGetRes = await makeRequest('GET', `/api/rheumatology/joints/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(jointGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(jointGetRes.body.length, 1, 'Should return exactly 1 joint assessment');
        assert.strictEqual(jointGetRes.body[0].id, assessmentId, 'Joint assessment ID should match');
        assert.strictEqual(parseInt(jointGetRes.body[0].tender_joint_count), 4, 'Tender joint count should match');
        assert.strictEqual(parseInt(jointGetRes.body[0].swollen_joint_count), 2, 'Swollen joint count should match');
        assert.strictEqual(parseInt(jointGetRes.body[0].vas_pain), 45, 'VAS pain should match');
        assert.strictEqual(parseFloat(jointGetRes.body[0].das28_score), 2.15, 'DAS28 score should match');
        console.log('✓ Patient joint assessments retrieved successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM joint_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Rheumatology Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
