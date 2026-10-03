#!/usr/bin/env python3
"""
==============================================================================
ALBERT LANE PROPRIETARY SOFTWARE AUDIT UTILITY
Script: aggregate_escalation_referral.py
Purpose: Aggregates recorded database violations by entity, scoring severity
         and generating an organized summary dossier for formal legal review.
Governing Reference: License_Live.md & LICENSE.md (Article 10, Article 15)
Filing Reference: SEC Whistleblower No. 17684-273-411-436
==============================================================================
"""

import os
import sys
import json
import sqlite3
import argparse
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "codebase_ast.db")

def generate_escalation_aggregates(
    db_path: str = DEFAULT_DB_PATH,
    min_count_threshold: int = 1
) -> List[Dict[str, Any]]:
    """
    Aggregates recorded violations from the database grouped by entity,
    calculating total incidents, max/avg similarity scores, and severity distribution.
    """
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found: {db_path}")

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    query = """
        SELECT 
            infringing_entity,
            COUNT(*) as total_infringements,
            AVG(structural_similarity_score) as avg_similarity,
            MAX(structural_similarity_score) as max_similarity,
            GROUP_CONCAT(DISTINCT violated_license_article) as distinct_articles,
            SUM(CASE WHEN severity_level = 'CRITICAL' THEN 1 ELSE 0 END) as critical_count,
            SUM(CASE WHEN severity_level = 'HIGH' THEN 1 ELSE 0 END) as high_count,
            SUM(CASE WHEN severity_level = 'ELEVATED' THEN 1 ELSE 0 END) as elevated_count,
            MIN(detected_at) as earliest_incident,
            MAX(detected_at) as latest_incident
        FROM ip_license_violations
        GROUP BY infringing_entity
        HAVING total_infringements >= ?
        ORDER BY total_infringements DESC, max_similarity DESC
    """

    cursor.execute(query, (min_count_threshold,))
    rows = cursor.fetchall()
    aggregates = []

    for r in rows:
        articles_list = [a.strip() for a in (r["distinct_articles"] or "").split(",") if a.strip()]
        aggregates.append({
            "entity": r["infringing_entity"],
            "total_infringements": r["total_infringements"],
            "avg_similarity_score": round(float(r["avg_similarity"] or 0.0), 4),
            "max_similarity_score": round(float(r["max_similarity"] or 0.0), 4),
            "violated_articles": articles_list,
            "severity_breakdown": {
                "critical": r["critical_count"],
                "high": r["high_count"],
                "elevated": r["elevated_count"]
            },
            "timeline": {
                "earliest_detected": r["earliest_incident"],
                "latest_detected": r["latest_incident"]
            }
        })

    conn.close()
    return aggregates

def build_escalation_dossier(
    aggregates: List[Dict[str, Any]],
    output_path: Optional[str] = None
) -> Dict[str, Any]:
    """
    Structures the aggregated data into a formal audit summary dossier.
    """
    dossier = {
        "report_title": "Aggregated License Violation Dossier for Escalation Review",
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "statutory_reference": "SEC Whistleblower No. 17684-273-411-436",
        "total_entities_analyzed": len(aggregates),
        "total_incidents_quantified": sum(a["total_infringements"] for a in aggregates),
        "entities": aggregates
    }

    if output_path:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(dossier, f, indent=2)
        print(f"[+] Dossier exported to: {output_path}")

    return dossier

def print_summary_table(aggregates: List[Dict[str, Any]], limit: int = 20) -> None:
    """
    Renders an ASCII summary table to stdout.
    """
    if not aggregates:
        print("[-] No records met the aggregation criteria.")
        return

    header_fmt = "{:<4} | {:<36} | {:<8} | {:<8} | {:<8} | {:<10}"
    row_fmt    = "{:<4} | {:<36.36} | {:<8} | {:<8.2f} | {:<8} | {:<10}"

    print("=" * 86)
    print(header_fmt.format("#", "ENTITY", "COUNT", "PEAK SIM", "CRITICAL", "STATUS"))
    print("=" * 86)

    for idx, item in enumerate(aggregates[:limit], 1):
        status = "CRITICAL_REVIEW" if item["severity_breakdown"]["critical"] > 0 else "PENDING_REVIEW"
        print(row_fmt.format(
            idx,
            item["entity"],
            item["total_infringements"],
            item["max_similarity_score"],
            item["severity_breakdown"]["critical"],
            status
        ))

    print("=" * 86)
    print(f"Showing top {min(len(aggregates), limit)} of {len(aggregates)} entities.")

def main():
    parser = argparse.ArgumentParser(
        description="Aggregate recorded violations from codebase_ast.db for an escalation referral process."
    )
    parser.add_argument("--db", default=DEFAULT_DB_PATH, help="Path to codebase_ast.db")
    parser.add_argument("--threshold", type=int, default=1, help="Minimum violation count per entity to include")
    parser.add_argument("--limit", type=int, default=25, help="Number of rows to display in table output")
    parser.add_argument("--export-json", help="File path to save the complete dossier JSON")
    parser.add_argument("--json", action="store_true", help="Print entire dossier JSON directly to stdout")

    args = parser.parse_args()

    try:
        aggregates = generate_escalation_aggregates(args.db, args.threshold)

        if args.export_json:
            build_escalation_dossier(aggregates, args.export_json)

        if args.json:
            dossier = build_escalation_dossier(aggregates)
            print(json.dumps(dossier, indent=2))
        elif not args.export_json:
            print(f"\n[*] SEC Whistleblower Ref: 17684-273-411-436 — Escalation Summary Dossier")
            print_summary_table(aggregates, args.limit)
            print()

    except Exception as e:
        print(f"[-] Execution error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
