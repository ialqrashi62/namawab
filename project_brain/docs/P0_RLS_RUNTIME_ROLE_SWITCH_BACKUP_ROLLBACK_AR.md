# Gate 2 — Environment Backup & Rollback (RLS Runtime Role Switch)

> المرحلة: `P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION` | التاريخ: 2026-06-21 | بلا طباعة أسرار.

```text
ENV_BACKUP_PATH: ~/nama_deploy_backups/rls_role_switch_20260621/.env.before-switch.bak (16 سطراً، المحتوى لم يُطبع)
PM2_CONFIG_BACKUP_PATH: ~/nama_deploy_backups/rls_role_switch_20260621/pm2_dump.before-switch.bak
ROLLBACK_DB_USER: postgres
ROLLBACK_ACTION: استعادة .env backup (DB_USER=postgres) + pm2 restart + health smoke
ROLLBACK_READY: YES
SECRETS_PRINTED: NO
```

`BACKUP_ROLLBACK: READY`
