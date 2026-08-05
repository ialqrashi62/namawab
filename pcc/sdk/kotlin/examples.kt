// PCC Kotlin SDK — example usage
// Auto-generated for PCC Catalog v3.316.0
//
// Run with:
//   ./gradlew run
// (after `gradle wrapper` if needed)

package com.jumanasoft.pcc.examples

import com.jumanasoft.pcc.PccClient
import com.jumanasoft.pcc.PccException

fun main() {
    val client = PccClient(baseURL = "http://localhost:3201")

    try {
        // 1) Health
        val health = client.health()
        println("[1/6] health = $health")

        // 2) Catalog
        val catalog = client.catalog()
        println("[2/6] catalog.count = ${catalog["count"]}")

        // 3) Module detail
        runCatching {
            val detail = client.module(slug = "pcc-cardiology-ext102")
            println("[3/6] module = ${detail["module"]} fn = ${detail["function_count"]}")
        }.onFailure {
            println("[3/6] module lookup skipped: ${it.message}")
        }

        // 4) Search
        val results = client.search(query = "cardiology")
        println("[4/6] search results = ${results["count"]}")

        // 5) Call
        val r = client.call(
            slug  = "pcc-cardiology-ext102",
            fn    = "CardGenExt",
            input = mapOf("hr" to 80, "age" to 60)
        )
        println("[5/6] call.score = ${r["score"]}")

        // 6) Record
        val rec = client.record(
            slug       = "pcc-cardiology-ext102",
            fn         = "CardGenExt",
            input      = mapOf("hr" to 80, "age" to 60),
            tenantId   = "demo-tenant",
            decisionId = "decision-001"
        )
        println("[6/6] record.recorded = ${rec["recorded"]}")

        println("OK: PCC Kotlin SDK smoke test passed.")
    } catch (e: PccException) {
        println("FAIL (PccException ${e.status}): ${e.message}")
        kotlin.system.exitProcess(1)
    } catch (e: Exception) {
        println("FAIL (other): ${e.message}")
        kotlin.system.exitProcess(1)
    }
}