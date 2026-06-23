# KEK Escrow / DR — خطة فقط (PLAN-ONLY) — تقرير

> 2026-06-23 | بوابة `APPROVE_KEK_ESCROW_DR_PLAN_ONLY`. تصميم خطة حضانة مفتاح حماية المفاتيح (KEK) والتعافي من الكوارث (DR) **قبل** أي re-wrap إنتاجي من DPAPI إلى HashiCorp Vault. **خطة نظرية فقط**: لا إنشاء/قراءة/تدوير/استخراج/طباعة أي مفتاح حقيقي، لا تشغيل Vault إنتاجي، لا inventory إنتاجي، لا re-wrap، لا شهادات/CSR/OTP، لا DDL/كود/بيانات.

## 1. الحالة النهائية
**FINAL_STATUS: KEK_ESCROW_DR_PLAN_ONLY_READY.** أُنشئت الخطة كاملة (نموذج مخاطر + حوكمة escrow + بنية DR + خطة restore drill بمراجع وهمية + متطلبات ما قبل الإنتاج + break-glass + قائمة أدلة التدقيق + RPO/RTO). لا تغييرات إنتاجية. docs-only.

## 2. المهارات الفعلية المفعّلة من Skill Pack
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`؛ الأسماء الفعلية بلاحقة `_SKILL_AR.md`. المُفعّلة: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` (الأساس) · `NM_INTEGRATION_SANDBOX` · `NM_ZATCA_PHASE2` · `NM_NPHIES` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لم يُنشأ Skill جديد ولم تُخترع أسماء. **DELTA**: تباين توثيقي فقط (الفهرس مختصر، الملفات `_SKILL_AR`)؛ بلا أثر أمني.

## 3. ملخص Baseline (Gate 0)
`drift 0/0 · parent d4b2003 · namaweb clean · health محلي 200 · Redis PONG · FORCE_RLS=150 · finance_journal_entries=0 · لا حاوية Vault sandbox باقية`. الملفات المتسخة كلها STITCH/UI سابقة خارج النطاق.

## 4. مراجعة الدليل السابق (Gate 1)
تقرير `DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY_REPORT_AR.md` (commit d4b2003) مُتّسق ودون تناقض:
dummy rehearsal 14/14 PASS · Vault sandbox هُدم · REAL_KEYS_CREATED/USED=NO · PRIVATE_KEYS_HANDLED=NO · REAL_CERTIFICATES_USED=NO · PRODUCTION_CHANGES=NONE · DDL/DATA/CODE=NO · KEYS_COMMITTED=NO · MOJIBAKE=CLEAN.

## 5. نموذج المخاطر (Gate 2)
الوضع الحالي: KEK = 32 بايت محمية بـWindows DPAPI (CurrentUser) في `~/nama_kek.dpapi` خارج repo. **DPAPI مرتبط بالمستخدم 'ice' والجهاز** ⟹ نقطة فشل وحيدة.

