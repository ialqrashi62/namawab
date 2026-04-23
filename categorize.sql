UPDATE drugs
SET category = 
    CASE
        -- Cardiovascular (أدوية القلب والضغط)
        WHEN name LIKE '%AMLODIPINE%' OR name LIKE '%VALSARTAN%' OR name LIKE '%LOSARTAN%' OR name LIKE '%CANDESARTAN%' OR name LIKE '%BISO%' OR name LIKE '%CONCOR%' OR name LIKE '%LISINOPRIL%' OR name LIKE '%CAPTOPRIL%' OR name LIKE '%ATORVASTATIN%' OR name LIKE '%LIPITOR%' OR name LIKE '%ROSUVASTATIN%' OR name LIKE '%SIMVASTATIN%' OR name LIKE '%ASPIRIN%' OR name LIKE '%PLAVIX%' OR name LIKE '%CLOPIDOGREL%' OR name LIKE '%DIURETIC%' OR name LIKE '%LASIX%' OR name LIKE '%FUROSEMIDE%' OR name LIKE '%METOPROLOL%' OR name LIKE '%ATENOLOL%' OR name LIKE '%CARVEDILOL%' OR name LIKE '%NEBIVOLOL%' OR name LIKE '%DILTIAZEM%' OR name LIKE '%VERAPAMIL%' THEN N'Cardiovascular - أدوية القلب والضغط'
        
        -- Anti-diabetic (أدوية السكري)
        WHEN name LIKE '%METFORMIN%' OR name LIKE '%GLUCOPHAGE%' OR name LIKE '%GLIMEPIRIDE%' OR name LIKE '%AMARYL%' OR name LIKE '%SITAGLIPTIN%' OR name LIKE '%JANUVIA%' OR name LIKE '%VINDA%' OR name LIKE '%GALVUS%' OR name LIKE '%INSULIN%' OR name LIKE '%LANTUS%' OR name LIKE '%NOVOMIX%' OR name LIKE '%LEVEMIR%' OR name LIKE '%TOUJEO%' OR name LIKE '%TRESIBA%' OR name LIKE '%OZEMPIC%' OR name LIKE '%TRULICITY%' OR name LIKE '%RYBELSUS%' OR name LIKE '%JARDIANCE%' OR name LIKE '%FORXIGA%' THEN N'Anti-Diabetic - أدوية السكري'
        
        -- Analgesics / Antipyretics / NSAIDs (مسكنات ومضادات التهاب)
        WHEN name LIKE '%PARACETAMOL%' OR name LIKE '%PANADOL%' OR name LIKE '%FEVADOL%' OR name LIKE '%ADOL%' OR name LIKE '%IBUPROFEN%' OR name LIKE '%BRUFEN%' OR name LIKE '%PROFEN%' OR name LIKE '%DICLOFENAC%' OR name LIKE '%VOLTAREN%' OR name LIKE '%CATAFLAM%' OR name LIKE '%NAPROXEN%' OR name LIKE '%CELECOXIB%' OR name LIKE '%CELEBREX%' OR name LIKE '%MELOXICAM%' OR name LIKE '%MOBIC%' OR name LIKE '%TRAMADOL%' OR name LIKE '%CODEINE%' OR name LIKE '%SOLPADEINE%' OR name LIKE '%ASPIRIN%' OR name LIKE '%ROFENAC%' THEN N'Analgesics & Anti-inflammatory - مسكنات ومضادات التهاب'
        
        -- Antibiotics / Anti-infectives (مضادات حيوية وعدوى)
        WHEN name LIKE '%AMOXICILLIN%' OR name LIKE '%AUGMENTIN%' OR name LIKE '%KLAVOX%' OR name LIKE '%CEF%' OR name LIKE '%ZINNAT%' OR name LIKE '%SUPRAX%' OR name LIKE '%AZITHROMYCIN%' OR name LIKE '%ZITHROMAX%' OR name LIKE '%CIPROFLOXACIN%' OR name LIKE '%CIPROXIN%' OR name LIKE '%LEVOFLOXACIN%' OR name LIKE '%METRONIDAZOLE%' OR name LIKE '%FLAGYL%' OR name LIKE '%CLINDAMYCIN%' OR name LIKE '%DALACIN%' OR name LIKE '%DOXYCYCLINE%' OR name LIKE '%VIBRAMYCIN%' OR name LIKE '%LINEZOLID%' OR name LIKE '%MEROPENEM%' OR name LIKE '%VANCOMYCIN%' THEN N'Antibiotics & Anti-infectives - مضادات حيوية وعدوى'
        
        -- Respiratory / Asthma (أدوية التنفس والربو)
        WHEN name LIKE '%SALBUTAMOL%' OR name LIKE '%VENTOLIN%' OR name LIKE '%BUDESONIDE%' OR name LIKE '%PULMICORT%' OR name LIKE '%FLUTICASONE%' OR name LIKE '%SERETIDE%' OR name LIKE '%SYMBICORT%' OR name LIKE '%MONTELUKAST%' OR name LIKE '%SINGULAIR%' OR name LIKE '%TIOTROPIUM%' OR name LIKE '%SPIRIVA%' OR name LIKE '%IPRATROPIUM%' OR name LIKE '%ATROVENT%' OR name LIKE '%BROMHEXINE%' OR name LIKE '%AMBROXOL%' OR name LIKE '%MUCOSOLVAN%' OR name LIKE '%PROSPAN%' OR name LIKE '%COUGH%' OR name LIKE '%SYRUP%' THEN N'Respiratory & Asthma - أدوية التنفس والربو'
        
        -- Gastrointestinal (أدوية الجهاز الهضمي)
        WHEN name LIKE '%OMEPRAZOLE%' OR name LIKE '%LOSEC%' OR name LIKE '%PANTOPRAZOLE%' OR name LIKE '%CONTROLOC%' OR name LIKE '%ESOMEPRAZOLE%' OR name LIKE '%NEXIUM%' OR name LIKE '%LANSOPRAZOLE%' OR name LIKE '%RABEPRAZOLE%' OR name LIKE '%DOMPERIDONE%' OR name LIKE '%MOTILIUM%' OR name LIKE '%METOCLOPRAMIDE%' OR name LIKE '%PRIMPERAN%' OR name LIKE '%MEBEVERINE%' OR name LIKE '%DUSPATALIN%' OR name LIKE '%LOPERAMIDE%' OR name LIKE '%IMODIUM%' OR name LIKE '%LAXATIVE%' OR name LIKE '%DULCOLAX%' OR name LIKE '%BISACODYL%' OR name LIKE '%LACTULOSE%' OR name LIKE '%DUPHALAC%' OR name LIKE '%SIMETHICONE%' OR name LIKE '%DEFLAT%' THEN N'Gastrointestinal - أدوية الجهاز الهضمي'
        
        -- Vitamins / Supplements (فيتامينات ومكملات)
        WHEN name LIKE '%VITAMIN%' OR name LIKE '% CALCIUM %' OR name LIKE '% IRON %' OR name LIKE '%FERROUS%' OR name LIKE '%MULTIVITAMIN%' OR name LIKE '%CENTRUM%' OR name LIKE '%OMEGA%' OR name LIKE '% ZINC %' OR name LIKE '%MAGNESIUM%' OR name LIKE '%FOLIC%ACID%' OR name LIKE '%B COMPLEX%' OR name LIKE '%NEUROBION%' OR name LIKE '%VITAMIN D3%' OR name LIKE '%VITAMIN C%' OR name LIKE '%VITAMIN B12%' THEN N'Vitamins & Supplements - فيتامينات ومكملات'
        
        -- Allergy / Antihistamines (أدوية الحساسية)
        WHEN name LIKE '%LORATADINE%' OR name LIKE '%CLARITINE%' OR name LIKE '%DESLORATADINE%' OR name LIKE '%AERIUS%' OR name LIKE '%CETIRIZINE%' OR name LIKE '%ZYRTEC%' OR name LIKE '%LEVOCETIRIZINE%' OR name LIKE '%XYZAL%' OR name LIKE '%FEXOFENADINE%' OR name LIKE '%TELFAST%' OR name LIKE '%CHLORPHENIRAMINE%' OR name LIKE '%HISTOP%' OR name LIKE '%ALLERGY%' THEN N'Allergy & Antihistamines - أدوية الحساسية'
        
        -- Dermatology (أدوية جلدية)
        WHEN name LIKE '%CREAM%' OR name LIKE '%OINTMENT%' OR name LIKE '%LOTION%' OR name LIKE '%GEL%' OR name LIKE '%BETAMETHASONE%' OR name LIKE '%FUCIDIN%' OR name LIKE '%CLOBETASOL%' OR name LIKE '%DERMOVATE%' OR name LIKE '%MOMETASONE%' OR name LIKE '%ELICA%' OR name LIKE '%ISOTRETINOIN%' OR name LIKE '%ROACCUTANE%' OR name LIKE '%ADAPALENE%' OR name LIKE '%DIFFERIN%' OR name LIKE '%BENZOYL PEROXIDE%' OR name LIKE '%KETOCONAZOLE%' OR name LIKE '%NIZORAL%' THEN N'Dermatology - أدوية جلدية وموضعية'
        
        -- Ophthalmic & Otic (أدوية العيون والأذن)
        WHEN name LIKE '%EYE DROP%' OR name LIKE '%EYE DROPS%' OR name LIKE '%EAR DROP%' OR name LIKE '%EAR DROPS%' OR name LIKE '%OPHTHALMIC%' OR name LIKE '%OPTIC%' OR name LIKE '%ALPHAGAN%' OR name LIKE '%XALATAN%' OR name LIKE '%COSOPT%' OR name LIKE '%TIMOLOL%' OR name LIKE '%TOBRADEX%' OR name LIKE '%SYSTANE%' OR name LIKE '%REFRESH%' OR name LIKE '%DEXAMETHASONE%' THEN N'Ophthalmic & Otic - أدوية العيون والأذن'
        
        -- CNS / Neurology / Psychiatry (أدوية المخ والأعصاب والنفسية)
        WHEN name LIKE '%SERTRALINE%' OR name LIKE '%ZOLOFT%' OR name LIKE '%ESCITALOPRAM%' OR name LIKE '%CIPRALEX%' OR name LIKE '%FLUOXETINE%' OR name LIKE '%PROZAC%' OR name LIKE '%VENLAFAXINE%' OR name LIKE '%EFFEXOR%' OR name LIKE '%DULOXETINE%' OR name LIKE '%CYMBALTA%' OR name LIKE '%OLANZAPINE%' OR name LIKE '%ZYPREXA%' OR name LIKE '%QUETIAPINE%' OR name LIKE '%SEROQUEL%' OR name LIKE '%RISPERIDONE%' OR name LIKE '%RISPERDAL%' OR name LIKE '%ALPRAZOLAM%' OR name LIKE '%XANAX%' OR name LIKE '%CLONAZEPAM%' OR name LIKE '%RIVOTRIL%' OR name LIKE '%VALPROATE%' OR name LIKE '%DEPINE%' OR name LIKE '%LEVETIRACETAMAM%' OR name LIKE '%KEPPRA%' OR name LIKE '%PREGABALIN%' OR name LIKE '%LYRICA%' OR name LIKE '%GABAPENTIN%' OR name LIKE '%NEURONTIN%' OR name LIKE '%DONEPEZIL%' OR name LIKE '%ARICEPT%' THEN N'CNS & Psychiatry - أدوية المخ والأعصاب'
        
        -- Endocrine & Hormones (أدوية الغدد والهرمونات)
        WHEN name LIKE '%LEVOTHYROXINE%' OR name LIKE '%EUTHYROX%' OR name LIKE '%THYROXINE%' OR name LIKE '%CARBIMAZOLE%' OR name LIKE '%PREDNISOLONE%' OR name LIKE '%DEXAMETHASONE%' OR name LIKE '%HYDROCORTISONE%' OR name LIKE '%ESTROGEN%' OR name LIKE '%PROGESTERONE%' OR name LIKE '%TESTOSTERONE%' THEN N'Endocrine & Hormones - الغدد والهرمونات'

        -- Women Health (أدوية صحة المرأة)
        WHEN name LIKE '%MARVELON%' OR name LIKE '%YASMIN%' OR name LIKE '%DIANE%' OR name LIKE '%GYNERA%' OR name LIKE '%CLOMIPHENE%' OR name LIKE '%CLOMID%' THEN N'Women Health - صحة المرأة وموانع الحمل'
        
        -- Urology / Men Health (مسالك بولية وصحة الرجل)
        WHEN name LIKE '%TAMSULOSIN%' OR name LIKE '%OMNIC%' OR name LIKE '%FINASTERIDE%' OR name LIKE '%PROSCAR%' OR name LIKE '%SILDENAFIL%' OR name LIKE '%VIAGRA%' OR name LIKE '%TADALAFIL%' OR name LIKE '%CIALIS%' OR name LIKE '%VARDENAFIL%' OR name LIKE '%LEVITRA%' OR name LIKE '%OXYBUTYNIN%' OR name LIKE '%DITROPAN%' OR name LIKE '%SOLIFENACIN%' OR name LIKE '%VESICARE%' THEN N'Urology & Men Health - مسالك بولية وصحة الرجل'
        
        ELSE N'General / Others - أدوية عامة أخرى'
    END;
