const servicesData = [
    // الخدمات الطبية
    { id: 1, titleEn: 'Medical Report', titleAr: 'التقارير الطبية', category: 'clinical', icon: 'ri-file-list-3-line' },
    { id: 2, titleEn: 'LAB Inventory', titleAr: 'مخزون المختبر', category: 'clinical', icon: 'ri-test-tube-line' },
    { id: 3, titleEn: 'Wasfaty', titleAr: 'وصفتي', category: 'clinical', icon: 'ri-medicine-bottle-line' },
    { id: 4, titleEn: 'REFERRALS', titleAr: 'الإحالات', category: 'clinical', icon: 'ri-arrow-left-right-line' },
    { id: 5, titleEn: 'Medic Errors', titleAr: 'أخطاء الدواء', category: 'clinical', icon: 'ri-error-warning-line' },
    { id: 6, titleEn: 'mortality programme', titleAr: 'برنامج الوفيات', category: 'clinical', icon: 'ri-heart-pulse-line' },
    { id: 7, titleEn: 'IBM Micromedex', titleAr: 'قاعدة بيانات الأدوية', category: 'clinical', icon: 'ri-book-read-line' },
    
    // الموارد البشرية
    { id: 8, titleEn: 'Mawared', titleAr: 'موارد', category: 'hr', icon: 'ri-group-line' },
    { id: 9, titleEn: 'Mudeeri', titleAr: 'مديري', category: 'hr', icon: 'ri-user-settings-line' },
    { id: 10, titleEn: 'Hudoor', titleAr: 'حضور', category: 'hr', icon: 'ri-fingerprint-line' },
    { id: 11, titleEn: 'Doctors Privileges', titleAr: 'امتيازات الأطباء', category: 'hr', icon: 'ri-medal-line' },
    { id: 12, titleEn: 'Doctors Privilege Admin', titleAr: 'ادمن امتيازات الاطباء', category: 'hr', icon: 'ri-admin-line' },
    { id: 13, titleEn: 'Daily Rotations', titleAr: 'جدول المناوبات', category: 'hr', icon: 'ri-calendar-todo-line' },

    // الجودة والسلامة
    { id: 14, titleEn: 'OVR', titleAr: 'الإبلاغ عن الحوادث والأخطاء', category: 'quality', icon: 'ri-alert-line' },
    { id: 15, titleEn: 'OPS rounds', titleAr: 'جولات السلامة', category: 'quality', icon: 'ri-walk-line' },
    { id: 16, titleEn: 'Regulatory guide to core standards', titleAr: 'الدليل التنظيمي للمعايير الأساسية', category: 'quality', icon: 'ri-book-mark-line' },
    { id: 17, titleEn: 'Risk Minimization Measures List', titleAr: 'قائمة وسائل خفض المخاطر', category: 'quality', icon: 'ri-shield-cross-line' },

    // تقنية المعلومات
    { id: 18, titleEn: 'IT Orientation', titleAr: 'البوابة الإعدادية', category: 'it', icon: 'ri-macbook-line' },
    { id: 19, titleEn: 'MOH reset', titleAr: 'استعادة البيانات', category: 'it', icon: 'ri-restart-line' },
    { id: 20, titleEn: 'Domain Zoon', titleAr: 'اسماء النطاقات', category: 'it', icon: 'ri-global-line' },
    { id: 21, titleEn: 'Card System', titleAr: 'نظام تفعيل الأبواب', category: 'it', icon: 'ri-pass-valid-line' },
    { id: 22, titleEn: 'Master DB', titleAr: 'البيانات المركزية', category: 'it', icon: 'ri-database-2-line' },

    // الأشعة والباكس
    { id: 23, titleEn: 'NNCH PACS', titleAr: 'باكس نجران العام (الشرقية)', category: 'radiology', icon: 'ri-body-scan-line' },
    { id: 24, titleEn: 'Cardiac PACS', titleAr: 'باكس القلب', category: 'radiology', icon: 'ri-heart-add-line' },
    { id: 25, titleEn: 'BADER PACS', titleAr: 'باكس بدر الجنوب', category: 'radiology', icon: 'ri-hospital-line' },

    // بوابات الوزارة
    { id: 26, titleEn: 'MOH Unified portal', titleAr: 'البوابة الموحدة', category: 'moh', icon: 'ri-government-line' },
    { id: 27, titleEn: 'MOH Update', titleAr: 'تحديث بوابات الوزارة', category: 'moh', icon: 'ri-refresh-line' },
    { id: 28, titleEn: 'MoH email', titleAr: 'بريد الوزارة', category: 'moh', icon: 'ri-mail-send-line' },
    { id: 29, titleEn: 'Mawid', titleAr: 'موعد', category: 'moh', icon: 'ri-calendar-check-line' },
    { id: 30, titleEn: 'Saha', titleAr: 'صحة', category: 'moh', icon: 'ri-heart-pulse-line' },
    { id: 31, titleEn: 'ANAT', titleAr: 'أناة', category: 'moh', icon: 'ri-nurse-line' },
    { id: 32, titleEn: 'Shahm', titleAr: 'شهم', category: 'moh', icon: 'ri-sword-line' },
    { id: 33, titleEn: 'BAIN', titleAr: 'بين', category: 'moh', icon: 'ri-exchange-line' },
    { id: 34, titleEn: 'Health transformation journey guide', titleAr: 'دليل رحلة التحول الصحي', category: 'moh', icon: 'ri-route-line' },

    // الإدارة العامة
    { id: 35, titleEn: 'Policies and Procedures', titleAr: 'السياسات والإجراءات', category: 'admin', icon: 'ri-file-paper-2-line' },
    { id: 36, titleEn: 'Hospital Forms', titleAr: 'نماذج المستشفى', category: 'admin', icon: 'ri-file-copy-2-line' },
    { id: 37, titleEn: 'Phone dir', titleAr: 'دليل الهاتف', category: 'admin', icon: 'ri-contacts-book-2-line' },
    { id: 38, titleEn: 'Intranet', titleAr: 'الانترانت', category: 'admin', icon: 'ri-wifi-line' },
    { id: 39, titleEn: 'Archiving', titleAr: 'الأرشفة الإلكترونية', category: 'admin', icon: 'ri-archive-drawer-line' },
    { id: 40, titleEn: 'Job Cards', titleAr: 'أوامر الصيانة', category: 'admin', icon: 'ri-tools-line' },
    { id: 41, titleEn: 'OASIS+', titleAr: 'أوسيس+', category: 'admin', icon: 'ri-hospital-building-line' },
];
