# NamaMedical — MASTER DEPARTMENT CATALOG
> Source: Owner mega-prompt 2026-08-25 · Generator skill: `nm-ai-brain-department-generator` (35-file blueprint)
> Status legend: `[x]` built · `[~]` skeleton-only · `[ ]` not started

## 1. Internal Medicine (الأقسام الباطنية) — group: `internal_medicine/`
- [~] cardiology (قلب + تداخلي + EP + وقائي + نووي + حوامل + قسطرة + أوعية طرفية + فشل قلبي متقدم)
- [~] respiratory (صدر + نوم + مناظير + أكسجين منزلي)
- [~] gastro (هضمي + EUS/ERCP + كبد + بنكرياس + حركة + تغذية)
- [~] nephrology (كلى + زراعة + غسيل hemodialysis/peritoneal/home + plasmapheresis)
- [~] oncology_hematology → dir: oncology (أورام + دم + تخثر + BMT autologous/allo/cord)
- [~] endocrinology (غدد + سكري T1/T2/حمل/مضاعفات + عظام استقلابية + سمنة)
- [~] rheumatology_immunology → dir: rheumatology (+ حساسية وربو)
- [~] infectious_diseases (+ وقاية عدوى + حميات + stewardship + مسافرين + تطعيمات)
- [~] dermatology (+ تجميل + جراحة + أورام جلدية + ضوء)

## 2. Surgical (الجراحية) — group: `surgical/`
- [~] general_surgery (+ أورام + غدد + مناظير/روبوت + سمنة + ثدي + رضوح + قولون)
- [~] cardiothoracic (+ أوعية: endovascular/grafts/دوالي)
- [ ] neurosurgery (وعائية + أورام + وظيفية + محيطية + skull base + تنظير + عمود فقري/scoliosis)
- [ ] orthopedics (مفاصل اصطناعية + رضوح + يد ميكروسكوبي + قدم وكاحل + رياضة + أورام + أطفال)
- [ ] ophthalmology (شبكية + قرنية/bank/DMEK + مياه بيضاء + جلوكوما + oculoplastics + أطفال/حول + عصبية + ليزر)
- [ ] ent_head_neck (جيوب + otology/cochlear + حنجرة/صوت + درقية + نوم جراحة)
- [ ] urology_andrology (حصوات + أورام مسالك + أطفال + ذكورة/عقم + نساء urodynamics + ترميم)
- [ ] plastic_burns_maxillofacial (تجميل وجه/جسم + microsurgery + حروق ICU/كيمياء/ترميم + فكين)

## 3. OB / GYN / Pediatrics — groups: `obgyn/`, `pediatrics/`
- [ ] obstetrics_gynecology (أم وجنين + 4D + IVF/ICSI/IMSI/PGD + بنوك تبريد + مراهقات + يأس + urogynecology)
- [ ] pediatrics (NICU III/IV + خدج + وراثة + تغذية + تنموي + 12 تخصص دقيق)

## 4. Advanced Diagnostics — group: `diagnostics/`
- [ ] radiology_imaging (تداخلية: angiography/embolization/ablation/stenting + CT dual-energy + MRI fMRI/MRS/DTI + US 4D/TEE + nuclear PET/scan/I-131)
- [ ] laboratory_medicine (histo/cyto/frozen/IHC/mol + bacterio/viro/myco/parasite + كيمياء + مناعة + وراثة + سموم + بنك دم/apheresis)
- [ ] functional_testing (ECG/stress/Holter + EMG/NCS/EP + EEG/video + PFT + تعرق وحساسية)

## 5. Critical Care & Emergency — group: `critical_care/`
- [ ] emergency_department (trauma I/II + chest pain + stroke code + نفسية + أطفال + سموم + triage + observation)
- [ ] icu_complex (MICU/SICU/Trauma/CCU/Neuro/PICU/NICU/Burn/Onc/Renal/Transplant/Obstetric)
- [ ] anesthesia_pain (تخدير عام/ولادة/أطفال/قلب + تداخلي: حقن/RF/SCS/pumps + PACU + HBOT)

## 6. Rehabilitative — group: `rehabilitation/`
- [ ] pmr_rehab (طبيعي: كهربي/مائي/يدوي + وظيفي + نطقي/بلع + شلل + أطفال + prosthetics + play)

## 7. Oncology Therapeutics & Integrative — group: `therapeutics/`
- [ ] radiation_oncology (IMRT/SRS/Gamma/CyberKnife/Proton/Brachytherapy) + clinical pharmacy units
- [ ] integrative_medicine (إبر + حجامة + أعشاب + موسيقى/فن/يوغا/pet)

## 8. Support Services — group: `support/`
- [ ] nursing_services (15 تخصص تمريض) · nutrition_food (TPN + مطبخ مركزي) · psychosocial · biomed_his (هندسة طبية + HIS/PACS + ترجمة + إحصاء) · safety_security

## 9. Admin & Academic — group: `admin_academic/`
- [ ] executive_quality (CEO/CMO/CNO/CFO/COO + JCI/CAP/ISO + credentialing + audit + مخاطر)
- [ ] education_research (امتياز/زمالة/CME + بحوث/IRB/biostats + مكتبة + محاكاة)
- [ ] hr_admin (توظيف طبي + قانونية + PR/إعلام + call center)

## 10. Centers of Excellence (16 مركز) — group: `centers_excellence/`
- [ ] heart_vascular · cancer · ortho_spine · fertility · ent_headneck · trauma · burns · transplant · geriatric · pain · bariatric_metabolic · childrens · behavioral · eye_institute · neuro_stroke · fetal_women

## 11. Rare & Super-Specialized — group: `rare_advanced/`
- [ ] space_dive_medicine · polysomnography · emu_epilepsy · stem_cell_adv · fetal_surgery · dbs · nm_therapy · cryotherapy · confocal_endomicroscopy · pharmacogenomics · nanomedicine

---
## Build waves
| Wave | Depts | Agents | Status |
|---|---|---|---|
| **AUDIT-DONE** | 3-layer gap analysis → GAP_ANALYSIS_CATALOG.md | — | ✅ 74/80 content-covered |
| **W1-DONE (2026-08-25)** | tier311-314 gap modules built + deployed LIVE | sequential+verified | ✅ |
| **W-BLUEPRINTS-DONE** | 35 full (×35 files) + 27 compact (×12) = **1,591 ملف** via `tools_gen/generate_blueprints.py` | python generator | ✅ |
| W2 next | platform backlog: pgvector schema, helpdesk, SEO, APM, i18n consolidation | queued | |
| W3 next | wire blueprint engines → real app code per dept | queued | |

> NOTE: prod runs branch `production/live-20260825`; deploys are ADDITIVE-ONLY.
> كل عمل يُسجَّل في: ACTIVITY_LOG.md
