/**
 * moyasar_http_integration_test.js — Integration test for the Moyasar HTTP payment endpoints.
 */
'use strict';

process.env.NODE_ENV = 'staging';

const { spawn } = require('child_process');
const http = require('http');
const assert = require('assert');
const bcrypt = require('bcryptjs');
const { pool } = require('./db_postgres');

const TEST_PORT = 3012;
const TEST_USERNAME = 'payment_clerk';
const TEST_PASSWORD = 'PAYMENT_PASSWORD_PLACEHOLDER';

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
    console.log('--- STARTING MOYASAR HTTP INTEGRATION TESTS ---');

    const patientId = 9995;
    const invoiceId = 9995;
    const clerkUserId = 9996;
    const client = await pool.connect();

    try {
        console.log('Setting up test data...');
        await client.query("SET app.tenant_id = '1'");

        // Clean up old test data
        await client.query('DELETE FROM invoices WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [clerkUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [clerkUserId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, tenant_id) VALUES ($1, $2, $3, 1)',
            [patientId, 'Payment Test Patient', 'مريض فحص الدفع']
        );

        // Insert invoice
        await client.query(
            "INSERT INTO invoices (id, patient_id, patient_name, total, description, service_type, paid, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, 0, 1, 1)",
            [invoiceId, patientId, 'Payment Test Patient', 150.00, 'Test Consultation', 'Clinical']
        );

        // Insert clerk user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [clerkUserId, TEST_USERNAME, hashedPassword, 'Clerk Accountant', 'Finance', 'Billing', '["invoices", "accounts"]']
        );

        // Associate clerk with tenant 1
        await client.query(
            'INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1, 1, true)',
            [clerkUserId]
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

        // 1. Test POST /api/payments/moyasar/initiate
        console.log('Initiating Moyasar payment...');
        const initRes = await makeRequest('POST', '/api/payments/moyasar/initiate', {
            invoiceId: invoiceId
        }, { 'Cookie': cookie });

        assert.strictEqual(initRes.statusCode, 200, 'Should return 200 OK');
        assert.ok(initRes.body.id, 'Should return a payment ID');
        assert.ok(initRes.body.id.startsWith('pay_mock_'), 'Should return a mock payment ID in sandbox mode');
        console.log(`✓ Payment initiated successfully. ID: ${initRes.body.id}`);

        const mockPaymentId = initRes.body.id;

        // 2. Test GET /api/payments/moyasar/callback
        console.log('Simulating Moyasar callback...');
        const callbackRes = await makeRequest('GET', `/api/payments/moyasar/callback?payment_id=${mockPaymentId}`, null);

        assert.strictEqual(callbackRes.statusCode, 200, 'Callback should return 200 OK');
        assert.ok(callbackRes.rawBody.includes('تم الدفع بنجاح'), 'Response should contain success message');
        console.log('✓ Callback processed successfully.');

        // 3. Verify database state
        console.log('Verifying invoice status in database...');
        const updatedInvoice = (await client.query('SELECT * FROM invoices WHERE id = $1', [invoiceId])).rows[0];
        assert.strictEqual(updatedInvoice.paid, 1, 'Invoice should be marked as paid');
        assert.strictEqual(updatedInvoice.payment_gateway_ref, mockPaymentId, 'Payment gateway reference should be saved');
        assert.ok(updatedInvoice.payment_method.includes('Moyasar'), 'Payment method should include Moyasar');
        console.log('✓ Database verification passed.');

    } finally {
        console.log('Cleaning up test data...');
        await client.query("SET app.tenant_id = '1'");
        await client.query('DELETE FROM invoices WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [clerkUserId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [clerkUserId]);
        client.release();

        if (serverProcess) {
            console.log('Killing test server...');
            serverProcess.kill();
        }
    }

    console.log('✅ Moyasar HTTP Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        if (serverProcess) serverProcess.kill();
        process.exit(1);
    });
}

module.exports = { runTests };