| # | السيناريو | الأثر | الاحتمال | الخطورة | التخفيف المخطّط |
|---|---|---|---|---|---|
| R1 | فقدان/تلف الجهاز أو ملف تعريف المستخدم المرتبط بـDPAPI | فقدان دائم للقدرة على فك تغليف KEK ⟹ فقدان كل البيانات المشفّرة at-rest | متوسط | **حرجة** | escrow مستقل خارج DPAPI + offline sealed backup + restore drill مُثبت |
| R2 | تلف ملف تعريف DPAPI (إعادة بناء النظام، ترقية، corruption) | تعذّر فك KEK محلياً | متوسط | حرجة | نفس R1 + توثيق ربط الجهاز/المستخدم |
| R3 | فقدان مادة unseal/recovery الخاصة بـVault (المرحلة 2) | تعذّر فك ختم Vault ⟹ توقف الخدمة + فقدان وصول للمفاتيح | منخفض-متوسط | حرجة | Shamir/recovery keys بحضّان متعددين + escrow منفصل + drill |
| R4 | فشل re-wrap أثناء نافذة الصيانة | حالة وسطية، احتمال تعذّر القراءة | متوسط | عالية | dual-read مُثبت (rehearsal) + rollback فوري لـv1 + backup قبل البدء |
| R5 | هجرة جزئية (partial migration) | بعض السجلات v1 وبعضها v2 | متوسط | عالية | header نسخة لكل سجل + dual-read دائم حتى اكتمال الترحيل + جرد قراءة فقط |
| R6 | فشل rollback | عجز عن العودة للحالة السليمة | منخفض | حرجة | إبقاء v1 سليماً طوال النافذة + عدم إبطال DPAPI إلا بعد إثبات v2 + drill |
| R7 | خطر داخلي (insider) | إساءة استخدام حضّان واحد للوصول للمفتاح | منخفض | عالية | dual-control + split knowledge + separation of duties + تدقيق |
| R8 | عدم توفّر حضّان (custodian unavailability) | تعذّر break-glass عند الحاجة | متوسط | عالية | ≥3 حضّان، عتبة m-of-n، بدائل مسمّاة، مراجعة دورية |
| R9 | فجوة تدقيق (audit gap) | عدم إثبات من وصل ومتى | متوسط | متوسطة | تسجيل غير قابل للتعديل لكل وصول/موافقة + Vault audit device (مرحلة 2) |
| R10 | إساءة استخدام break-glass الطارئ | وصول غير مبرّر للمفتاح | منخفض | عالية | تفعيل ثنائي + سبب موثّق + إشعار فوري + تدوير إجباري بعد الاستخدام |
| R11 | خطر امتثال ZATCA/NPHIES | ربط مفاتيح تنظيمية بحضانة غير ملائمة | — | عالية (مستقبلية) | المفاتيح التنظيمية في Vault-PKI/HSM (sign-in-place)، **بلا شهادات/CSR/OTP حقيقية في هذه البوابة** |

## 6. سياسة Escrow المقترحة (Gate 3 — حوكمة نظرية)
- **الأدوار**: مالك المفتاح (Key Owner، مسؤولية المساءلة) · حضّان المفتاح (Custodians، يحملون أجزاء/مواد الاسترجاع) · مُوافِق الطوارئ (Approver) · مدقّق (Auditor) مستقل.
- **الحد الأدنى للحضّان**: ≥3 حضّان مع عتبة **m-of-n** (مثلاً 2-of-3) — لا يكفي فرد واحد.
- **dual-control**: أي استرجاع/فك يتطلب موافقة شخصين منفصلين على الأقل.
- **split knowledge**: لا يملك أي فرد المادة الكاملة (Shamir shares أو passphrase مُجزّأة).
- **separation of duties**: من يُدير النظام ≠ من يحمل مادة الاسترجاع ≠ من يدقّق.
- **دورية مراجعة الوصول**: ربع سنوية — تأكيد هوية الحضّان وصلاحياتهم وبدائلهم.
- **سير الموافقة (approval workflow)**: طلب موثّق → موافقة m-of-n → تنفيذ بحضور مدقّق → سجل.
- **سير الوصول الطارئ (emergency)**: break-glass (القسم 10) بسبب موثّق + إشعار + تدوير بعد الاستخدام.
- **الدليل المطلوب قبل أي restore**: تذكرة معتمدة + هوية الحضّان + سبب + نطاق + موافقة dual-control.
- **التسجيل/التدقيق**: كل طلب/موافقة/وصول يُسجّل بشكل غير قابل للتعديل (من، متى، لماذا، ما النتيجة).
- **الاحتفاظ والإتلاف (retention/destruction)**: نسخ escrow مُعمّرة وفق سياسة؛ النسخ القديمة بعد التدوير تُتلَف إتلافاً موثّقاً؛ مادة الاسترجاع لا تُخزَّن مع النسخ المشفّرة.
- **ربط الاستجابة للحوادث**: أي استخدام escrow/break-glass = حادثة تُفتح وتُغلق بتقرير.

