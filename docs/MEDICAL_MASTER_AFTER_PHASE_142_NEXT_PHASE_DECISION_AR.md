# قرار المرحلة التالية بعد Phase 142 (Master Decision)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_AFTER_PHASE_142` | التاريخ: 2026-06-21.

```text
SELECTED_NEXT_PHASE: P1_PHI_CLASS_A_RESIDUAL_RLS_REHEARSAL (نُفِّذ على DB معزول throwaway)
PRIORITY_LEVEL: P1 (أعزل/RLS — أعلى عمل آمن لا يغيّر الإنتاج بعد تعذّر P0)
WHY_SELECTED:
  - تبديل دور RLS (P0) غير قابل للتنفيذ هذه الجولة (لا أمر صريح + لا سر).
  - أعلى عمل آمن متبقٍ على محور العزل هو إثبات مرشحات RLS لطبقة PHI Class A المتبقية.
  - الـ rehearsal يُثبت أمرين بقيمة مزدوجة: (أ) أنّ candidate الـ PHI Class A يُطبَّق نظيفاً ويتراجع نظيفاً، و(ب) أنّ RLS **يُنفَّذ فعلاً** تحت دور غير-superuser (آلية fail-closed) — وهي نفس الآلية التي سيعتمدها تبديل الدور لاحقاً، فيُخفِّض مخاطر المرحلتين معاً.
  - لا كود runtime، لا لمس إنتاج، لا تضخيم backlog غير منشور.
WHY_NOT_RLS_ROLE_SWITCH:
  - الأمر الصريح SECRET_READY_EXECUTE_SWITCH لم يصدر (ورد شرطياً فقط).
  - السر غير موجود في البيئة (.env DB_USER=postgres ؛ كلمة مرور nama_medical_app خارج الشات بمصادقة scram). ممنوع التخمين أو الطباعة.
WHY_NOT_PHI_CLASS_A_DDL (الإنتاج):
  - تطبيق الـ DDL على الإنتاج يحتاج موافقة صريحة (APPROVE_DDL). الـ rehearsal هو السابقة الآمنة الصحيحة قبل طلب الموافقة.
WHY_NOT_INVOICE_ACCOUNTING:
  - الراية ACCOUNTING_POSTING_ENABLED تبقى OFF بأمر المستخدم؛ لا تفويض تفعيل/journal هذه الجولة.
WHY_NOT_PHARMACY_FEFO:
  - P4 (سلامة سريرية مهمة لكن أدنى من عزل P1)؛ يبقى audit مؤجّل.
WHY_NOT_LAB_RADIOLOGY:
  - P4؛ فصل الموافقات audit مؤجّل، أدنى أولوية من العزل.
WHY_NOT_AUTH_HARDENING:
  - P5 (تقوية تشغيلية: CSRF/lockout/rate-limit)؛ أدنى من P1، يبقى plan مؤجّل.
WHY_NOT_STITCH:
  - BLOCKED_PENDING_MCP_AND_KEY (MCP والمفتاح غير جاهزين) — ممنوع البدء.
BLOCKERS:
  - لا حواجز على الـ rehearsal (DB معزول throwaway، أُسقط بعد التنفيذ).
  - تطبيق PHI Class A على الإنتاج: APPROVE_DDL (مرحلة لاحقة).
APPROVAL_REQUIRED:
  - لا موافقة لازمة للـ rehearsal (لا لمس إنتاج).
  - APPROVE_PHI_CLASS_A_DDL لازم للتطبيق الإنتاجي اللاحق.
EXECUTION_SCOPE:
  - DB معزول throwaway (nama_phi_rehearsal) فقط + دور throwaway (phi_rehearsal_app) — كلاهما أُسقط بعد الاختبار.
  - تقارير + ذاكرة. لا كود runtime، لا DDL إنتاجي، لا بيانات، لا .env، لا أسرار.
```

## قاعدة القرار المطبّقة
- لم يصدر `SECRET_READY_EXECUTE_SWITCH` ⇒ لا تبديل دور.
- اختير من قائمة الأعمال الآمنة: `P1_PHI_CLASS_A_RESIDUAL_RLS_REHEARSAL` (الأعلى أولوية لأنها على محور العزل P1 وتُجهّز لاحقاً لكل من PHI DDL و role switch).
- لم تُفعّل المحاسبة ولا Stitch.

`NEXT_PHASE_DECISION_COMPLETE`
