# Playbook — PHI Breach
v1.0 — Owner: DPO + CISO — Always Sev1 if confirmed

## Definition
Any unauthorized acquisition, access, use, or disclosure of PHI that compromises
its security or privacy.

## Detection signals
- DLP alert: bulk export, unusual download patterns.
- SIEM rule: off-hour PHI access; impossible travel; mass query.
- User self-report (lost device; misdirected email/fax).
- External notification (researcher, journalist, regulator).
- AI gateway flagging PHI sent to external endpoints.

## Phase 1 — Verify (0–60 min)
1. Verify the report is real (not a false positive); IC opens incident.
2. Identify scope: what data, how many subjects, who accessed/disclosed.
3. Preserve evidence: logs, emails, file metadata, device images.
4. Engage DPO + Legal immediately.

## Phase 2 — Contain (within first hours)
- Revoke access of involved accounts; force credential rotation.
- Recall misdirected emails/faxes; remote-wipe lost devices via MDM.
- Take data offline if exposure ongoing (e.g., misconfigured S3 bucket → make private).
- For external publication: legal request takedown; preserve copy as evidence.

## Phase 3 — Assess severity
Score impact on:
- **Number of subjects** affected.
- **Nature of data** (mental health, HIV, reproductive → higher).
- **Identifiability**.
- **Likelihood of misuse** (sold? leaked publicly? internal-only?).
- **Special categories** (minors).

## Phase 4 — Notify (regulatory clocks)
- **SDAIA**: notify within **72 hours** if breach likely to affect rights/freedoms.
- **Affected individuals**: notify directly when high impact, with:
  - Description of breach (no further PHI disclosed).
  - Likely consequences.
  - Mitigation taken.
  - Recommended actions for subject.
  - Contact for questions (DPO).
- **MoH** if clinical care impacted.
- **CBAHI** if accreditation-relevant.

## Phase 5 — Remediate
- Eliminate root cause (config fix, training gap, vendor controls).
- Recover affected data integrity if possible.
- Provide credit-monitoring or equivalent if appropriate.
- Update incident in regulator portals as new info arises.

## Phase 6 — Lessons & CAPA
- PIR within 14 days; root-cause analysis (5-Whys).
- Update controls (DLP rules, training, access reviews, vendor DPA).
- Quarterly trend report from DPO.
- Reflected in enterprise risk register (R2).

## Communication templates
### To affected patient (AR)
```
عزيزي [الاسم]،

نأسف لإبلاغك بأنه في [التاريخ] حدث وصول غير مصرح به إلى بعض بياناتك في النظام،
يشمل [نوع البيانات]. اتخذنا الإجراءات التالية: [تعداد]. نوصيك بـ [اقتراحات].
لأي استفسار: dpo@nama.local — هاتف: ...

مع الأسف،
[المسؤول]
```

### To affected patient (EN)
```
Dear [Name],

We regret to inform you that on [date] an unauthorized access affected some of your
data in the system, including [data type]. We have taken the following actions:
[list]. We recommend you [actions].
For any question: dpo@nama.local — phone: ...

Sincerely,
[Officer]
```

## Internal escalation
Sev1 PHI breach: CEO + CMO + CISO + DPO + Legal + Comms + Insurance immediately.

## Records
Maintain a **Breach Register** with: case ID, dates, scope, actions, regulator
notifications, subject notifications, closure.