## 7. خطة بنية DR التقنية (Gate 4 — تصميم فقط، بلا تنفيذ)
**متطلبات تقسية Vault الإنتاجي (قبل أي استخدام إنتاجي):**
- تخزين **Integrated Storage (raft)** أو ما يعادله مع خطة HA (≥3 عقد للنصاب)، **ليس وضع dev**.
- **TLS** على المستمع (شهادة داخلية صالحة)، لا HTTP صريح.
- قرار **seal/unseal**: auto-unseal (عبر مزوّد آمن) مقابل Shamir اليدوي — مع حوكمة recovery keys في الحالتين.
- **audit device** مُفعّل (ملف/syslog) لكل عملية.
- **حدود السياسات (policies)**: least-privilege، فصل مسارات sandbox/prod، سياسة منفصلة لـtransit `nama-kek` ولـPKI التنظيمي.
- **نسخ واسترجاع**: snapshot raft دوري مشفّر خارج الموقع + إجراء استرجاع مُختبَر.
- **تثبيت الإصدار (version pinning)** بدل `latest`؛ سياسة ترقية/تراجع موثّقة.
- **خيارات تخزين escrow للـKEK**: (أ) HSM أو KMS (on-prem/سحابي) مستقبلاً إن توفّر؛ (ب) offline sealed backup (وسيط غير متصل في خزنة)؛ (ج) Shamir Secret Sharing أو نموذج حوكمة مكافئ؛ (د) Vault recovery keys/unseal governance؛ (هـ) أرشيف مشفّر مع سير عمل الحضّان. الأداة الموجودة `ops/security/nama_kek_escrow.ps1` (AES-256-CBC+HMAC/PBKDF2-200k، passphrase) تخدم الخيارين (ب)/(هـ) — **يشغّلها المالك**، لا الوكيل.
- **معالجة النسخ المشفّرة**: passphrase منفصلة عن الوسيط؛ الوسيط خارج الموقع؛ استبعاد blob الـDPAPI من النسخ العادية.
- **تحقق الاسترجاع**: round-trip على بيئة معزولة قبل اعتماد أي نسخة.
- **سيناريوهات الكوارث**: فقدان الصندوق · تلف DPAPI · فقدان unseal · فساد نسخة · فشل re-wrap.
- **RPO/RTO**: انظر القسم 12.
- **الاعتماديات (قراءة سياقية فقط، بلا تعديل)**: PM2 (`nama-app`) · Redis (`nama-redis` في Docker) · PostgreSQL (`nama_medical_web`) · التطبيق — تُذكر كسياق DR ولا تُغيَّر في هذه البوابة.

## 8. خطة Restore Drill (Gate 5 — مراجع وهمية فقط، بلا تشغيل حقيقي)
- **الشروط المسبقة**: بيئة معزولة (sandbox) · نسخة escrow **وهمية** · لا لمس KEK إنتاج · موافقة مسبقة.
- **الموافقات المطلوبة**: dual-control + تذكرة معتمدة.
- **الدليل المطلوب**: معرّف النسخة الوهمية، الحضّان، السبب، النطاق.
- **الخطوات عالية المستوى**: (1) إحضار escrow وهمية لبيئة معزولة (2) فك التغليف بمادة استرجاع وهمية (3) إثبات round-trip على payload وهمي (4) مطابقة البصمات (5) إغلاق وإتلاف المخرجات المؤقتة.
- **فحوص التحقق**: تطابق بصمة KEK الوهمي قبل/بعد · فك payload وهمي بنجاح · لا اتصال شبكي خارج loopback.
- **معايير الإجهاض (abort)**: أي طلب لمفتاح حقيقي · أي مسار إنتاجي · أي تسريب · drift غير مفسّر.
- **معايير rollback**: العودة للحالة السابقة دون أثر؛ هدم البيئة المعزولة.
- **متطلبات تقرير ما بعد الـdrill**: ما نُفّذ، الأدلة، النتائج، الإثبات أن لا بيانات إنتاجية مُسّت، التوصيات.
- **إثبات عدم لمس الإنتاج**: العمل على نسخ/مراجع وهمية فقط؛ فحص أن KEK الإنتاج (`~/nama_kek.dpapi`) لم يُقرأ؛ health الإنتاج ثابت 200 قبل/بعد.
- **لم يُشغَّل أي restore drill حقيقي في هذه البوابة** — هذا تصميم فقط؛ التنفيذ ببوابة `APPROVE_RESTORE_DRILL_DUMMY_ONLY`.

