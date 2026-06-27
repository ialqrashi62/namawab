# تقرير PHASE 1 — المعالجة الحرجة (Critical Remediation)
## NamaMedical — بناءً على Global Product Benchmark Audit

**الفرع:** `audit/phase-1-critical-remediation` (في الريبوين: الجذر `NamaMedical` و`namaweb`)
**النطاق:** C-1 (أسرار في Git) · C-2 (نزاهة الفوترة/الضريبة خادمياً) · C-3 (فرض سقف الخصم) — لا شيء خارج PHASE 1.
**القيود المُحترَمة:** لم يُلمَس الإنتاج · لا DDL/migration على الإنتاج · لا طباعة أسرار · لا force push · لا حذف بيانات · أصغر diff ممكن + اختبارات.

---

## 1. ملخص تنفيذي

| Finding | الحالة | النتيجة |
|---|---|---|
| **C-1** أسرار مزروعة في ملفات متتبعة | ✅ مُعالَج (تنظيف الكود) | 6 سكربتات نُظّفت + 7 اختبارات + قاعدة `.gitignore` |
| **C-2** الفوترة تثق بالعميل (total/discount/VAT) | ✅ مُعالَج | طبقة تحقق خادمية + VAT خادمي + رفض NaN/سالب |
| **C-3** سقف الخصم كود ميت | ✅ مُعالَج | فرض فعلي حسب الدور + تدقيق |
| اختبارات | ✅ 88/88 PASS | منها 2 جديدة (26 + 14 حالة) |
| build:css | ✅ نجح | 393ms |
| تدوير الأسرار الحقيقية | ⛔ **إجراء مالك يدوي** | الكود نُظّف؛ التدوير خارج صلاحيتي |

**الكود نُظّف، لكن الأسرار المكشوفة سابقاً تبقى في تاريخ Git ويجب على المالك تدويرها فوراً.** لذلك الحالة النهائية = `BLOCKED_SECRET_ROTATION_REQUIRED` (العمل البرمجي جاهز للمراجعة، لكن الإغلاق الفعلي للمخاطرة يعتمد على تدوير لا أملكه).

---

## 2. C-1 — Secrets in Git

### هل كانت الأسرار في ملفات متتبعة؟ **نعم.**
سرّ واحد متكرر (كلمة مرور قاعدة بيانات) + سرّان للجلسة/JWT كانت **مزروعة نصّياً** في سكربتات متتبَّعة بـGit. (لا تُذكر أي قيمة هنا.)

### الملفات التي نُظّفت (استبدال القيم بمتغيرات بيئة إلزامية fail-closed):
| الملف | ما كان | ما أصبح |
|---|---|---|
| `restore_db.sh` | كلمة مرور MSSQL `sa` نصّية | `"$MSSQL_SA_PASSWORD"` + `:?` guard |
| `configure_sql.sh` | `export MSSQL_SA_PASSWORD='…'` + sqlcmd نصّي | يُطلب من البيئة |
| `fix_ldap.sh` | sqlcmd `-P '…'` | `"$MSSQL_SA_PASSWORD"` + guard |
| `setup_server.sh` | `CREATE USER … PASSWORD '…'` | `'${DB_PASSWORD}'` + guard |
| `deploy_web.sh` | postgres pass + `DATABASE_URL` + `JWT_SECRET` نصّية | من البيئة + `umask 077` على `.env` |
| `redeploy_new.sh` | `DATABASE_URL` + `SESSION_SECRET` نصّية *(اكتشفها الاختبار)* | من البيئة + guard |

### إجراءات إضافية:
- **`.gitignore` الجذر:** أُضيفت قاعدة `.env` / `.env.*` (مع إبقاء `*.example` متتبَّعة) — لم تكن موجودة.
- **`.env.example` الجذر (جديد):** placeholders فقط لكل متغيرات سكربتات النشر.
- **`namaweb/.env.example`:** عُقِّمت قيم `DB_PASSWORD`/`SESSION_SECRET` إلى `__CHANGE_ME__`.

