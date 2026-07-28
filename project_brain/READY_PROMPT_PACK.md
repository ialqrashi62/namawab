# 📦 READY PROMPT PACK — T1 (RAG Deploy) + T2 (Secret Rotation)
**تاريخ التوليد**: 2026-07-24
**المرجع الأعلى**: [AGENTS.md](../../AGENTS.md) — 13 سكة أمان
**الخطة المصدر**: [project_brain/plans/plan-2026-07-24-0053.md](../plans/plan-2026-07-24-0053.md)
**الفحص المصدر**: [project_brain/scans/scan-2026-07-24-0053.json](../scans/scan-2026-07-24-0053.json)
**موافقة المالك**: ✅ صريحة (USER اختار "1" = T1 + T2)
**المنفّذ**: أنت (المالك) — هذه الحزمة للنُسخ/اللصق

---

## ⏱️ الوقت المتوقع
- **T1** (نشر RAG): **30 دقيقة** (يشمل انتظار + تأكيد)
- **T2** (تدوير أسرار): **15 دقيقة** (5 أسرار × 3 دقائق)
- **إجمالي**: ~45 دقيقة

---

## 🎯 TASK 1 — P0: نشر RAG-grounded AI Copilot Fix

### المتطلبات قبل البدء
- ✅ جهاز Windows / macOS / Linux عنده SSH
- ✅ الوصول إلى Hetzner server (204.168.144.74) عبر SSH
- ✅ ملف مُجهَّز: `namaweb/.deploy_staging_2026-07-23_ragfix/clinical_knowledge_rag.js` (6,005 bytes، `node --check` ✅)
- ✅ دليل النشر: `ops/live_deploy/DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md` (13 قسم)

### الخطوة 1.1 — الاتصال بالخادم
```bash
ssh namaweb@204.168.144.74
cd /var/www/namaweb
git status  # تأكد أن الفرع = integration/all-epics
```

### الخطوة 1.2 — النسخ الاحتياطي للملف الحالي
```bash
sudo cp clinical_knowledge_rag.js clinical_knowledge_rag.js.bak-2026-07-24
ls -la clinical_knowledge_rag.js*
# المتوقع: original + backup
```

### الخطوة 1.3 — نقل الملف الجديد
من جهازك المحلي:
```bash
# في PowerShell من جذر المشروع
scp namaweb/.deploy_staging_2026-07-23_ragfix/clinical_knowledge_rag.js namaweb@204.168.144.74:/tmp/
```

على الخادم (بعد النقل):
```bash
sudo cp /tmp/clinical_knowledge_rag.js /var/www/namaweb/clinical_knowledge_rag.js
sudo chown namaweb:namaweb /var/www/namaweb/clinical_knowledge_rag.js
sudo chmod 644 /var/www/namaweb/clinical_knowledge_rag.js
```

### الخطوة 1.4 — فحص السلامة قبل reload
```bash
# على الخادم
cd /var/www/namaweb
node --check clinical_knowledge_rag.js
# المتوقع: لا output (syntax OK)

# اختبار سريع بدون reload
node -e "const r=require('./clinical_knowledge_rag.js'); console.log(Object.keys(r).slice(0,5))"
# المتوقع: أسماء الدوال المُصدَّرة
```

### الخطوة 1.5 — Reload عبر PM2 (zero-downtime)
```bash
pm2 reload nama-medical-erp
pm2 logs nama-medical-erp --lines 30 --nostream
# المتوقع: "Server listening" + صفر stack traces
```

### الخطوة 1.6 — التحقق من النشر
```bash
# من الخادم
curl -sS http://localhost:3000/api/ai/status
# المتوقع: {"ok":true,"provider":"openai","model":"gpt-4","rag_grounded":true,...}

# من جهازك
curl -sS https://jumanasoft.com/api/ai/status
# المتوقع: نفس الـ payload (لكن live=true)
```

### الخطوة 1.7 — Rollback (إذا لزم، <30 ثانية)
```bash
sudo cp /var/www/namaweb/clinical_knowledge_rag.js.bak-2026-07-24 /var/www/namaweb/clinical_knowledge_rag.js
pm2 reload nama-medical-erp
```

### الخطوة 1.8 — إغلاق في CHANGELOG + قالب
افتح [project_brain/closeouts/T1_RAG_LIVE_DEPLOY_2026-07-24_AR.md](../closeouts/T1_RAG_LIVE_DEPLOY_2026-07-24_AR.md) وعبّأ:
- تاريخ النشر الفعلي
- نتائج `node --check` و `curl /api/ai/status`
- commit SHA بعد النشر
- أي ملاحظات

ثم في `docs/CHANGELOG.md`، تحت `[Unreleased] → Added`، أضف:
```markdown
### Added — YYYY-MM-DD (RAG-grounded AI Copilot — Deployed)
- Live deployment of RAG-grounded AI Copilot fix to Hetzner 204.168.144.74.
- See `docs/PHASE_RAG_LIVE_DEPLOY_<DATE>_AR.md` for closeout evidence.
```

---

## 🎯 TASK 2 — P0 (مالك فقط): تدوير 5 أسرار إنتاجية

> **⚠️ مهم**: لا تنفّذ هذا وأنت غير متأكد أنك المالك. PHASE 1B تم تنقيحه برمجياً، لكن قيمه **محروقة** في تاريخ Git.