## 9. متطلبات ما قبل أي Production Re-wrap (Gate 6)
1. KEK escrow معتمد ومُنفّذ (مالك) + إثبات.
2. DR runbook معتمد.
3. restore drill (dummy) معتمد ومُثبت.
4. production inventory (قراءة فقط) لما هو مشفّر بـDPAPI — مُكتمل.
5. Vault إنتاجي مُقسّى (raft/TLS/unseal/audit/policies/pinning).
6. نافذة صيانة معتمدة.
7. خطة rollback معتمدة.
8. backup مُتحقَّق منه قبل البدء.
9. جهات اتصال الطوارئ مؤكَّدة.
10. ZATCA/NPHIES تبقى غير موصولة ما لم توجد موافقة onboarding منفصلة.
11. المحاسبة تبقى OFF (journal=0) ما لم توجد موافقة منفصلة.

## 10. سياسة Break-Glass
وصول طارئ للمفتاح/الاسترجاع فقط عند تعذّر المسار العادي: تفعيل **ثنائي (dual-control)** + سبب موثّق + إشعار فوري لجميع الحضّان والمدقّق + نطاق محدود زمنياً + **تدوير إجباري للمفتاح بعد الاستخدام** + فتح حادثة وإغلاقها بتقرير. أي استخدام يُراجَع لاحقاً للتأكد من المبرّر.

## 11. قائمة أدلة التدقيق (Audit Evidence Checklist)
- [ ] تذكرة طلب معتمدة (من/متى/لماذا/نطاق).
- [ ] إثبات موافقة dual-control / m-of-n.
- [ ] هوية الحضّان المشاركين.
- [ ] سجل غير قابل للتعديل لكل وصول.
- [ ] إثبات round-trip للاسترجاع (بصمات).
- [ ] إثبات عدم لمس بيانات/مفاتيح إنتاجية (في الـdrill).
- [ ] سجل تدوير/إتلاف النسخ القديمة.
- [ ] تقرير ما بعد الحدث (drill/break-glass).
- [ ] (مرحلة 2) مخرجات Vault audit device.

## 12. RPO/RTO المقترحة
- **RPO** (أقصى فقد بيانات مقبول للمفاتيح/الإعداد): ≈ **0** للمادة الحرجة (KEK/escrow ثابتان نادرا التغيّر؛ كل تدوير يُعاد escrow فوراً)؛ snapshot Vault الإنتاجي ≤ **24 ساعة**.
- **RTO** (زمن استعادة القدرة على فك التشفير): الهدف ≤ **4 ساعات** عبر escrow + restore runbook مُختبَر. (قيم مقترحة للمراجعة والاعتماد، ليست ملزمة بعد.)

## 13. المخاطر المتبقية
- DPAPI يبقى نقطة فشل وحيدة **حتى** يشغّل المالك الـescrow ويثبت الاسترجاع — هذا أعلى خطر مفتوح.
- Vault الإنتاجي غير مُقسّى بعد (المرحلة 2 candidate فقط).
- لم يُجرَ بعد جرد إنتاجي لحجم/مواقع البيانات المشفّرة بـDPAPI (بوابة لاحقة).
- المفاتيح التنظيمية (ZATCA/NPHIES) تبقى محجوبة على بنية مفاتيح + onboarding.

