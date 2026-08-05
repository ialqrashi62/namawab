// Package pcc provides a Go SDK for the NamaMedical PCC Sandbox.
// Auto-generated for PCC Catalog v3.316.0
// 1322 modules, 10035 unique functions
// Generated: 2026-07-29T05:41:27.561Z
package pcc

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

// Client is a PCC Sandbox client.
type Client struct {
	BaseURL string
	HTTP    *http.Client
	Headers map[string]string
}

// CallResult represents the result of a function call.
type CallResult struct {
	Version string                 `json:"version"`
	Module  string                 `json:"module"`
	Function string                `json:"function"`
	Input   map[string]interface{} `json:"input"`
	Score   *float64               `json:"score,omitempty"`
	TS      string                 `json:"ts"`
}

// RecordRequest represents a /record call payload.
type RecordRequest struct {
	TenantID  string                 `json:"tenant_id,omitempty"`
	DecisionID string                `json:"decisionId,omitempty"`
	Fn        string                 `json:"fn"`
	Input     map[string]interface{} `json:"input"`
	CreatedBy string                 `json:"created_by,omitempty"`
}

// RecordResponse represents the result of a /record call.
type RecordResponse struct {
	Version    string                 `json:"version"`
	Module     string                 `json:"module"`
	Function   string                 `json:"function"`
	TenantID   string                 `json:"tenant_id,omitempty"`
	DecisionID string                 `json:"decisionId,omitempty"`
	Result     CallResult             `json:"result"`
	Recorded   bool                   `json:"recorded"`
	CreatedBy  string                 `json:"created_by,omitempty"`
	TS         string                 `json:"ts"`
}

// Module represents a PCC module.
type Module struct {
	Module        string   `json:"module"`
	URLSlug       string   `json:"url_slug"`
	Version       string   `json:"version"`
	FunctionCount int      `json:"function_count"`
	Functions     []string `json:"functions"`
	APIBase       string   `json:"api_base"`
}

// New creates a new PCC client.
func New(baseURL string) *Client {
	if baseURL == "" {
		baseURL = "http://localhost:3201"
	}
	return &Client{
		BaseURL: baseURL,
		HTTP:    &http.Client{Timeout: 30 * time.Second},
		Headers: map[string]string{},
	}
}

func (c *Client) do(method, path string, body interface{}) (map[string]interface{}, error) {
	var reqBody io.Reader
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewReader(b)
	}
	req, err := http.NewRequest(method, c.BaseURL+path, reqBody)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	for k, v := range c.Headers {
		req.Header.Set(k, v)
	}
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("PCC %s %s failed: %d %s", method, path, resp.StatusCode, string(b))
	}
	var out map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return out, nil
}

// Health checks the server health.
func (c *Client) Health() (map[string]interface{}, error) {
	return c.do("GET", "/health", nil)
}

// Catalog returns all modules.
func (c *Client) Catalog() (map[string]interface{}, error) {
	return c.do("GET", "/api/v1/pcc-catalog/modules", nil)
}

// Categories returns modules grouped by category.
func (c *Client) Categories() (map[string]interface{}, error) {
	return c.do("GET", "/api/v1/pcc-catalog/categories", nil)
}

// Module returns detail for a specific module.
func (c *Client) Module(slug string) (*Module, error) {
	out, err := c.do("GET", "/api/v1/pcc-catalog/module/"+slug, nil)
	if err != nil {
		return nil, err
	}
	b, _ := json.Marshal(out)
	var m Module
	json.Unmarshal(b, &m)
	return &m, nil
}

// Search performs a full-text search.
func (c *Client) Search(query string) (map[string]interface{}, error) {
	return c.do("GET", "/api/v1/pcc-catalog/search?q="+url.QueryEscape(query), nil)
}

// Lookup finds modules exposing a function.
func (c *Client) Lookup(fn string) (map[string]interface{}, error) {
	return c.do("GET", "/api/v1/pcc-catalog/lookup/"+url.QueryEscape(fn), nil)
}

// Diagnostics returns server diagnostics.
func (c *Client) Diagnostics() (map[string]interface{}, error) {
	return c.do("GET", "/api/v1/pcc-diagnostics/diagnostics", nil)
}

// Version returns server version.
func (c *Client) Version() (map[string]interface{}, error) {
	return c.do("GET", "/api/v1/pcc-diagnostics/version", nil)
}

// ListModule lists functions of a module.
func (c *Client) ListModule(slug string) (map[string]interface{}, error) {
	return c.do("GET", "/api/v1/"+slug+"/list", nil)
}

// Call invokes a function on a module.
func (c *Client) Call(slug, fn string, input map[string]interface{}) (*CallResult, error) {
	out, err := c.do("POST", "/api/v1/"+slug+"/call/"+fn, input)
	if err != nil {
		return nil, err
	}
	b, _ := json.Marshal(out)
	var r CallResult
	json.Unmarshal(b, &r)
	return &r, nil
}

// Record invokes a function with tenant context.
func (c *Client) Record(slug string, req RecordRequest) (*RecordResponse, error) {
	out, err := c.do("POST", "/api/v1/"+slug+"/record", req)
	if err != nil {
		return nil, err
	}
	b, _ := json.Marshal(out)
	var r RecordResponse
	json.Unmarshal(b, &r)
	return &r, nil
}
