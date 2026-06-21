# P0 — خطة التراجع لتحويل دور التشغيل (Rollback Plan)

> المرحلة: `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE` — البوابة 4 | التاريخ: 2026-06-21.

## الوضع الحالي الموثّق
- دور التطبيق الحالي: **`postgres`** (في `namaweb/.env` ⇒ `DB_USER=postgres`).
- التطبيق online على PM2 بهذا الدور (مستقر).

## خطة التراجع (إذا فشل التحويل لاحقاً)
1. **نسخ احتياطي لـ `.env`**: قبل أي تعديل، تُؤخذ نسخة من `namaweb/.env` إلى مسار محلي خارج المستودع (لا يُطبع محتواه، لا يُلتزم في git).
2. **التراجع الفوري**: إعادة `DB_USER=postgres` (و`DB_PASSWORD` الأصلي) في `.env` ثم `pm2 restart nama-app`.
3. **التحقق بعد التراجع**: `/api/health`=200، :3000 مفتوح، login يعمل.
4. **لا تراجع DB مطلوب**: التحويل لا يغيّر مخططاً ولا بيانات ولا سياسات RLS — مجرد دور اتصال؛ التراجع = تغيير سطر بيئة + restart.
5. **GRANTs**: لا تُحذف عند التراجع (غير ضارة؛ الدور يبقى موجوداً جاهزاً لمحاولة لاحقة). إن لزم حذفها: `_rollback_notes.sql` للمرشّح.

## ضوابط
- لا طباعة أسرار (DB_PASSWORD/SESSION_SECRET) في أي وقت.
- `.env` يبقى gitignored (لا يدخل git).
- التراجع code/config-only، فوري، بلا فقد بيانات.

```text
GATE4_STATUS: ROLLBACK_PLAN_READY
ROLLBACK_TYPE: env DB_USER revert to postgres + pm2 restart (instant, no data loss)
NEXT: (Gate 5/6 switch) — مشروط بتوفير سرّ الدور + موافقة التنفيذ
```

`RLS_RUNTIME_ROLE_ROLLBACK_PLAN_COMPLETE`
