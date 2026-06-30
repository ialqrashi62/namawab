/**
 * orthopedics_integration_test.js — Integration test for the Orthopedics module HTTP endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3019;
const TEST_USERNAME = 'ortho_doctor';
const TEST_PASSWORD = 'ORTHO_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING ORTHOPEDICS MODULE INTEGRATION TESTS ---');

    const patientId = 9991;
    const doctorUserId = 9992;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM orthopedic_implants WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM joint_rom_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Ortho Test Patient', 'مريض العظام']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorUserId, TEST_USERNAME, hashedPassword, 'Dr. Orthopedist', 'Doctor', 'Orthopedics', '["patients", "prescriptions"]']
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

        // 1. Test POST /api/orthopedics/implants (Register implant)
        console.log('Testing register orthopedic implant...');
        const implantRes = await makeRequest('POST', '/api/orthopedics/implants', {
            patient_id: patientId,
            implant_type: 'Total Knee Joint',
            manufacturer: 'Zimmer Biomet',
            model_name: 'Persona Knee System',
            serial_number: 'SN-98483120',
            size_dimension: 'Size 6',
            batch_lot_number: 'LOT-2026-X',
            clinical_notes: 'Successful replacement, stable placement'
        }, { 'Cookie': cookie });

        assert.strictEqual(implantRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(implantRes.body.success, true, 'Should return success true');
        assert.ok(implantRes.body.id, 'Should return record ID');
        const implantId = implantRes.body.id;
        console.log(`✓ Orthopedic implant registered successfully. ID: ${implantId}`);

        // 2. Test GET /api/orthopedics/implants/patient/:patient_id
        console.log('Testing get patient implants...');
        const getImplantRes = await makeRequest('GET', `/api/orthopedics/implants/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getImplantRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(getImplantRes.body.length, 1, 'Should return exactly 1 record');
        assert.strictEqual(getImplantRes.body[0].id, implantId, 'Record ID should match');
        assert.strictEqual(getImplantRes.body[0].serial_number, 'SN-98483120', 'Serial number should match');
        console.log('✓ Patient implants retrieved successfully.');

        // 3. Test POST /api/orthopedics/rom (Save joint ROM assessment)
        console.log('Testing save joint ROM...');
        const romRes = await makeRequest('POST', '/api/orthopedics/rom', {
            patient_id: patientId,
            joint_name: 'Knee',
            lateral_side: 'Right',
            movement_type: 'Flexion',
            angle_degrees: 95,
            is_restricted: true
        }, { 'Cookie': cookie });

        assert.strictEqual(romRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(romRes.body.success, true, 'Should return success true');
        assert.ok(romRes.body.id, 'Should return record ID');
        const romId = romRes.body.id;
        console.log(`✓ Joint ROM saved successfully. ID: ${romId}`);

        // 4. Test GET /api/orthopedics/rom/patient/:patient_id
        console.log('Testing get patient ROM...');
        const getRomRes = await makeRequest('GET', `/api/orthopedics/rom/patient/${patientId}`, null, { 'Cookie': cookie });
        assert.strictEqual(getRomRes.statusCode, 200, 'Should return 200 OK');
        assert.strictEqual(getRomRes.body.length, 1, 'Should return exactly 1 record');
        assert.strictEqual(getRomRes.body[0].id, romId, 'Record ID should match');
        assert.strictEqual(getRomRes.body[0].is_restricted, true, 'ROM restriction flag should be true');
        console.log('✓ Patient ROM retrieved successfully.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM orthopedic_implants WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM joint_rom_assessments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Orthopedics Module Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
