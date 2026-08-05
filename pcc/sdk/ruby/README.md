# pcc-sdk (Ruby)

Ruby SDK for the NamaMedical PCC Sandbox catalog.

- 1322 modules
- 10035 unique functions
- Pure stdlib (net/http + uri + json)
- Sync client

## Install

```bash
gem install pcc-sdk
```

## Usage

```ruby
require 'pcc'

client = Pcc::Client.new(base_url: "http://localhost:3201")

# List all modules
catalog = client.catalog
puts "#{catalog["count"]} modules"

# Search
results = client.search("cardiology")
puts results["results"][0]

# Call
r = client.call("pcc-cardiology-ext102", "CardGenExt", { hr: 80 })
puts "Score: #{r["score"]}"

# Record
rec = client.record("pcc-cardiology-ext102", {
  tenant_id: "tenant_001",
  fn: "CardGenExt",
  input: { hr: 80 }
})
puts "Recorded: #{rec["recorded"]}"

# Health
puts client.health
```

## API

| Method | Description |
|---|---|
| `catalog` | List all 1322 modules |
| `categories` | Grouped by 255 categories |
| `module(slug)` | Module detail |
| `search(query)` | Full-text search |
| `lookup(fn)` | Find modules by function |
| `diagnostics` | Server diagnostics |
| `version` | Version info |
| `list_module(slug)` | Module function list |
| `call(slug, fn, input)` | Invoke function |
| `record(slug, req)` | Record with tenant |
| `health` | Health check |

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:45:07.522Z