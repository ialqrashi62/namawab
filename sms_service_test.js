/**
 * sms_service_test.js
 * Integration test for SMS notifications across appointments, lab results, and radiology reports.
 */

const { spawn } = require('child_process');
const http = require('http');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || 'nama_medical_web';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

const TEST_PORT = 3006;
const TEST_USERNAME = 'sms_doctor';
const TEST_PASSWORD = 'EXAMPLE_PASSWORD';
const LOG_FILE = path.join(__dirname, 'backups', 'sms_sent.log');
const EMAIL_LOG_FILE = path.join(__dirname, 'backups', 'email_sent.log');

const pool = new Pool({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
});

function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: TEST_PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                }
            });
        });
        req.on('error', reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTest() {
    console.log('=== Running SMS Gateway Integration Test ===');

    // Ensure lab_results has correct columns by running migration
    try {
        const migrationPath = path.join(__dirname, 'migrations', 'e3_02_lab_results_up.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');
        await pool.query(sql);
        console.log('✓ Ran migration e3_02_lab_results_up.sql on test database.');
    } catch (migErr) {
        console.error('Failed to run migration:', migErr.message);
    }

    // 1. Clean up mock log files
    if (fs.existsSync(LOG_FILE)) {
        fs.unlinkSync(LOG_FILE);
    }
    if (fs.existsSync(EMAIL_LOG_FILE)) {
        fs.unlinkSync(EMAIL_LOG_FILE);
    }

    // 2. Insert test data
    const patientId = 9991;
    const doctorId = 9992;
    const orderId = 9993;

    const client = await pool.connect();
    try {
        await client.query("SET app.tenant_id = '1'");

        // Clean up first
        await client.query('DELETE FROM portal_users WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM lab_results WHERE order_id = $1', [orderId]);
        await client.query('DELETE FROM lab_radiology_orders WHERE id = $1', [orderId]);
        await client.query('DELETE FROM appointments WHERE patient_id = $1', [patientId]);
        await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        await client.query('DELETE FROM hr_employees WHERE national_id = \'9999999999\'');
        await client.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorId]);
        await client.query('DELETE FROM system_users WHERE id = $1', [doctorId]);

        // Insert patient
        await client.query(
            'INSERT INTO patients (id, name_en, name_ar, phone, tenant_id) VALUES ($1, $2, $3, $4, 1)',
            [patientId, 'SMS Test Patient', 'مريض تجربة الرسائل', '+966555555555']
        );

        // Insert patient portal user to receive emails
        await client.query(
            "INSERT INTO portal_users (patient_id, username, password_hash, email, phone, tenant_id) VALUES ($1, $2, $3, $4, $5, 1)",
            [patientId, 'sms_patient_portal', 'pwd', 'patient@example.com', '+966555555555']
        );

        // Insert doctor user
        const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
        await client.query(
            'INSERT INTO system_users (id, username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, 1)',
            [doctorId, 'sms_doctor', hashedPassword, 'SMS Test Doctor', 'Doctor', 'General', '["appointments", "lab", "radiology"]']
        );

        // Associate doctor with tenant 1
        await client.query('INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1, 1, true)', [doctorId]);

        // Insert doctor employee record to resolve phone & email
        await client.query(
            'INSERT INTO hr_employees (emp_number, name_en, name_ar, national_id, phone, email, job_title) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            ['EMP9992', 'SMS Test Doctor', 'دكتور تجربة الرسائل', '9999999999', '+966544444444', 'doctor@example.com', 'Doctor']
        );

        // Insert order
        await client.query(
            'INSERT INTO lab_radiology_orders (id, patient_id, doctor_id, order_type, status, tenant_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [orderId, patientId, doctorId, 'Lab', 'Requested', 1]
        );
    } finally {
        client.release();
    }

    // 3. Start the server on TEST_PORT
    const server = spawn('node', [path.join(__dirname, 'server.js')], {
        env: { ...process.env, PORT: TEST_PORT, NODE_ENV: 'test', SKIP_DB_INIT: 'true' }
    });

    server.stdout.on('data', (data) => console.log(`[Server] ${data.toString().trim()}`));
    server.stderr.on('data', (data) => console.error(`[Server Error] ${data.toString().trim()}`));

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
        // --- Step 0: Login to get session cookie ---
        console.log('Logging in to get session cookie...');
        const loginRes = await makeRequest('POST', '/api/auth/login', {
            username: 'sms_doctor',
            password: TEST_PASSWORD
        });
        assert.strictEqual(loginRes.statusCode, 200, 'Login should succeed');
        
        const setCookie = loginRes.headers['set-cookie'];
        assert.ok(setCookie, 'Should receive set-cookie header');
        const cookie = setCookie[0].split(';')[0];
        console.log('✓ Logged in successfully. Cookie:', cookie);

        const authHeaders = { 'Cookie': cookie };

        // --- Test Case 1: Appointment Confirmation SMS ---
        console.log('Testing Case 1: Appointment Confirmation...');
        const apptRes = await makeRequest('POST', '/api/appointments', {
            patient_name: 'SMS Test Patient',
            patient_id: patientId,
            doctor_name: 'SMS Test Doctor',
            department: 'General',
            appt_date: '2026-07-01',
            appt_time: '10:00',
            fee: 0
        }, authHeaders);

        assert.strictEqual(apptRes.statusCode, 200, 'Appointment booking should succeed');

        // Verify log file contains appointment confirmation
        await new Promise(resolve => setTimeout(resolve, 800)); // wait for async SMS/Email
        const logContent1 = fs.readFileSync(LOG_FILE, 'utf8');
        assert.ok(logContent1.includes('APPOINTMENT_CONFIRM'), 'Log should contain APPOINTMENT_CONFIRM event');
        assert.ok(logContent1.includes('+966555555555'), 'Log should contain patient phone number');
        assert.ok(logContent1.includes('SMS Test Doctor'), 'Log should contain doctor name');
        console.log('✓ Appointment confirmation SMS successfully sent and logged.');

        const emailContent1 = fs.readFileSync(EMAIL_LOG_FILE, 'utf8');
        assert.ok(emailContent1.includes('patient@example.com'), 'Email log should contain patient email');
        assert.ok(emailContent1.includes('Appointment Confirmation'), 'Email log should contain appointment subject');
        console.log('✓ Appointment confirmation email successfully sent and logged.');

        // --- Test Case 2: Lab Result Ready SMS (Auto-Verified) ---
        console.log('Testing Case 2: Lab Result Ready (Auto-Verified)...');
        fs.writeFileSync(LOG_FILE, ''); // Clear log file
        fs.writeFileSync(EMAIL_LOG_FILE, ''); // Clear log file

        const resultRes = await makeRequest('POST', '/api/lab/results', {
            lab_sample_id: null,
            loinc: '12345-6',
            test_name: 'Glucose',
            value: '95',
            unit: 'mg/dL',
            normal_range: '70-100',
            ref_low: 70,
            ref_high: 100,
            order_id: orderId
        }, authHeaders);

        assert.strictEqual(resultRes.statusCode, 200, 'Result submission should succeed');

        await new Promise(resolve => setTimeout(resolve, 500));
        const logContent2 = fs.readFileSync(LOG_FILE, 'utf8');
        assert.ok(logContent2.includes('LAB_RESULT_READY'), 'Log should contain LAB_RESULT_READY event');
        assert.ok(logContent2.includes('+966555555555'), 'Log should contain patient phone');
        console.log('✓ Lab result ready SMS successfully sent and logged.');

        const emailContent2 = fs.readFileSync(EMAIL_LOG_FILE, 'utf8');
        assert.ok(emailContent2.includes('patient@example.com'), 'Email log should contain patient email');
        assert.ok(emailContent2.includes('Lab Results Ready'), 'Email log should contain lab result subject');
        console.log('✓ Lab result ready email successfully sent and logged.');

        // Verify database order was updated
        const dbOrder = (await pool.query('SELECT sms_sent FROM lab_radiology_orders WHERE id = $1', [orderId])).rows[0];
        assert.strictEqual(dbOrder.sms_sent, 1, 'sms_sent should be set to 1 in the database');
        console.log('✓ Database sms_sent updated successfully.');

        // --- Test Case 3: Critical Lab Result Doctor Alert ---
        console.log('Testing Case 3: Critical Lab Result Doctor Alert...');
        fs.writeFileSync(LOG_FILE, ''); // Clear log file
        fs.writeFileSync(EMAIL_LOG_FILE, ''); // Clear log file

        const criticalRes = await makeRequest('POST', '/api/lab/results', {
            lab_sample_id: null,
            loinc: '12345-6',
            test_name: 'Potassium',
            value: '2.5', // Critical low
            unit: 'mmol/L',
            normal_range: '3.5-5.0',
            ref_low: 3.5,
            ref_high: 5.0,
            order_id: orderId
        }, authHeaders);

        await new Promise(resolve => setTimeout(resolve, 500));
        const logContent3 = fs.readFileSync(LOG_FILE, 'utf8');
        assert.ok(logContent3.includes('LAB_CRITICAL_ALERT'), 'Log should contain LAB_CRITICAL_ALERT event');
        assert.ok(logContent3.includes('+966544444444'), 'Log should contain doctor phone');
        assert.ok(logContent3.includes('Potassium'), 'Log should contain test name');
        console.log('✓ Critical lab result doctor alert SMS successfully sent and logged.');

        const emailContent3 = fs.readFileSync(EMAIL_LOG_FILE, 'utf8');
        assert.ok(emailContent3.includes('doctor@example.com'), 'Email log should contain doctor email');
        assert.ok(emailContent3.includes('Critical Result'), 'Email log should contain critical result subject');
        console.log('✓ Critical lab result doctor email alert successfully sent and logged.');

        console.log('✅ SMS & Email Notification Integration Test passed successfully!');
    } catch (e) {
        console.error('❌ Test failed:', e);
        process.exitCode = 1;
    } finally {
        // Clean up
        server.kill();
        const cleanClient = await pool.connect();
        try {
            await cleanClient.query("SET app.tenant_id = '1'");
            await cleanClient.query('DELETE FROM portal_users WHERE patient_id = $1', [patientId]);
            await cleanClient.query('DELETE FROM lab_results WHERE order_id = $1', [orderId]);
            await cleanClient.query('DELETE FROM lab_radiology_orders WHERE id = $1', [orderId]);
            await cleanClient.query('DELETE FROM appointments WHERE patient_id = $1', [patientId]);
            await cleanClient.query('DELETE FROM patients WHERE id = $1', [patientId]);
            await cleanClient.query('DELETE FROM hr_employees WHERE national_id = \'9999999999\'');
            await cleanClient.query('DELETE FROM user_tenants WHERE user_id = $1', [doctorId]);
            await cleanClient.query('DELETE FROM system_users WHERE id = $1', [doctorId]);
        } finally {
            cleanClient.release();
        }
        await pool.end();
        if (fs.existsSync(LOG_FILE)) {
            fs.unlinkSync(LOG_FILE);
        }
        if (fs.existsSync(EMAIL_LOG_FILE)) {
            fs.unlinkSync(EMAIL_LOG_FILE);
        }
        console.log('✓ Cleanup complete');
    }
}

runTest();
