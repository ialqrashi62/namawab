# 54 — Training Video Script (CARD-001)

> Owner: PM/UX · Tier 2

## Video 1: Cardiology Doctor Station — 15 min (AR + EN subtitles)

### Scene 1 (0:00-1:00) — Intro

**Visuals:** NamaMedical logo + Cardiology icon
**Voice-over (AR):**
> "أهلاً بكم في تدريب محطة طبيب القلب. في هذا الفيديو سنتعلم كيف تستخدم النظام الجديد لإدارة مرضى القلب، من فتح encounter جديد إلى تفعيل CODE STEMI."

**Subtitles (EN):** "Welcome to the Cardiology Doctor Station training. In this video, you'll learn how to use the new system to manage cardiac patients, from opening a new encounter to activating CODE STEMI."

### Scene 2 (1:00-3:00) — Login + MFA

**Visuals:** Browser → login page → MFA
**Voice-over (AR):**
> "أولاً، افتح https://jumanasoft.com/login. أدخل بريدك الإلكتروني وكلمة المرور. ثم أدخل رمز MFA من تطبيق Google Authenticator. اضغط دخول."

### Scene 3 (3:00-5:30) — Open patient + new encounter

**Visuals:** Patient search → encounter form
**Voice-over (AR):**
> "اضغط 'Patients' في القائمة. ابحث بـ MRN أو الاسم. اضغط على المريض. ثم 'New Cardiology Encounter'. املأ chief complaint، HPI، PMH، PSH، FH، SH، allergies. اضغط Save."

### Scene 4 (5:30-8:00) — Upload ECG + auto-interpret

**Visuals:** ECG upload → wait → auto-interpret
**Voice-over (AR):**
> "اضغط 'ECG' في القائمة. اضغط 'Upload ECG'. اختر ملف الـ ECG (PDF أو PNG). انتظر 30 ثانية. النظام يحلل تلقائياً ويركز على: rhythm, rate, intervals, ST changes, Q waves. راجع الـ impression. إذا كان STEMI، النظام سيُفعّل CODE STEMI تلقائياً."

### Scene 5 (8:00-10:30) — Activate CODE STEMI manually

**Visuals:** Activate CODE → confirm → page
**Voice-over (AR):**
> "لتفعيل CODE STEMI يدوياً: افتح encounter، اضغط 'Activate CODE'، اختر 'STEMI'، اضغط 'Confirm'. النظام يُعلم طبيب القلب on-call، فريق القسطرة، الطوارئ، CCU. عند الوصول، مطلوب 4-eye review من طبيب قلب ثاني."

### Scene 6 (10:30-12:00) — HF GDMT Optimizer

**Visuals:** GDMT optimizer → 4 pillars
**Voice-over (AR):**
> "لمرضى HF: افتح encounter، اضغط 'GDMT Optimizer'. النظام يحلل: EF, NYHA, BP, HR, eGFR, K, الأدوية الحالية. يوصي بـ 4 pillars: ARNI, Beta-blocker, MRA, SGLT2i. راجع التحذيرات (مثل hyperkalemia, hypotension). اضغط 'Apply All' لقبول التغييرات."

### Scene 7 (12:00-13:30) — Co-pilot query

**Visuals:** Co-pilot tab → question → answer with citations
**Voice-over (AR):**
> "المساعد الذكي (Co-pilot) يجيب على أسئلتك السريرية. اكتب سؤالك بالعربية أو الإنجليزية. النظام يجيب بناءً على guidelines (ACC/AHA, ESC, NPHIES). كل إجابة فيها: المصدر + مستوى الدليل + تحذيرات. اضغط 'Save to Encounter' لإضافة الإجابة للسجل."

### Scene 8 (13:30-15:00) — Summary

**Voice-over (AR):**
> "هذا كان تدريب سريع على محطة طبيب القلب. لمزيد من التفاصيل، راجع wiki.nama-medical/cardio أو اتصل بالدعم."

---

## Video 2: Cath Lab Workflow — 20 min

### Scene 1 (0:00-2:00) — Intro + Pre-cath checklist

**Visuals:** Cath lab logo + checklist
**Voice-over (AR):**
> "هذا التدريب يغطي سير عمل مختبر القسطرة، من تقييم ما قبل القسطرة إلى المتابعة بعد الإجراء."

**Pre-cath checklist:**
- Indication (NSTEMI, stable angina, etc.)
- Risk assessment (RCRI, EF, valvular)
- Anticoag hold decision
- Informed consent
- Preop labs (CBC, BMP, coags, type + screen)
- Vascular access assessment

### Scene 2 (2:00-6:00) — Cath lab report (finding + intervention)

**Visuals:** Cath report form → fields
**Voice-over (AR):**
> "بعد القسطرة، افتح encounter، اضغط 'Cath'. اضغط 'New Cath Report'. حدد procedure_type: Diagnostic، PCI، TAVR، MitraClip، إلخ. حدد access_site: radial أو femoral. في 'Findings'، أدخل لكل vessel: stenosis %. في 'Interventions'، أدخل لكل stent: type, size, deployed_at. أدخل fluoro_minutes, contrast_ml, dose_mgy."

