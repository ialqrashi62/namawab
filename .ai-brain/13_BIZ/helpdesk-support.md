# Helpdesk & Support System — NamaMedical ERP
# Filepath: .ai-brain/13_BIZ/helpdesk-support.md
# Generated: 2026-08-08

# Helpdesk & Support System

> **Channels:** In-app tickets + Email + WhatsApp + Phone
> **SLA:** 24h email / 1h phone (Enterprise)
> **Knowledge Base:** 200+ articles (AR + EN)

---

## 1. Ticket Categories

| Category | Subcategory | SLA | Escalation |
|---|---|---|---|
| **Critical (P0)** | Production down, data loss | 1h | CTO + on-call |
| | Security breach | 1h | Security lead + CTO |
| | PHI leak | 1h | Compliance + CTO |
| **High (P1)** | Major feature broken | 4h | Backend lead |
| | Cross-tenant data exposure | 4h | Security |
| **Medium (P2)** | Minor bug | 24h | Dev team |
| | Performance issue | 24h | DevOps |
| **Low (P3)** | Cosmetic / feature request | 7d | Product team |

---

## 2. In-App Ticket Widget

```javascript
// filepath: namaweb/public/js/helpdesk_widget.js
(function(global) {
  'use strict';

  const HelpdeskWidget = {
    state: { open: false, ticketId: null },

    mount(rootSel, ctx) {
      this.root = document.querySelector(rootSel);
      if (!this.root) return;
      this.ctx = ctx || {};
      this.render();
      this.bindEvents();
    },

    render() {
      this.root.innerHTML = `
        <button class="helpdesk-fab" id="hd-fab" aria-label="Open helpdesk">
          <span aria-hidden="true">?</span>
        </button>
        <div class="helpdesk-panel" id="hd-panel" hidden>
          <header class="helpdesk-panel__header">
            <h2>${this.ctx.lang === 'ar' ? 'الدعم الفني' : 'Helpdesk'}</h2>
            <button class="hd-close" id="hd-close">×</button>
          </header>
          <div class="helpdesk-panel__body">
            <div class="hd-quick-links">
              <button data-action="search">${this.ctx.lang === 'ar' ? 'البحث في المقالات' : 'Search KB'}</button>
              <button data-action="ticket">${this.ctx.lang === 'ar' ? 'فتح تذكرة' : 'Open Ticket'}</button>
              <button data-action="chat">${this.ctx.lang === 'ar' ? 'دردشة مباشرة' : 'Live Chat'}</button>
              <button data-action="call">${this.ctx.lang === 'ar' ? 'اتصل بنا' : 'Call Us'}</button>
            </div>
            <div class="hd-ticket-form" hidden id="hd-form">
              <select id="hd-category">
                <option>${this.ctx.lang === 'ar' ? 'مشكلة تقنية' : 'Technical Issue'}</option>
                <option>${this.ctx.lang === 'ar' ? 'سؤال سريري' : 'Clinical Question'}</option>
                <option>${this.ctx.lang === 'ar' ? 'طلب ميزة' : 'Feature Request'}</option>
                <option>${this.ctx.lang === 'ar' ? 'مشكلة فوترة' : 'Billing Issue'}</option>
              </select>
              <select id="hd-priority">
                <option value="low">${this.ctx.lang === 'ar' ? 'منخفض' : 'Low'}</option>
                <option value="medium" selected>${this.ctx.lang === 'ar' ? 'متوسط' : 'Medium'}</option>
                <option value="high">${this.ctx.lang === 'ar' ? 'عالي' : 'High'}</option>
                <option value="critical">${this.ctx.lang === 'ar' ? 'حرج' : 'Critical'}</option>
              </select>
              <textarea id="hd-description" placeholder="${this.ctx.lang === 'ar' ? 'صف المشكلة...' : 'Describe the issue...'}"></textarea>
              <button class="btn btn--primary" id="hd-submit">${this.ctx.lang === 'ar' ? 'إرسال' : 'Submit'}</button>
            </div>
            <div class="hd-my-tickets" id="hd-tickets"></div>
          </div>
        </div>
      `;
    },

    bindEvents() {
      this.root.querySelector('#hd-fab').addEventListener('click', () => this.toggle());
      this.root.querySelector('#hd-close').addEventListener('click', () => this.toggle(false));
      this.root.querySelectorAll('.hd-quick-links button').forEach(btn => {
        btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
      });
      this.root.querySelector('#hd-submit').addEventListener('click', () => this.submitTicket());
    },

    toggle(force) {
      const panel = this.root.querySelector('#hd-panel');
      this.state.open = force !== undefined ? force : !this.state.open;
      panel.hidden = !this.state.open;
    },

    async handleAction(action) {
      const api = (window.DeptStations && window.DeptStations.api) || null;
      switch (action) {
        case 'search':
          window.open('https://jumanasoft.com/help', '_blank');
          break;
        case 'ticket':
          this.root.querySelector('#hd-form').hidden = false;
          break;
        case 'chat':
          if (api) {
            const res = await api.post('/helpdesk/chat/session', {}, { tenantId: this.ctx.tenantId });
            if (res.session_url) window.open(res.session_url, '_blank');
          }
          break;
        case 'call':
          window.location.href = 'tel:+966-XXX-XXXX';
          break;
      }
    },

    async submitTicket() {
      const category = this.root.querySelector('#hd-category').value;
      const priority = this.root.querySelector('#hd-priority').value;
      const description = this.root.querySelector('#hd-description').value;
      const api = (window.DeptStations && window.DeptStations.api) || null;
      if (!api || !description) return;
      try {
        const res = await api.post('/helpdesk/tickets', { category, priority, description }, { tenantId: this.ctx.tenantId });
        if (res.ticket_id) {
          this.state.ticketId = res.ticket_id;
          this.root.querySelector('#hd-description').value = '';
          this.root.querySelector('#hd-form').hidden = true;
          alert(this.ctx.lang === 'ar' ? 'تم فتح التذكرة رقم ' + res.ticket_id : 'Ticket #' + res.ticket_id + ' opened');
          this.loadMyTickets();
        }
      } catch (e) {
        console.error('Helpdesk submit failed:', e);
      }
    },

    async loadMyTickets() {
      const api = (window.DeptStations && window.DeptStations.api) || null;
      if (!api) return;
      try {
        const res = await api.get('/helpdesk/tickets/mine', { tenantId: this.ctx.tenantId });
        const tickets = res.items || [];
        const html = tickets.map(t => `
          <div class="hd-ticket hd-ticket--${t.priority}">
            <div class="hd-ticket__header">
              <span class="hd-ticket__id">#${t.id}</span>
              <span class="hd-ticket__status">${t.status}</span>
            </div>
            <div class="hd-ticket__body">${this.escapeHtml(t.description)}</div>
          </div>
        `).join('');
        this.root.querySelector('#hd-tickets').innerHTML = html;
      } catch (e) {
        console.error('Load tickets failed:', e);
      }
    },

    escapeHtml(s) {
      return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },

    unload() {
      if (this.root) this.root.innerHTML = '';
    },
  };

  global.HelpdeskWidget = HelpdeskWidget;
})(window);
```

