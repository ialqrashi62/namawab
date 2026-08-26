// lib/embeddings.js — pluggable embedder with offline fallback
// If OPENAI_API_KEY set → real embeddings (text-embedding-3-small, 1536d).
// Else → deterministic hashed bag-of-words vector (256d) — lexical cosine,
// good enough for SOP/keyword retrieval; swap provider later without API change.
'use strict';

const DIM_FALLBACK = 1536; // matches text-embedding-3-small & f015 schema

function hashToken(tok) {
  let h = 2166136261;
  for (let i = 0; i < tok.length; i++) { h ^= tok.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function fallbackEmbed(text) {
  const v = new Array(DIM_FALLBACK).fill(0);
  const toks = String(text).toLowerCase().normalize('NFKD').split(/[^a-z0-9\u0600-\u06FF]+/).filter(t => t.length > 1);
  for (const t of toks) v[hashToken(t) % DIM_FALLBACK] += 1;
  const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  return v.map(x => +(x / norm).toFixed(6));
}

async function openaiEmbed(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }),
  });
  if (!res.ok) throw new Error(`embeddings api ${res.status}`);
  const j = await res.json();
  return j.data[0].embedding;
}

async function embed(text) {
  if (process.env.OPENAI_API_KEY) {
    try { return { vec: await openaiEmbed(text), provider: 'openai' }; }
    catch (_) { /* fall through to offline */ }
  }
  return { vec: fallbackEmbed(text), provider: 'fallback256' };
}

function cosine(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function chunkText(text, size = 1100, overlap = 150) {
  const clean = String(text).replace(/\r/g, '');
  const chunks = [];
  let i = 0;
  while (i < clean.length) {
    chunks.push(clean.slice(i, i + size));
    if (i + size >= clean.length) break;
    i += size - overlap;
  }
  return chunks.filter(c => c.trim().length > 20);
}

module.exports = { embed, cosine, chunkText, fallbackEmbed, DIM_FALLBACK };