## 14. ما تم تنفيذه
خطة كاملة docs-only: نموذج مخاطر (11 سيناريو) · سياسة escrow/حوكمة · بنية DR · خطة restore drill (dummy) · متطلبات ما قبل الإنتاج · break-glass · قائمة أدلة تدقيق · RPO/RTO. Gate 0/1 مُجتازان. commit + push FF.

## 15. ما لم يتم تنفيذه (عمداً، خارج النطاق)
لا إنشاء/قراءة/تدوير/استخراج KEK حقيقي · لا تشغيل Vault (لا sandbox هذه المرة ولا إنتاج) · لا production inventory · لا re-wrap · لا restore drill حقيقي · لا DDL/كود/بيانات · لا شهادات/CSR/OTP · لا اتصال ZATCA/NPHIES.

## 16. إثبات No Real Keys
لم يُفتح/يُقرأ `~/nama_kek.dpapi`؛ لا أمر DPAPI نُفّذ؛ لا مفتاح وُلِّد؛ الأداة `nama_kek_escrow.ps1` لم تُشغَّل (يشغّلها المالك). REAL_KEYS_CREATED/READ/USED = NO · PRIVATE_KEYS_HANDLED = NO.

## 17. إثبات No Production Changes
لا app/DB/PM2/Redis/.env/Vault مُسّ؛ health 200 + Redis PONG قبل وبعد؛ FORCE_RLS=150؛ journal=0؛ DDL/DATA/CODE = NO. التغيير الوحيد = هذا التقرير (docs).

## 18. نتائج Hygiene
`git diff --check`: التنبيهات الوحيدة على ملفات STITCH خارج النطاق (غير مُجهّزة). المُجهّز = هذا التقرير فقط. لا أسرار/مفاتيح/شهادات/tokens في الـdiff.

## 19. نتائج Mojibake audit
لا BOM · لا U+FFFD · لا Latin-1 mis-decode في هذا التقرير. CLEAN.

## 20. الخطوة التالية المقترحة
**NEXT_RECOMMENDED_ACTION: APPROVE_RESTORE_DRILL_DUMMY_ONLY** (تنفيذ خطة القسم 8 على مراجع وهمية لإثبات الاسترجاع)، أو بالتوازي `APPROVE_PRODUCTION_REWRAP_READONLY_INVENTORY_ONLY` (جرد قراءة فقط). **لا انتقال إلى production re-wrap** إلا بموافقة صريحة جديدة + escrow مُنفّذ (مالك) + نافذة صيانة + rollback + DR مكتمل + Vault إنتاجي مُقسّى ومُراجَع.

## الحقول
```text
FINAL_STATUS: KEK_ESCROW_DR_PLAN_ONLY_READY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_INTEGRATION_SANDBOX, NM_ZATCA_PHASE2, NM_NPHIES, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
PREVIOUS_REWRAP_REHEARSAL_REVIEWED: YES (d4b2003, DUMMY_PASS, no contradiction)
KEK_ESCROW_PLAN_CREATED: YES
DR_RUNBOOK_CREATED: YES
RESTORE_DRILL_PLAN_CREATED: YES
REAL_KEYS_CREATED: NO
REAL_KEYS_READ: NO
REAL_KEYS_USED: NO
PRIVATE_KEYS_HANDLED: NO
REAL_CERTIFICATES_USED: NO
VAULT_PRODUCTION_DEPLOYED: NO
VAULT_SANDBOX_RUN: NO
PRODUCTION_INVENTORY_RUN: NO
PRODUCTION_REWRAP_RUN: NO
PRODUCTION_CHANGES: NONE
DDL: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
FORCE_PUSH_USED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: d4b2003
GIT_COMMIT: (انظر سطر الإغلاق بعد الدفع)
DRIFT: 0/0
NEXT_RECOMMENDED_ACTION: APPROVE_RESTORE_DRILL_DUMMY_ONLY
```

تم إعداد خطة KEK escrow و DR كاملة للمراجعة والاعتماد، دون إنشاء أو لمس أو طباعة أي مفتاح حقيقي، ودون أي تغيير إنتاجي أو ربط تنظيمي
