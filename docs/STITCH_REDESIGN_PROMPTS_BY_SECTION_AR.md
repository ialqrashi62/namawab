# موجهات وإرشادات إعادة التصميم التفصيلية لمنصة Google Stitch باللغة العربية

يوثق هذا التقرير موجهات التصميم الجاهزة للنسخ والاستخدام الفوري داخل منصة **Google Stitch** لكل شاشة وقسم طبي أو إداري مكتشف في نظام **نما الطبي** لضمان توليد واجهات مستخدم متميزة متطابقة مع الهوية البصرية المتطورة.

---

## 1. موجه تصميم صفحة الهبوط وتسجيل الدخول (Stitch Prompt: Landing & Login Page)

```md
Design a modern bilingual Arabic/English RTL-ready healthcare SaaS interface for the Hospital Portal Landing & Login Page.

Context:
- System type: Medical ERP / HIS / EMR SaaS
- Facility types: Medical Cities, Hospitals, Polyclinics, Laboratories, Pharmacies, Radiology Centers
- Primary users: Doctors, Nurses, Receptionists, Administrators, Patients
- Main workflow: Secure authentication, portal access selection, and credential verification

Current screen purpose:
Allows system users to select their facility portal, view overall platform features, and log in securely.

Route:
/login.html

Current file:
namaweb/public/login.html

Current UI elements:
- Cards: Healthcare features grid (Clinical EMR, LIS, RIS, Financial ERP, ZATCA, HR)
- Forms: Login Modal with Username and Password fields
- Buttons: Portal Login CTA, Languages Toggle, Theme Selector
- Modals: Interactive Login popup triggered on CTA click

Required layout:
- Header: Minimalist bar with dark logo "Nama Medical", language switch, and theme selector
- Main Section: Premium split-layout. Left (or Right in LTR): Stunning glassmorphism card explaining "Vision 2030 Healthcare Digitization in Saudi Arabia". Right (or Left in LTR): Greeting title "Global Excellence in Healthcare", features overview grid, and a primary "Portal Login" floating button.
- Login Modal: Centered glassmorphism modal with username, password, show/hide eye icon, and a prominent "Authenticate & Enter" button.
- Footer: Security certification badges, CHI, MOH compliance indicators, and help desk contact.

Visual style:
- Enterprise medical SaaS
- Deep Navy blue background with subtle gradients
- Medical Teal accent colors
- Clean typography using IBM Plex Sans Arabic
- Smooth hover animations and glassmorphism borders
- High contrast input fields with clear focus states

Data examples:
- Username: 'admin' or 'doctor1'
- Facility Name: 'Nama Medical Hospital - Riyadh'

Do not include:
- Unsafe clinical claims
- Fake credentials or exposed passwords
- Plain flat generic styling
- Weak responsive breakpoints

Output:
Create a polished, production-grade UI design for this screen.
```

---

## 2. موجه لوحة التحكم التشغيلية الكبرى (Stitch Prompt: Executive Command Center)

