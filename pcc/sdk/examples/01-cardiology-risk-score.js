// =============================================================================
// 01-cardiology-risk-score.js
// -----------------------------------------------------------------------------
// Title:       Cardiology General Risk Score via PCC Sandbox
// Description: Calls pcc-cardiology-ext102 /CardGenExt with a patient's vitals
//              (heart rate, age, systolic blood pressure) and pretty-prints the
//              returned risk score with ANSI color coding (LOW / MODERATE / HIGH).
// Language:    Node.js (>= 18) — uses ONLY the built-in `http` module.
// SDK used:    None. Raw http against http://localhost:3201.
// Run:         node sdk/examples/01-cardiology-risk-score.js
// =============================================================================

'use strict';

const http = require('http');

const HOST = 'localhost';
const PORT = 3201;
const SLUG = 'pcc-cardiology-ext102';
const FN   = 'CardGenExt';

// Patient vitals (edit these for your own scenario)
const PAYLOAD = {
  hr: 78,            // beats per minute
  age: 58,           // years
  systolic_bp: 142   // mmHg
};

// Map a numeric score to a risk bucket + ANSI color.
function colorize(score) {
  if (score < 0.4) return { label: 'LOW',      color: '\x1b[32m' }; // green
  if (score < 0.7) return { label: 'MODERATE', color: '\x1b[33m' }; // yellow
  return                  { label: 'HIGH',     color: '\x1b[31m' }; // red
}
const RESET = '\x1b[0m';

function postJson(path, bodyObj) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(bodyObj));
    const req = http.request({
      host: HOST, port: PORT, method: 'POST', path,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let raw = '';
      res.on('data', (c) => { raw += c; });
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(raw); }
        catch (e) { return reject(new Error('Bad JSON from server: ' + raw)); }
        if (res.statusCode >= 400) {
          return reject(new Error('HTTP ' + res.statusCode + ' ' + JSON.stringify(parsed)));
        }
        resolve(parsed);
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('--- 01 Cardiology Risk Score ---');
  console.log('Endpoint: POST http://' + HOST + ':' + PORT + '/api/v1/' + SLUG + '/call/' + FN);
  console.log('Input   :', JSON.stringify(PAYLOAD));

  let result;
  try {
    result = await postJson('/api/v1/' + SLUG + '/call/' + FN, PAYLOAD);
  } catch (err) {
    console.error('FAILED:', err.message);
    console.error('Is the PCC sandbox running on :3201 ?');
    process.exitCode = 1;
    return;
  }

  const score = typeof result.score === 'number' ? result.score : 0;
  const { label, color } = colorize(score);

  console.log('');
  console.log('Response (raw) :', JSON.stringify(result));
  console.log('');
  console.log('Module         :', result.module);
  console.log('Function       :', result.function);
  console.log('Timestamp      :', result.ts);
  console.log('Score          : ' + color + score.toFixed(3) + '  [' + label + ']' + RESET);
  console.log('Interpretation :', label === 'LOW'
      ? 'Routine follow-up recommended.'
      : label === 'MODERATE'
        ? 'Lifestyle intervention + clinical review within 30 days.'
        : 'Urgent cardiology referral advised.');
})();
