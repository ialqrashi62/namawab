# 28 — i18n Keys (CARD-001)

> Owner: PM/UX · Snippet: snippet:ar-rtl · Tier 1

## Core keys

```yaml
i18n:
  # Navigation
  - { key: cardio.nav.encounter,    ar: 'الزيارة',              en: 'Encounter' }
  - { key: cardio.nav.ecg,          ar: 'تخطيط القلب',          en: 'ECG' }
  - { key: cardio.nav.echo,         ar: 'إيكو القلب',           en: 'Echo' }
  - { key: cardio.nav.stress,       ar: 'اختبار الجهد',         en: 'Stress' }
  - { key: cardio.nav.holter,       ar: 'هولتر',                en: 'Holter' }
  - { key: cardio.nav.cath,         ar: 'القسطرة',              en: 'Cath' }
  - { key: cardio.nav.devices,      ar: 'الأجهزة',              en: 'Devices' }
  - { key: cardio.nav.rehab,        ar: 'التأهيل',              en: 'Rehab' }
  - { key: cardio.nav.risk,         ar: 'مقياس الخطورة',        en: 'Risk Scores' }
  - { key: cardio.nav.copilot,      ar: 'المساعد الذكي',        en: 'Co-pilot' }
  - { key: cardio.nav.red_flag,     ar: 'التنبيهات العاجلة',    en: 'Red Flags' }
  - { key: cardio.nav.nphies,       ar: 'NPHIES',               en: 'NPHIES' }

  # Tabs
  - { key: cardio.tab.encounter,    ar: 'الزيارة',              en: 'Encounter' }
  - { key: cardio.tab.orders,       ar: 'الطلبات',              en: 'Orders' }
  - { key: cardio.tab.results,      ar: 'النتائج',              en: 'Results' }
  - { key: cardio.tab.notes,        ar: 'الملاحظات',            en: 'Notes' }
  - { key: cardio.tab.rx,           ar: 'الوصفة',               en: 'Rx' }
  - { key: cardio.tab.disposition,  ar: 'التصرف',               en: 'Disposition' }

  # Encounter
  - { key: cardio.enc.chief_complaint, ar: 'الشكوى الرئيسية',    en: 'Chief complaint' }
  - { key: cardio.enc.hpi,         ar: 'تاريخ المرض',           en: 'HPI' }
  - { key: cardio.enc.pmh,         ar: 'التاريخ الطبي',         en: 'Past medical history' }
  - { key: cardio.enc.psh,         ar: 'التاريخ الجراحي',       en: 'Past surgical history' }
  - { key: cardio.enc.fh,          ar: 'التاريخ العائلي',       en: 'Family history' }
  - { key: cardio.enc.sh,          ar: 'التاريخ الاجتماعي',     en: 'Social history' }
  - { key: cardio.enc.allergies,    ar: 'الحساسية',              en: 'Allergies' }
  - { key: cardio.enc.exam,        ar: 'الفحص',                 en: 'Exam' }
  - { key: cardio.enc.diagnosis,    ar: 'التشخيص',               en: 'Diagnosis' }
  - { key: cardio.enc.plan,        ar: 'الخطة',                 en: 'Plan' }
  - { key: cardio.enc.disposition,  ar: 'التصرف',                en: 'Disposition' }

  # ECG
  - { key: cardio.ecg.rate,         ar: 'معدل النبض',            en: 'Rate' }
  - { key: cardio.ecg.rhythm,       ar: 'النظم',                 en: 'Rhythm' }
  - { key: cardio.ecg.pr,           ar: 'PR',                    en: 'PR' }
  - { key: cardio.ecg.qrs,          ar: 'QRS',                   en: 'QRS' }
  - { key: cardio.ecg.qtc,          ar: 'QTc',                   en: 'QTc' }
  - { key: cardio.ecg.axis,         ar: 'المحور',                en: 'Axis' }
  - { key: cardio.ecg.impression,   ar: 'الانطباع',              en: 'Impression' }
  - { key: cardio.ecg.urgency,      ar: 'الاستعجال',             en: 'Urgency' }
  - { key: cardio.ecg.stemi,        ar: '⚠ STEMI — فعّل CODE',   en: '⚠ STEMI — activate CODE' }

  # HF GDMT
  - { key: cardio.hf.gdmt,          ar: 'علاج الفشل القلبي',     en: 'GDMT' }
  - { key: cardio.hf.arni,          ar: 'ARNI',                  en: 'ARNI' }
  - { key: cardio.hf.bb,            ar: 'حاصر بيتا',             en: 'Beta-blocker' }
  - { key: cardio.hf.mra,           ar: 'MRA',                   en: 'MRA' }
  - { key: cardio.hf.sglt2i,        ar: 'SGLT2i',                en: 'SGLT2i' }
  - { key: cardio.hf.contra,        ar: 'موانع',                 en: 'Contraindications' }
  - { key: cardio.hf.monitor,       ar: 'المراقبة',              en: 'Monitoring' }

  # AF
  - { key: cardio.af.cha2ds2vasc,   ar: 'CHA2DS2-VASc',          en: 'CHA2DS2-VASc' }
  - { key: cardio.af.hasbled,       ar: 'HAS-BLED',              en: 'HAS-BLED' }
  - { key: cardio.af.doac,          ar: 'DOAC',                  en: 'DOAC' }

  # Red flag
  - { key: cardio.rf.stemi,         ar: '⚠ احتشاء عضلة القلب STEMI', en: '⚠ STEMI' }
  - { key: cardio.rf.dissection,    ar: '⚠ تسلخ الأبهر',         en: '⚠ Aortic Dissection' }
  - { key: cardio.rf.tamponade,    ar: '⚠ انصباب تأموري',       en: '⚠ Cardiac Tamponade' }
  - { key: cardio.rf.pe,            ar: '⚠ صمة رئوية',           en: '⚠ Massive PE' }
  - { key: cardio.rf.scd,           ar: '⚠ خطر موت قلبي مفاجئ',  en: '⚠ Sudden Cardiac Death' }
  - { key: cardio.rf.activate,      ar: 'تفعيل CODE',            en: 'Activate CODE' }
  - { key: cardio.rf.acknowledged,  ar: 'تم الاستلام',           en: 'Acknowledged' }

  # Co-pilot
  - { key: cardio.copilot.ask,      ar: 'اسأل المساعد...',       en: 'Ask the co-pilot...' }
  - { key: cardio.copilot.cite,     ar: 'المصدر',                en: 'Source' }
  - { key: cardio.copilot.evidence, ar: 'مستوى الدليل',          en: 'Evidence level' }
  - { key: cardio.copilot.warn,     ar: 'تحذيرات',               en: 'Warnings' }
  - { key: cardio.copilot.cds,      ar: 'قواعد CDS',             en: 'CDS rules' }
  - { key: cardio.copilot.save,     ar: 'حفظ في الزيارة',        en: 'Save to encounter' }

  # Common
  - { key: common.save,             ar: 'حفظ',                   en: 'Save' }
  - { key: common.cancel,           ar: 'إلغاء',                 en: 'Cancel' }
  - { key: common.sign,             ar: 'توقيع',                 en: 'Sign' }
  - { key: common.print,            ar: 'طباعة',                 en: 'Print' }
  - { key: common.loading,          ar: 'جاري التحميل...',       en: 'Loading...' }
  - { key: common.error,            ar: 'حدث خطأ',               en: 'Error occurred' }
  - { key: common.retry,            ar: 'إعادة',                 en: 'Retry' }
  - { key: common.empty,            ar: 'لا توجد بيانات',        en: 'No data' }
  - { key: common.required,         ar: 'مطلوب',                 en: 'Required' }
```
