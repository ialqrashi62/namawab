/**
 * payment_adapter_test.js — Integration tests for Moyasar Payment Adapter.
 */
'use strict';

const assert = require('assert');
const { initiatePayment, verifyAndProcessPayment } = require('./payment_adapter');
const { pool, runWithTenant } = require('./db_postgres');

async function runTests() {
    console.log('--- STARTING MOYASAR PAYMENT ADAPTER INTEGRATION TESTS ---');

    const client = await pool.connect();
    let patientId;
    let invoiceId;

    try {
        console.log('Setting up session tenant context and test data...');
        // Set tenant context for RLS
        await client.query("SET app.tenant_id = '1'");

        // Insert patient
        const patientRes = await client.query(
            "INSERT INTO patients (name_ar, name_en, tenant_id) VALUES ($1, $2, $3) RETURNING id",
            ['مريض تجريبي دفع', 'Test Payment Patient', 1]
        );
        patientId = patientRes.rows[0].id;

        // Insert invoice
        const invoiceRes = await client.query(
            "INSERT INTO invoices (patient_id, patient_name, total, description, service_type, payment_method, tenant_id, facility_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, total",
            [patientId, 'Test Payment Patient', 150.00, 'Test Consultation', 'Clinical', 'Moyasar', 1, 1]
        );
        invoiceId = invoiceRes.rows[0].id;
        const amount = invoiceRes.rows[0].total;

        // 2. Test initiatePayment
        console.log('Testing initiatePayment...');
        const paymentInit = await initiatePayment({
            invoiceId,
            amount,
            description: 'Test Payment',
            source: { type: 'creditcard' }
        });

        assert.ok(paymentInit.id, 'Payment initiation should return a payment ID');
        assert.strictEqual(paymentInit.currency, 'SAR', 'Payment currency should be SAR');
        console.log(`✓ Payment initiated successfully. ID: ${paymentInit.id}`);

        // Update the invoice with the payment gateway reference to simulate redirect/callback
        await client.query('UPDATE invoices SET payment_gateway_ref = $1 WHERE id = $2', [paymentInit.id, invoiceId]);

        // 3. Test verifyAndProcessPayment
        console.log('Testing verifyAndProcessPayment...');
        const verifyRes = await runWithTenant({ tenantId: 1 }, async () => {
            return await verifyAndProcessPayment(paymentInit.id);
        });

        assert.strictEqual(verifyRes.success, true, 'Verification should be successful');
        assert.strictEqual(verifyRes.invoice.paid, 1, 'Invoice should be marked as paid');
        assert.ok(verifyRes.invoice.payment_method.includes('Moyasar'), 'Payment method should contain Moyasar');
        assert.strictEqual(verifyRes.invoice.payment_gateway_ref, paymentInit.id, 'Payment gateway reference should match');
        console.log('✓ Payment verified and processed successfully. Invoice marked as paid.');

        // 4. Verify in DB
        const dbInv = (await client.query('SELECT * FROM invoices WHERE id = $1', [invoiceId])).rows[0];
        assert.strictEqual(dbInv.paid, 1, 'Database check: invoice paid should be 1');
        console.log('✓ Database state verified.');

    } finally {
        // Cleanup
        console.log('Cleaning up test data...');
        if (patientId) {
            await client.query('DELETE FROM invoices WHERE patient_id = $1', [patientId]);
            await client.query('DELETE FROM patients WHERE id = $1', [patientId]);
        }
        client.release();
        console.log('✓ Cleanup complete.');
    }

    console.log('✅ All Moyasar Payment Adapter Integration Tests passed successfully!\n');
}

if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Test failed:', err);
        process.exit(1);
    });
}

module.exports = { runTests };
