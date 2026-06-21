# Gate 1 — Target Role Verification (nama_medical_app)

> المرحلة: `P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION` | التاريخ: 2026-06-21 | read-only، بلا طباعة أسرار.

```text
role exists: nama_medical_app — YES
rolcanlogin: true
rolsuper: false
rolbypassrls: false
schema public USAGE: true
table DML coverage: 149/149 base tables لديها SELECT+INSERT+UPDATE+DELETE (MISSING: NONE)
sequence USAGE: 147/147
TARGET_ROLE_READY: YES
```

الدور مُهيّأ بالكامل (صلاحيات DML كاملة، غير-superuser، غير-bypassrls). لا فجوات صلاحيات تكسر التطبيق بعد التبديل.

`TARGET_ROLE_VERIFY: PASS — ROLE READY`
