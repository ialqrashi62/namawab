// PCC Swift SDK
// Auto-generated from PCC Sandbox v3.316.0
// 1322 modules, 10035 unique functions
// Generated: 2026-07-29
//
// Stdlib-only Swift client for the NamaMedical PCC Sandbox.
// Uses URLSession + async/await. No external dependencies.

import Foundation

public enum PCCError: Error, CustomStringConvertible {
    case http(status: Int, body: String)
    case decoding(String)
    case transport(Error)
    case badURL(String)

    public var description: String {
        switch self {
        case .http(let s, let b):   return "PCC HTTP \(s): \(b)"
        case .decoding(let m):       return "PCC decode error: \(m)"
        case .transport(let e):      return "PCC transport error: \(e)"
        case .badURL(let u):         return "PCC bad URL: \(u)"
        }
    }
}

// MARK: - Response models

public struct PCCHealth: Decodable {
    public let status: String
    public let version: String
}

public struct PCCCatalog: Decodable {
    public let version: String
    public let count: Int
    public let modules: [String]
    public let categories: [String]
}

public struct PCCModuleDetail: Decodable {
    public let module: String
    public let url_slug: String
    public let version: String
    public let function_count: Int
    public let functions: [String]
    public let api_base: String
}

public struct PCCSearchResult: Decodable {
    public let slug: String
    public let module: String?
    public let score: Double?
}

public struct PCCSearchResponse: Decodable {
    public let query: String
    public let count: Int
    public let results: [PCCSearchResult]
}

public struct PCCCallResult: Decodable {
    public let version: String
    public let module: String
    public let `function`: String
    public let score: Double?
    public let ts: String
    // Open-ended payload for engine-specific keys
    public let extras: [String: AnyCodable]?

    enum CodingKeys: String, CodingKey {
        case version, module, score, ts, `function`
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        version  = try c.decode(String.self, forKey: .version)
        module   = try c.decode(String.self, forKey: .module)
        `function` = try c.decode(String.self, forKey: .`function`)
        score    = try c.decodeIfPresent(Double.self, forKey: .score)
        ts       = try c.decode(String.self, forKey: .ts)
        extras   = nil
    }
}

/// Minimal AnyCodable for open payloads. Encodes/decodes JSON-scalar values.
public struct AnyCodable: Codable {
    public let value: Any

    public init(_ value: Any) { self.value = value }

    public init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if c.decodeNil() {                        value = NSNull(); return }
        if let v = try? c.decode(Bool.self)    { value = v; return }
        if let v = try? c.decode(Int.self)     { value = v; return }
        if let v = try? c.decode(Double.self)  { value = v; return }
        if let v = try? c.decode(String.self)  { value = v; return }
        if let v = try? c.decode([AnyCodable].self) { value = v.map { $0.value }; return }
        if let v = try? c.decode([String: AnyCodable].self) {
            value = v.mapValues { $0.value }; return
        }
        throw PCCError.decoding("AnyCodable: unsupported JSON value")
    }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch value {
        case is NSNull:                try c.encodeNil()
        case let v as Bool:            try c.encode(v)
        case let v as Int:             try c.encode(v)
        case let v as Double:          try c.encode(v)
        case let v as String:          try c.encode(v)
        case let v as [Any]:           try c.encode(v.map(AnyCodable.init))
        case let v as [String: Any]:   try c.encode(v.mapValues(AnyCodable.init))
        default:
            throw PCCError.decoding("AnyCodable: cannot encode \(type(of: value))")
        }
    }
}

// MARK: - Client

public struct PCCClient {
    public let baseURL: String
    private let session: URLSession

    public init(baseURL: String = "http://localhost:3201", session: URLSession = .shared) {
        // Trim trailing slash so URL construction is predictable.
        self.baseURL = baseURL.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        self.session = session
    }

    // MARK: Public methods (6 documented endpoints)

    /// GET /health
    public func health() async throws -> [String: Any] {
        try await getJSON(path: "/health")
    }

    /// GET /api/v1/pcc-catalog/modules
    public func catalog() async throws -> [String: Any] {
        try await getJSON(path: "/api/v1/pcc-catalog/modules")
    }

    /// GET /api/v1/pcc-catalog/module/{slug}
    public func module(slug: String) async throws -> [String: Any] {
        let encoded = slug.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? slug
        return try await getJSON(path: "/api/v1/pcc-catalog/module/\(encoded)")
    }

    /// GET /api/v1/pcc-catalog/search?q={query}
    public func search(query: String) async throws -> [String: Any] {
        let q = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? query
        return try await getJSON(path: "/api/v1/pcc-catalog/search?q=\(q)")
    }

    /// POST /api/v1/{slug}/call/{fn}
    public func call(slug: String, fn: String, input: [String: Any]) async throws -> [String: Any] {
        let body: [String: Any] = ["input": input]
        let encoded = slug.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? slug
        return try await postJSON(path: "/api/v1/\(encoded)/call/\(fn)", body: body)
    }

    /// POST /api/v1/{slug}/record
    public func record(
        slug: String,
        fn: String,
        input: [String: Any],
        tenantId: String? = nil,
        decisionId: String? = nil
    ) async throws -> [String: Any] {
        var body: [String: Any] = ["fn": fn, "input": input]
        if let t = tenantId   { body["tenant_id"]  = t }
        if let d = decisionId { body["decisionId"] = d }
        let encoded = slug.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? slug
        return try await postJSON(path: "/api/v1/\(encoded)/record", body: body)
    }

    // MARK: Internal HTTP helpers

    private func getJSON(path: String) async throws -> [String: Any] {
        let req = try makeRequest(method: "GET", path: path, body: nil)
        return try await performJSON(req)
    }

    private func postJSON(path: String, body: [String: Any]) async throws -> [String: Any] {
        let req = try makeRequest(method: "POST", path: path, body: body)
        return try await performJSON(req)
    }

    private func makeRequest(method: String, path: String, body: [String: Any]?) throws -> URLRequest {
        guard let url = URL(string: baseURL + path) else {
            throw PCCError.badURL(baseURL + path)
        }
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if let body = body {
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = try JSONSerialization.data(withJSONObject: body)
        }
        return req
    }

    private func performJSON(_ req: URLRequest) async throws -> [String: Any] {
        let (data, resp): (Data, URLResponse)
        do {
            (data, resp) = try await session.data(for: req)
        } catch {
            throw PCCError.transport(error)
        }
        guard let http = resp as? HTTPURLResponse else {
            throw PCCError.transport(URLError(.badServerResponse))
        }
        if http.statusCode >= 400 {
            let body = String(data: data, encoding: .utf8) ?? ""
            throw PCCError.http(status: http.statusCode, body: body)
        }
        let parsed = try JSONSerialization.jsonObject(with: data, options: [])
        return parsed as? [String: Any] ?? ["_raw": parsed]
    }
}