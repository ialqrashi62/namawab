POST /nursing_services/:fn → auth middlewares → zod → engine fn (pure) → persist jsonb to nursing_records → audit insert → 200 envelope
