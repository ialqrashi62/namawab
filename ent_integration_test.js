/**
 * ent_integration_test.js — Integration test for the ENT module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3016;
const TEST_USERNAME = 'ent_doctor';
const TEST_PASSWORD = 'ENT_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING ENT MODULE INTEGRATION TESTS ---');

    const patientId = 9973;
    const doctorUserId = 9974;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM audiogram_records WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'ENT Test Patient', 'مريض فحص الأذن']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. ENT Specialist', 'Doctor', 'Otolaryngology', '["patients", "prescriptions"]']
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

        // 1. Test POST /api/ent/audiograms (Create audiogram)
        console.log('Testing create audiogram...');
        const createRes = await makeRequest('POST', '/api/ent/audiograms', {
            patient_id: patientId,
            right_ac_250: 10,
            right_ac_500: 15,
            right_ac_1000: 20,
            right_ac_2000: 20,
            right_ac_4000: 25,
            right_ac_8000: 25,
            left_ac_250: 5,
            left_ac_500: 10,
            left_ac_1000: 15,
            left_ac_2000: 15,
            left_ac_4000: 20,
            left_ac_8000: 20,
            tympanometry_right: 'Type A',
            tympanometry_left: 'Type A',
            otoscopy_right: 'Tympanic membrane intact',
            otoscopy_left: 'Tympanic membrane intact',
            interpretation: 'Normal hearing bilaterally'
        }, { 'Cookie': cookie });

        assert.strictEqual(createRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(createRes.body.success, true, 'Should return success true');
        assert.ok(createRes.body.id, 'Should return record ID');
        const recordId = createRes.body.id;
        console.log(`✓ Audiogram created successfully. ID: ${recordId}`);

        // 2. Test GET /api/ent/audiograms/patient/:patient_id
        console.log('Testing get patient audiograms...');
        const getRes = await makeRequest('GET', `/api/ent/audiograms/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(getRes.body.length, 1, 'Should return exactly 1 record');
        assert.strictEqual(getRes.body[0].id, recordId, 'Record ID should match');
        assert.strictEqual(parseInt(getRes.body[0].right_ac_500), 15, 'Right AC 500 should match');
        assert.strictEqual(parseInt(getRes.body[0].left_ac_1000), 15, 'Left AC 1000 should match');
        assert.strictEqual(getRes.body[0].tympanometry_right, 'Type A', 'Tympanometry should match');
        assert.strictEqual(getRes.body[0].otoscopy_right, 'Tympanic membrane intact', 'Otoscopy should match');
        console.log('✓ Patient audiograms retrieved successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM audiogram_records WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ ENT Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
