package com.jumanasoft.pcc;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

/**
 * PCC SDK (Java) — Client for NamaMedical PCC Sandbox.
 * Auto-generated for PCC Catalog v3.316.0
 * 1322 modules, 10035 unique functions
 * Generated: 2026-07-29T05:49:59.996Z
 */
public class PccClient {
    private final String baseUrl;
    private final Duration timeout;
    private final HttpClient http;

    public PccClient() {
        this("http://localhost:3201", Duration.ofSeconds(30));
    }

    public PccClient(String baseUrl, Duration timeout) {
        this.baseUrl = baseUrl.replaceAll("/$", "");
        this.timeout = timeout;
        this.http = HttpClient.newBuilder()
            .connectTimeout(timeout)
            .build();
    }

    // === Catalog ===
    public String catalog() throws IOException, InterruptedException {
        return get("/api/v1/pcc-catalog/modules", null);
    }

    public String categories() throws IOException, InterruptedException {
        return get("/api/v1/pcc-catalog/categories", null);
    }

    public String module(String slug) throws IOException, InterruptedException {
        return get("/api/v1/pcc-catalog/module/" + slug, null);
    }

    // === Search ===
    public String search(String query) throws IOException, InterruptedException {
        return get("/api/v1/pcc-catalog/search?q=" + java.net.URLEncoder.encode(query, java.nio.charset.StandardCharsets.UTF_8), null);
    }

    public String lookup(String fn) throws IOException, InterruptedException {
        return get("/api/v1/pcc-catalog/lookup/" + java.net.URLEncoder.encode(fn, java.nio.charset.StandardCharsets.UTF_8), null);
    }

    // === Diagnostics ===
    public String diagnostics() throws IOException, InterruptedException {
        return get("/api/v1/pcc-diagnostics/diagnostics", null);
    }

    public String version() throws IOException, InterruptedException {
        return get("/api/v1/pcc-diagnostics/version", null);
    }

    // === Module operations ===
    public String listModule(String slug) throws IOException, InterruptedException {
        return get("/api/v1/" + slug + "/list", null);
    }

    public String call(String slug, String fn, String inputJson) throws IOException, InterruptedException {
        return post("/api/v1/" + slug + "/call/" + fn, inputJson);
    }

    public String record(String slug, String requestJson) throws IOException, InterruptedException {
        return post("/api/v1/" + slug + "/record", requestJson);
    }

    public String health() throws IOException, InterruptedException {
        return get("/health", null);
    }

    // === HTTP helpers ===
    private String get(String path, String body) throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + path))
            .timeout(timeout)
            .header("Content-Type", "application/json")
            .GET();
        return exec(builder);
    }

    private String post(String path, String body) throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + path))
            .timeout(timeout)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body != null ? body : "{}"));
        return exec(builder);
    }

    private String exec(HttpRequest.Builder builder) throws IOException, InterruptedException {
        HttpResponse<String> response = http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new RuntimeException("PCC request failed: " + response.statusCode() + " " + response.body());
        }
        return response.body();
    }
}
