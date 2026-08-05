# pcc-sdk (Swift)

Swift SDK for the **NamaMedical PCC Sandbox** catalog.

- 1322 modules · 10035 unique functions
- iOS 15+, macOS 12+
- Stdlib only — `URLSession` + async/await
- Zero external dependencies

> Auto-generated for PCC Catalog v3.316.0 on 2026-07-29

---

## Install (Swift Package Manager)

In `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/jumanasoft/pcc-sdk-swift.git", from: "3.316.0")
],
targets: [
    .target(name: "MyApp", dependencies: ["PCC"])
]
```

Or in Xcode: **File → Add Packages… → paste the repo URL**.

---

## Quick start

```swift
import PCC

let client = PCCClient(baseURL: "http://localhost:3201")

let health = try await client.health()
print(health["status"] ?? "?")

let r = try await client.call(
    slug: "pcc-cardiology-ext102",
    fn:   "CardGenExt",
    input: ["hr": 80, "age": 60]
)
print("score:", r["score"] ?? "n/a")
```

---

## API (6 methods)

| # | Method | Purpose |
|---|---|---|
| 1 | `health()` | GET `/health` |
| 2 | `catalog()` | GET `/api/v1/pcc-catalog/modules` |
| 3 | `module(slug:)` | GET `/api/v1/pcc-catalog/module/{slug}` |
| 4 | `search(query:)` | GET `/api/v1/pcc-catalog/search?q=…` |
| 5 | `call(slug:fn:input:)` | POST `/api/v1/{slug}/call/{fn}` |
| 6 | `record(slug:fn:input:tenantId:decisionId:)` | POST `/api/v1/{slug}/record` |

### 1. health

```swift
let h = try await client.health()   // ["status": "ok", "version": "3.316.0"]
```

### 2. catalog

```swift
let c = try await client.catalog()
let count = c["count"] as? Int ?? 0
```

### 3. module

```swift
let m = try await client.module(slug: "pcc-cardiology-ext102")
```

### 4. search

```swift
let s = try await client.search(query: "cardiology")
```

### 5. call

```swift
let r = try await client.call(
    slug:  "pcc-cardiology-ext102",
    fn:    "CardGenExt",
    input: ["hr": 80, "age": 60]
)
```

### 6. record

```swift
let rec = try await client.record(
    slug:       "pcc-cardiology-ext102",
    fn:         "CardGenExt",
    input:      ["hr": 80, "age": 60],
    tenantId:   "demo-tenant",
    decisionId: "decision-001"
)
```

---

## Error handling

```swift
do {
    let r = try await client.call(slug: "x", fn: "y", input: [:])
} catch let e as PCCError {
    switch e {
    case .http(let s, let b):  print("HTTP \(s): \(b)")
    case .decoding(let m):     print("decode: \(m)")
    case .transport(let t):    print("transport: \(t)")
    case .badURL(let u):       print("bad URL: \(u)")
    }
}
```

---

## Compatibility

| Platform | Minimum version |
|---|---|
| macOS | 12.0 |
| iOS | 15.0 |
| Swift | 5.7 |
| Xcode | 14.0 |

---

## License

UNLICENSED — internal use only (NamaMedical PCC team).