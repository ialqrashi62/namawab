/**
 * gastro_integration_test.js — Integration test for the Gastroenterology module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3012;
const TEST_USERNAME = 'gastro_doctor';
const TEST_PASSWORD = 'GASTRO_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING GASTROENTEROLOGY MODULE INTEGRATION TESTS ---');

    const patientId = 9983;
    const doctorUserId = 9984;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM endoscopy_reports WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM biopsy_samples WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Gastro Test Patient', 'مريض فحص الهضمي']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Gastro Consultant', 'Doctor', 'Gastroenterology', '["patients", "prescriptions"]']
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

        // 1. Test POST /api/gastro/endoscopy (Create endoscopy report)
        console.log('Testing create endoscopy report...');
        const endoCreateRes = await makeRequest('POST', '/api/gastro/endoscopy', {
            patient_id: patientId,
            endoscopy_type: 'Gastroscopy',
            indications: 'Dyspepsia, epigastric pain',
            findings: 'Mild antral gastritis, no active bleeding.',
            complications: 'None',
            recommendations: 'Start PPI therapy.'
        }, { 'Cookie': cookie });

        assert.strictEqual(endoCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(endoCreateRes.body.success, true, 'Should return success true');
        assert.ok(endoCreateRes.body.id, 'Should return endoscopy report ID');
        const endoscopyId = endoCreateRes.body.id;
        console.log(`✓ Endoscopy report created successfully. ID: ${endoscopyId}`);

        // 2. Test GET /api/gastro/endoscopy/patient/:patient_id
        console.log('Testing get patient endoscopy reports...');
        const endoGetRes = await makeRequest('GET', `/api/gastro/endoscopy/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(endoGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(endoGetRes.body.length, 1, 'Should return exactly 1 endoscopy report');
        assert.strictEqual(endoGetRes.body[0].id, endoscopyId, 'Endoscopy ID should match');
        assert.strictEqual(endoGetRes.body[0].endoscopy_type, 'Gastroscopy', 'Endoscopy type should match');
        console.log('✓ Patient endoscopy reports retrieved successfully.');

        // 3. Test POST /api/gastro/biopsy (Create biopsy sample request)
        console.log('Testing request biopsy sample...');
        const biopsyCreateRes = await makeRequest('POST', '/api/gastro/biopsy', {
            patient_id: patientId,
            specimen_source: 'Gastric Antrum',
            clinical_notes: 'Rule out H. pylori.'
        }, { 'Cookie': cookie });

        assert.strictEqual(biopsyCreateRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(biopsyCreateRes.body.success, true, 'Should return success true');
        assert.ok(biopsyCreateRes.body.id, 'Should return biopsy ID');
        const biopsyId = biopsyCreateRes.body.id;
        console.log(`✓ Biopsy request created successfully. ID: ${biopsyId}`);

        // 4. Test GET /api/gastro/biopsy/patient/:patient_id
        console.log('Testing get patient biopsy samples...');
        const biopsyGetRes = await makeRequest('GET', `/api/gastro/biopsy/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(biopsyGetRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(biopsyGetRes.body.length, 1, 'Should return exactly 1 biopsy request');
        assert.strictEqual(biopsyGetRes.body[0].id, biopsyId, 'Biopsy ID should match');
        assert.strictEqual(biopsyGetRes.body[0].status, 'Pending', 'Biopsy status should be Pending');
        console.log('✓ Patient biopsy samples retrieved successfully.');

        // 5. Test PUT /api/gastro/biopsy/:id/result (Update biopsy result)
        console.log('Testing record biopsy result...');
        const biopsyResultRes = await makeRequest('PUT', `/api/gastro/biopsy/${biopsyId}/result`, {
            result_findings: 'Chronic gastritis, H. pylori positive.'
        }, { 'Cookie': cookie });

        assert.strictEqual(biopsyResultRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(biopsyResultRes.body.success, true, 'Should return success true');
        console.log('✓ Biopsy result recorded successfully.');

        // 6. Verify biopsy status and result
        console.log('Verifying updated biopsy status...');
        const biopsyVerifyRes = await makeRequest('GET', `/api/gastro/biopsy/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(biopsyVerifyRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(biopsyVerifyRes.body[0].status, 'Resulted', 'Biopsy status should be updated to Resulted');
        assert.strictEqual(biopsyVerifyRes.body[0].result_findings, 'Chronic gastritis, H. pylori positive.', 'Biopsy findings should match');
        console.log('✓ Biopsy status and findings verified successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM endoscopy_reports WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM biopsy_samples WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Gastroenterology Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
