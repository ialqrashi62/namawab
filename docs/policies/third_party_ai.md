# Third-Party AI Use Policy
v1.0

## Scope
Any external AI service used in NamaMedical workflows (LLM providers, vision APIs,
OCR, voice, transcription, recommendation engines).

## Pre-engagement requirements
- DPA signed with PHI clauses.
- KSA-region inference (or explicit DPO-approved exception).
- No model training on our PHI without explicit institutional consent + patient consent.
- Independent evaluation on KSA validation set when used clinically.
- Transparent versioning + change-notification SLA.
- Security attestation: SOC 2 Type II preferred, ISO 27001 minimum.

## Allowed
- Claude / GPT-class models for general clinical reasoning when wrapped by our orchestrator
  (PHI redactor + safety critic + audit).
- Vision AI for imaging triage when CE/FDA-cleared and KSA-validated.
- Speech-to-text for documentation when on-prem or KSA region.

## Forbidden
- Sending raw PHI to public chatbots (ChatGPT consumer, Gemini consumer, Bing Chat, etc.).
- Models without DPA.
- Models using our prompts/responses for training without explicit opt-out.

## Per-feature gates
- Tier high/critical AI: model card + risk assessment + AI Governance Committee approval.
- Confidence thresholds tuned per feature with clinical lead.
- Drift monitoring + quarterly re-evaluation.

## Incident response for AI misuse
- Pause feature.
- Investigate root cause (prompt injection, data leak, harmful output).
- Notify DPO if PHI involved → PHI breach playbook.
- Public communication if patient impact.

## Monitoring
- Track upstream provider uptime + latency.
- Track per-feature confidence + override rate.
- Alert on hallucination incidents.

## Vendor exit
- Data deletion certified.
- Switch to alternate provider via abstraction layer (no vendor lock-in in code).
