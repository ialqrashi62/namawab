POST /nutrition_food_services/:fn → auth middlewares → zod → engine fn (pure) → persist jsonb to nutrition_orders → audit insert → 200 envelope
