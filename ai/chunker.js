// filepath: namaweb/ai/chunker.js
// Document chunker — splits source documents into embeddable chunks
// Pattern: nm-rag-template
'use strict';

const SPLITTERS = {
    pdf:   (text) => text.split(/\n\n+/).filter(p => p.trim().length > 50).slice(0, 200),
    md:    (text) => text.split(/^##\s+/m).filter(s => s.trim().length > 50).slice(0, 200),
    cds:   (text) => text.split(/(?=\n\d+\.\s)/).filter(s => s.trim().length > 30).slice(0, 200),
    icd10: (text) => text.split(/\n/).filter(l => /^[A-Z]\d{2}/.test(l)).slice(0, 500),
    drug:  (text) => text.split(/\n(?=[A-Z][a-z]+:)/).filter(s => s.trim().length > 50).slice(0, 200),
    lab:   (text) => text.split(/\n(?=Test:)/).filter(s => s.trim().length > 50).slice(0, 200)
};

function chunkDocument(doc) {
    const splitter = SPLITTERS[doc.kind] || SPLITTERS.md;
    return splitter(doc.content).map((text, idx) => ({
        doc_id: doc.id,
        doc_kind: doc.kind,
        chunk_idx: idx,
        text: text.trim(),
        metadata: { ...doc.metadata, chunk_idx: idx }
    }));
}

module.exports = { chunkDocument, SPLITTERS };