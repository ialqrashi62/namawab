# NM_DEVOPS_RELEASE — إدارة النشر وعمليات DevOps/SRE

## متى تُستخدم
أي خطوة نشر، إعادة تشغيل PM2، backup، أو health check على الإنتاج.

## الهدف
ضمان نشر آمن، منظّم، وقابل للتراجع مع دليل موثّق قبل وبعد النشر.

## قواعد إلزامية
```
STAGING_FIRST: YES — اختبر على staging قبل الإنتاج دائماً
BACKUP_BEFORE_DEPLOY: YES — نسخ احتياطي pg_dump قبل أي نشر
ROLLBACK_PLAN: YES — خطة rollback مكتوبة ومختبرة
PM2_MANAGED: YES — التطبيق يعمل تحت PM2 دائماً
HEALTH_CHECK: YES — تحقق من /api/health بعد كل نشر
SMOKE_TEST: YES — اختبارات smoke بعد كل نشر
NO_DEPLOY_WITHOUT_APPROVAL: YES — لا نشر إنتاجي بدون تصريح صريح
MONITORING_BEFORE_GO: YES — تحقق من PM2 logs والأخطاء قبل Go-Live
NO_FORCE_PUSH: YES — لا force push على main/master
DEPLOYMENT_EVIDENCE: YES — وثّق أوامر النشر وإخراجها
```

## خطوات النشر القياسية
```bash
# 1. Backup
pg_dump -h localhost -U nama_medical_app nama_medical_db > backup_$(date +%Y%m%d_%H%M).sql

# 2. Git sync
git pull origin main
git submodule update --init --recursive

# 3. Build
npm run build:css

# 4. Restart
pm2 restart nama-medical-erp --update-env

# 5. Health check
curl -s https://jumanasoft.com/api/health
# المتوقع: {"status":"UP"}

# 6. PM2 status
pm2 list | grep nama-medical
```

## Health Check المقبول
```
{"status": "UP"} + HTTP 200 = PASS
أي شيء آخر = BLOCKED_HEALTH_CHECK_FAILED
```

## أدلة النجاح
- Backup file موجود قبل النشر
- PM2 يُظهر `online` بعد النشر
- /api/health يُعيد 200
- لا أخطاء في pm2 logs
- Smoke test يُعيد PASS

## حالات الحظر
- لا backup قبل النشر → BLOCKED_NO_BACKUP
- Health check فاشل → BLOCKED_HEALTH_CHECK_FAILED
- PM2 في حالة error → BLOCKED_PM2_ERROR
- لا rollback plan → BLOCKED_NO_ROLLBACK_PLAN
- نشر إنتاجي بدون موافقة → BLOCKED_NO_PRODUCTION_APPROVAL

## صيغة التقرير المختصر
```
DEVOPS_GATE: PASS/BLOCKED | ENVIRONMENT: staging/production
BACKUP_DONE: YES/NO | BUILD_OK: YES/NO
PM2_STATUS: online/error | HEALTH_CHECK: UP/DOWN
SMOKE_TEST: PASS/FAIL | ROLLBACK_READY: YES/NO
deploy_executed: YES/NO (بدون تصريح: NO)
```
