# pcc-sdk (Go)

Go SDK for the NamaMedical PCC Sandbox catalog.

- 1322 modules
- 10035 unique functions
- Pure stdlib (no external deps)
- Type-safe structs

## Install

```bash
go get github.com/jumanasoft/pcc-sdk
```

## Usage

```go
package main

import (
    "fmt"
    "github.com/jumanasoft/pcc-sdk"
)

func main() {
    client := pcc.New("http://localhost:3201")

    // List all modules
    cat, _ := client.Catalog()
    fmt.Printf("%v modules\n", cat["count"])

    // Search
    results, _ := client.Search("cardiology")
    fmt.Println(results)

    // Call
    r, err := client.Call("pcc-cardiology-ext102", "CardGenExt", map[string]interface{}{
        "hr": 80,
    })
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Printf("Score: %v\n", *r.Score)

    // Record
    rec, _ := client.Record("pcc-cardiology-ext102", pcc.RecordRequest{
        TenantID: "tenant_001",
        Fn:       "CardGenExt",
        Input:    map[string]interface{}{"hr": 80},
    })
    fmt.Printf("Recorded: %v\n", rec.Recorded)

    // Health
    h, _ := client.Health()
    fmt.Println(h)
}
```

## API

| Method | Description |
|---|---|
| `Health()` | Server health check |
| `Catalog()` | List all 1322 modules |
| `Categories()` | Modules grouped by category |
| `Module(slug)` | Module detail |
| `Search(query)` | Full-text search |
| `Lookup(fn)` | Find modules by function |
| `Diagnostics()` | Server diagnostics |
| `Version()` | Version info |
| `ListModule(slug)` | Module function list |
| `Call(slug, fn, input)` | Invoke function |
| `Record(slug, req)` | Record with tenant |

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:41:27.562Z