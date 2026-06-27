# تقرير PHASE 2 — نزاهة الدفع والاسترداد (H-1/H-2)
## Payment & Refund Integrity Hardening — Local Code Only

**الفرع:** `audit/phase-1-critical-remediation`
**النطاق:** H-1 (partial-pay) + H-2 (refund) **فقط**. لا GL/journal/accounting/ZATCA/NPHIES/RBAC ثانوي/RLS migration/DDL/نشر.
**القيود:** لا DDL · لا DB writes · لا تشغيل endpoints كاتبة · لا إنتاج · لا PM2 · لا external calls · لا أسرار/PHI · لا history rewrite · لا push.

---

## 1. المشكلة

### H-1 — partial payment (`PUT /api/invoices/:id/partial-pay`)
- `parseFloat(amount_paid)` بلا تحقق → **NaN** (إدخال غير رقمي) يُخزَّن في `amount_paid`، و**مبلغ سالب** يعكس الدفع، و**تجاوز المستحق** (overpayment) يُسجَّل بلا سقف.
- لا **row lock** → سباق TOCTOU بين دفعتين متزامنتين على نفس الفاتورة.

### H-2 — refund (`POST /api/invoices/:id/refund`)
- `SELECT * FROM invoices WHERE id=$1` **بلا tenant predicate** = **IDOR عبر العملاء** (أي مستخدم invoices/accounts يسترد فاتورة أي عميل بالـid).
- `amount` بلا تحقق → سالب/NaN/صفر مقبولة؛ لا سقف refundable؛ لا منع تكرار الاسترداد.
- صف الاسترداد يُنشأ **بلا `tenant_id`/`facility_id`** (صف غير مُسيَّج).

---

## 2. الملفات المعدّلة (namaweb فقط، أصغر diff، بلا schema)
| الملف | التغيير |
|---|---|
| `billing_integrity.js` | +3 حراس نقية: `parsePositiveMoneyToMinorUnits`, `toMinorUnits`, `assertAmountWithinCap` |
| `server.js` | إعادة كتابة مسارَي partial-pay و refund (تحقق + transaction + tenant + IDOR fix) + import الحراس |
| `billing_integrity_test.js` | +20 حالة وحدة (دفع/استرداد) |
| `payment_refund_integrity_test.js` (جديد) | اختبار حراس المسار الساكن (21 حالة) |

---

## 3. إصلاح الدفع (H-1)
- كل مبلغ عميل يمر عبر `parsePositiveMoneyToMinorUnits` (يرفض: NaN, Infinity, نصّ غير رقمي, سالب, صفر, >2 منازل عشرية, قيمة ضخمة) → **HTTP 400**.
- **المستحق (outstanding) يُحسب خادمياً** من `invoice.total − invoice.amount_paid` (قيم DB، لا من العميل)، بوحدات **halalas صحيحة** (لا مقارنة float).
- `assertAmountWithinCap(payMinor, outstandingMinor)` يرفض **التجاوز** و**حالة لا مستحق**.
- **transaction + `SELECT … FOR UPDATE`** على صف الفاتورة + `set_config('app.tenant_id', …, true)` (رؤية FORCE-RLS تحت القفل) + `requireTenantScope` + predicate `AND tenant_id` على القراءة والتحديث + `finally client.release()`.

---

## 4. إصلاح الاسترداد (H-2)
- **IDOR مُغلق:** الفاتورة الأصلية تُقرأ وتُقفَل بـ`WHERE id=$1 AND tenant_id=$2 FOR UPDATE` (لا id مجرّد).
- المبلغ عبر `parsePositiveMoneyToMinorUnits` (نفس الرفض الصارم).
- **refundable يُحسب خادمياً** = `amount_paid − already_refunded` (مجموع صفوف الاسترداد السابقة لنفس الفاتورة، tenant-scoped) → `assertAmountWithinCap` يرفض التجاوز والاسترداد بعد الاسترداد الكامل.
- صف الاسترداد **يُختَم بـ`tenant_id`/`facility_id`** من الجلسة (لا من body).
- transaction + قفل + `requireTenantScope`.

---

## 5. الحراس المالية والـtenant/IDOR
| الحارس | partial-pay | refund |
|---|---|---|
| رفض NaN/Inf/سالب/صفر/غير رقمي | ✅ | ✅ |
| رفض >2 منازل عشرية | ✅ | ✅ |
| outstanding/refundable خادمي (لا ثقة بالعميل) | ✅ | ✅ |
| سقف (no overpayment / no over-refund) | ✅ | ✅ |
| tenant predicate على القراءة | ✅ | ✅ (IDOR fix) |
| tenant_id من الجلسة لا body | ✅ | ✅ (stamp) |
| row lock (FOR UPDATE) + transaction | ✅ | ✅ |
| RLS bind تحت client يدوي | ✅ | ✅ |

---

## 6. الاختبارات
- `billing_integrity_test.js`: **49/49** (شامل 20 حالة دفع/استرداد جديدة).
- `payment_refund_integrity_test.js`: **21/21** (حراس مسار ساكنة).
- `npm test`: **90/90**. `node --check server.js`: OK. secret scans: CLEAN. diff --check: CLEAN.

> ملاحظة: حراس المبلغ تُختبَر سلوكياً (وحدات نقية). إصلاحات IDOR/tenant/القفل تُتحقَّق ساكنياً من المصدر (بنمط `cross_tenant_*` بالمشروع) — لم تُشغَّل endpoints حقيقية ولا DB (حسب القيود).

---

## 7. ما لم يتم (وخارج النطاق)
- **H-5 GL ربط الفوترة بدفتر الأستاذ:** خارج النطاق صراحةً — يتطلب تصميم قيود محاسبية متوازنة وتفعيل posting، وهو قرار مالي/محاسبي مستقل (`ACCOUNTING_POSTING_ENABLED` يبقى OFF، journal=0).
- تتبّع already_refunded يعتمد ربط `invoice_number` عبر الوصف (لا عمود FK) — best-effort بلا schema change؛ يُوصى بعمود/جدول refunds في مرحلة لاحقة.
- لا تغيير على مسار `pay` الكامل (3413) — خارج H-1/H-2 الدقيق.

---

## 8. تأكيدات السلامة
لا production · لا DB writes · لا DDL · لا deploy · لا PM2 · لا ZATCA/NPHIES · لا journal · لا accounting posting · لا أسرار · لا PHI · لا history rewrite · لا force push. **تدوير الأسرار من C-1/C-1B لا يزال إجراء مالك مطلوباً** (مستقل عن هذه المرحلة).
