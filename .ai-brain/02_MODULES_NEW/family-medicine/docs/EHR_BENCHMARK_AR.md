# طب الأسرة — مقارنة مع الأنظمة العالمية
## Family Medicine vs Epic / Cerner / MEDITECH / Athena

> **القسم:** `family-medicine`
> **التاريخ:** 2026-08-11

---

## 1. نظرة عامة

طب الأسرة هو القسم الأكثر شيوعاً في المستشفيات والمراكز الصحية. يجب أن يكون:
- **شامل** (جميع الأعمار، جميع الحالات الشائعة)
- **سريع** (الطبيب يرى 25-30 مريض/يوم)
- **منسّق** (يحيل للاختصاصات)
- **وقائي** (فحوصات، لقاحات)

---

## 2. Epic (Care Everywhere)

### 2.1 Features
- **Healthy Planet** (population health) — تنبيهات للفحوصات المفقودة
- **Best Practice Advisories (BPAs)** — تنبيهات في الـ workflow
- **Care Plan** — multi-disciplinary
- **Smart Lists** — قوائم ذكية (e.g., مرضى السكري غير المسيطر عليهم)
- **NoteWriter** — قوالب SOAP، History of Present Illness (HPI)
- **Health Maintenance** — تذكيرات الفحوصات

### 2.2 ما عندنا ✅
- ✅ Filler reminders via wellnessScreenings()
- ✅ Risk scores (ASCVD, FINDRISC)
- ✅ 4-language i18n
- ✅ NPHIES integration

### 2.3 ما ينقصنا (P0/P1)
- 🆕 BPAs (Best Practice Advisories) — W14
- 🆕 NoteWriter templates (SOAP) — W14
- 🆕 Health Maintenance module — post-launch
- 🆕 Smart Lists — post-launch

---

## 3. Cerner (PowerChart Touch)

### 3.1 Features
- **MPages** (custom views)
- **Care Compass** (population health)
- **PowerNotes** (templates)
- **Discern Expert** (rules)
- **FirstNet** (ER)
- **HealtheRegistries** (registries)

### 3.2 ما عندنا ✅
- ✅ Pure-function engine (akin to CCL)
- ✅ Rules via middleware
- ✅ Risk assessments

### 3.3 ما ينقصنا
- 🆕 MPages (custom views) — post-launch
- 🆕 PowerNotes templates — W14
- 🆕 Population health dashboards — post-launch

---

## 4. MEDITECH (Expanse)

### 4.1 Features
- **Expanse Now** (mobile)
- **Population Health Management**
- **Care Transitions**
- **Expanse Ambulatory** (strong in primary care)

### 4.2 ما عندنا ✅
- ✅ Mobile (mynama PWA)
- ✅ Care coordination
- ✅ Preventive care

### 4.3 ما ينقصنا
- 🆕 Population Health Management — post-launch
- 🆕 Care Transitions tracking — W14

---

## 5. Athena (athenaOne)

### 5.1 Features
- **Rules Engine** (cloud-native)
- **MIPS/MACRA tracking** (US quality)
- **Care Coordination**
- **Patient Outreach** (vaccine reminders, follow-up)
- **Ambient Listening**

### 5.2 ما عندنا ✅
- ✅ Rules engine
- ✅ Patient portal (mynama)
- ✅ Care coordination

### 5.3 ما ينقصنا
- 🆕 Proactive patient outreach — post-launch
- 🆕 Ambient scribe (Arabic) — W14
- 🆕 Quality program tracking (Saudi equivalent) — post-launch

---

## 6. النتيجة

| Capability | Epic | Cerner | MEDITECH | Athena | **NamaMedical** |
|---|---|---|---|---|---|
| Risk scores (ASCVD, FINDRISC) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Smoking cessation (5As) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Wellness screenings | ✅ | ✅ | ✅ | ✅ | ✅ |
| i18n 4-locale | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
| NPHIES integration | ❌ | ❌ | ❌ | ❌ | ✅ |
| ZATCA | ❌ | ❌ | ❌ | ❌ | ✅ |
| Care plans | ✅ | ✅ | ✅ | ✅ | ⚠️ (P2) |
| BPAs | ✅ | ✅ | ⚠️ | ✅ | ⚠️ (P0) |
| Population health | ✅ | ✅ | ✅ | ✅ | ⚠️ (P2) |
| Patient outreach | ✅ | ✅ | ✅ | ✅ | ⚠️ (P2) |
| Mobile native | ✅ | ✅ | ✅ | ✅ | ✅ (PWA) |

**Score: 8/12 matching Epic-level features, 4/12 post-launch.**

---

## 7. Roadmap to Match Epic (12 months)

| Quarter | Deliverable |
|---|---|
| Q3 2026 | BPAs, NoteWriter templates, Care plans |
| Q4 2026 | Population health, Patient outreach |
| Q1 2027 | Ambient scribe, Quality program tracking |
| Q2 2027 | Care transitions, Smart lists |

---

> **Verdict:** NamaMedical Family Medicine = "Modern Epic-lite for KSA, with full Arabic + NPHIES + ZATCA advantages."
