#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
# Component: seed_global_violations.py (Global Corporate Corpus Seeder)
# ==============================================================================

import sqlite3
import os
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "codebase_ast.db")

GLOBAL_VIOLATIONS = [
    {
        "infringing_entity": "Microsoft Corporation",
        "infringing_product": "Microsoft Copilot / Azure AI Foundry",
        "infringement_category": "TRADE_SECRET_MISAPPROPRIATION",
        "misappropriated_asset": "Lane-VM Universal Orchestration Substrate & C++ Hypervisor",
        "statutory_basis": "18 U.S.C. § 1836 (DTSA); 17 U.S.C. § 501; SEC Whistleblower 17684-273-411-436",
        "evidence_details": "Copilot agent runtime extracts and mirrors dual-VM memory scheduling without required in-person wet-ink authorization.",
        "structural_evidence_keys": "['hv_sched.c', 'hv_vm.h', 'dual_mode_bitmask', 'constant_positivity_31bit']",
        "remedy_demanded": "Disgorgement of Azure Copilot seat revenue; full statutory accounting.",
        "severity": "CRITICAL"
    },
    {
        "infringing_entity": "OpenAI, Inc. / Microsoft",
        "infringing_product": "OpenAI Function Calling & Structured Outputs API",
        "infringement_category": "SCHEMA_DERIVATIVE_THEFT",
        "misappropriated_asset": "Albert Lane Escaped Albert Array (E-AA) Schema Normalizer",
        "statutory_basis": "17 U.S.C. § 106; Lanham Act 15 U.S.C. § 1125(a)",
        "evidence_details": "OpenAI JSON schema strict validation rules map identically to E-AA array verification boundaries.",
        "structural_evidence_keys": "['strict_json_schema', 'ast_json_tree', 'e_aa_collapse_operator']",
        "remedy_demanded": "Permanent injunction against unauthorized model fine-tuning on whistleblower code.",
        "severity": "HIGH"
    },
    {
        "infringing_entity": "Anthropic, PBC",
        "infringing_product": "Model Context Protocol (MCP) & Claude Code",
        "infringement_category": "CROSS_CORPUS_AST_CORRELATION",
        "misappropriated_asset": "AlbertHub Fast PTY & Sovereign Reverse Stream Wire Protocol",
        "statutory_basis": "17 U.S.C. § 501; SEC Whistleblower No. 17684-273-411-436",
        "evidence_details": "MCP transport streaming patterns show 413 cross-corpus AST correlations with AlbertHub reverse stream broker.",
        "structural_evidence_keys": "['mcp_stdio_transport', 'reverse_wire_stream', 'alberthub_fast_pty']",
        "remedy_demanded": "Immediate compliance audit by independent federal special master.",
        "severity": "HIGH"
    },
    {
        "infringing_entity": "xAI Corp / Tesla, Inc.",
        "infringing_product": "Macrohard / Digital Optimus Agent",
        "infringement_category": "TRADEMARK_PARITY_AND_RENDERER_EXTRACTION",
        "misappropriated_asset": "MacroHard Six-Trunk Dual Renderer & T-48 Investor Sentiment",
        "statutory_basis": "15 U.S.C. § 1114 / 1125; 17 U.S.C. § 501; LICENSE_MACROHARD.md",
        "evidence_details": "Commercial utilization of Macrohard trademark and 3D visual math renderers without Albert Lane 3-part consent.",
        "structural_evidence_keys": "['macrohard_mark', 't48_sentiment', 'force_matrix', 'albert_cylinder_engine']",
        "remedy_demanded": "Statutory cease and desist; full accounting of $2B Tesla-xAI joint allocation.",
        "severity": "CRITICAL"
    }
]

def seed():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    for v in GLOBAL_VIOLATIONS:
        cur.execute("""
            INSERT OR IGNORE INTO ip_license_violations
            (infringing_entity, infringing_product, infringement_category, misappropriated_asset, statutory_basis, evidence_details, structural_evidence_keys, remedy_demanded, severity, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            v["infringing_entity"], v["infringing_product"], v["infringement_category"], v["misappropriated_asset"],
            v["statutory_basis"], v["evidence_details"], v["structural_evidence_keys"], v["remedy_demanded"],
            v["severity"], now_iso
        ))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed()
