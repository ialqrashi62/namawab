// tier316_seo_1497_engine.js — SEO Optimization (sitemap/robots/meta)
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function t316_e1_sitemap_generate(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.base_url, 'base');
  if (!Array.isArray(req.paths) || req.paths.length === 0) throw new ValidationError('paths[] required', 'paths');
  const urls = req.paths.map(p => `  <url><loc>${req.base_url.replace(/\/$/, '')}/${String(p).replace(/^\//, '')}</loc></url>`);
  return { content_type: 'application/xml', xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`, count: urls.length };
}

function t316_e2_robots_generate(req) {
  ensureStr(req.tenant_id, 'tid'); ensureBool(req.allow_all, 'allow');
  ensureStr(req.sitemap_url, 'sm');
  const lines = req.allow_all ? ['User-agent: *', 'Allow: /'] : ['User-agent: *', 'Disallow: /'];
  return { content_type: 'text/plain', robots: `${lines.join('\n')}\nSitemap: ${req.sitemap_url}` };
}

function t316_e3_meta_og_validate(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.title, 'ti'); ensureStr(req.description, 'de');
  const issues = [];
  if (req.title.length < 30 || req.title.length > 60) issues.push('title length should be 30-60 chars');
  if (req.description.length < 70 || req.description.length > 160) issues.push('description length should be 70-160 chars');
  if (!req.image_url) issues.push('og:image missing');
  return { valid: issues.length === 0, issues, score: Math.max(0, 100 - issues.length * 25) };
}

function t316_e4_structured_data_medical_org(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.org_name, 'on'); ensureStr(req.url, 'u');
  const jsonld = { '@context': 'https://schema.org', '@type': 'MedicalOrganization', name: req.org_name, url: req.url };
  return { content_type: 'application/ld+json', jsonld };
}

function t316_e5_lighthouse_budget_check(req) {
  ensureStr(req.tenant_id, 'tid'); ensureNum(req.perf_score, 'pf'); ensureNum(req.lcp_ms, 'lcp');
  if (req.perf_score < 0 || req.perf_score > 100) throw new ValidationError('perf 0-100', 'pf');
  return { perf_score: req.perf_score, lcp_ms: req.lcp_ms, pass: req.perf_score >= 90 && req.lcp_ms <= 2500, advice: req.perf_score < 90 ? 'code-split routes, compress images' : 'maintain budgets' };
}

function funcs() { return { t316_e1_sitemap_generate, t316_e2_robots_generate, t316_e3_meta_og_validate, t316_e4_structured_data_medical_org, t316_e5_lighthouse_budget_check }; }
module.exports = { funcs, ValidationError };