```md
Design a modern bilingual Arabic/English RTL-ready healthcare SaaS interface for the Operational Command Center.

Context:
- System type: Enterprise HIS / ERP Executive Dashboard
- Facility types: Hospitals, Medical Cities, Polyclinics
- Primary users: Hospital Managers, Directors, Chief Doctors, CFOs
- Main workflow: Live monitoring of bed occupancy, clinical wait times, operational compliance, and financial flow.

Current screen purpose:
Provides a real-time command dashboard of hospital-wide KPIs, clinical trends, and regulatory alignment.

Route:
/ (لوحة التحكم الرئيسية)

Current file:
namaweb/public/js/app.js (renderDashboard)

Current UI elements:
- Cards: Live Bed Occupancy, Average Wait Time, Compliance Index (CHI/MOH), Emergency Cases
- Charts: Interactive line chart for daily revenue and surgical volume, donut chart for medical specialties distribution
- Feed: Live compliance alert logs (WPS updates, credential expirations, insurance audit outcomes)

Required layout:
- Header: Title "Operational Command Center", subtitle with live date and pulsating "Live Connection" green badge, alongside "Export Report" and "Print Portal" premium buttons.
- Main Grid: Bento-style dashboard:
  - Top row: 4 key KPI cards with icon backgrounds and mini sparklines.
  - Middle row: Left (large): Main clinical revenue trend line chart. Right (small): Medical specialty load distribution chart.
  - Bottom row: Left: Scrollable table of Physician Revenue and Patient Volume. Right: Real-time Compliance Alert Feed with colored urgency tags.

Visual style:
- Enterprise premium dark theme
- Deep Navy surfaces, Medical Teal accents, Golden highlights for executive elements
- HSL tailored colors for chart categories
- Clear font hierarchy (IBM Plex Sans Arabic)
- High contrast for critical alerts

Data examples:
- Bed Occupancy: 87% (out of 300 active beds)
- Average Wait Time: 18 Minutes
- Top Physician: 'Dr. Faisal Al-Otaibi (Cardiology)'

Output:
Create a polished, production-grade UI design for this screen.
```

---

## 3. موجه محطة الطبيب السريرية (Stitch Prompt: Doctor Station Workspace)

```md
Design a modern bilingual Arabic/English RTL-ready healthcare SaaS interface for the Doctor Station Workspace.

Context:
- System type: EMR / Consultation Workspace
- Facility types: General Hospitals, Polyclinics, Specialized Medical Centers
- Primary users: General Physicians, Surgeons, Consultants
- Main workflow: Load next patient, review EMR history, write clinical diagnosis, search ICD-10, and issue lab, radiology, and pharmacy orders.

Current screen purpose:
A comprehensive consultation interface enabling physicians to handle patient visits end-to-end.

Route:
#doctor

Current file:
namaweb/public/js/app.js (renderDoctor)

Current UI elements:
- Forms: Patient selector dropdown, Symptoms textarea, Diagnosis text field, ICD-10 Search, Medication dosage/duration form, Lab/Radiology test selector
- Tables: Patient visit history, latest nursing vitals, recent prescriptions
- Modals: Next Patient call dialog with vitals and allergy warnings

Required layout:
- Split-Screen Workspace (3 columns):
  - Right Column (Width 25%): Fixed Patient Summary Card. Shows name, MRN, age, blood group, prominent RED Allergy Alert banner, and a timeline of recent vitals (BP, Temp, Pulse).
  - Middle Column (Width 50%): Main Consultation Sheet. Text area for chief complaints/symptoms, diagnosis field with predictive ICD-10 autocomplete search box, and a rich clinical notes editor.
  - Left Column (Width 25%): Order Cart. Active tabs for: [Pharmacy Orders], [Lab Orders], [Radiology Orders], [Medical Reports / Sick Leave]. Allows adding items dynamically and sending orders with a primary CTA "Finalize Visit".

Visual style:
- Clinical clean interface
- White/Light gray background (data-theme 5/6 friendly)
- Medical Teal headers, Crimson highlights for allergies, amber highlights for chronic conditions
- Easily readable tabular listings for medications

Data examples:
- Patient Name: 'Sarah Ahmed Al-Sudairy' (MRN-001024)
- Diagnosis: 'Acute Nasopharyngitis (J00)'
- Allergies: 'Penicillin - Severe Anaphylaxis'

Do not include:
- Random charts on the consultation sheet
- Overcrowded single-column formats

Output:
Create a polished, production-grade UI design for this screen.
```

---

## 4. موجه صرف الصيدلية ومبيعات الدواء (Stitch Prompt: Pharmacy & POS Console)

