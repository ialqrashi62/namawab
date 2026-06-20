# P1 — تقرير اختبار Refund IDOR (Test Report)

> المرحلة: `P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX` — البوابة 3 | التاريخ: 2026-06-21 | محلي، بلا قاعدة بيانات.

## الاختبار المُضاف
`namaweb/cross_tenant_refund_idor_test.js` (نمط static audit + simulation، يعمل بلا DB) — **11/11 PASS**.

## مصفوفة التغطية
| Test | Expected | النتيجة |
| ---- | -------- | ------- |
| tenant 1 يسترد فاتورته | allowed (يجد الفاتورة) | ✅ |
| tenant 999 يسترد فاتورة tenant 1 | blocked (لا تطابق → 404) | ✅ |
| سياق مستأجر مفقود | blocked (لا تطابق؛ +`requireTenantScope` 403 إنتاجاً) | ✅ |
| id فقط بلا تطابق tenant | blocked | ✅ |
| المسار يستخدم `requireTenantScope` | موجود | ✅ |
| القراءة `WHERE id=$1 AND tenant_id=$2` | موجود | ✅ |
| لا بقاء للنمط المعرّض (id فقط) | لا يوجد | ✅ |
| refund لا يُنشئ journal والعلم OFF | `runEventWithPosting` flag-governed؛ لا تفعيل | ✅ |
| الإصلاح لا يفعّل العلم المحاسبي | غير مفعّل | ✅ |
| node --check server.js | OK | ✅ |

## الانحدار (regression)
| Suite | النتيجة |
| ----- | ------- |
| cross_tenant_leak_test | ✅ (exit 0) |
| cross_tenant_facility_entitlement_test | ✅ 41/0 |
| cross_tenant_facility_failclosed_test | ✅ 50/0 |
| cross_tenant_wave2_modules_test | ✅ 38/0 |
| accounting_posting_test | ✅ 28/0 |

> ملاحظة: اختبار عزل DB حيّ (tenant 999 فعلياً) يتطلّب قاعدة + دور غير-superuser؛ هنا اعتُمد نمط المستودع (static+simulation). التحقّق الحيّ الكامل يُجرى ضمن النشر المحكوم/بيئة بروفة.

```text
GATE3_STATUS: TESTS_PASS
IDOR_TEST: 11/11 ; REGRESSION: green ; NODE_CHECK: OK
NEXT: GATE4_REGRESSION → GATE5_READINESS
```

`REFUND_IDOR_TEST_REPORT_COMPLETE`
