---
name: nm-compliance-pdpl
description: Use when implementing Saudi PDPL/NPHIES/CBAHI/ZATCA compliance features. Loads the canonical patterns for consent capture, data subject rights, regulator reporting. Saves ~70% tokens per compliance module.
---

# Compliance — PDPL / NPHIES / CBAHI / ZATCA

## When to use

Any module touches:
- Patient consent (capture / withdraw / audit)
- PHI encryption at rest
- Cross-border data transfer
- Regulator data export (NPHIES, CBAHI, ZATCA, MOH)
- Right to access / right to erasure (PDPL Article 18)
- Breach notification

## AGENTS.md safety rails covered

- RAIL-1 No hardcoded secrets
- RAIL-2 No PHI in commits/fixtures
- RAIL-7 PHI at rest encrypted
- RAIL-10 Audit log 7+ years retention
- RAIL-12 No PHI in logs

## PDPL Consent Capture

```js
// namaweb/routes/consent.js
router.post('/consent/capture',
    requireAuth, requireTenantScope, requireRole('doctor','receptionist','admin'),
    validateBody(RS.consentCapture),
    idempotencyGuard,
    async (req, res) => {
        const { patient_id, consent_type, version, signature_b64, witness_user_id, language } = req.validated;
        await db.query(`
            INSERT INTO patient_consent (tenant_id, patient_id, consent_type, version,
                signature_b64, witness_user_id, language, captured_by, captured_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now())
        `, [req.tenantId, patient_id, consent_type, version, signature_b64,
            witness_user_id, language, req.userId]);
        await auditLog({ tenantId: req.tenantId, userId: req.userId,
            event_type: 'consent_captured', target_type: 'patient', target_id: patient_id,
            payload: { consent_type, version, language } });
        res.status(201).json({ ok: true });
    }
);

router.post('/consent/withdraw',
    requireAuth, requireTenantScope, requireRole('patient','doctor','admin'),
    async (req, res) => {
        const { patient_id, consent_type } = req.body;
        await db.query(`
            UPDATE patient_consent
            SET withdrawn_at = now(), withdrawn_by = $1
            WHERE patient_id = $2 AND consent_type = $3 AND withdrawn_at IS NULL
        `, [req.userId, patient_id, consent_type]);
        await auditLog({ tenantId: req.tenantId, userId: req.userId,
            event_type: 'consent_withdrawn', target_type: 'patient', target_id: patient_id,
            payload: { consent_type } });
        res.json({ ok: true });
    }
);
```

## PDPL Right to Access (Article 18)

```js
router.post('/pdpl/access-request',
    requireAuth, requireTenantScope, requireRole('patient','admin'),
    async (req, res) => {
        const { patient_id } = req.body;
        // Verify requester is the patient (or admin)
        if (req.userRole === 'patient' && req.session.user.patientId !== patient_id) {
            return res.status(403).json({ error: 'forbidden' });
        }
        // Generate a single-use export token, async job will compile
        const token = crypto.randomBytes(32).toString('hex');
        await db.query(`
            INSERT INTO pdpl_access_requests (tenant_id, patient_id, requested_by, token, status)
            VALUES ($1,$2,$3,$4,'pending')
        `, [req.tenantId, patient_id, req.userId, token]);
        // Queue job to compile data export
        res.status(202).json({ ok: true, requestId: token });
    }
);
```

## PDPL Right to Erasure

```js
router.post('/pdpl/erasure-request',
    requireAuth, requireTenantScope, requireRole('patient','admin'),
    async (req, res) => {
        const { patient_id } = req.body;
        // Cannot erase: clinical records retained per MOH 25-year rule
        // Can erase: marketing consent, contact preferences, optional profile fields
        await db.query(`
            INSERT INTO pdpl_erasure_requests (tenant_id, patient_id, requested_by, status)
            VALUES ($1,$2,$3,'pending_owner_review')
        `, [req.tenantId, patient_id, req.userId]);
        await auditLog({ tenantId: req.tenantId, userId: req.userId,
            event_type: 'pdpl_erasure_requested', target_type: 'patient', target_id: patient_id });
        res.status(202).json({ ok: true });
    }
);
```

