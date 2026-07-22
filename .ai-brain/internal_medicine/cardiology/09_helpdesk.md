# Helpdesk — Cardiology

> **Owner:** PM
> **Date:** 2026-07-22

---

## Support Channels

| Channel | Use case | Response SLA |
|---|---|---|
| **Email** helpdesk@jumanasoft.com | General questions, bug reports, feature requests | 4 business hours |
| **Phone** +966-XX-XXX-XXXX | Urgent issues (production down) | 15 min |
| **Slack** #cardio-eng | Quick questions, peer support | 1 hour |
| **In-app** Help → "Report Issue" | Bug reports with auto-context | 4 hours |
| **On-call** PagerDuty | Critical (CDS down, door-to-balloon blocked) | 5 min |

---

## Common Issues & Solutions

### Issue 1: "CDS query returns 503"

**Cause:** OpenAI rate limit or timeout
**Solution:**
1. Wait 1-2 min and retry
2. If persistent, switch to deterministic mode (toggle feature flag)
3. If still failing, page DevOps on-call

### Issue 2: "Echo upload fails"

**Cause:** DICOM file too large (>100MB) or wrong format
**Solution:**
1. Check file size — should be <100MB
2. Verify DICOM format (.dcm extension)
3. Try compressing the DICOM
4. If still failing, save to local disk and escalate

### Issue 3: "CHA₂DS₂-VASc calculation shows 0 but patient is on anticoagulation"

**Cause:** CDS only scores, doesn't suggest changes
**Solution:**
1. This is correct behavior — the system shows current score, not recommendations
2. Click "View full CDS analysis" for recommendations
3. Discuss with cardiology lead if score seems wrong

### Issue 4: "INR queue is empty but I have patients due today"

**Cause:** next_visit_date not set correctly
**Solution:**
1. Check anticoagulation_clinic_visits table
2. Update next_visit_date
3. Refresh queue (F5)

### Issue 5: "STEMI activation didn't page the cardiologist"

**Cause:** PagerDuty integration down
**Solution:**
1. Call cardiologist directly via phone
2. Open incident in PagerDuty manually
3. Page DevOps on-call for system fix

### Issue 6: "I can't sign an echo report"

**Cause:** User role doesn't have sign authority
**Solution:**
1. Verify your role (Settings → My Profile → Role)
2. Sonographers can only sign their own echoes
3. Other roles: request Admin to grant sign authority

### Issue 7: "Patient data not showing (RLS issue)"

**Cause:** Tenant context mismatch
**Solution:**
1. Check that you're in the correct tenant (top-right corner)
2. If you're a cross-tenant user, request Admin to grant access
3. Otherwise, contact data steward

### Issue 8: "Procedure scheduled for wrong time slot"

**Cause:** Time zone confusion
**Solution:**
1. All times are stored in UTC
2. Display is in local Saudi time (UTC+3)
3. To reschedule: cancel + re-schedule

---

## Reporting Workflow

1. **Bug:** Use in-app "Report Issue" → auto-attaches context
2. **Feature request:** Email helpdesk + tag #cardio
3. **Urgent:** Phone + Slack

---

## SLA Matrix

| Priority | Response | Resolution |
|---|---|---|
| **P0 Critical** (CDS down, STEMI blocked) | 5 min | 1 hour |
| **P1 High** (degraded but workaround exists) | 15 min | 4 hours |
| **P2 Medium** (single user impacted) | 1 hour | 1 business day |
| **P3 Low** (cosmetic, typo) | 4 hours | 1 week |

---

## On-Call Rotation

- **Primary:** Cardiology on-call (clinical decisions)
- **Secondary:** DevOps on-call (system issues)
- **Tertiary:** PM (escalation if both unavailable)

---

## Training

- **Self-service:** User manual (07_user_manual.md) + training videos (07b_training_video_script.md)
- **Live training:** Monthly Q&A session (Zoom)
- **Onboarding:** New hires get 1-on-1 walkthrough

---

## Feedback

- **Weekly survey:** all cardiology users get a 3-question survey
- **Monthly review:** cardiology lead + PM + DevOps review feedback
- **Quarterly roadmap:** features prioritized based on feedback

---

End of helpdesk spec.
