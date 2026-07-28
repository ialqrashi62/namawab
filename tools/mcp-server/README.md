# MCP Server — Stitch Integration

## Purpose
Read-only access to Stitch design tokens and UI components for NamaMedical.

## Security
- API key is read from `STITCH_MCP_API_KEY` env var.
- No secrets in tracked files.
- No PHI access.
- No production commands.

## Setup
1. Copy `mcp-config.template.json` to your local VS Code MCP settings.
2. Set `STITCH_MCP_API_KEY` in your env.
3. Restart VS Code.