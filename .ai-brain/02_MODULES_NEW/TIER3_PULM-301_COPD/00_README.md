# TIER3_PULM-301 COPD

## Specialty
Chronic Obstructive Pulmonary Disease (COPD) — GOLD 2024

## Compliance
- ✅ GOLD 2024
- ✅ ATS/ERS COPD
- ✅ MoH Saudi Respiratory
- ✅ SCFHS Pulmonology Standards

## Live Wire-Up
```bash
scp tier3_pulm_301_copd_engine.js copd_router.js migrations/e146_tier3_pulm_301_copd_up.sql root@204.168.144.74:/var/www/namaweb/
psql -U nama_medical_app -d nama_medical_web -f migrations/e146_tier3_pulm_301_copd_up.sql
pm2 reload nama-medical-erp
```