### Scene 3 (6:00-10:00) — Sign + send to NPHIES

**Visuals:** Sign + send
**Voice-over (AR):**
> "راجع التقرير. اضغط 'Sign'. بعد التوقيع، اضغط 'Send to NPHIES'. النظام يرسل تلقائياً مع Idempotency-Key. لو حاولت الإرسال مرتين، NPHIES سيرجع نفس الـ claim (لا تكرار)."

### Scene 4 (10:00-13:00) — Post-cath follow-up

**Visuals:** Orders + Rx
**Voice-over (AR):**
> "بعد القسطرة: اكتب DAPT (Aspirin 81mg + P2Y12 inhibitor لمدة 12 شهر). اكتب statin. حدد follow-up (1 week, 1 month, 3 months). أحل للمريض لتأهيل القلب."

### Scene 5 (13:00-15:00) — Complications

**Visuals:** Complication list
**Voice-over (AR):**
> "المضاعفات المحتملة: access site bleeding, hematoma, retroperitoneal bleed, dissection, perforation, no-reflow, stent thrombosis, contrast nephropathy, MI, stroke. في حالة أي مضاعفة، فعّل red flag المقابل. وثّق في الـ complication field."

### Scene 6 (15:00-18:00) — Quality metrics

**Visuals:** KPIs
**Voice-over (AR):**
> "مؤشرات الجودة: door-to-balloon (STEMI) < 90 دقيقة. Contrast volume < 3x eGFR. Radiation dose ALARA. DAPT compliance > 95%. 30-day readmission < 10%. MACCE tracking."

### Scene 7 (18:00-20:00) — Summary

**Voice-over (AR):**
> "هذا كان تدريب مختبر القسطرة. لمزيد من التفاصيل، راجع wiki.nama-medical/cath-lab."

---

## Video 3: Co-pilot AI for Cardiologists — 12 min

### Scene 1 (0:00-1:30) — What is Co-pilot?

**Voice-over (AR):**
> "المساعد الذكي (Co-pilot) هو مساعد سريري يستخدم نماذج لغوية كبيرة (LLM) للإجابة على أسئلتك السريرية. هو ليس بديلاً عن حكمك السريري — هو أداة لتسريع الوصول للمعلومات. كل إجابة مبنية على guidelines معتمدة، مع ذكر المصدر وسنة النشر."

### Scene 2 (1:30-3:30) — When to use

**Visuals:** Use cases
- Dose check
- Drug interaction check
- Guideline recall (latest ACC/AHA, ESC)
- Risk score calculation
- Differential diagnosis brainstorming
- Patient education explanation

### Scene 3 (3:30-6:00) — Demo: HF GDMT

**Visuals:** Question + answer
**Question (AR):** "ما هو GDMT الأمثل لمريض EF 25% NYHA II على Enalapril وMetoprolol مع K 5.4 وeGFR 35؟"

**Answer (AR):**
> "حالياً: ARNI بدل Enalapril (لأن HFrEF). إضافة SGLT2i (eGFR 35 مقبول). **لا تضيف MRA** لأن K=5.4 مرتفع وعندك ARNI. الهدف: الوصول إلى جرعة قصوى تدريجياً مع مراقبة K و Cr."

**Sources:** ACC/AHA 2024 HF Guideline §7.4, ESC 2023 HF Guideline §8.2.

**Evidence level:** A.

**Warnings:** Hyperkalemia risk with ARNI. Monitor K q1week x 4 weeks.

### Scene 4 (6:00-8:00) — Demo: Red flag detection

**Visuals:** Question → red flag
**Question (AR):** "هل تخطيط القلب هذا طبيعي؟" (with attached ECG image of STEMI)

**Answer (AR):**
> "⚠ **RED FLAG DETECTED**: ST elevation في leads II, III, aVF (>2mm). هذا STEMI inferior. CODE STEMI يوصى بالتفعيل الفوري. ECG criteria per ACC/AHA 2024 §3.1."

[System auto-activates CODE STEMI in background]

### Scene 5 (8:00-10:00) — Limitations

**Voice-over (AR):**
> "حدود المساعد الذكي: لا يحل محل الفحص السريري. لا يصف أدوية بدون تحقّق من CDS. لا يكشف PHI لمستأجر آخر. لا يتذكر محادثات قديمة (إلا إذا حفظت)."

### Scene 6 (10:00-12:00) — Best practices + summary

**Best practices:**
- اكتب سؤالك بوضوح
- ضمّن patient context (PHI-redacted)
- راجع المصدر دائماً
- لا تنسخ الإجابة بدون فهم
- استخدم للتفسير، ليس للقرار النهائي

**Summary:** "المساعد الذكي أداة قوية لكن بحكمة. استخدمها لتسريع عملك، لا لاستبداله."

---

## Video 4: Patient Portal — Cardiology — 8 min (AR primary)

### Scene 1 (0:00-1:30) — Login + 2FA
### Scene 2 (1:30-3:30) — View appointments + results
### Scene 3 (3:30-5:30) — Message cardiologist (read-only)
### Scene 4 (5:30-7:00) — Educational content (AR)
### Scene 5 (7:00-8:00) — Privacy + how to request data
