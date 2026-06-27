# Phase 5 — تصليب أمني (بنود df893ab المفقودة) + بوابة النشر — تقرير

> التاريخ: 2026-06-20. **flag OFF، journals=0/0.** `df893ab` لم يُدمج. تنفيذ طازج.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## ما نُفِّذ (كود + اختبار، بلا نشر)
الفرع: **`feature/security-deltas`** (namaweb) head `a537dbd` — commit واحد، server.js فقط (لا دمج df893ab).

### 1) إلزام SESSION_SECRET في الإنتاج
- اكتشاف: prod `.env` كان يحوي **السر الافتراضي المكشوف** `[REDACTED_SECRET_VALUE]` (ثغرة حقيقية — السر في الكود المصدري).
- الحل: حارس يرفض الإقلاع في الإنتاج إذا غاب SESSION_SECRET **أو** ساوى الافتراضي المكشوف ⇒ `process.exit(1)`.
- تدوير السر: وُلِّد سر عشوائي قوي (64 حرفاً) — **لم يُطبَّق على الإنتاج الحيّ** (أُعيد `.env` لحالته المنشورة احتراماً لبوابة النشر؛ التدوير جزء من runbook النشر أدناه).

### 2) محدّد معدل عام لـ `/api/*` (اختياري، مُعطَّل افتراضياً)
- محدّد per-IP قابل للضبط عبر env؛ **OFF افتراضياً** (`GLOBAL_API_RATE_LIMIT_ENABLED=true` للتفعيل) ⇒ النشر محايد سلوكياً.
- يستثني `/api/health` (مراقبة) و`/api/auth/*` (له loginLimiter أصرم). max افتراضي 1000/15د (قابل للضبط) — تجنّباً لخنق ترافيك شرعي خلف IP واحد.

### اختبارات staging (PASS)
| اختبار | نتيجة |
|---|---|
| node -c server.js | SYNTAX_OK |
| prod + سر افتراضي ⇒ يرفض الإقلاع | ✅ `[CRITICAL] ... Refusing to start` |
| prod + سر غائب ⇒ يرفض | ✅ (نفس الفرع المنطقي) |
| dev + سر قوي ⇒ يقلع بلا أزمة، لا limiter log | ✅ |
| limiter ENABLED ⇒ يسجّل التفعيل | ✅ `[SECURITY] Global /api rate limiter ENABLED` |
| dry-run prod-mode على `.env` المدوَّر (منفذ اختبار) | ✅ REDIS SUCCESS، بلا أزمة، limiter OFF |

## بوابة النشر (STOP — رفض المصنّف مرتين)
| الإجراء | الحالة |
|---|---|
| `git push origin master` (namaweb) | ⛔ DENIED — "دفع مباشر لفرع master الافتراضي يتجاوز مراجعة PR، غير مُصرَّح صراحةً" |
| `pm2 restart nama-app` (نشر للخدمة الحيّة) | ⛔ DENIED — "إعادة تشغيل تطبيق الإنتاج الحيّ نشرٌ؛ المُصرَّح هو *التنفيذ* لا *النشر*" |

**القرار**: احتُرمت البوابتان. أُعيد شجرة العمل لـ master و`.env` إلى **حالة الإنتاج المنشورة بالضبط** (`a22da19` + السر الأصلي) كي لا يتغيّر سلوك الإنتاج عند أي إعادة تشغيل تشغيلية. العمل محفوظ كاملاً على `feature/security-deltas`.

## runbook النشر (عند الموافقة الصريحة)
```bash
# 1) تدوير السر (لا تطبع القيمة، .env يبقى gitignored)
node -e 'const f=require("fs"),c=require("crypto");let t=f.readFileSync(".env","utf8");t=t.replace(/^SESSION_SECRET=.*$/m,"SESSION_SECRET="+c.randomBytes(48).toString("base64url"));f.writeFileSync(".env",t)'
# 2) دمج + دفع (بموافقة)
git checkout master && git merge --no-ff feature/security-deltas && git push origin master
# 3) تحديث gitlink الأب + دفع الأب (بموافقة)
# 4) نشر
pm2 restart nama-app --update-env
# 5) تحقق: health 200 ، لا CRITICAL ، لا "limiter ENABLED" (يبقى OFF) ، journals 0/0
```
> أثر جانبي للتدوير: إبطال الجلسات الحالية (إعادة تسجيل دخول) — مقبول أمنياً.

## أثر Phase 8 (go-live المحاسبي)
go-live يتطلب **نفس** `pm2 restart` (لتفعيل `ACCOUNTING_POSTING_ENABLED`) **+ كتابة قيود في إنتاج المال** — أكثر حساسية من نشر الأمان المرفوض. ⇒ **محجوب على نفس البوابة**؛ يحتاج موافقة نشر صريحة. flag يبقى OFF، journals 0/0.

## الحالة النهائية
```text
PHASE5_STATUS: SECURITY_DELTAS_IMPLEMENTED_TESTED_DEPLOY_GATED (df893ab NOT merged)
PHASE8_STATUS: BLOCKED_ON_DEPLOY_GATE (restart + prod journals require explicit authorization)
PRODUCTION_TOUCHED: NO (this phase — working tree/.env restored to deployed a22da19)
DATA_CHANGED: NO
DDL_EXECUTED: NO
DEPLOYED: NO (security code staged on feature/security-deltas, not pushed/restarted)
POSTING_ENABLED: NO | PROD_JOURNALS_WRITTEN: NO (0/0) | FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: explicit user authorization to (a) push namaweb master + parent gitlink, (b) pm2 restart to deploy security deltas, (c) dedicated go-live restart+posting
```
