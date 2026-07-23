# OBG-001 — Helpdesk Runbook

## L1 Support

### Common Issues
- Cannot log in
- ANC visit not saving
- Preeclampsia screen not auto-classifying
- L&D board not updating
- Delivery not recording
- PPH not activating

## L2 Support

### Database Issues
- Check Postgres logs
- Check connections
- Check slow queries
- Kill long queries if needed

### AI Service Issues
- Check LangSmith
- Check OpenAI status
- Fall back to deterministic rules
- Restart service

### RLS / Tenant Issues
- Verify session.tenantId
- Check RLS policies
- Verify FORCE_RLS
- Escalate to L3 if violation

## L3 Support

### Migration Issues
- Check migration log
- Run down + up
- Validate
- Backup before change

### Performance Issues
- Check slow queries
- Add index
- Consider partitioning
- Connection pool tuning

### PHI Leak
- STOP service
- Identify affected
- Notify DPO
- Notify SDAIA within 72h
- Document incident

## On-Call
- Primary: 1 week
- Secondary: backup
- Escalation: OBG director → CMO → CTO

## Runbook Templates

### PPH Active
1. Check EBL value
2. Confirm uterotonics given
3. Check transfusion status
4. Check surgical readiness
5. Document steps

### Eclampsia
1. Check MgSO4 (loading dose 4g IV)
2. Check maintenance (1-2g/h)
3. Check reflexes (loss = toxicity)
4. Check RR (depression = toxicity)
5. Document seizure activity

### Shoulder Dystocia
1. Call for help
2. McRoberts maneuver
3. Suprapubic pressure
4. Episiotomy
5. Delivery of posterior arm
6. Document time

### Fetal Distress
1. Category I → continue
2. Category II → reposition, O2, stop oxytocin
3. Category III → emergency delivery

## Communication
- Slack: #obg-helpdesk
- Email: obg-support@jumanasoft.com
- Phone: ext 1234
