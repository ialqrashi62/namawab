#!/bin/bash
echo P7_CSP_LOG
cat /var/log/namaweb/csp_preflight_2026-07-28T23:53:03Z.log 2>&1
echo P7_NAMAWEB_LS
ls -la /var/log/namaweb/ 2>&1
echo P7_PM2_OUT_HEAD
head -3 /root/.pm2/logs/nama-medical-erp-out.log 2>&1
echo P7_PM2_ERR_HEAD
head -3 /root/.pm2/logs/nama-medical-erp-error.log 2>&1
echo P7_PM2_PCC_OUT_HEAD
head -3 /root/.pm2/logs/nama-medical-pcc-out.log 2>&1
echo P7_PM2_PCC_ERR_HEAD
head -3 /root/.pm2/logs/nama-medical-pcc-error.log 2>&1
echo P7_END
