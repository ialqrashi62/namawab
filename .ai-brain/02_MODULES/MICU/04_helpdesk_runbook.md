# MICU — Helpdesk Runbook

## L1 Support (Helpdesk)

### Common Issues

#### Issue: Cannot log in
- Check email + password
- Check caps lock
- Reset password link
- Check MFA device
- Check tenant selection
- Escalate to L2 if persists

#### Issue: Slow performance
- Check internet (ping jumanasoft.com)
- Check browser cache (clear)
- Try different browser
- Check if other users affected (escalate)

#### Issue: Vitals not saving
- Check required fields (HR, BP, RR, SpO2, temp, GCS)
- Check format (numeric, range)
- Refresh page
- Escalate to L2 if persists

## L2 Support (Application)

### Database Issues
- Check Postgres logs: `pm2 logs nama-medical-erp`
- Check connections: `SELECT count(*) FROM pg_stat_activity`
- Check long queries: `SELECT pid, query, state FROM pg_stat_activity WHERE state='active' AND query_start < NOW() - INTERVAL '5 minutes'`
- Kill if needed: `SELECT pg_terminate_backend(pid)`

### AI Service Issues
- Check LangSmith: https://langsmith.com (project: nama-medical-micu)
- Check OpenAI status: https://status.openai.com
- Fall back to deterministic rules if LLM down
- Restart service: `pm2 restart nama-medical-erp`

### RLS / Tenant Issues
- Verify session.tenantId is set
- Check RLS policies: `SELECT * FROM pg_policies WHERE tablename LIKE 'icu_%'`
- Verify FORCE_RLS: `SELECT relname, relforcerowsecurity FROM pg_class WHERE relname LIKE 'icu_%'`
- Escalate to L3 if violation suspected

## L3 Support (Engineering)

### Migration Issues
- Check migration log: `namaweb/migrations/`
- Run down + up
- Validate: `psql -d nama_medical -f e101_micu_module_validate.sql`
- Backup before any change: `pg_dump`

### Performance Issues
- Check slow queries: pg_stat_statements
- Add index if needed
- Consider partitioning (icu_vitals, icu_labs)
- Connection pool tuning (pg pool)

### PHI Leak
- STOP service
- Identify affected records
- Notify DPO (Data Protection Officer)
- Notify SDAIA within 72h
- Document incident

## On-Call Rotation
- Primary: 1 week on-call
- Secondary: backup
- Escalation: ICU director → CMO → CTO

## Runbook Templates

### Sepsis Bundle Failing
1. Check timer in Sepsis tab
2. Identify which step is delayed
3. Page MD if ABX >1h
4. Document reason for delay
5. Reset bundle if patient re-admitted

### Ventilator Alarm
1. Check patient (color, chest rise)
2. Check circuit (disconnect, leak)
3. Check ET tube (position, cuff)
4. Check ventilator (settings, alarm code)
5. Manual ventilation if needed
6. Call RT and MD

### Code Blue
1. CPR
2. Crash cart
3. Code leader (senior MD)
4. Defibrillator
5. Epinephrine 1mg q3-5min
6. Post-event documentation

## Communication
- Slack: #micu-helpdesk
- Email: micu-support@jumanasoft.com
- Phone: ext 1234 (24/7)
