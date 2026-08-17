#!/bin/bash
BODY='{"beers_count":2,"beers_high_risk":true,"category_high":"benzodiazepine","replacement_planned":true,"taper_planned":true,"monitoring_planned":true}'
curl -s -X POST http://127.0.0.1:3000/api/ger_pp/beers -H "Content-Type: application/json" -d "$BODY"