### ما لم يُلمَس (بقصد، خارج النطاق + للحفاظ على الأدلة):
- السر يظهر أيضاً في **ملفات توثيق حوكمة** (`docs/.../01_CURRENT_SECRETS_SURFACE_AR.md` وفرعها في `project_brain/`) — وهي سجلّ تدقيقي للمشكلة؛ تعديلها يمسح أدلة ويخرج عن «scripts». تُعالَج عند خطوة history-rewrite (إجراء مالك).
- **لم يُنفَّذ history rewrite** (حسب التعليمات).
- مخاطرة `redeploy_new.sh:13` (DROP DATABASE بلا نسخة) = **D-4** من التدقيق، **خارج PHASE 1** — وُثّقت ولم تُلمَس.

---

## 3. C-2 — Server-side Billing/VAT Integrity

### القرار التصميمي (شفافية):
واجهة إنشاء الفاتورة **إدخال مبلغ حر** من مستخدم بدور مالي مُصرّح (`requireRole('invoices','accounts')`)، وجدول `medical_services` (السعر) **بلا tenant_id** ولا يُستخدم في هذا التدفق. لذا **«إجبار التسعير من الكتالوج» يتطلب تغيير UI/تصميم → مؤجَّل لـPHASE 2** (مُوثَّق، ليس BLOCKED). سلّمتُ الآن **طبقة التحقق الآمنة** التي تسمح بها التعليمات صراحةً.

### ما طُبِّق (وحدة نقية `namaweb/billing_integrity.js` + ربطها في مساري `/api/invoices` و`/api/invoices/generate`):
1. **`parseMoney()` fail-closed:** يرفض `NaN`/`Infinity`/نصّ غير رقمي/سالب/قيمة ضخمة → **HTTP 400** بدل التحويل الصامت إلى 0. تقريب 2 منزلة (لا float drift).
2. **إعادة حساب خادمية:** `original_amount = total + discount` يُحسب خادمياً؛ `/generate` يجمع بنود مُتحقَّقة خادمياً ولا يقبل `total` من العميل.
3. **VAT خادمي:** عبر `finance_engine.vatFromInclusive` ويُخزَّن في `vat_amount` (كان لا يُكتب أبداً). قيمة الضريبة لا تؤخذ من العميل إطلاقاً.
4. **تحقق البنود:** الكمية إن وُجدت = عدد صحيح موجب؛ مبلغ البند > 0.
5. **تدقيق:** سطر `INVOICE_DISCOUNT` عند وجود خصم (مبلغ/نسبة/سبب).

> ملاحظة: السعر يُقبل من **مستخدم مالي مُصادَق ومُصرَّح بالدور** (وليس عميلاً مجهولاً)؛ الضوابط = تحقق + سقف خصم + VAT خادمي + تدقيق. إجبار الكتالوج = PHASE 2.

---

## 4. C-3 — Enforce MAX_DISCOUNT_BY_ROLE

- كان `MAX_DISCOUNT_BY_ROLE` **معرَّفاً وغير مستخدَم** (كود ميت).
- الآن `enforceDiscountCap(role, discount, gross)` يُطبَّق في مساري إنشاء الفاتورة: الخصم كنسبة من الإجمالي يجب ألا يتجاوز سقف الدور؛ **دور غير معروف ⇒ سقف 0% (fail closed)**؛ الخصم > المبلغ مرفوض (400)؛ التجاوز مرفوض بـ**403** برسالة واضحة. override يحتاج دوراً ذا سقف أعلى (مثل admin 100%) ويُسجَّل في التدقيق.

---

## 5. جدول التغييرات

| Finding | الملفات المتغيّرة | ملخص الإصلاح | الاختبارات المضافة | النتيجة | إجراء المالك المتبقي |
|---|---|---|---|---|---|
| C-1 | `restore_db.sh`, `configure_sql.sh`, `fix_ldap.sh`, `setup_server.sh`, `deploy_web.sh`, `redeploy_new.sh`, `.gitignore`, `.env.example` (جذر), `namaweb/.env.example` | استبدال الأسرار بمتغيرات بيئة + قواعد ignore + placeholders | `no_hardcoded_secrets_test.js` | ✅ PASS | **تدوير الأسرار** + history rewrite |
| C-2 | `namaweb/server.js`, `namaweb/billing_integrity.js` | تحقق خادمي + VAT خادمي + رفض القيم غير الآمنة | `billing_integrity_test.js` (26) | ✅ PASS | مراجعة + (PHASE 2: كتالوج إلزامي) |
| C-3 | `namaweb/server.js`, `namaweb/billing_integrity.js` | فرض سقف الخصم حسب الدور + تدقيق | ضمن `billing_integrity_test.js` | ✅ PASS | — |
| QA | `namaweb/package.json` | إضافة `npm test` → `run_all_tests.js` | — | ✅ | ربط CI (PHASE 5) |

