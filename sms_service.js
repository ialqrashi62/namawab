/**
 * sms_service.js
 * Extensible SMS Gateway Client supporting Twilio, Unifonic, and a Mock provider.
 * Built using Node's native https module to avoid external dependencies.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { pool } = require('./db_postgres');
require('dotenv').config();

const PROVIDER = process.env.SMS_PROVIDER || 'mock';
const LOG_DIR = path.join(__dirname, 'backups');
const LOG_FILE = path.join(LOG_DIR, 'sms_sent.log');

// Ensure log directory exists for the mock provider
if (PROVIDER === 'mock' && !fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Log the SMS sending operation in the audit_trail table
 */
async function logSMSAudit(to, text, eventType, status, errorMsg = '') {
    try {
        const details = `SMS to: ${to} | Event: ${eventType} | Status: ${status}${errorMsg ? ` | Error: ${errorMsg}` : ''} | Msg: "${text.slice(0, 100)}..."`;
        await pool.query(
            'INSERT INTO audit_trail (user_id, username, action, module, details, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
            [null, 'SYSTEM_SMS', 'SMS_SEND', 'Notifications', details, '127.0.0.1']
        );
    } catch (e) {
        console.error('[SMS SERVICE] Failed to log audit trail:', e.message);
    }
}

/**
 * Send an SMS using Twilio REST API
 */
function sendTwilio(to, text) {
    return new Promise((resolve, reject) => {
        const sid = process.env.SMS_TWILIO_SID;
        const token = process.env.SMS_TWILIO_TOKEN;
        const from = process.env.SMS_TWILIO_FROM;

        if (!sid || !token || !from) {
            return reject(new Error('Missing Twilio credentials (SMS_TWILIO_SID, SMS_TWILIO_TOKEN, SMS_TWILIO_FROM)'));
        }

        const auth = Buffer.from(`${sid}:${token}`).toString('base64');
        const postData = new URLSearchParams({
            To: to,
            From: from,
            Body: text
        }).toString();

        const options = {
            hostname: 'api.twilio.com',
            port: 443,
            path: `/2010-04-01/Accounts/${sid}/Messages.json`,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`Twilio API returned HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Send an SMS using Unifonic REST API (Saudi Arabia compliance)
 */
function sendUnifonic(to, text) {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.SMS_UNIFONIC_API_KEY;
        const sender = process.env.SMS_UNIFONIC_SENDER;

        if (!apiKey || !sender) {
            return reject(new Error('Missing Unifonic credentials (SMS_UNIFONIC_API_KEY, SMS_UNIFONIC_SENDER)'));
        }

        const postData = JSON.stringify({
            AppSid: apiKey,
            Recipient: to.replace('+', ''), // Unifonic expects digits only
            Body: text,
            SenderID: sender
        });

        const options = {
            hostname: 'api.unifonic.com',
            port: 443,
            path: '/rest/SMS/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`Unifonic API returned HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Send an SMS message
 * @param {string} to - Recipient phone number (e.g., '+966500000000')
 * @param {string} text - Message body
 * @param {string} eventType - Event type for audit logging (e.g., 'APPOINTMENT_CONFIRM')
 * @param {object} metadata - Optional metadata
 */
async function sendSMS(to, text, eventType = 'GENERAL', metadata = {}) {
    if (!to || !text) {
        console.warn('[SMS SERVICE] Missing recipient or message body.');
        return false;
    }

    const formattedTo = String(to).trim();
    console.log(`[SMS SERVICE] Sending ${eventType} to ${formattedTo} using ${PROVIDER}...`);

    if (PROVIDER === 'mock') {
        const logEntry = `[${new Date().toISOString()}] EVENT: ${eventType} | TO: ${formattedTo} | MSG: "${text}"\n`;
        try {
            fs.appendFileSync(LOG_FILE, logEntry);
            console.log(`[SMS MOCK LOGGED] To: ${formattedTo} | Msg: ${text}`);
            await logSMSAudit(formattedTo, text, eventType, 'SUCCESS_MOCK');
            return true;
        } catch (e) {
            console.error('[SMS SERVICE] Failed to write to mock log file:', e.message);
            await logSMSAudit(formattedTo, text, eventType, 'FAILED_MOCK', e.message);
            return false;
        }
    }

    try {
        let result;
        if (PROVIDER === 'twilio') {
            result = await sendTwilio(formattedTo, text);
        } else if (PROVIDER === 'unifonic') {
            result = await sendUnifonic(formattedTo, text);
        } else {
            throw new Error(`Unsupported SMS provider: ${PROVIDER}`);
        }

        console.log('[SMS SERVICE] SMS sent successfully via API.');
        await logSMSAudit(formattedTo, text, eventType, 'SUCCESS_API');
        return true;
    } catch (err) {
        console.error('[SMS SERVICE] API sending failed:', err.message);
        await logSMSAudit(formattedTo, text, eventType, 'FAILED_API', err.message);
        return false;
    }
}

module.exports = { sendSMS };
