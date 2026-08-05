// pcc-sdk (Rust) — SDK for NamaMedical PCC Sandbox
// Auto-generated for PCC Catalog v3.316.0
// 1322 modules, 10035 unique functions
// Generated: 2026-07-29T05:49:19.420Z

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Duration;

const DEFAULT_BASE_URL: &str = "http://localhost:3201";

#[derive(Debug, Clone)]
pub struct Client {
    base_url: String,
    timeout: Duration,
}

impl Client {
    pub fn new() -> Self {
        Self {
            base_url: DEFAULT_BASE_URL.to_string(),
            timeout: Duration::from_secs(30),
        }
    }

    pub fn with_base_url(mut self, base_url: &str) -> Self {
        self.base_url = base_url.trim_end_matches('/').to_string();
        self
    }

    pub fn with_timeout(mut self, timeout: Duration) -> Self {
        self.timeout = timeout;
        self
    }

    pub fn health(&self) -> reqwest::Result<Health> {
        let url = format!("{}/health", self.base_url);
        let client = reqwest::blocking::Client::builder()
            .timeout(self.timeout)
            .build()?;
        client.get(&url).send()?.json()
    }

    pub fn catalog(&self) -> reqwest::Result<Catalog> {
        let url = format!("{}/api/v1/pcc-catalog/modules", self.base_url);
        let client = reqwest::blocking::Client::builder()
            .timeout(self.timeout)
            .build()?;
        client.get(&url).send()?.json()
    }

    pub fn module(&self, slug: &str) -> reqwest::Result<Module> {
        let url = format!("{}/api/v1/pcc-catalog/module/{}", self.base_url, slug);
        let client = reqwest::blocking::Client::builder()
            .timeout(self.timeout)
            .build()?;
        client.get(&url).send()?.json()
    }

    pub fn search(&self, query: &str) -> reqwest::Result<SearchResponse> {
        let url = format!("{}/api/v1/pcc-catalog/search?q={}", self.base_url, urlencoding(query));
        let client = reqwest::blocking::Client::builder()
            .timeout(self.timeout)
            .build()?;
        client.get(&url).send()?.json()
    }

    pub fn call(&self, slug: &str, fn_name: &str, input: HashMap<String, serde_json::Value>) -> reqwest::Result<CallResult> {
        let url = format!("{}/api/v1/{}/call/{}", self.base_url, slug, fn_name);
        let client = reqwest::blocking::Client::builder()
            .timeout(self.timeout)
            .build()?;
        client.post(&url).json(&input).send()?.json()
    }

    pub fn record(&self, slug: &str, req: RecordRequest) -> reqwest::Result<RecordResponse> {
        let url = format!("{}/api/v1/{}/record", self.base_url, slug);
        let client = reqwest::blocking::Client::builder()
            .timeout(self.timeout)
            .build()?;
        client.post(&url).json(&req).send()?.json()
    }

    pub fn diagnostics(&self) -> reqwest::Result<Diagnostics> {
        let url = format!("{}/api/v1/pcc-diagnostics/diagnostics", self.base_url);
        let client = reqwest::blocking::Client::builder()
            .timeout(self.timeout)
            .build()?;
        client.get(&url).send()?.json()
    }
}

impl Default for Client {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Health {
    pub status: String,
    pub version: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Catalog {
    pub version: String,
    pub count: u32,
    pub modules: Vec<String>,
    pub categories: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Module {
    pub module: String,
    pub url_slug: String,
    pub version: String,
    pub function_count: u32,
    pub functions: Vec<String>,
    pub api_base: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResponse {
    pub query: String,
    pub tokens: Vec<String>,
    pub count: u32,
    pub results: Vec<SearchResult>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResult {
    pub slug: String,
    pub score: u32,
    pub module: String,
    pub version: String,
    pub function_count: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CallResult {
    pub version: String,
    pub module: String,
    pub function: String,
    pub input: serde_json::Value,
    pub score: Option<f64>,
    pub ts: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecordRequest {
    #[serde(rename = "tenant_id", skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,
    #[serde(rename = "decisionId", skip_serializing_if = "Option::is_none")]
    pub decision_id: Option<String>,
    pub fn_name: String,
    pub input: serde_json::Value,
    #[serde(rename = "created_by", skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecordResponse {
    pub version: String,
    pub module: String,
    pub function: String,
    #[serde(rename = "tenant_id")]
    pub tenant_id: Option<String>,
    pub recorded: bool,
    pub ts: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Diagnostics {
    pub status: String,
    pub uptime_ms: u64,
    pub uptime_seconds: u64,
    pub process: ProcessInfo,
    pub catalog: CatalogStats,
    pub search: SearchStats,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessInfo {
    pub pid: u32,
    pub version: String,
    pub platform: String,
    pub arch: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CatalogStats {
    pub version: String,
    pub modules: u32,
    pub categories: u32,
    pub total_functions: u32,
    pub avg_functions_per_module: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchStats {
    pub unique_tokens: u32,
    pub indexed_functions: u32,
}

fn urlencoding(s: &str) -> String {
    s.chars().map(|c| {
        if c.is_alphanumeric() || c == '-' || c == '_' || c == '.' || c == '~' {
            c.to_string()
        } else {
            format!("%{:02X}", c as u32)
        }
    }).collect()
}
