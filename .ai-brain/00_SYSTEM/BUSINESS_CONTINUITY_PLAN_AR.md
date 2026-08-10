# خطة استمرارية الأعمال (BCP) — NamaMedical
**التاريخ:** 2026-08-10 · **الإصدار:** v3.0 · **MBCO:** 8 ساعات

---

## 1. نظرة عامة

| الخاصية | القيمة |
|---|---|
| **MBCO** (Minimum Business Continuity Objective) | 8 ساعات |
| **الهدف** | استمرار الخدمة الحرجة (ER, ICU, OR, Pharmacy) |
| **النطاق** | NamaMedical Hospital Platform |
| **المراجعة** | كل 6 أشهر |

---

## 2. العمليات الحرجة (Tier 0 - لا تتوقف أبداً)

| العملية | النظام | RTO | البديل |
|---|---|---|---|
| تسجيل دخول الطوارئ | ER Station | 5min | Paper triage |
| إعطاء الأدوية | MAR | 5min | Paper MAR |
| الجراحة | OR System | 30min | Paper OR log |
| نتائج المختبر الحرجة | LIS | 15min | Phone result |
| نقل دم طارئ | BloodBank | 5min | Manual crossmatch |
| التصوير الطبي | RIS/PACS | 30min | Wet reads |

---

## 3. العمليات المهمة (Tier 1 - تتوقف لـ4 ساعات كحد أقصى)

| العملية | النظام | RTO | البديل |
|---|---|---|---|
| المواعيد | Scheduling | 4h | Phone booking |
| الإحالات | Referrals | 4h | Email |
| الفواتير | Billing | 8h | Paper invoice |
| التأمين (NPHIES) | Insurance | 4h | Manual eligibility |
| الصيدلية | Pharmacy | 2h | Paper Rx |
| التمريض | Nursing Station | 2h | Paper chart |

---

## 4. العمليات العادية (Tier 2 - تتوقف لـ24 ساعة)

| العملية | النظام | RTO |
|---|---|---|
| التقارير الدورية | Reporting | 24h |
| التدريب | LMS | 24h |
| التسويق | CRM | 24h |
| إدارة المخزون | Inventory | 24h |

---

## 5. سيناريوهات الكوارث

### 5.1 تعطل NamaMedical جزئياً

**الحل:**
- Failover إلى region ثانوي خلال 30 دقيقة
- أو: manual override + paper workflow

### 5.2 تعطل NamaMedical كلياً

**الحل:**
- العودة لـ paper workflow (دليل crisis_paper_workflow.pdf)
- استعادة خلال 4-8 ساعات
- إدخال البيانات بأثر رجعي بعد الاستعادة

### 5.3 اختراق أمني

**الحل:**
- عزل فوري
- استعادة من backup نظيف (NOT infected)
- إبلاغ المرضى المتأثرين (PDPL)
- Forensic investigation

### 5.4 فقدان provider (cloud down)

**الحل:**
- Failover تلقائي
- أو: تفعيل "manual mode" مع تخزين محلي

---

## 6. الأدوار والمسؤوليات

| الدور | المسؤول | البديل |
|---|---|---|
| BCP Coordinator | COO | CFO |
| IT Recovery | CTO | DevOps Lead |
| Communications | CCO | CMO |
| Patient Care | CNO | Senior Nurse |
| Finance | CFO | Controller |
| Legal | General Counsel | Outside Counsel |

---

## 7. خطة الاتصال

### داخلي

| الجمهور | القناة | التردد |
|---|---|---|
| فريق القيادة | Phone + Slack | كل ساعة |
| كل الفريق | Slack + email | كل 4 ساعات |
| On-call | PagerDuty | real-time |

### خارجي

| الجمهور | القناة | التردد |
|---|---|---|
| المستشفيات | Phone + email | كل ساعتين |
| المرضى | in-app + email | مرة واحدة |
| SFDA/CBAHI | Email رسمي | خلال 24 ساعة |
| الإعلام | press release | حسب الحاجة |

---

## 8. خطة الورقي (Paper Workflow)

كل مستشفى يجب أن يحتفظ بـ:
- 500 ورقة triage form
- 500 ورقة MAR
- 200 ورقة OR log
- 200 ورقة anesthesia record
- 200 ورقة delivery note
- 200 ورقة death certificate
- 1000 ورقة prescription blank

**مراجعة:** كل 6 أشهر (صلاحية الحبر + التخزين)

---

## 9. خطة ما بعد الحادث

خلال 5 أيام عمل:
1. **Day 1:** hot wash (نقاش فوري)
2. **Day 2:** root cause analysis
3. **Day 3-5:** post-mortem doc + action items
4. **Day 5:** share with leadership
5. **Day 30:** verify action items completed

---

## 10. تحديث الخطة

- **مراجعة كاملة:** كل 6 أشهر
- **مراجعة بعد كل حادث:** خلال 5 أيام
- **مراجعة بعد تغيير كبير:** فوري

المالك: COO
المراجع: CEO + Board
