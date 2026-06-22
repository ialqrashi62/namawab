# 11 — وثيقة المعمارية (Architecture)

> 2026-06-22 | المعمارية الحالية (من الكود) + الهدف. لا تغيير إنتاجي.

## 1-4 الهدف/النطاق/المنهجية/الأدلة
توصيف فعلي: Node/Express monolith (server.js 7054 سطر) + SPA (app.js 11469 سطر) + PostgreSQL 16 + Redis + PM2 على صندوق win32 واحد، خلف دومين alfaisal-erp.com (health 200).

## المعمارية الحالية
- **System context**: مستخدمون (متصفّح) → Nginx/دومين → Node:3000 → PostgreSQL (nama_medical_web) + Redis (جلسات). تطبيق متعدد المستأجرين.
- **Frontend**: SPA vanilla JS (`pages[]` 51 صفحة، render functions)، Tailwind-compiled + styles.css، RTL عربي، tr() ثنائي اللغة، Chart.js للوحات.
- **Backend**: Express monolith، 377 مسار، middleware: requireAuth/requireRole/requireTenantScope، AsyncLocalStorage لـapp.tenant_id.
- **Database**: 162 جدول، 148 FORCE RLS، 233 فهرس، سياسة `tenant_id=current_setting('app.tenant_id')`، DEFAULT لكل جدول حسّاس.
- **API layer**: REST JSON، session cookie.
- **Auth/RBAC**: connect-redis sessions، ROLE_PERMISSIONS (11 دور)، Admin='*'.
- **Tenant isolation**: طبقتان — DB (RLS بدور non-superuser nama_medical_app) + التطبيق (binding من الجلسة). **أقوى من العزل التطبيقي وحده**.
- **RLS**: مفروض runtime (مُثبَت 3/0/0).
- **Logging/Audit**: logAudit→audit_trail (FORCE، append-only).
- **Caching/Redis**: جلسات؛ التطبيق يرفض MemoryStore في الإنتاج.
- **PM2**: nama-app؛ logon resurrect (HKCU Run) + watchdog كل 5د.
- **Nginx/domain**: alfaisal-erp.com (HTTPS).
- **Backup/restore**: dumps خارجية + down.sql per-batch.
- **Deployment topology**: single-box (لا HA).

## المعمارية الهدف (Target)
- طبقة تكامل **FHIR R4 + HL7 v2** (Mirth-style channel) + integration_settings/integration_channels.
- **PACS/DICOM** خارجي مربوط.
- **NPHIES/ZATCA-2** قنوات.
- **MFA** + secure file vault (PHI مشفّر).
- **Observability**: alerting/APM + SLA dashboard.
- **HA/DR** (مرحلة لاحقة): تكرار DB + failover (single-box حالياً مقبول للقبول الحالي).
- فصل محتمل لـmodules كبيرة لاحقاً (monolith→modular) عند النمو.

## 6-12
المتطلبات: طبقة تكامل + observability + storage آمن. الأولويات: integration (P1)، HA (P2). المخاطر: single-box = نقطة فشل (مخفّفة بـautorecovery). توصيات: إبقاء RLS-first؛ أي خدمة جديدة تحت نفس نمط العزل. Acceptance: حالي+هدف مغطّيان (✅). Next: 12 Security.