---

## 3. Backend Routes (Express)

```javascript
// filepath: namaweb/helpdesk_routes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope } = require('./middleware');

module.exports = (pool) => {
  // Create ticket
  router.post('/tickets', requireAuth, requireTenantScope, async (req, res) => {
    try {
      const { category, priority, description } = req.body;
      const result = await pool.query(
        `INSERT INTO helpdesk_tickets (tenant_id, user_id, category, priority, description, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'open', now(), now())
         RETURNING id`,
        [req.tenantId, req.user.id, category, priority, description]
      );
      // Notify on-call
      const ticketId = result.rows[0].id;
      if (priority === 'critical') {
        // PagerDuty trigger (mock)
        console.error(`[HELPDESK CRITICAL] Ticket #${ticketId}: ${description}`);
      }
      res.status(201).json({ ok: true, ticket_id: ticketId });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // List user's tickets
  router.get('/tickets/mine', requireAuth, requireTenantScope, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, category, priority, description, status, created_at
         FROM helpdesk_tickets
         WHERE tenant_id = $1 AND user_id = $2
         ORDER BY created_at DESC
         LIMIT 50`,
        [req.tenantId, req.user.id]
      );
      res.json({ ok: true, items: result.rows });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Chat session start (intercom-style)
  router.post('/chat/session', requireAuth, requireTenantScope, async (req, res) => {
    try {
      const sessionId = `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const sessionUrl = `https://chat.jumanasoft.com/${sessionId}`;
      res.json({ ok: true, session_url: sessionUrl, session_id: sessionId });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  return router;
};
```

---

## 4. Knowledge Base (200+ articles)

### 4.1 Topics

- Getting Started (15 articles)
- Cardiology (20 articles)
- Each of 60 departments × 2-3 articles = 120-180 articles
- Admin & Setup (10 articles)
- Security & Compliance (15 articles)
- API & Integration (15 articles)
- Troubleshooting (30 articles)

### 4.2 Top 20 FAQ

1. **كيف أسجل دخول لأول مرة؟** (How do I login for the first time?)
2. **Forgot password** (English)
3. **How to add a new patient?**
4. **ما هو الفرق بين Owner/Admin/Doctor؟** (Golden Access Rule)
5. **كيف أوقع على طلب؟** (How do I sign an order?)
6. **How does cross-tenant isolation work?**
7. **هل يدعم الذكاء الاصطناعي؟** (Does it support AI?)
8. **NPHIES claim submission guide**
9. **ZATCA Phase 2 setup**
10. **SFDA drug interaction check**
11. **RAG / LangChain setup**
12. **Backup and restore**
13. **Performance tuning**
14. **SSL/TLS configuration**
15. **Mobile access**
16. **Voice input (Whisper)**
17. **Custom reports**
18. **Bulk data export**
19. **Audit log queries**
20. **CBAHI preparation**

---

## 5. SLA Matrix

| Tier | Email Response | Phone Response | Resolution Time |
|---|---|---|---|
| Community (Free) | 48h | None | 30d |
| Professional ($5k) | 24h | None | 7d |
| Enterprise ($30k) | 4h | 1h | 24h |
| Sovereign ($50k) | 1h | 15min | 4h |

---

## 6. Support Channels

| Channel | Hours | Languages |
|---|---|---|
| **Email** | 24/7 | AR + EN |
| **WhatsApp** | 08:00-20:00 AST | AR + EN |
| **Phone** | 08:00-20:00 AST | AR + EN (Enterprise+) |
| **In-app chat** | 24/7 (Enterprise) | AR + EN |
| **Slack Connect** | 24/7 (Sovereign) | AR + EN |
| **On-site visit** | By appointment | AR + EN |

---

## 7. Metrics

| Metric | Target |
|---|---|
| First response time | < SLA |
| Resolution rate (first contact) | > 70% |
| Customer satisfaction (CSAT) | > 4.5/5 |
| Ticket volume / month | Track for staffing |
| KB article helpfulness | > 80% |

---

**Generated:** 2026-08-08 · **Owner:** Support Team
