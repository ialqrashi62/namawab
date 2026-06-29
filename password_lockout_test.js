/**
 * password_lockout_test.js
 * Integration test for the 5-failed-logins account lockout policy.
 */

const { spawn } = require('child_process');
const http = require('http');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
const assert = require('assert');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || 'nama_medical_web';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

const TEST_PORT = 3005;
const TEST_USERNAME = 'lockout_test_user_99';
const TEST_PASSWORD = 'EXAMPLE_PASSWORD';

const pool = new Pool({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
});

function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: TEST_PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        body: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
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
    console.log('=== Running Account Lockout Integration Test ===');

    // 1. Clean up and insert test user
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
    await pool.query('DELETE FROM system_users WHERE username = $1', [TEST_USERNAME]);
    await pool.query(
        'INSERT INTO system_users (username, password_hash, display_name, role, speciality, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, 1)',
        [TEST_USERNAME, hashedPassword, 'Lockout Test User', 'Doctor', 'General', '[]']
    );

    // 2. Start the server on TEST_PORT
    const server = spawn('node', [path.join(__dirname, 'server.js')], {
        env: { ...process.env, PORT: TEST_PORT, NODE_ENV: 'test', SKIP_DB_INIT: 'true' }
    });

    server.stdout.on('data', (data) => console.log(`[Server] ${data.toString().trim()}`));
    server.stderr.on('data', (data) => console.error(`[Server Error] ${data.toString().trim()}`));

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
        // 3. Perform 4 failed logins
        for (let i = 1; i <= 4; i++) {
            const res = await makeRequest('POST', '/api/auth/login', {
                username: TEST_USERNAME,
                password: 'WrongPassword!'
            });
            assert.strictEqual(res.statusCode, 401, `Attempt ${i} should return 401`);
            assert.ok(res.body.error.includes('المتبقي'), 'Should warning about remaining attempts');
            assert.ok(res.body.error.includes(String(5 - i)), `Should state ${5 - i} attempts remaining`);
            console.log(`✓ Failed attempt ${i} verified: ${res.body.error}`);
        }

        // 4. Perform 5th failed login - should lock the account
        const res5 = await makeRequest('POST', '/api/auth/login', {
            username: TEST_USERNAME,
            password: 'WrongPassword!'
        });
        assert.strictEqual(res5.statusCode, 403, '5th attempt should return 403 Forbidden');
        assert.ok(res5.body.error.includes('تم قفل الحساب مؤقتاً'), 'Should return lockout message');
        console.log(`✓ 5th failed attempt verified: ${res5.body.error}`);

        // 5. Attempt login with CORRECT password - should still be locked
        const res6 = await makeRequest('POST', '/api/auth/login', {
            username: TEST_USERNAME,
            password: TEST_PASSWORD
        });
        assert.strictEqual(res6.statusCode, 403, 'Login with correct password during lockout should return 403');
        assert.ok(res6.body.error.includes('تم قفل الحساب مؤقتاً'), 'Should return lockout message');
        console.log('✓ Login during lockout verified as blocked');

        // 6. Simulate lockout expiration by updating DB
        await pool.query(
            'UPDATE system_users SET lockout_until = NOW() - INTERVAL \'1 second\' WHERE username = $1',
            [TEST_USERNAME]
        );
        console.log('✓ Simulated lockout expiration in database');

        // 7. Login with correct password after expiration - should succeed
        const res7 = await makeRequest('POST', '/api/auth/login', {
            username: TEST_USERNAME,
            password: TEST_PASSWORD
        });
        assert.strictEqual(res7.statusCode, 200, 'Login after lockout expires should succeed');
        assert.strictEqual(res7.body.success, true, 'Response should indicate success');
        console.log('✓ Successful login after lockout expiration verified');

        // Verify database counters were reset
        const dbUser = (await pool.query('SELECT failed_login_attempts, lockout_until FROM system_users WHERE username = $1', [TEST_USERNAME])).rows[0];
        assert.strictEqual(dbUser.failed_login_attempts, 0, 'Failed attempts should be reset to 0');
        assert.strictEqual(dbUser.lockout_until, null, 'Lockout until should be reset to null');
        console.log('✓ Database counters reset verified');

        console.log('✅ Account Lockout Integration Test passed successfully!');
    } catch (e) {
        console.error('❌ Test failed:', e);
        process.exitCode = 1;
    } finally {
        // Clean up
        server.kill();
        await pool.query('DELETE FROM system_users WHERE username = $1', [TEST_USERNAME]);
        await pool.end();
        console.log('✓ Cleanup complete');
    }
}

runTest();
