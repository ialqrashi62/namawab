# nm-ai-brain-token-saver

## Description
A meta-skill for reducing token consumption when working with `.ai-brain`. Use this skill before any large `.ai-brain` generation task.

## When to use
- Before generating many department files.
- When the conversation is at risk of exceeding context limits.

## Techniques
1. **Reference, don't repeat**: Cite canonical docs by name/section instead of quoting them.
2. **One-pass loading**: Read all reference docs in a single turn, then generate files without re-reading.
3. **Batch by similarity**: Generate files for departments that share the same pattern in one pass.
4. **Use skills**: Invoke `nm-ai-brain-department-generator`, `nm-ai-brain-index-manager`, and `nm-ai-brain-workflow-scribe` instead of re-explaining requirements each time.
5. **Skeleton first**: For very large tasks, produce a skeleton/TOC first, then fill sections in subsequent turns.
6. **Avoid verbose intros**: Start generated files directly with the content; skip long preambles.
7. **Reuse snippets**: Keep a shared snippet file for common sections (RLS note, PHI vault note, Stitch station layout) and reference it.

## Shared snippet file
If it does not exist, create `.ai-brain/skills/shared/snippets.md` with short reusable paragraphs for:
- RLS / tenant isolation note
- PHI vault / crypto_envelope note
- Stitch 3-column station layout
- Golden Access Rule note
- Safety-gate pattern
- Hash-chained audit trail note
- Money/VAT server-side note
- CSP report-only note

## Available helper skills
Load these skills instead of re-explaining their purpose:
- `nm-ai-brain-multi-agent` — parallel expert voices (CMO, AI Engineer, Architect, UX, Compliance, DevOps).
- `nm-ai-brain-department-generator` — generate brain.md + 01-06.
- `nm-ai-brain-index-manager` — update INDEX.md.
- `nm-ai-brain-workflow-scribe` — generate scenarios and dataflow.
- `nm-ai-brain-autopilot` — batch generation across groups.
- `nm-ai-brain-station-matcher` — map stations vs. brain docs.
- `nm-ai-brain-loop-engineering` — panel-of-experts refinement.
- `nm-ai-brain-frontend-bridge` — turn brain docs into station.js.
- `nm-ai-brain-master-orchestrator` — combine all of the above.

## Rules
- Never paste the full reference doc into a generated file.
- Never re-explain the tech stack in every department file.
- Always reference helper skills by name rather than rewriting their instructions.
