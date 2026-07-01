# حزمة فحص الإنتاج بوضعية القراءة فقط لترقية المنشآت (PHASE_FACILITY_PRODUCTION_READONLY_PREFLIGHT_OWNER_PACKET_AR)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المستند:** استبيان مطابقة الإنتاج read-only الفعلي
* **الجهة المعنية:** مالك المشروع / فريق DevOps
* **الوضعية:** معلق بانتظار استلام الأدلة والإجابات المعتمدة ⏳

---

## استبيان DevOps لمطابقة الإنتاج (Production Read-only Verification Packet)

نموذج الإقرار المسجل (الحالة المحافظة لعدم تزويد إقرار مستند فعلي):

```text
OWNER_DEVOPS_PRODUCTION_READINESS_ATTESTATION

1. هل تم تنفيذ فحص Production بطريقة read-only فقط؟
الإجابة: NO

2. هل تم تنفيذ أي write أو DDL أو migration أو deploy على Production؟
الإجابة: NO

3. هل الجداول الـ 17 الخاصة بمنصة المنشآت موجودة مسبقًا في Production؟
الإجابة: UNKNOWN

4. هل جدول `facilities` موجود في Production؟
الإجابة: UNKNOWN

5. هل توجد تعارضات schema في Production مثل أسماء جداول/أعمدة/قيود؟
الإجابة: UNKNOWN

6. هل RLS/FORCE RLS الحالي في Production متوافق مع الخطة؟
الإجابة: UNKNOWN

7. هل DB role المستخدم للتطبيق في Production ليس SUPERUSER؟
الإجابة: UNKNOWN

8. هل DB role المستخدم للتطبيق في Production ليس BYPASSRLS؟
الإجابة: UNKNOWN

9. هل يوجد backup رسمي قابل للاستعادة قبل أي نشر Production؟
الإجابة: NO

10. نوع النسخة الاحتياطية:
الإجابة: NOT_APPLICABLE

11. هل تم التحقق من قابلية الاستعادة أو وجود restore drill؟
الإجابة: NO

12. قرار فجوة اختبارات DB/server الـ 48 skipped:
الإجابة: NO_DECISION

13. هل تم طباعة أي passwords أو tokens أو connection strings أو محتوى `.env`؟
الإجابة: NO

OWNER_DECISION:
PRODUCTION_READINESS_STILL_BLOCKED
```
