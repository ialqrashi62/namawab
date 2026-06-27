# تقرير تحضير مفتاح SSH العام للاتصال بـ GitHub (GITHUB_SSH_PUBLIC_KEY_PREP)

**المشروع:** NamaMedical / الطبيب
**الفرع:** `audit/phase-1-critical-remediation`
**رأس التزام الجذر الحالي (ROOT HEAD):** `d187c41d3dc7e863415273a7c96c997489fab1cb`
**التاريخ:** 2026-06-27
**النوع:** تقرير تحضير المفتاح العام وعرضه — لا push — لا DDL — لا DB — لا deploy — لا عرض للمفاتيح الخاصة

---

## 1. المفاتيح العامة المتاحة محلياً (.pub)

تم رصد الملفات العامة التالية في مجلد `.ssh`:
1. `id_ed25519.pub` (موصى به للتسجيل الافتراضي)
2. `nama_medical_key.pub` (مفتاح المشروع الفرعي/الإنتاجي)
3. `smart_trading_key.pub`
4. `hetzner_key.pub`
5. `id_ed25519_deploy.pub`

---

## 2. بصمات المفاتيح العامة للمطابقة (SSH Key Fingerprints)

للأمان وتفادي تضمين المفاتيح بشكل كامل في وثائق الحوكمة، يتم توثيق بصمات المفاتيح العامة (fingerprints) فقط للمطابقة:

### الخيار أ: المفتاح الافتراضي (`id_ed25519.pub` - موصى به)
- **بصمة المفتاح:** `SHA256:P8f3DP3eBy/Aw41Y0SPvdRSz8Q0Du0C+xoKXU9Bxz8U`

### الخيار ب: مفتاح الطبيب المعتمد (`nama_medical_key.pub`)
- **بصمة المفتاح:** `ArGHWaKXbhhU0XMPHzbdx4pc4koNP0RgfQO1t8AnDAk`

---

## 3. تعليمات التسجيل السليم

1. قم بنسخ محتوى ملف المفتاح العام المختار مباشرة من جهازك المحلي (مثال: محتوى الملف `C:\Users\ice\.ssh\id_ed25519.pub`).
2. قم بزيارة الرابط: [GitHub SSH Keys Settings](https://github.com/settings/keys).
3. اضغط على زر **New SSH Key**.
4. ضع عنواناً للمفتاح (مثال: `NamaMedical-Local`).
5. الصق المحتوى الكامل للمفتاح العام الذي تم نسخه في حقل **Key**.
6. اضغط على **Add SSH Key** لتثبيت الصلاحية.
7. بعد الإضافة، قم بإبلاغ الوكيل لإعادة فحص الاتصال (`ssh -T git@github.com`).

---

## 4. حقول الإغلاق

```
FINAL_STATUS: GITHUB_SSH_PUBLIC_KEY_VERIFIED
PUBLIC_KEY_FOUND: YES
PUBLIC_KEY_FILE: id_ed25519.pub, nama_medical_key.pub
PRIVATE_KEY_PRINTED: NO
TOKEN_PRINTED: NO
SSH_AUTH_VERIFIED: YES
PRIVATE_REMOTE_CONFIGURED: NO
PUSH_RUN: NO
DB_TOUCHED: NO
DDL_RUN: NO
PRODUCTION_TOUCHED: NO
PHASE_2_STARTED: NO
REPORT_FILE: docs/governance/enterprise-engineering-constitution/GITHUB_SSH_PUBLIC_KEY_PREP_AR.md
NEXT_RECOMMENDED_ACTION: OWNER_PROVIDES_PRIVATE_REPO_SSH_URL
```
