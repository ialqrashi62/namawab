const servicesData = [
    // ═══════════════════════════════════════════
    // الخدمات الطبية (Clinical)
    // ═══════════════════════════════════════════
    { id: 1, titleEn: 'Medical Report', titleAr: 'التقارير الطبية', descAr: 'إنشاء وإدارة التقارير الطبية للمرضى', category: 'clinical', icon: 'ri-file-list-3-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 2, titleEn: 'LAB Inventory', titleAr: 'مخزون المختبر', descAr: 'إدارة مواد ومستلزمات المختبر', category: 'clinical', icon: 'ri-test-tube-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 3, titleEn: 'Wasfaty', titleAr: 'وصفتي', descAr: 'نظام الوصفات الإلكترونية - وزارة الصحة', category: 'clinical', icon: 'ri-medicine-bottle-line', url: 'https://wasfaty.moh.gov.sa', status: 'active' },
    { id: 4, titleEn: 'REFERRALS', titleAr: 'الإحالات', descAr: 'نظام إدارة الإحالات الطبية', category: 'clinical', icon: 'ri-arrow-left-right-line', url: 'https://referral.moh.gov.sa', status: 'active' },
    { id: 5, titleEn: 'Medication Errors', titleAr: 'أخطاء الدواء', descAr: 'نظام الإبلاغ عن أخطاء الأدوية', category: 'clinical', icon: 'ri-error-warning-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 6, titleEn: 'Mortality Programme', titleAr: 'برنامج الوفيات', descAr: 'تسجيل ومتابعة بيانات الوفيات', category: 'clinical', icon: 'ri-heart-pulse-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 7, titleEn: 'IBM Micromedex', titleAr: 'قاعدة بيانات الأدوية', descAr: 'المرجع الشامل للأدوية والتفاعلات الدوائية', category: 'clinical', icon: 'ri-book-read-line', url: 'https://www.micromedexsolutions.com', status: 'active' },

    // ═══════════════════════════════════════════
    // الموارد البشرية (HR)
    // ═══════════════════════════════════════════
    { id: 8, titleEn: 'Mawared', titleAr: 'موارد', descAr: 'نظام إدارة الموارد البشرية', category: 'hr', icon: 'ri-group-line', url: 'https://mawared.moh.gov.sa', status: 'active' },
    { id: 9, titleEn: 'Mudeeri', titleAr: 'مديري', descAr: 'بوابة المدير للموافقات والمتابعة', category: 'hr', icon: 'ri-user-settings-line', url: 'https://mudeeri.moh.gov.sa', status: 'active' },
    { id: 10, titleEn: 'Hudoor', titleAr: 'حضور', descAr: 'نظام الحضور والانصراف', category: 'hr', icon: 'ri-fingerprint-line', url: 'https://hudoor.moh.gov.sa', status: 'active' },
    { id: 11, titleEn: 'Doctors Privileges', titleAr: 'امتيازات الأطباء', descAr: 'نظام إدارة صلاحيات وامتيازات الأطباء', category: 'hr', icon: 'ri-medal-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 12, titleEn: 'Doctors Privilege Admin', titleAr: 'إدارة امتيازات الأطباء', descAr: 'لوحة التحكم الإدارية للامتيازات', category: 'hr', icon: 'ri-admin-line', url: 'http://46.224.178.153/admin.html', status: 'active' },
    { id: 13, titleEn: 'Daily Rotations', titleAr: 'جدول المناوبات', descAr: 'جدولة وتنظيم مناوبات الموظفين', category: 'hr', icon: 'ri-calendar-todo-line', url: 'http://46.224.178.153/login.html', status: 'active' },

    // ═══════════════════════════════════════════
    // الجودة والسلامة (Quality)
    // ═══════════════════════════════════════════
    { id: 14, titleEn: 'OVR', titleAr: 'الإبلاغ عن الحوادث', descAr: 'نظام الإبلاغ عن الحوادث والأخطاء الطبية', category: 'quality', icon: 'ri-alert-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 15, titleEn: 'OPS Rounds', titleAr: 'جولات السلامة', descAr: 'نظام متابعة جولات السلامة التشغيلية', category: 'quality', icon: 'ri-walk-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 16, titleEn: 'Core Standards Guide', titleAr: 'دليل المعايير الأساسية', descAr: 'الدليل التنظيمي لمعايير الجودة', category: 'quality', icon: 'ri-book-mark-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 17, titleEn: 'Risk Minimization', titleAr: 'إدارة المخاطر', descAr: 'قائمة وسائل وإجراءات خفض المخاطر', category: 'quality', icon: 'ri-shield-cross-line', url: 'http://46.224.178.153/login.html', status: 'active' },

    // ═══════════════════════════════════════════
    // تقنية المعلومات (IT)
    // ═══════════════════════════════════════════
    { id: 18, titleEn: 'IT Orientation', titleAr: 'البوابة الإعدادية', descAr: 'دليل التهيئة والإعداد لتقنية المعلومات', category: 'it', icon: 'ri-macbook-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 19, titleEn: 'MOH Reset', titleAr: 'استعادة البيانات', descAr: 'أداة استعادة وإعادة تعيين بيانات الوزارة', category: 'it', icon: 'ri-restart-line', url: 'http://46.224.178.153/admin.html', status: 'active' },
    { id: 20, titleEn: 'Domain Zone', titleAr: 'أسماء النطاقات', descAr: 'إدارة نطاقات DNS والتوجيهات', category: 'it', icon: 'ri-global-line', url: 'http://46.224.178.153/admin.html', status: 'active' },
    { id: 21, titleEn: 'Card System', titleAr: 'نظام البطاقات', descAr: 'نظام التحكم بالبطاقات وتفعيل الأبواب', category: 'it', icon: 'ri-pass-valid-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 22, titleEn: 'Master DB', titleAr: 'البيانات المركزية', descAr: 'قاعدة البيانات المركزية الرئيسية', category: 'it', icon: 'ri-database-2-line', url: 'http://46.224.178.153/admin.html', status: 'active' },

    // ═══════════════════════════════════════════
    // أنظمة الأشعة (Radiology / PACS)
    // ═══════════════════════════════════════════
    { id: 23, titleEn: 'NNCH PACS', titleAr: 'باكس نجران العام', descAr: 'نظام أرشفة وتبادل الصور الطبية - الشرقية', category: 'radiology', icon: 'ri-body-scan-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 24, titleEn: 'Cardiac PACS', titleAr: 'باكس القلب', descAr: 'نظام أرشفة صور القلب والقسطرة', category: 'radiology', icon: 'ri-heart-add-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 25, titleEn: 'BADER PACS', titleAr: 'باكس بدر الجنوب', descAr: 'نظام الأرشفة لمركز بدر الجنوب', category: 'radiology', icon: 'ri-hospital-line', url: 'http://46.224.178.153/login.html', status: 'active' },

    // ═══════════════════════════════════════════
    // بوابات الوزارة (MOH)
    // ═══════════════════════════════════════════
    { id: 26, titleEn: 'MOH Unified Portal', titleAr: 'البوابة الموحدة', descAr: 'البوابة الإلكترونية الموحدة لوزارة الصحة', category: 'moh', icon: 'ri-government-line', url: 'https://portal.moh.gov.sa', status: 'active' },
    { id: 27, titleEn: 'MOH Update', titleAr: 'تحديث بوابات الوزارة', descAr: 'تحديثات وتعليمات البوابات الإلكترونية', category: 'moh', icon: 'ri-refresh-line', url: 'https://portal.moh.gov.sa', status: 'active' },
    { id: 28, titleEn: 'MoH Email', titleAr: 'بريد الوزارة', descAr: 'خدمة البريد الإلكتروني لوزارة الصحة', category: 'moh', icon: 'ri-mail-send-line', url: 'https://mail.moh.gov.sa', status: 'active' },
    { id: 29, titleEn: 'Mawid', titleAr: 'موعد', descAr: 'خدمة حجز المواعيد الإلكترونية', category: 'moh', icon: 'ri-calendar-check-line', url: 'https://mawid.moh.gov.sa', status: 'active' },
    { id: 30, titleEn: 'Seha', titleAr: 'صحة', descAr: 'تطبيق الاستشارات الطبية عن بعد', category: 'moh', icon: 'ri-heart-pulse-line', url: 'https://seha.sa', status: 'active' },
    { id: 31, titleEn: 'ANAT', titleAr: 'أناة', descAr: 'نظام متابعة التمريض وخطط الرعاية', category: 'moh', icon: 'ri-nurse-line', url: 'https://anat.moh.gov.sa', status: 'active' },
    { id: 32, titleEn: 'Shahm', titleAr: 'شهم', descAr: 'نظام إدارة خدمات الطوارئ والإسعاف', category: 'moh', icon: 'ri-sword-line', url: 'https://shahm.moh.gov.sa', status: 'active' },
    { id: 33, titleEn: 'BAIN', titleAr: 'بين', descAr: 'منصة التكامل بين الأنظمة الصحية', category: 'moh', icon: 'ri-exchange-line', url: 'https://bain.moh.gov.sa', status: 'active' },
    { id: 34, titleEn: 'Health Transformation', titleAr: 'التحول الصحي', descAr: 'دليل رحلة التحول الصحي الشامل', category: 'moh', icon: 'ri-route-line', url: 'https://www.moh.gov.sa', status: 'active' },

    // ═══════════════════════════════════════════
    // الإدارة العامة (Admin)
    // ═══════════════════════════════════════════
    { id: 35, titleEn: 'Policies & Procedures', titleAr: 'السياسات والإجراءات', descAr: 'مكتبة السياسات والإجراءات المعتمدة', category: 'admin', icon: 'ri-file-paper-2-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 36, titleEn: 'Hospital Forms', titleAr: 'نماذج المستشفى', descAr: 'مستودع النماذج والمطبوعات الرسمية', category: 'admin', icon: 'ri-file-copy-2-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 37, titleEn: 'Phone Directory', titleAr: 'دليل الهاتف', descAr: 'دليل الهاتف الداخلي للمستشفى', category: 'admin', icon: 'ri-contacts-book-2-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 38, titleEn: 'Intranet', titleAr: 'الشبكة الداخلية', descAr: 'بوابة الشبكة الداخلية للمستشفى', category: 'admin', icon: 'ri-wifi-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 39, titleEn: 'Archiving', titleAr: 'الأرشفة الإلكترونية', descAr: 'نظام الأرشفة والتوثيق الرقمي', category: 'admin', icon: 'ri-archive-drawer-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 40, titleEn: 'Job Cards', titleAr: 'أوامر الصيانة', descAr: 'نظام إدارة أوامر العمل والصيانة', category: 'admin', icon: 'ri-tools-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 41, titleEn: 'OASIS+', titleAr: 'أوسيس+', descAr: 'نظام إدارة المستشفيات الشامل', category: 'admin', icon: 'ri-hospital-line', url: 'http://46.224.178.153/login.html', status: 'active' },

    // ═══════════════════════════════════════════
    // نظام نما الطبي ERP - الأقسام الرئيسية
    // ═══════════════════════════════════════════
    { id: 100, titleEn: 'Nama Medical ERP', titleAr: 'نما الطبي - الدخول', descAr: 'تسجيل الدخول للنظام الطبي الشامل', category: 'erp', icon: 'ri-login-box-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 101, titleEn: 'Dashboard', titleAr: 'لوحة التحكم', descAr: 'نظرة عامة على أداء المستشفى والإحصائيات', category: 'erp', icon: 'ri-dashboard-3-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 102, titleEn: 'Patients', titleAr: 'المرضى', descAr: 'إدارة سجلات وملفات المرضى', category: 'erp', icon: 'ri-user-heart-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 103, titleEn: 'Appointments', titleAr: 'المواعيد', descAr: 'جدولة وإدارة مواعيد المرضى', category: 'erp', icon: 'ri-calendar-2-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 104, titleEn: 'Pharmacy', titleAr: 'الصيدلية', descAr: 'إدارة الأدوية والوصفات والمخزون', category: 'erp', icon: 'ri-capsule-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 105, titleEn: 'Laboratory', titleAr: 'المختبر', descAr: 'طلبات الفحوصات المخبرية والنتائج', category: 'erp', icon: 'ri-flask-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 106, titleEn: 'Radiology', titleAr: 'الأشعة', descAr: 'طلبات وتقارير الأشعة التشخيصية', category: 'erp', icon: 'ri-body-scan-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 107, titleEn: 'Billing & Finance', titleAr: 'المالية والفوترة', descAr: 'الفواتير والمدفوعات والتقارير المالية', category: 'erp', icon: 'ri-money-dollar-circle-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 108, titleEn: 'Emergency', titleAr: 'الطوارئ', descAr: 'إدارة قسم الطوارئ والحالات العاجلة', category: 'erp', icon: 'ri-first-aid-kit-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 109, titleEn: 'Nursing', titleAr: 'التمريض', descAr: 'خطط الرعاية التمريضية ومتابعة المرضى', category: 'erp', icon: 'ri-nurse-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 110, titleEn: 'Surgery & OR', titleAr: 'العمليات والجراحة', descAr: 'جدولة العمليات وإدارة غرف العمليات', category: 'erp', icon: 'ri-surgical-mask-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 111, titleEn: 'Wards & Beds', titleAr: 'الأجنحة والأسرّة', descAr: 'إدارة الأجنحة وحجوزات الأسرّة', category: 'erp', icon: 'ri-hotel-bed-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 112, titleEn: 'ZATCA E-Invoice', titleAr: 'الفوترة الإلكترونية', descAr: 'نظام الفوترة الإلكترونية (زاتكا)', category: 'erp', icon: 'ri-file-text-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 113, titleEn: 'Blood Bank', titleAr: 'بنك الدم', descAr: 'إدارة مخزون الدم والتبرعات', category: 'erp', icon: 'ri-drop-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 114, titleEn: 'ICU', titleAr: 'العناية المركزة', descAr: 'مراقبة وإدارة وحدة العناية المركزة', category: 'erp', icon: 'ri-heart-pulse-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 115, titleEn: 'Telemedicine', titleAr: 'الطب عن بعد', descAr: 'الاستشارات الطبية المرئية عن بعد', category: 'erp', icon: 'ri-video-chat-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 116, titleEn: 'Reports & Analytics', titleAr: 'التقارير والتحليلات', descAr: 'تقارير الأداء والإحصائيات الشاملة', category: 'erp', icon: 'ri-bar-chart-box-line', url: 'http://46.224.178.153/login.html', status: 'active' },
    { id: 117, titleEn: 'Admin Panel', titleAr: 'لوحة الإدارة', descAr: 'إعدادات النظام وإدارة المستخدمين', category: 'erp', icon: 'ri-settings-3-line', url: 'http://46.224.178.153/admin.html', status: 'active' },
];

// Category metadata
const categoriesConfig = {
    all:       { titleAr: 'جميع الخدمات',        icon: 'ri-function-line',      color: '#00d4ff', gradient: 'linear-gradient(135deg, #00d4ff, #0099cc)' },
    erp:       { titleAr: 'نما الطبي ERP',        icon: 'ri-hospital-line',      color: '#22d3ee', gradient: 'linear-gradient(135deg, #22d3ee, #0891b2)' },
    clinical:  { titleAr: 'الخدمات الطبية',       icon: 'ri-stethoscope-line',   color: '#00e5a0', gradient: 'linear-gradient(135deg, #00e5a0, #00b37d)' },
    hr:        { titleAr: 'الموارد البشرية',      icon: 'ri-team-line',          color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
    quality:   { titleAr: 'الجودة والسلامة',      icon: 'ri-shield-check-line',  color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    radiology: { titleAr: 'أنظمة الأشعة (PACS)',  icon: 'ri-body-scan-line',     color: '#f472b6', gradient: 'linear-gradient(135deg, #f472b6, #ec4899)' },
    moh:       { titleAr: 'بوابات الوزارة',       icon: 'ri-government-line',    color: '#38bdf8', gradient: 'linear-gradient(135deg, #38bdf8, #0284c7)' },
    it:        { titleAr: 'تقنية المعلومات',      icon: 'ri-computer-line',      color: '#fb923c', gradient: 'linear-gradient(135deg, #fb923c, #ea580c)' },
    admin:     { titleAr: 'الإدارة العامة',       icon: 'ri-folder-open-line',   color: '#94a3b8', gradient: 'linear-gradient(135deg, #94a3b8, #64748b)' },
};
