/**
 * specialties_next_integration_test.js — Integration test for G16, G19, and G20 clinical modules.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3023;
const TEST_USERNAME = 'spec_next_doctor';
const TEST_PASSWORD = 'SPEC_NEXT_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING G16, G19, & G20 MODULE INTEGRATION TESTS ---');

    const patientId = 9987;
    const doctorUserId = 9988;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM cpb_logs WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM pain_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM pediatric_growth_records WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Spec Next Patient', 'مريض التخصصات الجديدة']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Specialist Urologist', 'Doctor', 'Anesthesiology', '["patients", "prescriptions"]']
        );

        // Associate doctor with tenant 1
        await client.query(
            'INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1, 1, true)',
            [doctorUserId]
        );

        console.log('Spawning test server...');
        serverProcess = spawn('node', ['server.js'], {
            env: { ...process.env, PORT: TEST_PORT, NODE_ENV: 'staging', SKIP_DB_INIT: 'true' },
            stdio: 'pipe'
        });

        serverProcess.stdout.on('data', (data) => {
            console.log(`[SERVER] ${data.toString().trim()}`);
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`[SERVER ERR] ${data.toString().trim()}`);
        });

        // Wait 6 seconds for server to boot
        await new Promise(resolve => setTimeout(resolve, 6000));

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

        // 1. Test POST /api/surgery/cpb
        console.log('Testing create CPB log...');
        const cpbRes = await makeRequest('POST', '/api/surgery/cpb', {
            patient_id: patientId,
            pump_time: 120,
            cross_clamp_time: 80,
            flow_rate: 2.55,
            min_temp: 28.5,
            notes: 'Uneventful CPB'
        }, { 'Cookie': cookie });

        assert.strictEqual(cpbRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(cpbRes.body.success, true);
        assert.ok(cpbRes.body.id);
        const cpbId = cpbRes.body.id;
        console.log(`✓ CPB log created. ID: ${cpbId}`);

        // 2. Test GET /api/surgery/cpb/patient/:patient_id
        console.log('Testing get patient CPB logs...');
        const getCpbRes = await makeRequest('GET', `/api/surgery/cpb/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getCpbRes.statusCode, 200);
        assert.strictEqual(getCpbRes.body.length, 1);
        assert.strictEqual(getCpbRes.body[0].id, cpbId);
        assert.strictEqual(getCpbRes.body[0].pump_time, 120);
        assert.strictEqual(parseFloat(getCpbRes.body[0].flow_rate), 2.55);
        console.log('✓ Patient CPB logs retrieved.');

        // 3. Test POST /api/anesthesia/pain
        console.log('Testing create pain assessment...');
        const painRes = await makeRequest('POST', '/api/anesthesia/pain', {
            patient_id: patientId,
            pain_score_vas: 6,
            pca_pump_used: true,
            pca_demands: 15,
            pca_deliveries: 12,
            notes: 'Epidural functioning'
        }, { 'Cookie': cookie });

        assert.strictEqual(painRes.statusCode, 200);
        assert.ok(painRes.body.id);
        const painId = painRes.body.id;
        console.log(`✓ Pain assessment created. ID: ${painId}`);

        // 4. Test GET /api/anesthesia/pain/patient/:patient_id
        console.log('Testing get patient pain assessments...');
        const getPainRes = await makeRequest('GET', `/api/anesthesia/pain/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getPainRes.statusCode, 200);
        assert.strictEqual(getPainRes.body.length, 1);
        assert.strictEqual(getPainRes.body[0].id, painId);
        assert.strictEqual(getPainRes.body[0].pain_score_vas, 6);
        assert.strictEqual(getPainRes.body[0].pca_pump_used, true);
        console.log('✓ Patient pain assessments retrieved.');

        // 5. Test POST /api/pediatrics/growth
        console.log('Testing create pediatric growth record...');
        const pedRes = await makeRequest('POST', '/api/pediatrics/growth', {
            patient_id: patientId,
            apgar_1min: 8,
            apgar_5min: 9,
            weight_kg: 3.45,
            height_cm: 51.2,
            head_circ_cm: 34.5
        }, { 'Cookie': cookie });

        assert.strictEqual(pedRes.statusCode, 200);
        assert.ok(pedRes.body.id);
        const pedId = pedRes.body.id;
        console.log(`✓ Pediatric growth record created. ID: ${pedId}`);

        // 6. Test GET /api/pediatrics/growth/patient/:patient_id
        console.log('Testing get patient pediatric growth records...');
        const getPedRes = await makeRequest('GET', `/api/pediatrics/growth/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getPedRes.statusCode, 200);
        assert.strictEqual(getPedRes.body.length, 1);
        assert.strictEqual(getPedRes.body[0].id, pedId);
        assert.strictEqual(parseFloat(getPedRes.body[0].weight_kg), 3.45);
        assert.strictEqual(getPedRes.body[0].apgar_1min, 8);
        console.log('✓ Patient pediatric growth records retrieved.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM cpb_logs WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM pain_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM pediatric_growth_records WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ G16, G19, & G20 Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(async err => {
        console.error('❌ Test failed:', err);
        // Wait 3 seconds for server logs to flush
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
