# Playbook — Ransomware
v1.0 — Owner: CISO + IR — Always Sev1

## Detection signals
- EDR alerts: mass file rename / .crypt extensions.
- File shares show README ransom notes.
- Backup integrity checks fail.
- Sudden spike in CPU/IO from atypical hosts.
- User reports inability to open files.

## Immediate actions (first 30 min)
1. **Declare Sev1** → page IC, CISO, CMO, CTO.
2. **DO NOT power-off** affected hosts (lose memory artifacts);
   instead **isolate from network** (VLAN quarantine, NAC port shut).
3. Block lateral movement: disable AD account of suspected source; revoke service tokens.
4. Activate **paper-fallback** for tier-1 clinical workflows; CMO informs ED/ICU/wards.
5. Notify CFO + insurance broker (cyber policy invocation timeline).
6. Snapshot affected hosts (memory + disk) for forensics.
7. Engage retained DFIR firm (per playbook contact card).

## Containment (30 min – 4 h)
- Identify patient zero + initial access vector (phishing? RDP? exploited service?).
- Block all C2 IPs/domains at firewall; sinkhole DNS.
- Disable mass-deletion service accounts; rotate all admin creds.
- Take primary database to read-only if integrity uncertain; failover to **DR** (per DR runbook).
- Pull Kerberos KRBTGT password twice (24 h apart) if AD compromised.
- Force MFA re-enrollment.

## Decision: pay or not
- Default: **DO NOT PAY** (legal + ethical; per KSA cyber regulations & insurance).
- Engage law enforcement (Saudi CERT, NCA) and legal counsel.
- Confirm immutable backups are intact for restore path.

## Recovery (4 h – days)
- Validate clean backups (offline scan with multi-AV).
- Rebuild affected systems from gold images; do not restore in place from compromised hosts.
- Patch the original vulnerability before bringing services back.
- Phased restoration prioritizing tier-1 services.
- Communicate transparently with staff, patients, regulators.

## Notifications
- **Saudi CERT** as soon as practicable.
- **NCA** per ECC incident reporting controls.
- **SDAIA**: if PHI affected, **within 72 h** per PDPL.
- **Patients**: if individuals' data exposed, direct notice with remediation steps.
- **CBAHI**: if ongoing care impact during accreditation cycle.

## Post-incident
- Full forensic report; root cause; IoCs shared (TLP:AMBER).
- CAPA: enforce phishing-resistant MFA, restrict RDP, segment legacy systems,
  improve EDR coverage, harden backups.
- Tabletop exercise within 60 days incorporating lessons learned.

## Contacts (placeholders)
- Internal IC: pager @nama-ic
- DFIR retainer: +966-... / dfir@vendor
- Cyber insurance: +966-... / claims@insurer
- Saudi CERT: cert@cert.gov.sa
- NCA: contact@nca.gov.sa
- SDAIA: dpo-notifications@sdaia.gov.sa
