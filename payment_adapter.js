/**
 * payment_adapter.js — Moyasar Payment Gateway Adapter (Saudi Arabia Compliant).
 * 
 * Supports Mada, Visa, Mastercard, and Apple Pay.
 * Natively uses global fetch (Node.js 18+).
 * Safe-by-design: falls back to Sandbox/Mock mode in staging/test or if keys are missing.
 */
'use strict';

const { pool } = require('./db_postgres');

const MOYASAR_SECRET_KEY = process.env.MOYASAR_SECRET_KEY || '';
const MOYASAR_PUBLISHABLE_KEY = process.env.MOYASAR_PUBLISHABLE_KEY || '';
const IS_SANDBOX = !MOYASAR_SECRET_KEY || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

/**
 * Initiates a payment request with Moyasar.
 * @param {Object} params { invoiceId, amount, description, source }
 * @returns {Promise<Object>} Moyasar payment object or mock response
 */
async function initiatePayment({ invoiceId, amount, description, source }) {
    const amountInHalalas = Math.round(amount * 100); // Moyasar expects amount in Halalas (cents)

    if (IS_SANDBOX) {
        console.log(`[Moyasar Sandbox] Initiating payment for invoice ${invoiceId}: ${amount} SAR`);
        const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 15)}`;
        return {
            id: mockPaymentId,
            status: 'initiated',
            amount: amountInHalalas,
            currency: 'SAR',
            description: description || `Invoice ${invoiceId}`,
            invoice_id: invoiceId,
            callback_url: `https://www.jumanasoft.com/api/payments/moyasar/callback?payment_id=${mockPaymentId}`,
            check_url: `https://www.jumanasoft.com/api/payments/moyasar/verify?payment_id=${mockPaymentId}`
        };
    }

    try {
        const authHeader = 'Basic ' + Buffer.from(MOYASAR_SECRET_KEY + ':').toString('base64');
        const response = await fetch('https://api.moyasar.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amountInHalalas,
                currency: 'SAR',
                description: description || `Invoice ${invoiceId}`,
                callback_url: `https://www.jumanasoft.com/api/payments/moyasar/callback`,
                source: source || { type: 'creditcard' },
                metadata: {
                    invoice_id: String(invoiceId)
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Moyasar API error: ${response.status} - ${errText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[Moyasar] Failed to initiate payment:', error);
        throw error;
    }
}

/**
 * Verifies a payment status with Moyasar and updates the invoice in the DB.
 * @param {string} paymentId 
 * @returns {Promise<Object>} Verification status and invoice
 */
async function verifyAndProcessPayment(paymentId) {
    let paymentData;

    if (IS_SANDBOX && paymentId.startsWith('pay_mock_')) {
        console.log(`[Moyasar Sandbox] Verifying mock payment: ${paymentId}`);
        paymentData = {
            id: paymentId,
            status: 'paid',
            amount: 10000, // 100.00 SAR
            currency: 'SAR',
            source: { type: 'creditcard', company: 'visa', name: 'Sandbox User', number: 'XXXX-XXXX-XXXX-1111' },
            metadata: { invoice_id: null } // will be matched from DB or query
        };
    } else {
        try {
            const authHeader = 'Basic ' + Buffer.from(MOYASAR_SECRET_KEY + ':').toString('base64');
            const response = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': authHeader
                }
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Moyasar verification failed: ${response.status} - ${errText}`);
            }

            paymentData = await response.json();
        } catch (error) {
            console.error(`[Moyasar] Verification request failed for ${paymentId}:`, error);
            throw error;
        }
    }

    if (paymentData.status === 'paid' || paymentData.status === 'captured') {
        // Find invoice. If metadata doesn't have it, we check if we stored paymentId in the db or check by query.
        const invoiceId = paymentData.metadata?.invoice_id;
        let invoice;

        if (invoiceId) {
            invoice = (await pool.query('SELECT * FROM invoices WHERE id = $1', [invoiceId])).rows[0];
        } else {
            // Fallback search: find invoice by payment gateway ref or find the oldest unpaid invoice with similar amount
            invoice = (await pool.query('SELECT * FROM invoices WHERE payment_gateway_ref = $1', [paymentId])).rows[0];
        }

        if (invoice) {
            if (!invoice.paid) {
                const paymentMethod = `Moyasar (${paymentData.source.type || 'card'} - ${paymentData.source.company || 'unknown'})`;
                await pool.query(
                    'UPDATE invoices SET paid = 1, payment_method = $1, payment_gateway_ref = $2 WHERE id = $3',
                    [paymentMethod, paymentId, invoice.id]
                );
                console.log(`[Moyasar] Invoice ${invoice.id} marked as PAID via ${paymentId}`);
                invoice.paid = 1;
                invoice.payment_method = paymentMethod;
                invoice.payment_gateway_ref = paymentId;
            }
            return { success: true, status: paymentData.status, invoice };
        } else {
            console.warn(`[Moyasar] Payment ${paymentId} verified but no matching invoice found.`);
            return { success: false, status: paymentData.status, error: 'No matching invoice' };
        }
    }

    return { success: false, status: paymentData.status, error: 'Payment not captured' };
}

module.exports = {
    initiatePayment,
    verifyAndProcessPayment,
    IS_SANDBOX
};
