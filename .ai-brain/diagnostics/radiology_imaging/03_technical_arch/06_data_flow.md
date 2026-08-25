POST /radiology_imaging/:fn → auth middlewares → zod → engine fn (pure) → persist jsonb to rad_orders → audit insert → 200 envelope
