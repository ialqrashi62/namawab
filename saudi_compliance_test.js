/**
 * saudi_compliance_test.js
 * Integration test for Saudi regulatory compliance upgrades (ZATCA Phase 2, CBAHI OVR, PDPL Consent).
 */

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3009;
const TEST_USERNAME = 'compliance_admin';
const TEST_PASSWORD = 'COMPLIANCE_PASSWORD_PLACEHOLDER';

let server;

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
    console.log('--- STARTING SAUDI COMPLIANCE INTEGRATION TESTS ---');

    // 1. Setup compliance test data
    const patientId = 8881;
    const adminUserId = 8882;
    const client = await pool.connect();

    try {
        await client.query("SET app.tenant_id = '1'");

        // Clean up
        await client.query('DELETE FROM invoices WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM quality_incidents WHERE reported_by = $1', ['Compliance Test Reporter']);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [adminUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [adminUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, phone, tenant_id) VALUES ($1, $2, $3, $4, 1)',
            [patientId, 'Compliance Patient', 'مريض الامتثال', '+966555555555']
        );

        // Insert admin user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [adminUserId, TEST_USERNAME, hashedPassword, 'Compliance Admin', 'Admin', 'General', '["patients", "invoices", "quality"]']
        );

        // Associate user with tenant 1
        await client.query('INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1, 1, true)', [adminUserId]);

    } finally {
        client.release();
    }

    // 2. Start local server
    server = spawn('node', ['server.js'], {
        env: { ...process.env, PORT: TEST_PORT, SKIP_DB_INIT: '1' }
    });

    server.stdout.on('data', (data) => {
        // console.log('SERVER:', data.toString());
    });
    server.stderr.on('data', (data) => {
        console.error('SERVER ERR:', data.toString());
    });

    // Wait for server to boot
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
        // Log in
        console.log('Logging in...');
        const loginRes = await makeRequest('POST', '/api/auth/login', {
            username: TEST_USERNAME,
            password: TEST_PASSWORD
        });
        assert.strictEqual(loginRes.statusCode, 200, 'Login should succeed');
        const setCookie = loginRes.headers['set-cookie'];
        assert.ok(setCookie, 'Should receive set-cookie header');
        const cookie = setCookie[0].split(';')[0];
        const authHeaders = { 'Cookie': cookie };

        // --- Test Case 1: PDPL Privacy Consent ---
        console.log('Testing Case 1: PDPL Patient Privacy Consent...');
        const consentRes = await makeRequest('POST', `/api/patients/${patientId}/consent`, {}, authHeaders);
        assert.strictEqual(consentRes.statusCode, 200, 'Consent signing should succeed');
        assert.strictEqual(consentRes.body.success, true);

        // Verify database state
        const dbPatient = (await pool.query('SELECT privacy_consent_signed, privacy_consent_date FROM patients WHERE id = $1', [patientId])).rows[0];
        assert.strictEqual(dbPatient.privacy_consent_signed, true, 'privacy_consent_signed should be true');
        assert.ok(dbPatient.privacy_consent_date, 'privacy_consent_date should be populated');
        console.log('✓ Patient privacy consent successfully signed and verified in DB.');

        // --- Test Case 2: ZATCA Phase 2 Invoice Chaining & Hashing ---
        console.log('Testing Case 2: ZATCA Phase 2 Invoice Chaining & Hashing...');
        
        // Generate Invoice 1
        const inv1Res = await makeRequest('POST', '/api/invoices/generate', {
            patient_id: patientId,
            items: [{ description: 'Consultation', amount: '100.00' }]
        }, authHeaders);
        assert.strictEqual(inv1Res.statusCode, 200, 'Invoice 1 generation should succeed');
        const inv1 = inv1Res.body;
        assert.ok(inv1.invoice_hash, 'Invoice 1 should have a hash');
        assert.strictEqual(inv1.previous_invoice_hash, '0000000000000000000000000000000000000000000000000000000000000000', 'First invoice previous hash should be zero sentinel');

        // Generate Invoice 2
        const inv2Res = await makeRequest('POST', '/api/invoices/generate', {
            patient_id: patientId,
            items: [{ description: 'Follow-up', amount: '50.00' }]
        }, authHeaders);
        assert.strictEqual(inv2Res.statusCode, 200, 'Invoice 2 generation should succeed');
        const inv2 = inv2Res.body;
        assert.ok(inv2.invoice_hash, 'Invoice 2 should have a hash');
        assert.strictEqual(inv2.previous_invoice_hash, inv1.invoice_hash, 'Invoice 2 previous_invoice_hash must exactly match Invoice 1 invoice_hash');
        console.log('✓ Invoice chaining verified. Chaining sequence: Inv1 Hash -> Inv2 PrevHash.');

        // --- Test Case 3: CBAHI OVR Incident Reporting ---
        console.log('Testing Case 3: CBAHI OVR Incident Reporting...');
        const incidentRes = await makeRequest('POST', '/api/quality/incidents', {
            incident_type: 'medication_error',
            severity: 'medium',
            harm_level: 'Mild',
            department: 'Pharmacy',
            location: 'Main Pharmacy',
            description: 'Wrong dosage of aspirin dispensed but caught before administration.',
            immediate_action: 'Dispensed correct dose, notified supervisor.'
        }, authHeaders);
        if (incidentRes.statusCode !== 200) {
            console.error('FAILED RESPONSE:', incidentRes.statusCode, incidentRes.body || incidentRes.rawBody);
        }
        assert.strictEqual(incidentRes.statusCode, 200, 'Incident reporting should succeed');
        assert.ok(incidentRes.body.id, 'Should return the generated incident ID');

        // Fetch incidents
        const getIncidentsRes = await makeRequest('GET', '/api/quality/incidents', {}, authHeaders);
        assert.strictEqual(getIncidentsRes.statusCode, 200, 'Fetching incidents should succeed');
        const found = getIncidentsRes.body.find(i => i.id === incidentRes.body.id);
        assert.ok(found, 'Should find the reported incident in the list');
        assert.strictEqual(found.department, 'Pharmacy');
        assert.strictEqual(found.severity, 'medium');
        console.log('✓ CBAHI OVR incident successfully reported and retrieved.');

        console.log('✅ All Saudi Regulatory Compliance Integration Tests passed successfully!');
    } catch (e) {
        console.error('❌ Test failed:', e);
        process.exitCode = 1;
    } finally {
        // Clean up
        server.kill();
        const cleanClient = await pool.connect();
        try {
            await cleanClient.query("SET app.tenant_id = '1'");
            await cleanClient.query('DELETE FROM invoices WHERE patient_id = $1', [patientId]);
            await cleanClient.query('DELETE FROM patients WHERE id = $1', [patientId]);
            await cleanClient.query('DELETE FROM quality_incidents WHERE reported_by = $1', ['Compliance Test Reporter']);
            await cleanClient.query('DELETE FROM user_tenants WHERE user_id = $1', [adminUserId]);
            await cleanClient.query('DELETE FROM system_users WHERE id = $1', [adminUserId]);
        } finally {
            cleanClient.release();
        }
        await pool.end();
        console.log('✓ Cleanup complete');
    }
}

runTests();
