# pcc-sdk (Rust)

Rust SDK for the NamaMedical PCC Sandbox catalog.

- 1322 modules
- 10035 unique functions
- Async + blocking support
- Type-safe structs

## Install

```toml
[dependencies]
pcc-sdk = "3.316"
```

## Usage

```rust
use pcc_sdk::Client;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new()
        .with_base_url("http://localhost:3201");

    // Health
    let health = client.health()?;
    println!("{} v{}", health.status, health.version);

    // Catalog
    let catalog = client.catalog()?;
    println!("{} modules", catalog.count);

    // Search
    let results = client.search("cardiology")?;
    println!("Found {} results", results.count);

    // Call
    let mut input = std::collections::HashMap::new();
    input.insert("hr".to_string(), serde_json::json!(80));
    let r = client.call("pcc-cardiology-ext102", "CardGenExt", input)?;
    println!("Score: {:?}", r.score);

    Ok(())
}
```

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:49:19.421Z