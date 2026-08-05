# pcc-sdk (Python)

Python SDK for the NamaMedical PCC Sandbox catalog.

- 1322 modules
- 10035 unique functions
- Pure Python stdlib (no dependencies)
- Synchronous client

## Install

```bash
pip install pcc-sdk
```

## Usage

```python
from pcc_sdk import PccClient, SHORTCUTS

client = PccClient(base_url="http://localhost:3201")

# List all modules
catalog = client.catalog()
print(f"{catalog['count']} modules")

# Search
results = client.search("cardiology")
print(results["results"][0])

# Call a function
result = client.call("pcc-cardiology-ext102", "CardGenExt", {"hr": 80})
print(f"Score: {result.get('score')}")

# Record with tenant
recorded = client.record("pcc-cardiology-ext102", {
    "tenant_id": "tenant_001",
    "fn": "CardGenExt",
    "input": {"hr": 80}
})
print(f"Recorded: {recorded['recorded']}")

# Health
health = client.health()
print(health["status"])
```

## Module Shortcuts

```python
from pcc_sdk import SHORTCUTS

print(SHORTCUTS["PccCardiologyExt102"])
# {"slug": "pcc-cardiology-ext102", "module": "pcc_cardiology_ext102", "version": "3.316.0", "functions": [...]}
```

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:32:22.719Z