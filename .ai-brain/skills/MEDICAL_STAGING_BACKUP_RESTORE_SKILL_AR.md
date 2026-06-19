# MEDICAL_STAGING_BACKUP_RESTORE_SKILL_AR

## الهدف

ضمان أن أي تجربة على Staging مسبوقة بنسخة احتياطية قابلة للتحقق وخطة استعادة واضحة.

## القواعد

* backup قبل أي تجربة RLS.
* لا تضف backup إلى Git.
* لا تطبع credentials.
* وثق فقط:
  * المسار
  * الحجم
  * وقت الإنشاء
  * نتيجة التحقق
* لا تعمل restore فوق قاعدة تعمل إلا بتصريح صريح.
* يفضل restore validation على قاعدة مؤقتة إن أمكن.

## مخرجات إلزامية

* BACKUP_CREATED: YES/NO
* BACKUP_SIZE_BYTES
* BACKUP_PATH_MASKED_OR_SAFE
* RESTORE_VALIDATION: PASS/PLAN_ONLY/BLOCKED
* ROLLBACK_PLAN: EXISTS/MISSING
