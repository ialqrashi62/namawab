# Phase A1 — نطاق التنفيذ (Implementation Scope)

> 2026-06-22 | نطاق دقيق للكود المطلوب. **candidate — لم يُنفَّذ على الكود الحيّ** (للحفاظ على main نظيفة + لأن كود السجل السريري الحيّ يحتاج موافقة نشر صريحة). يُنفَّذ بعد موافقة gate.

## API (namaweb/server.js)
| المسار | الفعل | الحارس | المنطق |
|---|---|---|---|
| `POST /api/medical-records/:id/sign` | توقيع+قفل | requireAuth + requireRole('doctor') + requireTenantScope | `UPDATE medical_records SET emr_status='locked', signed_by_user_id=<session>, signed_at=now(), locked_at=now(), integrity_hash=<hash(content)> WHERE id=$1 AND tenant_id=$2 AND emr_status<>'locked'` → rowCount 0 ⇒ 409 (مقفل/غير موجود)؛ logAudit SIGN_RECORD/LOCK_RECORD |
| `POST /api/medical-records/:id/amend` | تعديل بعد القفل | requireAuth + requireRole('doctor') + requireTenantScope | يتطلّب reason؛ يُدرج صف `emr_amendments` (record_type/id/amended_by/reason/previous_integrity_hash/summary)؛ logAudit AMEND_RECORD؛ لا يعدّل الأصل صامتاً |
| تحصين UPDATE/DELETE القائمة على الجداول المستهدفة | منع تعديل المقفل | (نفس الحارس) | إضافة `AND emr_status<>'locked'` لكل UPDATE/DELETE؛ rowCount 0 ⇒ 409 |

الجداول المستهدفة: medical_records، nursing_assessments (finalize بدور Nurse)، medical_reports، medical_certificates، surgery_anesthesia_records.

## UI (namaweb/public/js/app.js)
| العنصر | الموضع | السلوك |
|---|---|---|
| زر "توقيع وإنهاء" (Sign/Finalize) | شاشة الطبيب/EMR (renderDoctor)، التمريض (renderNursing) | يستدعي sign endpoint؛ يطلب تأكيداً |
| Badge "موقّع/مقفل" (Signed/Locked) | بطاقة السجل | يعرض emr_status بلون دلالي |
| حالة تحرير معطّلة | عند emr_status='locked' | حقول للقراءة فقط؛ زر التعديل المباشر مخفي/معطّل |
| Modal سبب التعديل (amendment) | بعد القفل | يطلب reason ثم يستدعي amend endpoint |
| عرض سجل التعديلات | تبويب السجل | قائمة emr_amendments (من/متى/سبب) |

## الصلاحيات والعزل
- requireRole('doctor') للتوقيع/التعديل الطبي؛ Nurse للتقييمات؛ Admin='*'. (ملاحظة: 'doctor' permission موجودة في ROLE_PERMISSIONS لدور Doctor.)
- كل العمليات tenant-scoped عبر getRequestTenantContext + RLS؛ لا ثقة بمستأجر من body/query.
- لا يستطيع Admin تغيير محتوى موقّع صامتاً (يمرّ عبر amendment + audit).

## اختبارات (candidate static + rehearsal)
- static guard test: وجود sign/amend endpoints + `emr_status<>'locked'` على UPDATE/DELETE + logAudit.
- rehearsal DB (مُنفَّذ — انظر 04): أثبت القفل والمنع والعزل.

## ملفات متأثّرة
`namaweb/server.js` (endpoints + حُرّاس)، `namaweb/public/js/app.js` (UI). **لا تُلمس صفحات beta الثمانية ولا فرع R17.**

## 6-12
المتطلبات: تنفيذ الكود على فرع مخصّص بعد موافقة + (يُفضّل) Browser E2E بحساب اختبار. الأولوية P0. المخاطر: منطق المنع يجب أن يستثني draft/signed (الفحص فقط على 'locked'). توصيات: تنفيذ على branch ثم نشر محكوم + smoke. Acceptance: نطاق كامل API+UI+صلاحيات (✅). Next: 04 Tests.