## PHI encryption at rest (RAIL-7)

```js
// namaweb/crypto_envelope.js (existing)
const crypto = require('crypto');
const KEK = Buffer.from(process.env.DPAPI_KEK_BASE64, 'base64');

function encryptPHI(plain) {
    const dek = crypto.randomBytes(32);
    const iv  = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);
    const ct = Buffer.concat([cipher.update(JSON.stringify(plain)), cipher.final()]);
    const tag = cipher.getAuthTag();
    const wrappedDek = crypto.publicEncrypt(process.env.RSA_PUB, dek);   // or wrap with KEK
    return { v: 1, ct: ct.toString('base64'), iv: iv.toString('base64'),
             tag: tag.toString('base64'), dek: wrappedDek.toString('base64') };
}
```

## NPHIES Bundle submission (R4)

```js
// namaweb/integrations/nphies.js
async function submitBundle(tenantId, bundleType, payload) {
    const { rows } = await db.query(`
        SELECT nphies_endpoint, nphies_token FROM tenant_integrations
        WHERE tenant_id = $1
    `, [tenantId]);
    const { nphies_endpoint, nphies_token } = rows[0];

    const res = await fetch(`${nphies_endpoint}/fhir/Bundle`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${nphies_token}`,
            'Content-Type': 'application/fhir+json',
            'X-NPHIES-Source': 'nama-medical-erp'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        await auditLog({ tenantId, event_type: 'nphies_submit_failed',
            payload: { status: res.status, bundleType } });
        throw new Error(`nphies_${res.status}`);
    }
    const body = await res.json();
    await auditLog({ tenantId, event_type: 'nphies_submit_success',
        payload: { bundleType, bundleId: body.id } });
    return body;
}
```

## ZATCA Phase 2 (UBL XML + XAdES)

```js
const { signInvoice } = require('./integrations/zatca');

async function issueInvoice(tenantId, invoice) {
    const { rows } = await db.query(`
        SELECT zatca_cert, zatca_key, zatca_csid FROM tenant_integrations
        WHERE tenant_id = $1
    `, [tenantId]);
    const xml = renderInvoiceXML(invoice);
    const signed = await signInvoice(xml, {
        cert: rows[0].zatca_cert, key: rows[0].zatca_key, csid: rows[0].zatca_csid
    });
    await db.query(`UPDATE invoices SET zatca_xml = $1, zatca_hash = $2, zatca_signed_at = now() WHERE id = $3`,
        [signed.xml, signed.hash, invoice.id]);
    await auditLog({ tenantId, event_type: 'zatca_invoice_signed',
        payload: { invoiceId: invoice.id, hash: signed.hash } });
    return signed;
}
```

## Breach notification (PDPL Article 19)

```js
router.post('/breach/report',
    requireAuth, requireTenantScope, requireRole('owner','admin'),
    validateBody(RS.breachReport),
    async (req, res) => {
        const { affected_patients_count, breach_type, discovered_at, description } = req.validated;
        await db.query(`
            INSERT INTO breach_reports (tenant_id, reported_by, breach_type, affected_count,
                discovered_at, description, status)
            VALUES ($1,$2,$3,$4,$5,$6,'submitted_to_authority')
        `, [req.tenantId, req.userId, breach_type, affected_patients_count, discovered_at, description]);
        await notifyAuthority(tenantId, { breach_type, affected_patients_count, discovered_at });
        res.status(201).json({ ok: true });
    }
);
```

## Token saving

Each compliance module from scratch = ~300 lines. With template = ~80 lines unique
(specific consent types, specific regulator, specific bundle shape). ~70% reduction.