---

## 6. نتائج الفحوص الإلزامية

| الفحص | النتيجة |
|---|---|
| `npm test` (88 ملف) | ✅ **88 passed, 0 failed** (شامل الاختبارين الجديدين) |
| `node billing_integrity_test.js` | ✅ 26/26 |
| `node no_hardcoded_secrets_test.js` | ✅ نظيف (بعد تنظيف `redeploy_new.sh` الذي اكتشفه) |
| `npm run build:css` | ✅ 393ms |
| `npm run lint` | ⚠️ غير موجود (لا lint script) — N/A |
| `npm audit` | ⚠️ يتطلب `package-lock.json` غير موجود؛ **لم تُضَف أي اعتمادية** ⇒ وضع الثغرات لم يتغيّر (H-17 لـPHASE 3) |
| `bash -n` لكل سكربت | ✅ 6/6 سليمة |
| `node --check server.js` | ✅ |
| `git diff --check` | ✅ لا أخطاء مسافات (تحذيرات LF/CRLF فقط) |

---

## 7. تقرير إجراءات المالك (Owner Actions) — مطلوبة يدوياً

> الكود نُظّف، لكن **الأسرار التي سبق كشفها في تاريخ Git تبقى مكشوفة حتى تُدوَّر.** نفّذ بالترتيب:

1. **تدوير كلمة مرور MSSQL `sa`** على خادم قاعدة البيانات (كانت في `restore_db.sh`/`configure_sql.sh`/`fix_ldap.sh`).
2. **تدوير كلمة مرور PostgreSQL** للمستخدم `namasoft` (كانت في `setup_server.sh`/`deploy_web.sh`/`DATABASE_URL`).
3. **تدوير `JWT_SECRET` و`SESSION_SECRET`** (كانت في `deploy_web.sh`/`redeploy_new.sh`).
4. **ضبط الأسرار الحقيقية خارج Git:** ملف `.env` محلي (مُستثنى الآن) أو متجر أسرار؛ صدِّر المتغيرات قبل تشغيل أي سكربت.
5. **(لاحقاً) history rewrite / purge** للأسرار من تاريخ Git ومن ملفات `*_SECRETS_SURFACE_*.md`، ثم اعتبار أي مفتاح ظهر سابقاً «محروقاً».
6. **إعادة تشغيل آمن بعد التدوير:** أعد تشغيل التطبيق بالأسرار الجديدة فقط بعد الخطوات 1–4 (التطبيق يرفض الإقلاع بالإنتاج بلا `SESSION_SECRET`).

---

## 8. FINAL_STATUS

### `BLOCKED_SECRET_ROTATION_REQUIRED`

العمل البرمجي لـPHASE 1 (C-1/C-2/C-3) **مكتمل، مُختبَر (88/88)، وبأصغر diff**، وجاهز للمراجعة على الفرع `audit/phase-1-critical-remediation`. لكن **إغلاق مخاطرة C-1 فعلياً يتطلب تدوير أسرار يدوياً من المالك** (خطوات القسم 7) — وهو خارج صلاحية هذه الجلسة (لا لمس إنتاج/لا أسرار). بعد التدوير + المراجعة، يصبح الوضع `PHASE_1_READY_FOR_REVIEW` → دمج.

**التغييرات لم تُلتزَم (uncommitted) بانتظار موافقتك على الـcommit** — لم أُنفّذ commit/push (لم تطلبه صراحةً)، وريبو الجذر يحوي تغييرات سابقة غير متعلقة سأستثنيها عند الـstaging.
