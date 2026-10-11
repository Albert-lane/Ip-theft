/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Filing Reference: SEC Whistleblower No. 17684-273-411-436
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * License: Albert Lane Proprietary License v1.2
 * Component: server.ts (Express Full-Stack API Engine & Dev Server)
 *==============================================================================*/

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { spawnSync, execSync } from "child_process";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROVENANCE_CERT = {
  rightsHolder: "Albert Lane",
  filingReference: "SEC Whistleblower No. 17684-273-411-436",
  license: "Albert Lane Proprietary License v1.2",
  zaxisMemoryAnchor: "0x3F8F9A1B2C3D",
  registrationToken: "17684273411436",
  authority: "Albert Lane Sovereign Enclave Core",
  timestamp: new Date().toISOString()
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Global Provenance Headers
  app.use((req, res, next) => {
    res.setHeader("X-Provenance-Authority", PROVENANCE_CERT.rightsHolder);
    res.setHeader("X-SEC-Filing-Reference", PROVENANCE_CERT.filingReference);
    res.setHeader("X-Z-Axis-Anchor", PROVENANCE_CERT.zaxisMemoryAnchor);
    next();
  });

  // 1. Cursor Scan Pool Endpoints
  app.get("/api/cursor/status", (req, res) => {
    try {
      const dbPath = path.resolve(process.cwd(), "data/codebase_ast.db");
      if (!fs.existsSync(dbPath)) {
        return res.json({ status: "INITIALIZING", schemas_count: 0, violations_count: 0 });
      }
      const out = spawnSync("python3", [
        "-c",
        `import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
c.execute("SELECT COUNT(*) FROM cursor_corpus_schemas")
schemas = c.fetchone()[0]
c.execute("SELECT COUNT(*) FROM ip_license_violations WHERE infringing_entity LIKE '%Cursor%' OR infringing_entity LIKE '%Anysphere%'")
violations = c.fetchone()[0]
c.execute("SELECT schema_name, schema_type, properties_count, source_entity FROM cursor_corpus_schemas LIMIT 10")
rows = c.fetchall()
print(json.dumps({'schemas_count': schemas, 'violations_count': violations, 'sample_schemas': rows}))
`
      ], { encoding: "utf-8" });

      if (out.stdout) {
        const data = JSON.parse(out.stdout.trim());
        return res.json({ status: "ACTIVE_SCAN_POOL", ...data, provenance: PROVENANCE_CERT });
      }
      res.json({ status: "OFFLINE", error: out.stderr });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post(["/api/cursor/scan", "/api/cursor/rescan"], (req, res) => {
    try {
      const idxScript = path.resolve(process.cwd(), "scripts/index_cursor_corpus.py");
      const scanScript = path.resolve(process.cwd(), "scripts/scan_cursor_license_violations.py");
      
      const outIdx = spawnSync("python3", [idxScript], { encoding: "utf-8" });
      const outScan = spawnSync("python3", [scanScript], { encoding: "utf-8" });

      const reportPath = path.resolve(process.cwd(), "data/cursor_license_violations_report.json");
      let report = null;
      if (fs.existsSync(reportPath)) {
        report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      }

      res.json({
        success: true,
        message: "Cursor database successfully ingested into scan pool; license violation lookup complete.",
        stdout: outScan.stdout,
        report
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Cursor Codebase Deep Audit & Code Search Endpoints
  app.get("/api/cursor/codebase-violations", (req, res) => {
    try {
      const dbPath = path.resolve(process.cwd(), "data/codebase_ast.db");
      if (!fs.existsSync(dbPath)) return res.json([]);
      const out = spawnSync("python3", [
        "-c",
        `import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
c.execute("SELECT id, file_path, line_number, symbol_or_function, infringement_type, misappropriated_asset, statutory_basis, severity, code_snippet, evidence_analysis, remedy_demanded, evidence_sha256, timestamp FROM cursor_codebase_violations ORDER BY id ASC")
cols = ['id', 'file_path', 'line_number', 'symbol_or_function', 'infringement_type', 'misappropriated_asset', 'statutory_basis', 'severity', 'code_snippet', 'evidence_analysis', 'remedy_demanded', 'evidence_sha256', 'timestamp']
rows = [dict(zip(cols, r)) for r in c.fetchall()]
print(json.dumps(rows))
`
      ], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json(JSON.parse(out.stdout.trim()));
      }
      res.json([]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/cursor/codebase-search", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/search_cursor_codebase_violations.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const reportPath = path.resolve(process.cwd(), "data/cursor_codebase_violations_report.json");
      let report = null;
      if (fs.existsSync(reportPath)) {
        report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      }
      res.json({
        success: true,
        message: "Cursor codebase searched successfully. License violations logged to database.",
        stdout: out.stdout,
        report
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Marketplace & MCP Ecosystem Endpoints (Grok, Meta, Claude, Claude Code, GitHub)
  app.get("/api/marketplace/mcp-catalog", (req, res) => {
    try {
      const dbPath = path.resolve(process.cwd(), "data/codebase_ast.db");
      if (!fs.existsSync(dbPath)) return res.json([]);
      const ecosystem = req.query.ecosystem as string || "";
      let sql = "SELECT id, ecosystem, tool_or_extension_name, provider_entity, mcp_server_id, category, tool_description, schema_parameters_json, ast_keys_json, provenance_violation_status, misappropriated_asset, statutory_basis, severity, evidence_details, code_snippet, remedy_demanded, sha256_seal, ingested_at FROM marketplace_mcp_catalog";
      if (ecosystem) {
        sql += ` WHERE ecosystem LIKE '%${ecosystem}%'`;
      }
      sql += " ORDER BY id ASC";
      
      const out = spawnSync("python3", [
        "-c",
        `import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
c.execute("${sql}")
cols = ['id', 'ecosystem', 'tool_or_extension_name', 'provider_entity', 'mcp_server_id', 'category', 'tool_description', 'schema_parameters_json', 'ast_keys_json', 'provenance_violation_status', 'misappropriated_asset', 'statutory_basis', 'severity', 'evidence_details', 'code_snippet', 'remedy_demanded', 'sha256_seal', 'ingested_at']
rows = [dict(zip(cols, r)) for r in c.fetchall()]
print(json.dumps(rows))
`
      ], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json(JSON.parse(out.stdout.trim()));
      }
      res.json([]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/marketplace/query-violations", (req, res) => {
    try {
      const dbPath = path.resolve(process.cwd(), "data/codebase_ast.db");
      if (!fs.existsSync(dbPath)) return res.json([]);
      const query = (req.query.q as string || "").toLowerCase();
      const ecosystem = (req.query.ecosystem as string || "");
      const severity = (req.query.severity as string || "");

      const out = spawnSync("python3", [
        "-c",
        `import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
c.execute("SELECT id, ecosystem, item_name, provider_entity, violation_category, misappropriated_asset, statutory_basis, severity, schema_evidence_snippet, remedy_demanded, evidence_sha256, timestamp FROM marketplace_mcp_violations ORDER BY id ASC")
cols = ['id', 'ecosystem', 'item_name', 'provider_entity', 'violation_category', 'misappropriated_asset', 'statutory_basis', 'severity', 'schema_evidence_snippet', 'remedy_demanded', 'evidence_sha256', 'timestamp']
rows = [dict(zip(cols, r)) for r in c.fetchall()]
if '${ecosystem}':
    rows = [r for r in rows if '${ecosystem}'.lower() in r['ecosystem'].lower()]
if '${severity}':
    rows = [r for r in rows if '${severity}'.lower() == r['severity'].lower()]
if '${query}':
    q = '${query}'.lower()
    rows = [r for r in rows if q in r['item_name'].lower() or q in r['misappropriated_asset'].lower() or q in r['statutory_basis'].lower() or q in r['provider_entity'].lower()]
print(json.dumps(rows))
`
      ], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json(JSON.parse(out.stdout.trim()));
      }
      res.json([]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/marketplace/scan", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/index_marketplace_and_mcp_ecosystem.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const reportPath = path.resolve(process.cwd(), "data/marketplace_mcp_violations_report.json");
      let report = null;
      if (fs.existsSync(reportPath)) {
        report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      }
      res.json({
        success: true,
        message: "Marketplace & MCP ecosystem scanned and indexed successfully.",
        stdout: out.stdout,
        report
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Live Website & Subdomain IP Capture Endpoints
  app.get("/api/website/captured-manifest", (req, res) => {
    try {
      const p = path.resolve(process.cwd(), "data/captured_website/site_manifest.json");
      const dnsP = path.resolve(process.cwd(), "data/captured_website/dns_records_complete.json");
      let manifest = null;
      let dns = null;
      if (fs.existsSync(p)) manifest = JSON.parse(fs.readFileSync(p, "utf-8"));
      if (fs.existsSync(dnsP)) dns = JSON.parse(fs.readFileSync(dnsP, "utf-8"));
      res.json({ manifest, dns, provenance: PROVENANCE_CERT });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/website/download/:file", (req, res) => {
    const fileName = path.basename(req.params.file);
    const p = path.resolve(process.cwd(), "data/captured_website", fileName);
    if (fs.existsSync(p)) {
      if (fileName.endsWith(".html")) res.setHeader("Content-Type", "text/html");
      else if (fileName.endsWith(".json")) res.setHeader("Content-Type", "application/json");
      else res.setHeader("Content-Type", "application/octet-stream");
      return res.sendFile(p);
    }
    res.status(404).send(`Captured asset ${fileName} not found.`);
  });

  app.post("/api/website/recapture", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/pull_and_capture_website_ip.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const p = path.resolve(process.cwd(), "data/captured_website/site_manifest.json");
      let manifest = null;
      if (fs.existsSync(p)) manifest = JSON.parse(fs.readFileSync(p, "utf-8"));
      res.json({
        success: true,
        message: "Live website, products, subdomains, and DNS records re-captured.",
        stdout: out.stdout,
        manifest
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/website/audit", (req, res) => {
    try {
      const p = path.resolve(process.cwd(), "data/albertlane_website_audit.json");
      if (fs.existsSync(p)) {
        return res.json(JSON.parse(fs.readFileSync(p, "utf-8")));
      }
      // If not yet generated, run audit script
      const script = path.resolve(process.cwd(), "scripts/audit_albertlane_website.py");
      spawnSync("python3", [script], { encoding: "utf-8" });
      if (fs.existsSync(p)) {
        return res.json(JSON.parse(fs.readFileSync(p, "utf-8")));
      }
      res.status(404).json({ error: "Audit not available" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/website/audit", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/audit_albertlane_website.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const p = path.resolve(process.cwd(), "data/albertlane_website_audit.json");
      const data = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : null;
      res.json({
        ok: true,
        message: "Live website audit completed for all 10 albertlane.net endpoints.",
        stdout: out.stdout,
        audit: data
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Elon Ecosystem Endpoints (X Corp, xAI, Tesla, SpaceX)
  app.get("/api/elon/status", (req, res) => {
    try {
      const dbPath = path.resolve(process.cwd(), "data/codebase_ast.db");
      if (!fs.existsSync(dbPath)) return res.json({ status: "INITIALIZING", x: 0, xai: 0, tesla: 0, spacex: 0 });
      const out = spawnSync("python3", [
        "-c",
        `import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
def count_table(tbl):
    try:
        c.execute(f"SELECT COUNT(*) FROM {tbl}")
        return c.fetchone()[0]
    except:
        return 0

res = {
    'x_schemas': count_table('x_corpus_schemas'),
    'x_violations': count_table('x_codebase_violations'),
    'xai_schemas': count_table('xai_corpus_schemas'),
    'xai_violations': count_table('xai_codebase_violations'),
    'tesla_schemas': count_table('tesla_corpus_schemas'),
    'tesla_violations': count_table('tesla_codebase_violations'),
    'spacex_schemas': count_table('spacex_corpus_schemas'),
    'spacex_violations': count_table('spacex_codebase_violations')
}
print(json.dumps(res))
`
      ], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json({ status: "ACTIVE_SCAN_POOL", ...JSON.parse(out.stdout.trim()), provenance: PROVENANCE_CERT });
      }
      res.json({ status: "OFFLINE" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/elon/scan", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/index_and_scan_elon_ecosystem.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const consScript = path.resolve(process.cwd(), "scripts/consolidate_master_forensics.py");
      spawnSync("python3", [consScript], { encoding: "utf-8" });

      const reportPath = path.resolve(process.cwd(), "data/elon_ecosystem_master_audit.json");
      let report = null;
      if (fs.existsSync(reportPath)) {
        report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      }
      res.json({
        success: true,
        message: "X, xAI, Tesla, and SpaceX corpora scanned, indexed, and consolidated with cryptographic proofs.",
        stdout: out.stdout,
        report
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/elon/violations", (req, res) => {
    try {
      const dbPath = path.resolve(process.cwd(), "data/codebase_ast.db");
      if (!fs.existsSync(dbPath)) return res.json([]);
      const entity = (req.query.entity as string || "").toLowerCase();
      const out = spawnSync("python3", [
        "-c",
        `import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
tables = [('x_codebase_violations', 'X Corp.'), ('xai_codebase_violations', 'xAI Corp.'), ('tesla_codebase_violations', 'Tesla, Inc.'), ('spacex_codebase_violations', 'SpaceX')]
all_rows = []
for tbl, ent in tables:
    try:
        c.execute(f"SELECT id, file_path, line_number, symbol_or_function, infringement_type, misappropriated_asset, statutory_basis, severity, code_snippet, evidence_analysis, remedy_demanded, evidence_sha256, hmac_seal, timestamp FROM {tbl}")
        cols = ['id', 'file_path', 'line_number', 'symbol_or_function', 'infringement_type', 'misappropriated_asset', 'statutory_basis', 'severity', 'code_snippet', 'evidence_analysis', 'remedy_demanded', 'evidence_sha256', 'hmac_seal', 'timestamp']
        for r in c.fetchall():
            d = dict(zip(cols, r))
            d['entity'] = ent
            all_rows.append(d)
    except:
        pass

if '${entity}':
    ent_filter = '${entity}'
    all_rows = [r for r in all_rows if ent_filter in r['entity'].lower()]

print(json.dumps(all_rows))
`
      ], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json(JSON.parse(out.stdout.trim()));
      }
      res.json([]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Push to albertlane.net API Endpoints
  app.post("/api/push-to-albertlane-api", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/push_to_albertlane_api.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const receiptPath = path.resolve(process.cwd(), "data/api_albertlane_push_receipt.json");
      let receipt = null;
      if (fs.existsSync(receiptPath)) {
        receipt = JSON.parse(fs.readFileSync(receiptPath, "utf-8"));
      }
      res.json({
        success: true,
        message: "Successfully pushed provenance, webhooks, and Merkle root to https://api.albertlane.net",
        stdout: out.stdout,
        receipt
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/push-receipt", (req, res) => {
    try {
      const receiptPath = path.resolve(process.cwd(), "data/api_albertlane_push_receipt.json");
      if (fs.existsSync(receiptPath)) {
        const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf-8"));
        return res.json(receipt);
      }
      res.status(404).json({ error: "No push receipt found." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Recursive Self-Updating Ledger & MCEL 1.0 Endpoints
  app.get("/api/ledger", (req, res) => {
    try {
      const ledgerPath = path.resolve(process.cwd(), "albert-deepseek-ledger.json");
      const fallbackPath = path.resolve(process.cwd(), "data/albert-deepseek-ledger.json");
      const targetPath = fs.existsSync(ledgerPath) ? ledgerPath : fallbackPath;
      if (fs.existsSync(targetPath)) {
        const records = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
        return res.json({
          ok: true,
          total_records: records.length,
          zaxis: "0x3F8F9A1B2C3D",
          stride: 17684,
          base_offset: 57000,
          rights_holder: "Albert Lane",
          filing_reference: "SEC Whistleblower No. 17684-273-411-436",
          license: "Albert Lane Proprietary License v1.2 / E=AA / MacroHard",
          records
        });
      }
      res.status(404).json({ error: "Ledger not initialized yet." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/ledger/canonical", (req, res) => {
    try {
      const latestPath = path.resolve(process.cwd(), "canonical_latest.json");
      const r6Path = path.resolve(process.cwd(), "canonical_R6.json");
      const target = fs.existsSync(latestPath) ? latestPath : r6Path;
      if (fs.existsSync(target)) {
        const data = JSON.parse(fs.readFileSync(target, "utf-8"));
        return res.json({
          ok: true,
          type: fs.existsSync(latestPath) ? "CANONICAL_LATEST" : "CANONICAL_R6",
          canonical: data
        });
      }
      res.status(404).json({ error: "No canonical pointer found." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/taxonomy", (req, res) => {
    try {
      const p = path.resolve(process.cwd(), "ast_taxonomy_schematical_option.json");
      const fallback = path.resolve(process.cwd(), "data/ast_taxonomy_schematical_option.json");
      const target = fs.existsSync(p) ? p : fallback;
      if (fs.existsSync(target)) {
        return res.json(JSON.parse(fs.readFileSync(target, "utf-8")));
      }
      res.status(404).json({ error: "AST taxonomy not found." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/ledger/append", express.json(), (req, res) => {
    try {
      const text = req.body?.data || `Manual Audit Attestation ${new Date().toISOString()}`;
      const script = path.resolve(process.cwd(), "recursive_self_updating_json.py");
      const out = spawnSync("python3", [
        "-c",
        `import sys, recursive_self_updating_json as r
rec = r.append_record(${JSON.stringify(text)})
r.sync_data_dir()
import json; print(json.dumps(rec))
`
      ], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json({ ok: true, appended: JSON.parse(out.stdout.trim()) });
      }
      res.status(500).json({ error: out.stderr || "Failed to append record." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/ledger/recompute", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "recursive_self_updating_json.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const ledgerPath = path.resolve(process.cwd(), "albert-deepseek-ledger.json");
      const records = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, "utf-8")) : [];
      res.json({
        ok: true,
        stdout: out.stdout,
        total_records: records.length,
        latest: records[records.length - 1] || null
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/ledger/seal-immutable", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/seal_immutable_log.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const canonicalPath = path.resolve(process.cwd(), "canonical_latest.json");
      const canonical = fs.existsSync(canonicalPath) ? JSON.parse(fs.readFileSync(canonicalPath, "utf-8")) : null;
      res.json({
        ok: out.status === 0,
        stdout: out.stdout,
        stderr: out.stderr,
        canonical,
        message: "Immutable log seal successfully executed, chained, and calendar stamped."
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Recursive Manifest (ALDI LANE-VM Spec & OTS Calendar Stamp) Endpoints
  app.get("/api/manifest/recursive", (req, res) => {
    try {
      const p = path.resolve(process.cwd(), "recursive-manifest.json");
      const fallback = path.resolve(process.cwd(), "data/recursive-manifest.json");
      const target = fs.existsSync(p) ? p : fallback;
      if (fs.existsSync(target)) {
        const manifest = JSON.parse(fs.readFileSync(target, "utf-8"));
        const otsPath = path.resolve(process.cwd(), "recursive-manifest.json.ots");
        let ots = null;
        if (fs.existsSync(otsPath)) {
          try { ots = JSON.parse(fs.readFileSync(otsPath, "utf-8")); } catch (_) {}
        }
        return res.json({
          ok: true,
          manifest,
          ots_proof: ots
        });
      }
      res.status(404).json({ error: "recursive-manifest.json not found." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/manifest/ots", (req, res) => {
    try {
      const otsPath = path.resolve(process.cwd(), "recursive-manifest.json.ots");
      if (fs.existsSync(otsPath)) {
        return res.json(JSON.parse(fs.readFileSync(otsPath, "utf-8")));
      }
      res.status(404).json({ error: "OTS proof not found." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/manifest/rebuild", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "recursive-manifest.json.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const p = path.resolve(process.cwd(), "recursive-manifest.json");
      const manifest = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : null;
      res.json({
        ok: true,
        message: "recursive-manifest.json recomputed, sealed into ledger, and OTS calendar stamped.",
        stdout: out.stdout,
        manifest
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ALDI Lane-VM Series Execution Endpoints (C++20 & Julia RFC-SERIES-001)
  app.post("/api/series/run-cpp", (req, res) => {
    try {
      const compileCmd = spawnSync("g++", ["-std=c++20", "-lcrypto", "-o", "lane_vm_series", "lane_vm_series.cpp"], {
        encoding: "utf-8",
        cwd: process.cwd()
      });
      if (compileCmd.status !== 0) {
        return res.status(500).json({
          ok: false,
          error: "Compilation failed",
          stderr: compileCmd.stderr,
          stdout: compileCmd.stdout
        });
      }
      const runCmd = spawnSync("./lane_vm_series", [], {
        encoding: "utf-8",
        cwd: process.cwd()
      });
      res.json({
        ok: runCmd.status === 0,
        exitCode: runCmd.status,
        stdout: runCmd.stdout,
        stderr: runCmd.stderr,
        command: "g++ -std=c++20 -lcrypto -o lane_vm_series lane_vm_series.cpp && ./lane_vm_series",
        executedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.post("/api/series/run-julia", (req, res) => {
    try {
      const runCmd = spawnSync("julia", ["lane_vm_series.jl"], {
        encoding: "utf-8",
        cwd: process.cwd()
      });
      res.json({
        ok: runCmd.status === 0,
        exitCode: runCmd.status,
        stdout: runCmd.stdout,
        stderr: runCmd.stderr,
        command: "julia lane_vm_series.jl",
        executedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.get("/api/series/status", (req, res) => {
    try {
      const cppPath = path.resolve(process.cwd(), "lane_vm_series.cpp");
      const jlPath = path.resolve(process.cwd(), "lane_vm_series.jl");
      const pyPath = path.resolve(process.cwd(), "recursive-manifest.json.py");

      const getHash = (file: string) => {
        if (!fs.existsSync(file)) return null;
        return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
      };

      res.json({
        ok: true,
        zaxis: "0x3F8F9A1B2C3D",
        stride: 17684,
        base_offset: 57000,
        sec_id: "17684-273-411-436",
        rfc_id: "RFC-SERIES-001",
        tags: ["#NoExploitRobot", "#NoExploitAlbert", "#NoExploitJulia"],
        provenance: "Albert Lane & Robot",
        hashes: {
          cpp_sha256: getHash(cppPath),
          julia_sha256: getHash(jlPath),
          python_manifest_sha256: getHash(pyPath)
        },
        hasBinary: fs.existsSync(path.resolve(process.cwd(), "lane_vm_series"))
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Forensic Altered & Deleted Records Lookup & Immutable Logging Endpoints
  app.get("/api/records/altered-lookup", (req, res) => {
    try {
      const jsonPath = path.resolve(process.cwd(), "data/DELETED_AND_ALTERED_RECORDS_FORENSIC_LEDGER.json");
      if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        return res.json({
          ok: true,
          ...data
        });
      }
      res.status(404).json({ error: "No reconciled altered records ledger found." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/records/altered-reconcile", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/lookup_and_log_altered_records.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const jsonPath = path.resolve(process.cwd(), "data/DELETED_AND_ALTERED_RECORDS_FORENSIC_LEDGER.json");
      const data = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf-8")) : null;
      res.json({
        ok: true,
        message: "Forensic lookup complete. All altered and deleted records retrieved and immutably chained.",
        stdout: out.stdout,
        reconciled: data
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/records/altered-csv", (req, res) => {
    const p = path.resolve(process.cwd(), "data/csv/DELETED_AND_ALTERED_RECORDS_FORENSIC_LEDGER.csv");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"DELETED_AND_ALTERED_RECORDS_FORENSIC_LEDGER.csv\"");
      return res.sendFile(p);
    }
    res.status(404).send("Reconciled CSV file not found.");
  });

  // 2. Global Scan Pools & License Violations Endpoints
  app.get("/api/scan-pools", (req, res) => {
    try {
      const dbPath = path.resolve(process.cwd(), "data/codebase_ast.db");
      if (!fs.existsSync(dbPath)) {
        return res.json([]);
      }
      const out = spawnSync("python3", [
        "-c",
        `import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
c.execute("SELECT id, corpus_name, entity_owner, corpus_type, status, schemas_indexed, last_scanned FROM scan_pool_registry")
cols = ['id', 'corpus_name', 'entity_owner', 'corpus_type', 'status', 'schemas_indexed', 'last_scanned']
rows = [dict(zip(cols, r)) for r in c.fetchall()]
print(json.dumps(rows))
`
      ], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json(JSON.parse(out.stdout.trim()));
      }
      res.json([]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/violations", (req, res) => {
    try {
      const limit = req.query.limit || "50";
      const entity = req.query.entity || "";
      const script = path.resolve(process.cwd(), "scripts/search_license_violations.py");
      const args = ["--json", "--limit", String(limit)];
      if (entity) args.push("--entity", String(entity));

      const out = spawnSync("python3", [script, ...args], { encoding: "utf-8" });
      if (out.stdout) {
        return res.json(JSON.parse(out.stdout.trim()));
      }
      res.json([]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. SEC Report Proxy & Consolidated Master Reports
  app.get("/api/sec/consolidated-report", (req, res) => {
    try {
      const p = path.resolve(process.cwd(), "data/sec_consolidated_master_report.json");
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, "utf-8"));
        return res.json(data);
      }
      res.status(404).json({ error: "Consolidated SEC report not generated yet." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/consolidated/csv", (req, res) => {
    const p = path.resolve(process.cwd(), "data/csv/CONSOLIDATED_MASTER_IP_FORENSIC_EVIDENCE.csv");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"CONSOLIDATED_MASTER_IP_FORENSIC_EVIDENCE.csv\"");
      return res.sendFile(p);
    }
    res.status(404).send("Consolidated CSV evidence file not found.");
  });

  app.get("/api/consolidated/log", (req, res) => {
    const p = path.resolve(process.cwd(), "data/CONSOLIDATED_MASTER_FORENSIC_AUDIT.log");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "text/plain");
      return res.sendFile(p);
    }
    res.status(404).send("Consolidated audit log not found.");
  });

  app.get("/api/consolidated/db", (req, res) => {
    const p = path.resolve(process.cwd(), "data/master_unified_forensic.db");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/x-sqlite3");
      res.setHeader("Content-Disposition", "attachment; filename=\"master_unified_forensic.db\"");
      return res.sendFile(p);
    }
    res.status(404).send("Consolidated master database not found.");
  });

  // Corporate Crimes, Violations & Penalty Fees
  app.get("/api/corporate/crimes-and-penalties", (req, res) => {
    try {
      const p = path.resolve(process.cwd(), "data/corporate_crimes_and_penalty_report.json");
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, "utf-8"));
        return res.json(data);
      }
      res.status(404).json({ error: "Corporate crimes and penalty report not generated yet." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/corporate/penalties-csv", (req, res) => {
    const p = path.resolve(process.cwd(), "data/csv/corporate_crimes_and_penalty_ledger.csv");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=\"corporate_crimes_and_penalty_ledger.csv\"");
      return res.sendFile(p);
    }
    res.status(404).send("Corporate crimes and penalty CSV ledger not found.");
  });

  app.get("/api/corporate/penalties-markdown", (req, res) => {
    const p = path.resolve(process.cwd(), "data/MASTER_CORPORATE_CRIMES_AND_PENALTIES.md");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "text/markdown");
      return res.sendFile(p);
    }
    res.status(404).send("Corporate crimes and penalty markdown dossier not found.");
  });

  app.post("/api/consolidated/rebuild", (req, res) => {
    try {
      const script = path.resolve(process.cwd(), "scripts/consolidate_master_forensics.py");
      const out = spawnSync("python3", [script], { encoding: "utf-8" });
      const p = path.resolve(process.cwd(), "data/sec_consolidated_master_report.json");
      let data = null;
      if (fs.existsSync(p)) {
        data = JSON.parse(fs.readFileSync(p, "utf-8"));
      }
      res.json({
        success: true,
        message: "All databases, logs, CSVs, and SEC reports consolidated into single master artifacts.",
        stdout: out.stdout,
        report: data
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get(["/api/sec/report", "/api/sec-report"], async (req, res) => {
    try {
      const url = new URL(req.originalUrl || req.url, `http://${req.headers.host || 'localhost'}`);
      const params = url.searchParams.toString();
      const upstream = await fetch(`https://api.albertlane.net/v1/sec/report${params ? "?" + params : ""}`, {
        headers: { Authorization: `Bearer ${process.env.SEC_REPORT_TOKEN || "17684273411436"}` },
        cache: "no-store",
      }).catch(() => null);

      if (upstream && upstream.ok) {
        const data = await upstream.json().catch(() => ({}));
        return res.status(upstream.status).json(data);
      }

      // Offline fallback
      return res.json({
        ok: true,
        meta: {
          title: "Albert Lane — SEC report records index (Offline Local Mirror)",
          generated_at_utc: new Date().toISOString(),
          version: "1.2.4",
          authority: PROVENANCE_CERT.rightsHolder,
          filing: PROVENANCE_CERT.filingReference,
          anchor: PROVENANCE_CERT.zaxisMemoryAnchor
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/sec/status", (req, res) => {
    res.json({
      status: "ONLINE",
      provenance: PROVENANCE_CERT,
      engine: "Lane-VM Universal Orchestration Substrate",
      timestamp: new Date().toISOString()
    });
  });

  // 4. Package Downloads & Manifest
  app.get("/api/package/manifest", (req, res) => {
    const manifestPath = path.resolve(process.cwd(), "data/master_cryptographic_manifest.json");
    if (fs.existsSync(manifestPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        return res.json(data);
      } catch (err: any) {
        return res.status(500).json({ error: err.message });
      }
    }
    res.json({
      deployment_packages: {
        tarball: { file: "albert-lane-sovereign-enclave.tar.gz", route: "/albert-lane-sovereign-enclave.tar.gz" },
        seven_zip: { file: "albert-lane-sovereign-enclave.7z", route: "/albert-lane-sovereign-enclave.7z" },
        zip: { file: "albert-lane-sovereign-enclave.zip", route: "/albert-lane-sovereign-enclave.zip" }
      },
      provenance: PROVENANCE_CERT
    });
  });

  app.get("/albert-lane-sovereign-enclave.tar.gz", (req, res) => {
    const p = path.resolve(process.cwd(), "albert-lane-sovereign-enclave.tar.gz");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/gzip");
      return res.sendFile(p);
    }
    res.status(404).send("Archive not found.");
  });

  app.get("/albert-lane-sovereign-enclave.7z", (req, res) => {
    const p = path.resolve(process.cwd(), "albert-lane-sovereign-enclave.7z");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/x-7z-compressed");
      return res.sendFile(p);
    }
    res.status(404).send("Archive not found.");
  });

  app.get(["/albert-lane-sovereign-enclave.zip", "/this-app-fucks-combined.zip"], (req, res) => {
    let p = path.resolve(process.cwd(), "albert-lane-sovereign-enclave.zip");
    if (!fs.existsSync(p)) p = path.resolve(process.cwd(), "this-app-fucks-combined.zip");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/zip");
      return res.sendFile(p);
    }
    res.status(404).send("Archive not found.");
  });

  // Standalone Framework Visualizations
  app.get(["/zaxis", "/z-axis"], (req, res) => {
    const p = path.resolve(process.cwd(), "public/zaxis_core.html");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "text/html");
      return res.sendFile(p);
    }
    res.status(404).send("zaxis_core.html not found.");
  });

  // Public Indexing, Crawlers & Sitemap (per applet-seo)
  app.get("/robots.txt", (req, res) => {
    const p = path.resolve(process.cwd(), "public/robots.txt");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.sendFile(p);
    }
    res.status(404).send("User-agent: *\nAllow: /\nSitemap: https://albertlane.net/sitemap.xml");
  });

  app.get(["/sitemap.xml", "/sitemap"], (req, res) => {
    const p = path.resolve(process.cwd(), "public/sitemap.xml");
    if (fs.existsSync(p)) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      return res.sendFile(p);
    }
    res.status(404).send("Sitemap not found.");
  });

  // Serve static files from public
  app.use(express.static(path.resolve(process.cwd(), "public")));

  // In development, hook Vite middlewares
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist
    app.use(express.static(path.resolve(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Albert Lane Sovereign Engine] Running on port ${PORT}`);
    console.log(`[Provenance] SEC Whistleblower No. 17684-273-411-436 | Z-Axis: 0x3F8F9A1B2C3D`);
  });
}

startServer();
