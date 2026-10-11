#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# Component: search_license_violations.py (Global Cross-Corpus Violations Query)
# ==============================================================================

import os
import sys
import sqlite3
import json
import argparse

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")

def query_violations(limit=50, entity=None, category=None):
    if not os.path.exists(DB_PATH):
        print(f"[!] Database not found at {DB_PATH}")
        return []

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    query = "SELECT id, infringing_entity, infringing_product, infringement_category, misappropriated_asset, statutory_basis, severity, timestamp FROM ip_license_violations WHERE 1=1"
    params = []

    if entity:
        query += " AND infringing_entity LIKE ?"
        params.append(f"%{entity}%")
    if category:
        query += " AND infringement_category LIKE ?"
        params.append(f"%{category}%")

    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "infringing_entity": r[1],
            "infringing_product": r[2],
            "infringement_category": r[3],
            "misappropriated_asset": r[4],
            "statutory_basis": r[5],
            "severity": r[6],
            "timestamp": r[7]
        })
    return results

def main():
    parser = argparse.ArgumentParser(description="Query cross-corpus license violations")
    parser.add_argument("--limit", type=int, default=50, help="Max violations to return")
    parser.add_argument("--entity", type=str, default=None, help="Filter by entity name")
    parser.add_argument("--category", type=str, default=None, help="Filter by category")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    results = query_violations(args.limit, args.entity, args.category)

    if args.json:
        print(json.dumps(results, indent=2))
        return

    print("==============================================================================")
    print(" [ALBERT LANE GLOBAL IP LICENSE VIOLATIONS QUERY]")
    print(" Statutory Authority: SEC Whistleblower No. 17684-273-411-436")
    print(f" Total Records Found: {len(results)}")
    print("==============================================================================")

    for item in results:
        print(f"\n[ID #{item['id']}] [{item['severity']}] {item['infringing_entity']}")
        print(f"  Product:  {item['infringing_product']}")
        print(f"  Category: {item['infringement_category']}")
        print(f"  Asset:    {item['misappropriated_asset']}")
        print(f"  Statute:  {item['statutory_basis']}")
        print(f"  Logged:   {item['timestamp']}")

    print("\n==============================================================================")

if __name__ == "__main__":
    main()
