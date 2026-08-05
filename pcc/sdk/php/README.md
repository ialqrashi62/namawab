# pcc-sdk (PHP)

PHP SDK for the NamaMedical PCC Sandbox catalog.

- 1322 modules
- 10035 unique functions
- PHP 8.0+
- Uses cURL + JSON

## Install

```bash
composer require jumanasoft/pcc-sdk
```

## Usage

```php
require 'vendor/autoload.php';

$client = new PccClient("http://localhost:3201");

// Catalog
$cat = $client->catalog();
echo "{$cat["count"]} modules\n";

// Search
$results = $client->search("cardiology");
print_r($results);

// Call
$r = $client->call("pcc-cardiology-ext102", "CardGenExt", ["hr" => 80]);
echo "Score: {$r["score"]}\n";

// Record
$rec = $client->record("pcc-cardiology-ext102", [
    "tenant_id" => "tenant_001",
    "fn" => "CardGenExt",
    "input" => ["hr" => 80]
]);
echo "Recorded: {$rec["recorded"]}\n";

// Health
print_r($client->health());
```

## API

| Method | Description |
|---|---|
| `catalog()` | List all 1322 modules |
| `categories()` | Grouped by category |
| `module($slug)` | Module detail |
| `search($query)` | Full-text search |
| `lookup($fn)` | Find modules by function |
| `diagnostics()` | Server diagnostics |
| `version()` | Version info |
| `listModule($slug)` | Module function list |
| `call($slug, $fn, $input)` | Invoke function |
| `record($slug, $req)` | Record with tenant |
| `health()` | Health check |

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:48:17.966Z