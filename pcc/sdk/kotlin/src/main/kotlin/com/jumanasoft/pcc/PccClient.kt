// PCC Kotlin SDK
// Auto-generated from PCC Sandbox v3.316.0
// 1322 modules, 10035 unique functions
// Generated: 2026-07-29
//
// Stdlib-only Kotlin/JVM client for the NamaMedical PCC Sandbox.
// Uses java.net.HttpURLConnection. No external dependencies.

package com.jumanasoft.pcc

import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

/** Thrown for any client-side or HTTP error from the PCC Sandbox. */
class PccException(
    val status: Int = -1,
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause)

/**
 * PccClient — stdlib-only SDK for the NamaMedical PCC Sandbox.
 *
 * Default base URL: http://localhost:3201
 */
class PccClient @JvmOverloads constructor(
    var baseURL: String = "http://localhost:3201",
    var connectTimeoutMs: Int = 10_000,
    var readTimeoutMs: Int = 30_000
) {
    init {
        // Trim trailing slash so URL joining is predictable.
        baseURL = baseURL.trimEnd('/')
    }

    // -------------------------------------------------------------
    // Public API (6 documented methods)
    // -------------------------------------------------------------

    /** GET /health */
    fun health(): Map<String, Any?> = getJSON("/health")

    /** GET /api/v1/pcc-catalog/modules */
    fun catalog(): Map<String, Any?> = getJSON("/api/v1/pcc-catalog/modules")

    /** GET /api/v1/pcc-catalog/module/{slug} */
    fun module(slug: String): Map<String, Any?> {
        val s = enc(slug)
        return getJSON("/api/v1/pcc-catalog/module/$s")
    }

    /** GET /api/v1/pcc-catalog/search?q={query} */
    fun search(query: String): Map<String, Any?> {
        val q = enc(query)
        return getJSON("/api/v1/pcc-catalog/search?q=$q")
    }

    /** POST /api/v1/{slug}/call/{fn} with body { "input": {...} } */
    fun call(slug: String, fn: String, input: Map<String, Any?>): Map<String, Any?> {
        val s = enc(slug)
        val f = enc(fn)
        val body = mapOf("input" to input)
        return postJSON("/api/v1/$s/call/$f", body)
    }

    /**
     * POST /api/v1/{slug}/record
     * Body: { fn, input, tenant_id?, decisionId? }
     */
    fun record(
        slug: String,
        fn: String,
        input: Map<String, Any?>,
        tenantId: String? = null,
        decisionId: String? = null
    ): Map<String, Any?> {
        val s = enc(slug)
        val payload = mutableMapOf<String, Any?>(
            "fn" to fn,
            "input" to input
        )
        if (tenantId != null)   payload["tenant_id"]  = tenantId
        if (decisionId != null) payload["decisionId"] = decisionId
        return postJSON("/api/v1/$s/record", payload)
    }

    // -------------------------------------------------------------
    // Internal HTTP helpers
    // -------------------------------------------------------------

    private fun getJSON(path: String): Map<String, Any?> {
        val (data, status) = httpRequest("GET", baseURL + path, null)
        return parseObject(data, status)
    }

    private fun postJSON(path: String, body: Any): Map<String, Any?> {
        val payload = toJsonString(body)
        val (data, status) = httpRequest("POST", baseURL + path, payload)
        return parseObject(data, status)
    }

    private fun httpRequest(method: String, fullURL: String, body: String?): Pair<String, Int> {
        val url = URL(fullURL)
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = connectTimeoutMs
            readTimeout = readTimeoutMs
            doInput = true
            setRequestProperty("Accept", "application/json")
            if (body != null) {
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
            }
        }
        return try {
            if (body != null) {
                conn.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            }
            val status = conn.responseCode
            val stream = if (status in 200..299) conn.inputStream else (conn.errorStream ?: conn.inputStream)
            val text = BufferedReader(InputStreamReader(stream, Charsets.UTF_8)).use { it.readText() }
            text to status
        } catch (e: Exception) {
            throw PccException(message = "transport error: ${e.message}", cause = e)
        } finally {
            conn.disconnect()
        }
    }

    private fun parseObject(body: String, status: Int): Map<String, Any?> {
        if (status >= 400) {
            throw PccException(status = status, message = "HTTP $status: $body")
        }
        val parsed: Any? = parseJson(body)
        @Suppress("UNCHECKED_CAST")
        return (parsed as? Map<String, Any?>) ?: mapOf("_raw" to parsed)
    }

    // -------------------------------------------------------------
    // Minimal JSON encode/decode — stdlib only.
    // Supports objects, arrays, strings, numbers, booleans, null.
    // -------------------------------------------------------------

    private fun toJsonString(value: Any?): String = when (value) {
        null          -> "null"
        is Boolean    -> value.toString()
        is Number     -> value.toString()
        is String     -> jsonString(value)
        is Map<*, *>  -> value.entries.joinToString(",", "{", "}") { (k, v) ->
                            jsonString(k.toString()) + ":" + toJsonString(v)
                          }
        is Iterable<*> -> value.joinToString(",", "[", "]") { toJsonString(it) }
        is Array<*>    -> value.joinToString(",", "[", "]") { toJsonString(it) }
        else           -> jsonString(value.toString())
    }

    private fun jsonString(s: String): String {
        val sb = StringBuilder(s.length + 2)
        sb.append('"')
        for (c in s) {
            when (c) {
                '"'  -> sb.append("\\\"")
                '\\' -> sb.append("\\\\")
                '\n' -> sb.append("\\n")
                '\r' -> sb.append("\\r")
                '\t' -> sb.append("\\t")
                '\b' -> sb.append("\\b")
                else -> if (c.code < 0x20) sb.append(String.format("\\u%04x", c.code)) else sb.append(c)
            }
        }
        sb.append('"')
        return sb.toString()
    }

    /** Recursive JSON parser (objects, arrays, strings, numbers, booleans, null). */
    @Suppress("UNCHECKED_CAST")
    private fun parseJson(text: String): Any? {
        val p = JsonParser(text)
        p.skipWs()
        val v = p.parseValue()
        p.skipWs()
        if (p.pos < text.length) {
            throw PccException(message = "trailing JSON content at pos ${p.pos}")
        }
        return v
    }

    private class JsonParser(private val src: String) {
        var pos = 0

        fun skipWs() {
            while (pos < src.length && src[pos].isWhitespace()) pos++
        }

        fun parseValue(): Any? {
            skipWs()
            if (pos >= src.length) throw PccException(message = "unexpected end of JSON")
            return when (val c = src[pos]) {
                '{' -> parseObject()
                '[' -> parseArray()
                '"' -> parseString()
                't', 'f' -> parseBool()
                'n' -> parseNull()
                else -> if (c == '-' || c.isDigit()) parseNumber() else
                    throw PccException(message = "unexpected char '$c' at $pos")
            }
        }

        private fun parseObject(): Map<String, Any?> {
            expect('{')
            val map = linkedMapOf<String, Any?>()
            skipWs()
            if (peek() == '}') { pos++; return map }
            while (true) {
                skipWs()
                val key = parseString()
                skipWs(); expect(':')
                val v = parseValue()
                map[key] = v
                skipWs()
                when (val c = src[pos]) {
                    ',' -> { pos++; continue }
                    '}' -> { pos++; return map }
                    else -> throw PccException(message = "expected ',' or '}' got '$c' at $pos")
                }
            }
        }

        private fun parseArray(): List<Any?> {
            expect('[')
            val list = mutableListOf<Any?>()
            skipWs()
            if (peek() == ']') { pos++; return list }
            while (true) {
                list.add(parseValue())
                skipWs()
                when (val c = src[pos]) {
                    ',' -> { pos++; continue }
                    ']' -> { pos++; return list }
                    else -> throw PccException(message = "expected ',' or ']' got '$c' at $pos")
                }
            }
        }

        private fun parseString(): String {
            expect('"')
            val sb = StringBuilder()
            while (pos < src.length) {
                val c = src[pos++]
                if (c == '"') return sb.toString()
                if (c == '\\') {
                    if (pos >= src.length) break
                    when (val esc = src[pos++]) {
                        '"'  -> sb.append('"')
                        '\\' -> sb.append('\\')
                        '/'  -> sb.append('/')
                        'n'  -> sb.append('\n')
                        'r'  -> sb.append('\r')
                        't'  -> sb.append('\t')
                        'b'  -> sb.append('\b')
                        'f'  -> sb.append('\u000C')
                        'u'  -> {
                            val hex = src.substring(pos, pos + 4)
                            pos += 4
                            sb.append(hex.toInt(16).toChar())
                        }
                        else -> throw PccException(message = "bad escape \\$esc at $pos")
                    }
                } else {
                    sb.append(c)
                }
            }
            throw PccException(message = "unterminated string")
        }

        private fun parseNumber(): Number {
            val start = pos
            if (src[pos] == '-') pos++
            while (pos < src.length && (src[pos].isDigit() || src[pos] in ".eE+-")) pos++
            val s = src.substring(start, pos)
            return if ('.' in s || 'e' in s || 'E' in s) s.toDouble() else s.toLong()
        }

        private fun parseBool(): Boolean {
            if (src.startsWith("true", pos))  { pos += 4; return true  }
            if (src.startsWith("false", pos)) { pos += 5; return false }
            throw PccException(message = "invalid bool at $pos")
        }

        private fun parseNull(): Any? {
            if (src.startsWith("null", pos)) { pos += 4; return null }
            throw PccException(message = "invalid null at $pos")
        }

        private fun peek(): Char = src[pos]
        private fun expect(c: Char) {
            if (pos >= src.length || src[pos] != c) {
                throw PccException(message = "expected '$c' at $pos")
            }
            pos++
        }
    }

    private fun enc(s: String): String =
        URLEncoder.encode(s, "UTF-8").replace("+", "%20")
}