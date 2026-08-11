# Admin UI — Specification (Wave 51)

> Owner/Admin panel. Single-page, RTL/LTR, WCAG 2.1 AA.

## File: `namaweb/public/admin-panel.js`

| Area | Widget | API |
|---|---|---|
| **Dashboard** | KPI cards (revenue, encounters, alerts, uptime) | `GET /api/admin/kpis` |
| **Tenants** | Table (CRUD, search, filter, freeze/unfreeze) | `GET/POST/PUT/DELETE /api/admin/tenants` |
| **Users** | Table (CRUD, role assign, MFA reset, deactivate) | `GET/POST/PUT /api/admin/users` |
| **Audit Log** | Stream + filter (user, action, date, hash verify) | `GET /api/admin/audit?filter=...` |
| **Compliance** | Cards: NPHIES, ZATCA, CBAHI, PDPL, HIPAA | `GET /api/admin/compliance` |
| **RBAC** | Matrix view (role × permission) | `GET /api/admin/rbac` |
| **System** | Health, migrations, secrets, env | `GET /api/admin/system` |
| **Observability** | Embed Grafana iframe (4 dashboards) | — |
| **LangSmith** | LLM cost, traces, errors | `GET /api/admin/llm` |
| **Helpdesk** | Ticket list + assignment | `GET /api/admin/helpdesk` |

## File: `namaweb/admin.html`

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>NamaMedical Admin</title>
  <link rel="stylesheet" href="/css/tailwind.css">
  <link rel="stylesheet" href="/css/admin.css">
  <script src="/js/modal.js"></script>
</head>
<body>
  <nav id="admin-sidebar" aria-label="Admin navigation"></nav>
  <main id="admin-main" role="main"></main>
  <script type="module" src="/js/admin-panel.js"></script>
</body>
</html>
```

## RBAC: Owner + Admin only

- `requireRole(['owner', 'admin'])` on every `/api/admin/*` route
- 2FA mandatory (MFA TOTP) — no exception
- All admin actions write to audit_log with `actor_role: 'admin'`

## i18n keys (AR primary)

```yaml
admin.dashboard.title: "لوحة الإدارة"
admin.tenants.title: "المستأجرون"
admin.users.title: "المستخدمون"
admin.audit.title: "سجل التدقيق"
admin.compliance.title: "الامتثال"
admin.rbac.title: "الصلاحيات"
admin.system.title: "النظام"
admin.observability.title: "المراقبة"
admin.llm.title: "تتبع الذكاء الاصطناعي"
admin.helpdesk.title: "الدعم الفني"
```

## Definition of Done

- [ ] All 10 areas render in AR + EN
- [ ] RTL flips correctly when `lang='en'`
- [ ] All forms use Modal framework (no raw `alert()`)
- [ ] Audit log writes to hash chain
- [ ] MFA enforced on /admin route
- [ ] Keyboard navigable (Tab/Enter/Esc)
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Lighthouse accessibility ≥ 95
