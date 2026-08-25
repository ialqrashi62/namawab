// filepath: namaweb/kb_router.js
// Knowledge base + FAQ router. Bilingual (EN/AR), category-filtered.
// Patients can read; staff can manage.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// ============================================================
// GET /api/kb/articles?category=...&audience=...
// ============================================================
router.get('/articles', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { category, audience } = req.query;
        const conditions = ['tenant_id = $1', 'published = TRUE'];
        const params = [req.tenantId];
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        if (audience) { params.push(audience); conditions.push(`audience IN ($${params.length}, 'both')`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, slug, title_en, title_ar, summary_en, summary_ar, category, audience, tags, view_count, created_at
            FROM knowledge_articles WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, articles: r.rows });
    } catch (err) {
        console.error('GET /api/kb/articles', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/kb/articles/:slug — fetch one article + increment view count
// ============================================================
router.get('/articles/:slug', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE knowledge_articles SET view_count = view_count + 1
            WHERE tenant_id = $1 AND slug = $2 AND published = TRUE
            RETURNING id, slug, title_en, title_ar, summary_en, summary_ar, body_en, body_ar, category, audience, tags, view_count, created_at, updated_at
        `, [req.tenantId, req.params.slug]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, article: r.rows[0] });
    } catch (err) {
        console.error('GET /api/kb/articles/:slug', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/kb/articles/:id/helpful?helpful=yes
// ============================================================
router.post('/articles/:id/helpful', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const helpful = req.body.helpful === 'yes' || req.body.helpful === true;
        const column = helpful ? 'helpful_yes' : 'helpful_no';
        const r = await db.query(`UPDATE knowledge_articles SET ${column} = ${column} + 1 WHERE id = $1 AND tenant_id = $2 RETURNING id, helpful_yes, helpful_no`, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) {
        console.error('POST /api/kb/helpful', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/kb/articles — staff creates article
// ============================================================
router.post('/articles', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { slug, title_en, title_ar, summary_en, summary_ar, body_en, body_ar, category, audience, tags, published } = req.body;
        if (!slug || !title_en) return res.status(400).json({ error: 'missing_required', required: ['slug', 'title_en'] });
        const r = await db.query(`
            INSERT INTO knowledge_articles (tenant_id, slug, title_en, title_ar, summary_en, summary_ar, body_en, body_ar, category, audience, tags, published, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
            RETURNING id
        `, [req.tenantId, slug, title_en, title_ar || '', summary_en || '', summary_ar || '', body_en || '', body_ar || '', category || 'general', audience || 'both', JSON.stringify(tags || []), published === true, req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) {
        console.error('POST /api/kb/articles', err);
        if (err.message.includes('unique') || err.message.includes('duplicate')) return res.status(409).json({ error: 'slug_already_exists' });
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/kb/faqs
// ============================================================
router.get('/faqs', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { category } = req.query;
        const conditions = ['tenant_id = $1', 'published = TRUE'];
        const params = [req.tenantId];
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        const r = await db.query(`
            SELECT id, question_en, question_ar, answer_en, answer_ar, category, sort_order
            FROM faqs WHERE ${conditions.join(' AND ')}
            ORDER BY sort_order ASC, id ASC
        `, params);
        res.json({ ok: true, total: r.rows.length, faqs: r.rows });
    } catch (err) {
        console.error('GET /api/kb/faqs', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/kb/faqs — staff creates FAQ
// ============================================================
router.post('/faqs', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { question_en, question_ar, answer_en, answer_ar, category, sort_order } = req.body;
        if (!question_en || !answer_en) return res.status(400).json({ error: 'missing_required', required: ['question_en', 'answer_en'] });
        const r = await db.query(`
            INSERT INTO faqs (tenant_id, question_en, question_ar, answer_en, answer_ar, category, sort_order)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, question_en, question_ar || '', answer_en, answer_ar || '', category || 'general', sort_order || 0]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) {
        console.error('POST /api/kb/faqs', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/kb/seed-defaults — seed standard hospital FAQs + articles
// ============================================================
router.post('/seed-defaults', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const defaults = [
            // FAQs
            { type: 'faq', q_en: 'How do I book an appointment?', q_ar: 'كيف أحجز موعداً؟', a_en: 'Log in to the patient portal and click "Request Appointment".', a_ar: 'سجّل دخول إلى بوابة المريض واضغط "طلب موعد".', category: 'appointments', order: 1 },
            { type: 'faq', q_en: 'How do I view my lab results?', q_ar: 'كيف أعرض نتائج تحاليل؟', a_en: 'Go to the patient portal and click "My Lab Results".', a_ar: 'اذهب إلى بوابة المريض واضغط "نتائج تحاليل".', category: 'labs', order: 2 },
            { type: 'faq', q_en: 'How can I update my allergies?', q_ar: 'كيف أحدّث حساسيتي؟', a_en: 'Ask your nurse or doctor to update your allergies at your next visit.', a_ar: 'اطلب من الممرض أو الطبيب تحديث حساسيتك في زيارتك القادمة.', category: 'allergies', order: 3 },
            { type: 'faq', q_en: 'Is my health data secure?', q_ar: 'هل بياناتي الصحية آمنة؟', a_en: 'Yes. We follow Saudi PDPL and HIPAA standards. Data is encrypted at rest and in transit.', a_ar: 'نعم. نتبع معايير PDPL السعودية و HIPAA. البيانات مشفّرة.', category: 'privacy', order: 4 }
        ];
        let inserted = 0;
        for (const d of defaults) {
            if (d.type === 'faq') {
                await db.query(`
                    INSERT INTO faqs (tenant_id, question_en, question_ar, answer_en, answer_ar, category, sort_order)
                    VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING
                `, [req.tenantId, d.q_en, d.q_ar || '', d.a_en, d.a_ar || '', d.category, d.order]).catch(() => {});
                inserted++;
            }
        }
        res.json({ ok: true, inserted_count: inserted, message: 'Default FAQs seeded' });
    } catch (err) {
        console.error('POST /api/kb/seed-defaults', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['articles', 'article-by-slug', 'helpful', 'faqs', 'seed-defaults'], timestamp: new Date().toISOString() });
});

module.exports = router;