```md
Design a modern bilingual Arabic/English RTL-ready healthcare SaaS interface for the Pharmacy & POS Console.

Context:
- System type: Pharmacy Management & Point of Sale
- Facility types: Hospital Pharmacies, Retail Pharmacies
- Primary users: Pharmacists, Cashiers
- Main workflow: Manage incoming prescription queue, dispense medications, verify stock, calculate insurance coverage, and print dosage labels.

Current screen purpose:
Enables pharmacists to view patient prescriptions, check stock, calculate payments, and dispense drugs.

Route:
#pharmacy

Current file:
namaweb/public/js/app.js (renderPharmacy)

Current UI elements:
- Lists: Incoming prescription queue cards
- Forms: Dispensing confirmation, dosage instruction generator, payment calculation (Cash vs Insurance)
- Tables: Drug catalog stock levels, batch numbers, and expiry alerts

Required layout:
- Two-Column Layout:
  - Left Panel (Width 35%): Prescription Queue. Scrollable vertical list of patients awaiting medication. Cards show urgency, waiting time, prescriber's name, and number of items.
  - Right Panel (Width 65%): Dispense Workspace. A premium card showing selected patient's details. Shows a list of prescribed drugs with name, dose, batch selector, stock indicator, and an interactive dosage editor. Below is the financial breakdown: Original Price, Insurance Cover (%), Patient Share, VAT (15% for non-Saudis), and payment method select.
  - Action Bar: Primary "Confirm & Dispense" CTA and "Print Dosage Label" button.

Visual style:
- Clean retail/clinical hybrid
- High contrast status tags (e.g., green for In Stock, red for Out of Stock)
- Bold pricing elements
- IBM Plex Sans Arabic for clear instructions

Data examples:
- Medication: 'Amoxicillin 500mg Capsule' (Stock: 120, Batch: B9022, Expiry: 2027-12)
- Patient Share: 15.00 SAR (Insurance covers 85.00 SAR)

Output:
Create a polished, production-grade UI design for this screen.
```

---

## 5. موجه قسم الطوارئ والفرز الطبي (Stitch Prompt: ED Tracking Board)

```md
Design a modern bilingual Arabic/English RTL-ready healthcare SaaS interface for the Emergency Department (ED) Tracking Board.

Context:
- System type: Emergency Medicine & Triage Control
- Facility types: General Hospitals, Emergency Trauma Centers
- Primary users: ED Nurses, ED Doctors, Triage Coordinators
- Main workflow: Register incoming emergency patients, assess triage level (1 to 5), allocate ED beds, and track patient disposition.

Current screen purpose:
A live tracking dashboard for emergency patient status, trauma severity, and bed availability.

Route:
#emergency

Current file:
namaweb/public/js/app.js (renderEmergency)

Current UI elements:
- Tables: Active emergency visits list with triage colors (Red, Orange, Yellow, Blue, Green)
- Forms: Triage assessment form (Pain score slider, GCS calculator, chief complaint)
- Grids: ED Beds layout dashboard (Resuscitation zone, Acute zone, Observation zone)

Required layout:
- Header: ED Command banner showing: Total Active ED Patients, Resuscitation Bed Occupancy (%), and average time to triage.
- Main Section: Split Layout:
  - Left Panel (60%): Live ED Triage Queue. Columns for Patient Name, Arrival Mode (Ambulance/Walk-in), Triage Level Badge (1-STAT, 2-Critical, 3-Urgent, 4-Less Urgent, 5-Non-Urgent), Assigned Bed, and elapsed waiting time. Urgency levels 1 and 2 must have a soft pulsating red/orange background animation.
  - Right Panel (40%): ED Bed Grid Map. Graphical representation of beds grouped by zone: Resuscitation (Red beds), Critical (Orange beds), Acute (Yellow beds), and Observation (Green beds). Clicking a bed displays the assigned patient details or allows assigning a new patient from the queue.

Visual style:
- High-urgency command center theme
- Dark mode or high-contrast interfaces
- Clear international color codes for triage levels
- Large, readable status indicators

Data examples:
- Patient: 'Khalid Mansour Al-Harbi' (Triage Level: 1 - Resuscitation, Bed: ER-1)
- Pain Score: 9/10

Output:
Create a polished, production-grade UI design for this screen.
```
