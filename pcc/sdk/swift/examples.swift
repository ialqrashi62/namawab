// PCC Swift SDK — example usage
// Auto-generated for PCC Catalog v3.316.0
//
// Run with:
//   swift run PCCExamples
// or from an Xcode scheme that imports the PCC package.

import Foundation
import PCC

@main
struct PCCExamples {
    static func main() async {
        let client = PCCClient(baseURL: "http://localhost:3201")

        do {
            // 1) Health
            let health = try await client.health()
            print("[1/6] health =", health)

            // 2) Catalog
            let catalog = try await client.catalog()
            print("[2/6] catalog.count =", catalog["count"] ?? "?")

            // 3) Module detail
            if let detail = try? await client.module(slug: "pcc-cardiology-ext102") {
                print("[3/6] module =", detail["module"] ?? "?", "fn =", detail["function_count"] ?? "?")
            } else {
                print("[3/6] module lookup skipped (server may differ)")
            }

            // 4) Search
            let results = try await client.search(query: "cardiology")
            print("[4/6] search results =", results["count"] ?? "?")

            // 5) Call
            let r = try await client.call(
                slug: "pcc-cardiology-ext102",
                fn: "CardGenExt",
                input: ["hr": 80, "age": 60]
            )
            print("[5/6] call.score =", r["score"] ?? "n/a")

            // 6) Record
            let rec = try await client.record(
                slug: "pcc-cardiology-ext102",
                fn: "CardGenExt",
                input: ["hr": 80, "age": 60],
                tenantId: "demo-tenant",
                decisionId: "decision-001"
            )
            print("[6/6] record.recorded =", rec["recorded"] ?? "?")

            print("OK: PCC Swift SDK smoke test passed.")
        } catch let e as PCCError {
            print("FAIL (PCCError):", e)
            exit(1)
        } catch {
            print("FAIL (other):", error)
            exit(1)
        }
    }
}