---
document_family: Enterprise Engineering Framework
project: Nama Invest ERP (بيان سوفت بلس)
version: 1.0.0
status: Approved Baseline
classification: Internal Engineering Standard
owner: CTO Office / Enterprise Architecture Board
effective_date: 2026-06-27
language: ar
---

# Quality Gate: QG-006 API

## 1. الغرض

هذه البوابة تمنع اعتماد التغيير إذا لم يحقق الحد الأدنى من الجودة في المجال المحدد.

## 2. شروط المرور

- [ ] Validation
- [ ] Auth
- [ ] Error format
- [ ] OpenAPI عند الحاجة

## 3. درجات القرار

| الدرجة | المعنى | القرار |
|---|---|---|
| PASS | جميع الشروط الحرجة محققة | يسمح بالانتقال |
| PASS WITH NOTES | توجد ملاحظات غير حرجة | يسمح مع متابعة |
| CONDITIONAL | توجد ملاحظات يجب معالجتها قبل الإنتاج | يمنع الإنتاج |
| FAIL | شرط حرج مفقود | يمنع الدمج أو الإصدار |

## 4. أدلة مطلوبة

- نتائج اختبارات أو مبرر عدم تشغيلها.
- قائمة الملفات المتأثرة.
- تقرير مختصر.
- ADR عند الحاجة.
- Screenshot أو وصف UI عند الحاجة.

## 5. أسئلة إلزامية

- هل يوجد أثر على الأمن؟
- هل يوجد أثر على البيانات؟
- هل يوجد أثر على المستأجرين؟
- هل يوجد أثر على المحاسبة؟
- هل يوجد أثر على الأداء؟
- هل يمكن الرجوع عن التغيير؟

## 6. القرار النهائي

- [ ] PASS
- [ ] PASS WITH NOTES
- [ ] CONDITIONAL
- [ ] FAIL

## 7. الملاحظات وخطة المعالجة

اكتب هنا الملاحظات وخطة المعالجة.
