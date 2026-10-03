#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2 (Articles 3-12, 14, 15)
# Component: Endpoint License Violations & Network Traversal Query Engine
# ==============================================================================

import os
import sys
import json
import sqlite3

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(WORKSPACE, "data", "codebase_ast.db")

def query_endpoint_logs(params):
    q = params.get("query", "") or params.get("q", "")
    q = q.strip()
    entity = (params.get("entity", "") or "").strip()
    method = (params.get("method", "") or "").strip().upper()
    article = (params.get("article", "") or "").strip().upper()
    limit = min(max(int(params.get("limit", 100)), 1), 1000)
    offset = max(int(params.get("offset", 0)), 0)

    if not os.path.exists(DB_PATH):
        return {"error": "Database not found", "records": [], "summary": {}}

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Base WHERE clause
    where_clauses = []
    args = []

    if q:
        where_clauses.append("""(
            entity_name LIKE '%' || ? || '%' OR
            endpoint_path_or_uri LIKE '%' || ? || '%' OR
            traversal_method LIKE '%' || ? || '%' OR
            network_traversal LIKE '%' || ? || '%' OR
            network_lookups LIKE '%' || ? || '%' OR
            violated_license_articles LIKE '%' || ? || '%' OR
            infringement_classification LIKE '%' || ? || '%' OR
            structural_evidence_summary LIKE '%' || ? || '%'
        )""")
        args.extend([q] * 8)

    if entity:
        where_clauses.append("entity_name LIKE '%' || ? || '%'")
        args.append(entity)

    if method:
        where_clauses.append("traversal_method = ?")
        args.append(method)

    if article:
        where_clauses.append("violated_license_articles LIKE '%' || ? || '%'")
        args.append(article)

    where_str = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

    # Total matching count
    count_sql = f"SELECT count(*) FROM endpoint_license_violations_traversal_log {where_str};"
    cursor.execute(count_sql, args)
    total_matching = cursor.fetchone()[0]

    # Records query
    records_sql = f"""
    SELECT id, entity_name, endpoint_path_or_uri, traversal_method, timestamp_utc,
           network_traversal, network_lookups, violations_quantity, cumulative_violations_over_time,
           violated_license_articles, infringement_classification, structural_evidence_summary,
           cryptographic_proof_sha256, sec_statutory_authority
    FROM endpoint_license_violations_traversal_log
    {where_str}
    ORDER BY entity_name ASC, endpoint_path_or_uri ASC, timestamp_utc ASC
    LIMIT ? OFFSET ?;
    """
    cursor.execute(records_sql, args + [limit, offset])
    cols = [c[0] for c in cursor.description]
    records = [dict(zip(cols, r)) for r in cursor.fetchall()]

    # Aggregates across entire table
    total_traversals = cursor.execute("SELECT count(*) FROM endpoint_license_violations_traversal_log;").fetchone()[0]
    total_violations_quantified = cursor.execute("SELECT sum(violations_quantity) FROM endpoint_license_violations_traversal_log;").fetchone()[0] or 0
    unique_endpoints_count = cursor.execute("SELECT count(distinct endpoint_path_or_uri) FROM endpoint_license_violations_traversal_log;").fetchone()[0]

    # By entity breakdown
    cursor.execute("""
    SELECT entity_name, count(*) as traversals, count(distinct endpoint_path_or_uri) as unique_endpoints,
           sum(violations_quantity) as total_violations, max(cumulative_violations_over_time) as max_cumulative
    FROM endpoint_license_violations_traversal_log
    GROUP BY entity_name
    ORDER BY total_violations DESC;
    """)
    by_entity = [
        {
            "entity_name": r[0],
            "traversals_count": r[1],
            "unique_endpoints": r[2],
            "total_violations": r[3],
            "max_cumulative": r[4]
        }
        for r in cursor.fetchall()
    ]

    # By method breakdown
    cursor.execute("""
    SELECT traversal_method, count(*) as count, sum(violations_quantity) as total_violations
    FROM endpoint_license_violations_traversal_log
    GROUP BY traversal_method
    ORDER BY count DESC;
    """)
    by_method = [
        {
            "method": r[0],
            "count": r[1],
            "total_violations": r[2]
        }
        for r in cursor.fetchall()
    ]

    # Timeline progression breakdown
    cursor.execute("""
    SELECT substr(timestamp_utc, 1, 10) as date_day, count(*) as traversals, sum(violations_quantity) as violations_logged
    FROM endpoint_license_violations_traversal_log
    GROUP BY date_day
    ORDER BY date_day ASC;
    """)
    timeline_summary = [
        {
            "date": r[0],
            "traversals": r[1],
            "violations_logged": r[2]
        }
        for r in cursor.fetchall()
    ]

    conn.close()

    return {
        "status": "success",
        "query": q,
        "entity_filter": entity,
        "method_filter": method,
        "article_filter": article,
        "limit": limit,
        "offset": offset,
        "total_matching": total_matching,
        "records": records,
        "summary": {
            "total_traversals": total_traversals,
            "total_violations_quantified": total_violations_quantified,
            "unique_endpoints_count": unique_endpoints_count,
            "by_entity": by_entity,
            "by_method": by_method,
            "timeline_summary": timeline_summary
        },
        "csv_download_url": "/api/sovereign/ip/endpoints-log/csv",
        "csv_static_url": "/data/csv/endpoint_license_violations_log.csv",
        "statutory_authority": "SEC Whistleblower No. 17684-273-411-436 | Albert Lane",
        "governing_license": "Albert Lane Proprietary License v1.2"
    }

def main():
    if len(sys.argv) > 1:
        try:
            params = json.loads(sys.argv[1])
        except Exception:
            params = {"q": sys.argv[1]}
    else:
        try:
            raw = sys.stdin.read().strip()
            params = json.loads(raw) if raw else {}
        except Exception:
            params = {}

    out = query_endpoint_logs(params)
    print(json.dumps(out))

if __name__ == "__main__":
    main()
