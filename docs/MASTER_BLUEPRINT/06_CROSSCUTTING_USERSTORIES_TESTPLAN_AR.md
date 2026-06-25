# 06 — قصص المستخدم + معايير القبول + خطة الاختبار

> صيغة قصص المستخدم: «كـ<دور> أريد <هدف> حتى <قيمة>» + معايير قبول (Gherkin: Given/When/Then). يلي ذلك خطة اختبار (مستويات + حالات + تتبّع).

## 1) الأدوار (Personas)
Super-Admin · Admin (منشأة) · طبيب · ممرضة · فني مختبر · أخصائي أشعة · صيدلي · موظف استقبال · محاسب/مالية · موظف تأمين · مدير جودة · مريض (بوابة).

## 2) قصص مستخدم تمثيلية + معايير قبول (Epics مختارة)

### E1 — تسجيل منشأة (Onboarding Wizard)
- **US1.1** كـSuper-Admin أريد اختيار نمط منشأة (مدينة طبية/مستشفى/مستوصف/مركز) حتى تُفعّل الوحدات المناسبة تلقائياً.
  - **AC:** Given نمط «مركز صحي» When أُكمل الويزرد Then تُفعّل وحدات `health_center` فقط وتُخفى البقية؛ And يُنشأ tenant+facility+Admin ضمن transaction واحد؛ And يُسجّل في audit؛ And غير-super-admin يُرفض (403).
- **US1.2** كـSuper-Admin أريد كلمة مرور Admin قوية إلزامية حتى لا تبقى افتراضية.
  - **AC:** Given كلمة مرور <12 خانة Then تُرفض؛ And لا قيمة افتراضية تُقبل.

### E2 — النواة السريرية (CPOE/CDS)
- **US2.1** كطبيب أريد طلب فحوص/أدوية من شاشة واحدة (CPOE) حتى أوفّر الوقت.
  - **AC:** Given encounter مفتوح When أنشئ order set "Chest Pain" Then تُنشأ طلبات ECG+Troponin+CXR موقّعة؛ And كل طلب tenant-scoped+audit.
- **US2.2** كطبيب أريد تنبيه تفاعل/حساسية عند الوصف (CDS) حتى أتجنّب الضرر.
  - **AC:** Given دواء يتفاعل مع حساسية المريض When أصف Then يظهر تنبيه يفرض سبب تجاوز؛ And يُسجّل التجاوز (من/سبب).

### E3 — المختبر (LIS)
- **US3.1** كفني مختبر أريد نتائج تلقائية من الجهاز (HL7) حتى أقلّل الإدخال اليدوي.
  - **AC:** Given رسالة HL7 واردة When تُستقبل Then تُربط بالعيّنة (باركود) وتُحفظ مع LOINC؛ And النتائج ضمن النطاق تُعتمد تلقائياً، والخارجة تُعلّق للمراجعة.
- **US3.2** كفني أريد call-back موثّق للقيم الحرجة حتى أضمن إبلاغ الطبيب.
  - **AC:** Given قيمة حرجة Then لا تُغلق حتى يُوثّق call-back (لمن/متى).

### E4 — الطوارئ (ED)
- **US4.1** كممرضة فرز أريد تصنيف ESI حتى تُرتّب الأولوية.
  - **AC:** Given شكوى+علامات When أفرز ESI-2 Then يظهر على tracking board بأولوية؛ And يبدأ مؤقّت time-to-provider.

### E5 — الفوترة/التأمين (NPHIES/ZATCA)
- **US5.1** كموظف تأمين أريد eligibility فوري حتى أتأكد من التغطية.
  - **AC (gated):** Given مريض مؤمَّن When أطلب eligibility Then يُستدعى NPHIES (في الإنتاج المعتمد) ويُعرض الرد؛ And في غير المعتمد يبقى gated بلا اتصال.
- **US5.2** كمحاسب أريد فاتورة ZATCA متوافقة حتى ألتزم تنظيمياً.
  - **AC:** Given فاتورة When تُصدر Then تُولَّد UBL XML+QR+ختم؛ And تُؤرشَف؛ And clearance gated حتى الاعتماد.