### القائمة الـ 5
| # | السر | مكانه السابق | نوع الـ rotation |
|---|---|---|---|
| 1 | MSSQL `sa` password | deploy/restore + dev-tooling + CI | Database user |
| 2 | PostgreSQL app user (`namasoft` / `nama_app_user`) | setup_server.sh + deploy_web.sh | Database user |
| 3 | `JWT_SECRET` | deploy_web.sh + runbooks | Env var |
| 4 | `SESSION_SECRET` | deploy_web.sh + redeploy_new.sh | Env var |
| 5 | E2E test password | `.env.example` (placeholder) | Env var |

### الخطوة 2.1 — توليد الـ 5 secrets جديدة
افتح [project_brain/secrets-rotation.ps1](../secrets-rotation.ps1) أو شغّله:

```powershell
# على Windows
powershell -ExecutionPolicy Bypass -File .\project_brain\secrets-rotation.ps1
```

السكربت سيُظهر:
- 5 قيم base64 (48 بايت لكل)
- أوامر النسخ الاحتياطي
- أوامر التطبيق (بدون طباعة القيم على الشاشة بشكل كامل — يستخدم `[Environment]::SetEnvironmentVariable`)

### الخطوة 2.2 — تحديث vault / `.env` على الخادم
```bash
# على الخادم
ssh namaweb@204.168.144.74
sudo nano /etc/namaweb/.env
# استبدل القيم الـ 5 بالقيم الجديدة
# احفظ (Ctrl+O, Enter, Ctrl+X)
sudo chmod 600 /etc/namaweb/.env
```

### الخطوة 2.3 — تحديث قاعدة البيانات (MSSQL + PostgreSQL)
```bash
# MSSQL (rotated secret #1)
sudo docker exec -it nama-mssql /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P '<OLD_PASSWORD>' \
  -Q "ALTER LOGIN sa WITH PASSWORD = '<NEW_PASSWORD>'"

# PostgreSQL (rotated secret #2)
sudo -u postgres psql -c "ALTER USER nama_app_user WITH PASSWORD '<NEW_PASSWORD>';"
```

### الخطوة 2.4 — Reload الـ app
```bash
pm2 reload nama-medical-erp
pm2 logs nama-medical-erp --lines 20 --nostream
# المتوقع: "Server listening" + 0 errors
```

### الخطوة 2.5 — التحقق
```bash
# من الخادم
curl -sS https://jumanasoft.com/api/health
# المتوقع: {"ok":true,"db":"up","redis":"up",...}

# اختبار login
curl -sS -X POST https://jumanasoft.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<admin_password>"}'
# المتوقع: 200 + session cookie
```

### الخطوة 2.6 — إغلاق في CHANGELOG
في `docs/CHANGELOG.md`، تحت `[Unreleased] → Security`:
```markdown
### Security — YYYY-MM-DD (Production Secret Rotation — PHASE 1B Closeout)
- Rotated 5 production secrets: MSSQL sa / PG app user / JWT_SECRET / SESSION_SECRET / E2E_TEST_PASSWORD.
- Old values remain in Git history (history rewrite deferred to separate owner-authorized operation).
- See `docs/PHASE_<DATE>_SECRET_ROTATION_CLOSEOUT_AR.md` for full evidence.
```

---

## 🛡️ قائمة التحقق من سكك الأمان الـ 13 (من AGENTS.md)

| # | السكة | الحالة |
|---|---|---|
| 1 | default to wait, never assume go by silence | ✅ أنت وافقت صراحة |
| 2 | موافقة صريحة لكل تغيير في namaweb/ migrations/ server.js | ✅ T1 فقط يلمس namaweb/clinical_knowledge_rag.js |
| 3 | Phase-by-Phase | ✅ T1 → T2 بالترتيب |
| 4 | Read-only أولاً | ✅ كل التحضير تم في read-only |
| 5 | Audit trail | ✅ سيُسجَّل في CHANGELOG |
| 6 | Backwards compatibility | ✅ T1 = +22/-3 lines آمن |
| 7 | Migration safety | ✅ لا migrations |
| 8 | JSDoc/TypeScript | ✅ لم يُلمس |
| 9 | No secrets in code | ✅ السكربت يولّد ولا يطبع |
| 10 | HIPAA awareness | ✅ T2 يحمي بيانات المرضى |
| 11 | RTL/LTR support | ✅ لا علاقة |
| 12 | Bilingual (ar+en) | ✅ التوثيق بالعربية |
| 13 | Golden Access Rule | ✅ لم يُلمس |

---

## 📂 المخرجات بعد التنفيذ

| الملف | الحالة بعد التنفيذ |
|---|---|
| `namaweb/clinical_knowledge_rag.js` | محدّث على الخادم، +22/-3 lines |
| `/etc/namaweb/.env` على الخادم | محدّث بالـ 5 secrets الجديدة |
| `docs/CHANGELOG.md` | +2 entries (T1, T2) |
| `project_brain/closeouts/T1_RAG_LIVE_DEPLOY_2026-07-24_AR.md` | مُعبَّأ بالنتائج |
| Git history | لم يتغيّر (لا commits) |
| `docs/PHASE_<DATE>_SECRET_ROTATION_CLOSEOUT_AR.md` | جديد (اختياري لكن موصى به) |

---

## ⏸️ بعد التنفيذ: ارجع إليّ

عند الانتهاء:
1. الصق نتائج `curl /api/ai/status` و `curl /api/health`
2. أخبرني بـ commit SHA (إن وُجد) أو "no commit, deployed directly"
3. سأحدّث `orchestrator-state.json` إلى `Phase 5 (QA)` و أُفعّل QA Agent (سكربتات تحقق إضافية)

**🤖 Multi-Agent Builder v5.0** — Ready Pack Delivered · Awaiting your execution
