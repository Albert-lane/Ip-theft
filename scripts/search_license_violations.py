#!/usr/bin/env python3
"""
==============================================================================
ALBERT LANE PROPRIETARY SOFTWARE LICENSE AUDIT UTILITY
Script: search_license_violations.py
Governing Reference: License_Live.md (Section 10.01) & LICENSE.md (Article 10)
Filing Reference: SEC Whistleblower No. 17684-273-411-436
==============================================================================
Section 10.01 Review (Unilateral Modification Right):
  "Rights Holder may modify, update, patch, deprecate, restrict, or withdraw
   Covered Works at any time in versions Rights Holder controls and distributes
   directly."
Article 10 Review (Cryptographic Evidence & Attestation Standards):
  "All claims of licensing compliance or alleged infringement must be supported
   by verifiable cryptographic artifacts: SHA-256 canonical digest computed over
   normalized AST representations; digital signature via sovereign keypair."
==============================================================================
"""

import os
import sys
import json
import sqlite3
import argparse
from typing import List, Dict, Any, Optional

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "codebase_ast.db")

def search_violations(
    db_path: str = DEFAULT_DB_PATH,
    entity: Optional[str] = None,
    article: Optional[str] = None,
    severity: Optional[str] = None,
    min_similarity: float = 0.0,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Queries the local SQLite database for recorded license violations.
    """
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database not found at: {db_path}")

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    query = """
        SELECT 
            id,
            infringing_entity,
            infringement_category,
            infringing_artifact_or_path,
            misappropriated_asset,
            violated_license_article,
            article_title,
            structural_similarity_score,
            structural_evidence_keys,
            cryptographic_evidence_sha256,
            severity_level,
            remedy_enforcement_status,
            statutory_authority,
            detected_at
        FROM ip_license_violations
        WHERE structural_similarity_score >= ?
    """
    params: List[Any] = [min_similarity]

    if entity:
        query += " AND infringing_entity LIKE ?"
        params.append(f"%{entity}%")

    if article:
        query += " AND (violated_license_article LIKE ? OR article_title LIKE ?)"
        params.append(f"%{article}%")
        params.append(f"%{article}%")

    if severity:
        query += " AND severity_level = ?"
        params.append(severity.upper())

    query += " ORDER BY structural_similarity_score DESC, id ASC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()

    return results

def get_violations_summary(db_path: str = DEFAULT_DB_PATH) -> Dict[str, Any]:
    """
    Computes summary metrics across all recorded violation records in the database.
    """
    if not os.path.exists(db_path):
        return {"error": "Database not found"}

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM ip_license_violations")
    total_violations = cursor.fetchone()[0]

    cursor.execute("SELECT severity_level, COUNT(*) FROM ip_license_violations GROUP BY severity_level")
    by_severity = dict(cursor.fetchall())

    cursor.execute("SELECT violated_license_article, COUNT(*) FROM ip_license_violations GROUP BY violated_license_article")
    by_article = dict(cursor.fetchall())

    cursor.execute("SELECT COUNT(DISTINCT infringing_entity) FROM ip_license_violations")
    unique_entities = cursor.fetchone()[0]

    conn.close()

    return {
        "total_records": total_violations,
        "unique_entities_count": unique_entities,
        "by_severity": by_severity,
        "by_article": by_article,
        "reference": "License_Live.md Section 10.01 / LICENSE.md Article 10"
    }

def print_text_table(records: List[Dict[str, Any]]) -> None:
    if not records:
        print("[-] No matching license violation records found.")
        return

    header_fmt = "{:<6} | {:<32} | {:<12} | {:<8} | {:<16}"
    row_fmt    = "{:<6} | {:<32.32} | {:<12.12} | {:<8.2f} | {:<16.16}"

    print("-" * 84)
    print(header_fmt.format("ID", "INFRINGING ENTITY", "ARTICLE", "SIMILAR", "SEVERITY"))
    print("-" * 84)

    for r in records:
        print(row_fmt.format(
            r["id"],
            r["infringing_entity"],
            r["violated_license_article"],
            float(r["structural_similarity_score"] or 0.0),
            r["severity_level"]
        ))
    print("-" * 84)
    print(f"Total records displayed: {len(records)}")

def main():
    parser = argparse.ArgumentParser(
        description="Search codebase_ast.db for recorded license violations per License Section 10.01 / Article 10"
    )
    parser.add_argument("--db", default=DEFAULT_DB_PATH, help="Path to codebase_ast.db")
    parser.add_argument("--entity", help="Filter by infringing entity name (fuzzy match)")
    parser.add_argument("--article", help="Filter by violated article (e.g. ARTICLE_4, ARTICLE_5)")
    parser.add_argument("--severity", help="Filter by severity level (e.g. CRITICAL, HIGH)")
    parser.add_argument("--min-similarity", type=float, default=0.0, help="Minimum structural similarity score (0.0 to 1.0)")
    parser.add_argument("--limit", type=int, default=25, help="Maximum number of rows to return")
    parser.add_argument("--summary", action="store_true", help="Print summary aggregation metrics")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = parser.parse_args()

    if args.summary:
        summary = get_violations_summary(args.db)
        if args.json:
            print(json.dumps(summary, indent=2))
        else:
            print("\n=== LICENSE VIOLATIONS DATABASE SUMMARY ===")
            print(f"Total Violations Recorded: {summary.get('total_records')}")
            print(f"Unique Entities Identified: {summary.get('unique_entities_count')}")
            print("\nBreakdown by Severity:")
            for k, v in summary.get("by_severity", {}).items():
                print(f"  - {k}: {v}")
            print("\nBreakdown by Violated Article:")
            for k, v in summary.get("by_article", {}).items():
                print(f"  - {k}: {v}")
            print(f"Reference: {summary.get('reference')}\n")
        return

    try:
        results = search_violations(
            db_path=args.db,
            entity=args.entity,
            article=args.article,
            severity=args.severity,
            min_similarity=args.min_similarity,
            limit=args.limit
        )

        if args.json:
            print(json.dumps(results, indent=2))
        else:
            print_text_table(results)

    except Exception as e:
        print(f"[-] Execution error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
