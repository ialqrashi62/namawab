/**
 * plastic_burns_integration_test.js — Integration test for the Plastic & Burns module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3017;
const TEST_USERNAME = 'burn_doctor';
const TEST_PASSWORD = 'BURN_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING PLASTIC & BURNS MODULE INTEGRATION TESTS ---');

    const patientId = 9983;
    const doctorUserId = 9984;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM burn_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM clinical_photos_meta WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Burn Test Patient', 'مريض الحروق']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Burn Specialist', 'Doctor', 'PlasticSurgery', '["patients", "prescriptions"]']
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

        // 1. Test POST /api/plastic-burns/assessments (Create burn assessment)
        console.log('Testing create burn assessment...');
        const createRes = await makeRequest('POST', '/api/plastic-burns/assessments', {
            patient_id: patientId,
            weight_kg: 70,
            head_percent: 4.5,
            torso_front_percent: 18,
            torso_back_percent: 9,
            left_arm_percent: 4.5,
            right_arm_percent: 0,
            left_leg_percent: 0,
            right_leg_percent: 0,
            perineum_percent: 0,
            tbsa_percent: 36,
            parkland_fluid_ml: 10080,
            fluid_first_8h_ml: 5040,
            fluid_next_16h_ml: 5040,
            clinical_notes: 'Partial thickness burns on chest and left arm'
        }, { 'Cookie': cookie });

        assert.strictEqual(createRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(createRes.body.success, true, 'Should return success true');
        assert.ok(createRes.body.id, 'Should return record ID');
        const assessmentId = createRes.body.id;
        console.log(`✓ Burn assessment created successfully. ID: ${assessmentId}`);

        // 2. Test GET /api/plastic-burns/assessments/patient/:patient_id
        console.log('Testing get patient burn assessments...');
        const getRes = await makeRequest('GET', `/api/plastic-burns/assessments/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(getRes.body.length, 1, 'Should return exactly 1 record');
        assert.strictEqual(getRes.body[0].id, assessmentId, 'Record ID should match');
        assert.strictEqual(parseFloat(getRes.body[0].tbsa_percent), 36, 'TBSA percentage should match');
        assert.strictEqual(parseFloat(getRes.body[0].parkland_fluid_ml), 10080, 'Parkland fluid should match');
        console.log('✓ Patient burn assessments retrieved successfully.');

        // 3. Test POST /api/plastic-burns/photos (Create photo meta)
        console.log('Testing register photo metadata...');
        const photoCreateRes = await makeRequest('POST', '/api/plastic-burns/photos', {
            patient_id: patientId,
            body_region: 'Chest',
            description: 'Pre-debridement photo ref #PB-984',
            is_confidential: true
        }, { 'Cookie': cookie });

        assert.strictEqual(photoCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(photoCreateRes.body.success, true, 'Should return success true');
        assert.ok(photoCreateRes.body.id, 'Should return photo record ID');
        const photoId = photoCreateRes.body.id;
        console.log(`✓ Photo metadata registered successfully. ID: ${photoId}`);

        // 4. Test GET /api/plastic-burns/photos/patient/:patient_id
        console.log('Testing get patient photo registry...');
        const getPhotoRes = await makeRequest('GET', `/api/plastic-burns/photos/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getPhotoRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(getPhotoRes.body.length, 1, 'Should return exactly 1 record');
        assert.strictEqual(getPhotoRes.body[0].id, photoId, 'Photo ID should match');
        assert.strictEqual(getPhotoRes.body[0].body_region, 'Chest', 'Body region should match');
        console.log('✓ Patient photo registry retrieved successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM burn_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM clinical_photos_meta WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Plastic & Burns Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
