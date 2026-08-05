<?php
/**
 * pcc-sdk (PHP) — SDK for NamaMedical PCC Sandbox
 * Auto-generated for PCC Catalog v3.316.0
 * 1322 modules, 10035 unique functions
 * Generated: 2026-07-29T05:48:17.964Z
 */

declare(strict_types=1);

class PccClient {
    private string $baseUrl;
    private array $headers;
    private int $timeout;

    public function __construct(string $baseUrl = 'http://localhost:3201', array $headers = [], int $timeout = 30) {
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->headers = $headers;
        $this->timeout = $timeout;
    }

    // === Catalog ===
    public function catalog(): array {
        return $this->get('/api/v1/pcc-catalog/modules');
    }

    public function categories(): array {
        return $this->get('/api/v1/pcc-catalog/categories');
    }

    public function module(string $slug): array {
        return $this->get('/api/v1/pcc-catalog/module/' . $slug);
    }

    // === Search ===
    public function search(string $query): array {
        return $this->get('/api/v1/pcc-catalog/search?q=' . urlencode($query));
    }

    public function lookup(string $fn): array {
        return $this->get('/api/v1/pcc-catalog/lookup/' . urlencode($fn));
    }

    // === Diagnostics ===
    public function diagnostics(): array {
        return $this->get('/api/v1/pcc-diagnostics/diagnostics');
    }

    public function version(): array {
        return $this->get('/api/v1/pcc-diagnostics/version');
    }

    // === Module operations ===
    public function listModule(string $slug): array {
        return $this->get('/api/v1/' . $slug . '/list');
    }

    public function call(string $slug, string $fn, array $input = []): array {
        return $this->post('/api/v1/' . $slug . '/call/' . $fn, $input);
    }

    public function record(string $slug, array $request): array {
        return $this->post('/api/v1/' . $slug . '/record', $request);
    }

    public function health(): array {
        return $this->get('/health');
    }

    private function get(string $path): array {
        return $this->request('GET', $path, null);
    }

    private function post(string $path, ?array $body): array {
        return $this->request('POST', $path, $body);
    }

    private function request(string $method, string $path, ?array $body): array {
        $url = $this->baseUrl . $path;
        $ch = curl_init();
        $headers = array_merge(['Content-Type: application/json'], $this->headers);
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => $headers
        ]);
        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($body !== null) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
            }
        }
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode >= 400) {
            throw new RuntimeException("PCC {$method} {$path} failed: {$httpCode} {$response}");
        }
        return json_decode($response, true) ?: [];
    }
}

function urlencode(string $str): string {
    return rawurlencode($str);
}
