# pcc-sdk (Kotlin)

Kotlin SDK for the **NamaMedical PCC Sandbox** catalog.

- 1322 modules · 10035 unique functions
- JVM 11+ / Android API 21+
- Stdlib only — `java.net.HttpURLConnection`
- Zero external dependencies
- Bundled stdlib JSON parser (no org.json / Jackson required)

> Auto-generated for PCC Catalog v3.316.0 on 2026-07-29

---

## Install (Gradle Kotlin DSL)

```kotlin
dependencies {
    implementation("com.jumanasoft:pcc-sdk:3.316.6")
}
```

Or as a multi-module project, include `sdk/kotlin/` as a sub-project:

```kotlin
include(":pcc-sdk")
project(":pcc-sdk").projectDir = file("sdk/kotlin")
```

---

## Quick start

```kotlin
import com.jumanasoft.pcc.PccClient

val client = PccClient(baseURL = "http://localhost:3201")

val health = client.health()
println(health["status"])

val r = client.call(
    slug  = "pcc-cardiology-ext102",
    fn    = "CardGenExt",
    input = mapOf("hr" to 80, "age" to 60)
)
println("score: ${r["score"]}")
```

---

## API (6 methods)

| # | Method | Purpose |
|---|---|---|
| 1 | `health()` | GET `/health` |
| 2 | `catalog()` | GET `/api/v1/pcc-catalog/modules` |
| 3 | `module(slug)` | GET `/api/v1/pcc-catalog/module/{slug}` |
| 4 | `search(query)` | GET `/api/v1/pcc-catalog/search?q=…` |
| 5 | `call(slug, fn, input)` | POST `/api/v1/{slug}/call/{fn}` |
| 6 | `record(slug, fn, input, tenantId, decisionId)` | POST `/api/v1/{slug}/record` |

### 1. health

```kotlin
val h = client.health()           // { status=ok, version=3.316.0 }
```

### 2. catalog

```kotlin
val c = client.catalog()
val count = (c["count"] as? Number)?.toInt() ?: 0
```

### 3. module

```kotlin
val m = client.module(slug = "pcc-cardiology-ext102")
```

### 4. search

```kotlin
val s = client.search(query = "cardiology")
```

### 5. call

```kotlin
val r = client.call(
    slug  = "pcc-cardiology-ext102",
    fn    = "CardGenExt",
    input = mapOf("hr" to 80, "age" to 60)
)
```

### 6. record

```kotlin
val rec = client.record(
    slug       = "pcc-cardiology-ext102",
    fn         = "CardGenExt",
    input      = mapOf("hr" to 80, "age" to 60),
    tenantId   = "demo-tenant",
    decisionId = "decision-001"
)
```

---

## Error handling

```kotlin
try {
    val r = client.call("x", "y", emptyMap())
} catch (e: PccException) {
    println("HTTP ${e.status}: ${e.message}")
}
```

`PccException` carries:
- `status: Int` — HTTP status code (-1 for transport errors)
- `message: String`
- `cause: Throwable?` — the underlying IOException if any

---

## Compatibility

| Target | Minimum |
|---|---|
| JVM | 11+ |
| Android | API 21+ |
| Kotlin | 1.9.0 |
| Gradle | 8.0 |

---

## License

UNLICENSED — internal use only (NamaMedical PCC team).