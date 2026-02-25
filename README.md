# 🏥 Nama Medical ERP — نما الطبي

نظام إدارة المستشفيات الشامل | Comprehensive Hospital Management System

## ✨ المميزات | Features

- 📊 لوحة تحكم مع رسوم بيانية | Dashboard with Charts
- 🏥 استقبال وتسجيل مرضى | Reception & Patient Registration
- 👨‍⚕️ محطة طبيب كاملة | Full Doctor Station
- 🔬 مختبر + أشعة + صيدلية | Lab + Radiology + Pharmacy
- 💰 مالية + تأمين + فواتير | Finance + Insurance + Billing
- 📋 44 قسم متكامل | 44 Integrated Departments
- 🌐 عربي + إنجليزي | Arabic + English
- 📱 متجاوب مع الموبايل | Mobile Responsive

## 🚀 التثبيت السريع | Quick Setup

### المتطلبات | Prerequisites

- [Node.js](https://nodejs.org) v18+
- [PostgreSQL](https://www.postgresql.org/download/) v14+

### خطوة واحدة فقط! | One Step Only

```bash
git clone https://github.com/iceman18ice-sketch/namaweb3.git
cd namaweb3
setup.bat
```

> السكريبت يسوي كل شيء تلقائياً: يفحص المتطلبات، ينشئ قاعدة البيانات، يحمل المكتبات، ويزرع البيانات الأولية.

### أو يدوياً | Or Manually

```bash
git clone https://github.com/iceman18ice-sketch/namaweb3.git
cd namaweb3
copy .env.example .env
npm install
node server.js
```

## ▶️ التشغيل | Run

```bash
start.bat
```

أو | or

```bash
node server.js
```

ثم افتح | Then open: **<http://localhost:3000>**

### بيانات الدخول الافتراضية | Default Login

| الحقل | القيمة |
|-------|--------|
| المستخدم | `admin` |
| كلمة المرور | `admin` |

## 📁 هيكل المشروع | Project Structure

```
namaweb3/
├── server.js              # السيرفر الرئيسي + APIs
├── public/
│   ├── index.html         # الصفحة الرئيسية
│   ├── login.html         # صفحة الدخول
│   ├── js/
│   │   ├── app.js         # الواجهة (44 قسم)
│   │   └── api.js         # مكتبة API
│   ├── css/styles.css     # التصميم
│   └── consent-forms/     # نماذج الموافقة (31 نموذج)
├── setup.bat              # تثبيت تلقائي
├── start.bat              # تشغيل بضغطة واحدة
├── .env.example           # قالب الإعدادات
├── package.json           # المكتبات
└── README.md              # هذا الملف
```

## 🏥 الأقسام | Departments (44)

| القسم | Department | القسم | Department |
|-------|-----------|-------|-----------|
| لوحة التحكم | Dashboard | الاستقبال | Reception |
| المواعيد | Appointments | محطة الطبيب | Doctor Station |
| المختبر | Laboratory | الأشعة | Radiology |
| الصيدلية | Pharmacy | الموارد البشرية | HR |
| المالية | Finance | التأمين | Insurance |
| المخازن | Inventory | التمريض | Nursing |
| الجراحة | Surgery | الطوارئ | Emergency |
| التنويم | Inpatient | العناية المركزة | ICU |
| بنك الدم | Blood Bank | التأهيل | Rehabilitation |
| النساء والولادة | OB/GYN | التجميل | Cosmetic Surgery |
| التعقيم | CSSD | التغذية | Dietary |
| مكافحة العدوى | Infection Control | الجودة | Quality |
| الصيانة | Maintenance | النقل | Transport |
| الطب عن بُعد | Telemedicine | علم الأمراض | Pathology |
| التعليم الطبي | CME | الخدمة الاجتماعية | Social Work |

## 🛠️ التقنيات | Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Frontend:** Vanilla JS, CSS3
- **Security:** Helmet, bcrypt, express-rate-limit

## 📝 الترخيص | License

MIT License — Free to use