### E6 — التنويم/التمريض
- **US6.1** كممرضة أريد MAR بالباركود (5 rights) حتى أمنع أخطاء الدواء.
  - **AC:** Given إعطاء دواء When أمسح سوار المريض والدواء Then يُتحقّق من المريض/الدواء/الجرعة/الطريق/الوقت؛ And عدم التطابق يمنع الإعطاء ويُسجّل.

### E7 — متعدّد المستأجرين (عابر)
- **US7.1** كأي مستخدم يجب ألا أرى بيانات مستأجر آخر أبداً.
  - **AC:** Given جلسة tenant=A When أطلب أي مورد Then تُرجع بيانات A فقط (RLS)؛ And محاولة الوصول لمعرّف من B تُرجع 404/0.

> النمط نفسه يُعمّم على باقي الأقسام (lab/rad/pharmacy/adt/icu/ob/blood/inventory/quality...). كل قسم ≥ 3 قصص (CRUD + workflow + صلاحية/عزل).

## 3) خطة الاختبار (Test Plan)
### 3.1 المستويات
- **Unit:** منطق (CDS rules, FEFO, ESI calc, balance check للقيود, EMPI dedupe).
- **Integration:** API + DB (tenant scoping, RLS, audit) — نمط الاختبارات القائمة (cross_tenant_*, rls_*).
- **E2E:** تدفّقات (تسجيل→زيارة→طلب→نتيجة→فاتورة) عبر متصفّح/harness.
- **Security/Regression:** RLS fail-closed, XSS output-encoding (Layer1+2 قائم), CSRF/CORS/CSP, RBAC 403.
- **Performance:** أحمال على القوائم/التقارير، فهارس tenant_id.
- **UAT:** قبول المالك per-module (browser smoke).

### 3.2 حالات اختبار تمثيلية (Test Cases)
| ID | المستوى | الحالة | متوقّع |
|---|---|---|---|
| TC-RLS-01 | Security | جلسة tenant=1 تطلب مريض tenant=2 | 404/صفر صفوف |
| TC-CDS-01 | Unit | وصف دواء يتفاعل مع حساسية | تنبيه + يفرض سبب |
| TC-LIS-01 | Integration | HL7 وارد بنتيجة طبيعية | auto-verified + LOINC |
| TC-LIS-02 | Integration | قيمة حرجة | لا إغلاق بلا call-back |
| TC-PH-01 | Unit | صرف دواء | يخصم أقرب دفعة انتهاءً (FEFO) |
| TC-ED-01 | Unit | فرز ESI | ترتيب board صحيح |
| TC-FIN-01 | Unit | قيد محاسبي | مدين=دائن (متوازن) |
| TC-ZATCA-01 | Integration | إصدار فاتورة | UBL+QR+ختم، clearance gated |
| TC-ONB-01 | E2E | onboarding «مستوصف» | وحدات clinic فقط مُفعّلة |
| TC-AUTH-01 | Security | endpoint أدمن بلا دور Admin | 403 (قائم) |
| TC-XSS-01 | Security | اسم مريض `<img onerror>` | يُعرض نصاً (مُهرَّب، قائم) |
| TC-PERF-01 | Performance | قائمة 10k مريض مفلترة | < 500ms مع فهرس tenant_id |

### 3.3 معايير الخروج (Exit Criteria)
- 100% من حالات Security/RLS تمرّ (fail-closed).
- 0 ثغرة XSS مفتوحة (مُحقّق Layer1+2).
- تغطية وحدات ≥ القواعد الحرجة (CDS/FEFO/ESI/balance/EMPI).
- UAT المالك PASS لكل P0/P1.
- لا تسريب عبر المستأجرين في أي مسار.

### 3.4 التتبّع (Traceability)
كل US → AC → Test Case → نتيجة. يُحفظ كمصفوفة (RTM) تُحدّث كل إصدار. الاختبارات الأمنية القائمة (cross_tenant_idor_sweep, rls_insert_tenant_stamping, a2_mfa, audit...) تُدمج في CI (انظر 07 §CI/CD).
