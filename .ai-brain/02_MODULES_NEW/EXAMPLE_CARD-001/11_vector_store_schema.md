# 11 — Vector Store Schema (CARD-001)

> Owner: AIE · Snippet: snippet:vector-mine · Tier 1

## Index: nm_cardio_guidelines_v1

```yaml
- index_id: nm_cardio_guidelines_v1
  embedding: { model: multilingual-e5-large, dims: 1024, normalize: true }
  chunking: { size: 512, overlap: 64 }
  refresh: on-write
  sources:
    - { name: acc-aha-2024-gl-stemi, type: pdf, lang: en, pii: redact }
    - { name: acc-aha-2024-gl-af, type: pdf, lang: en, pii: redact }
    - { name: acc-aha-2024-gl-hf, type: pdf, lang: en, pii: redact }
    - { name: esc-2023-acs, type: pdf, lang: en, pii: redact }
    - { name: esc-2023-af, type: pdf, lang: en, pii: redact }
    - { name: esc-2023-valvular, type: pdf, lang: en, pii: redact }
    - { name: nphies-cardio-bundle, type: json, lang: ar+en, pii: none }
    - { name: sfda-drug-list, type: api, lang: ar+en, pii: none }
  retention: 7y
  namespace: tenant_<tenant_id>
  filter_keys: [tenant_id, lang, guideline, year, topic]
```

## Index: nm_drug_interactions_v1

```yaml
- index_id: nm_drug_interactions_v1
  embedding: { model: multilingual-e5-large, dims: 1024 }
  chunking: { size: 384, overlap: 64 }
  refresh: weekly
  sources:
    - { name: lexicomp-ddi, type: api, lang: en }
    - { name: sfda-ddi-db, type: api, lang: ar+en }
    - { name: nphies-rx-rules, type: json, lang: ar+en }
  retention: 7y
  namespace: global (cross-tenant by design)
  filter_keys: [drug_a, drug_b, severity]
```

## Index: nm_cardio_ecg_patterns_v1

```yaml
- index_id: nm_cardio_ecg_patterns_v1
  embedding: { model: bge-m3, dims: 1024 }  # for image-text
  chunking: { size: 256, overlap: 32 }
  refresh: on-write
  sources:
    - { name: dublin-ecg-library, type: image+text, lang: en }
    - { name: aha-ecg-atlas, type: image+text, lang: en }
    - { name: local-ecg-archive-deidentified, type: image+text, lang: en, pii: redact }
  retention: 7y
  namespace: tenant_<tenant_id>
  filter_keys: [pattern_type, lead_set, age_group]
  critical: true
```

## Index: nm_cardio_local_protocols_v1

```yaml
- index_id: nm_cardio_local_protocols_v1
  embedding: { model: multilingual-e5-large, dims: 1024 }
  chunking: { size: 512, overlap: 64 }
  refresh: on-write
  sources:
    - { name: code-stemi-sop, type: md, lang: ar+en }
    - { name: code-stroke-sop, type: md, lang: ar+en }
    - { name: hf-clinic-sop, type: md, lang: ar+en }
    - { name: device-implant-sop, type: md, lang: ar+en }
    - { name: tavr-pathway-sop, type: md, lang: ar+en }
    - { name: pci-pathway-sop, type: md, lang: ar+en }
  retention: 7y
  namespace: tenant_<tenant_id>
  filter_keys: [tenant_id, lang, protocol_type, version]
```

## Index: nm_cardio_patient_edu_v1

```yaml
- index_id: nm_cardio_patient_edu_v1
  embedding: { model: multilingual-e5-large, dims: 1024 }
  chunking: { size: 256, overlap: 32 }
  refresh: monthly
  sources:
    - { name: aha-patient, type: pdf, lang: en+ar }
    - { name: nhc-uk-patient, type: pdf, lang: en+ar }
    - { name: moh-ksa-patient, type: pdf, lang: ar }
    - { name: local-edu, type: md, lang: ar+en }
  retention: 7y
  namespace: tenant_<tenant_id>
  filter_keys: [tenant_id, lang, topic, reading_level]
```

## Naming convention reminder

`<tenant>.<group>.<topic>.<version>`

Example: `tenant_001.cardio.acs_2024.v1`
