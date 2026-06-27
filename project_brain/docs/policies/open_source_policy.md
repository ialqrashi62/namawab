# Open-Source Software (OSS) Policy
v1.0

## 1. Allowed licenses (default green)
Apache-2.0 · MIT · BSD-2/3 · ISC · MPL-2.0 · CC0 · Unlicense.

## 2. Conditional (review required)
- LGPL-2.1/3.0 (linkage matters)
- EPL-2.0
- CDDL
- MS-PL
- Any "additional restrictions" appended

## 3. Forbidden by default
- GPL-2.0 / GPL-3.0 / AGPL-3.0 (would force open-sourcing our code)
- "Source-available" non-commercial-only (BUSL/SSPL/Commons Clause)
- Unknown / no license (treat as "all rights reserved")

## 4. Process to add an OSS dependency
1. Verify license category (above).
2. Check security advisories (Snyk + osv.dev).
3. Maintenance health (releases in last 12 months, active community).
4. Vulnerability scanning (Trivy on container, Snyk on lockfile).
5. Add to SBOM (CycloneDX).
6. Add provenance entry (where downloaded from, hash).
7. Document the why in PR description.

## 5. Compliance with OSS we use
- Maintain `THIRD_PARTY_NOTICES.md` shipping in product.
- Include OSS licenses in product (legal page).
- For source-redistribution licenses, provide source on request.

## 6. Contributing back
Encouraged for non-business-critical patches. Approval via Engineering Director.
- Contributions made on personal accounts must NOT include NamaMedical IP.
- For company-time contributions, use the corporate identity + CLA where required.

## 7. AI-generated code
- AI-generated suggestions reviewed for license-tainted training (avoid copyleft outputs).
- Every AI-suggested block reviewed; cannot be merged without human comprehension.

## 8. Audits
- Quarterly automated SBOM diff.
- Annual manual audit of forbidden-license usage.
- Internal SBOM published to Vault for legal access.
