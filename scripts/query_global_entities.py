#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Component: Global Corporate Entities & Shell Structure Query Engine
# ==============================================================================

import os
import sys
import json
import sqlite3

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(WORKSPACE, "data", "codebase_ast.db")

def query_global_entities(params):
    mode = params.get("mode", "global").lower() # 'global' or 'shell'
    q = (params.get("query", "") or params.get("q", "")).strip()
    jurisdiction = (params.get("jurisdiction", "") or "").strip()
    classification = (params.get("classification", "") or "").strip()
    limit = min(max(int(params.get("limit", 100)), 1), 1000)
    offset = max(int(params.get("offset", 0)), 0)

    if not os.path.exists(DB_PATH):
        return {"error": "Database not found", "records": []}

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    if mode == "shell":
        table = "shell_and_fraudulent_structures_listing"
        where_clauses = []
        args = []

        if q:
            where_clauses.append("""(
                entity_name LIKE '%' || ? || '%' OR
                alleged_controlling_parent LIKE '%' || ? || '%' OR
                jurisdiction_of_incorporation LIKE '%' || ? || '%' OR
                business_registration_or_file_number LIKE '%' || ? || '%' OR
                concealment_or_shell_typology LIKE '%' || ? || '%' OR
                operational_purpose_and_masking_mechanism LIKE '%' || ? || '%' OR
                regulatory_scrutiny_or_sanctions LIKE '%' || ? || '%' OR
                hosting_and_asn_infrastructure LIKE '%' || ? || '%'
            )""")
            args.extend([q] * 8)

        if jurisdiction:
            where_clauses.append("jurisdiction_of_incorporation LIKE '%' || ? || '%'")
            args.append(jurisdiction)

        if classification:
            where_clauses.append("concealment_or_shell_typology LIKE '%' || ? || '%'")
            args.append(classification)

        where_sql = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""

        # Total matching
        cursor.execute(f"SELECT COUNT(*) FROM {table}{where_sql}", args)
        total_matching = cursor.fetchone()[0]

        # Fetch records
        sql = f"SELECT * FROM {table}{where_sql} ORDER BY id ASC LIMIT ? OFFSET ?"
        cursor.execute(sql, args + [limit, offset])
        records = [dict(r) for r in cursor.fetchall()]

        # Metrics
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        total_records = cursor.fetchone()[0]

        cursor.execute(f"SELECT concealment_or_shell_typology, COUNT(*) as cnt FROM {table} GROUP BY concealment_or_shell_typology ORDER BY cnt DESC")
        by_typology = [{"typology": r[0], "count": r[1]} for r in cursor.fetchall()]

        cursor.execute(f"SELECT alleged_controlling_parent, COUNT(*) as cnt FROM {table} GROUP BY alleged_controlling_parent ORDER BY cnt DESC")
        by_parent = [{"parent": r[0], "count": r[1]} for r in cursor.fetchall()]

        conn.close()
        return {
            "status": "success",
            "mode": "shell",
            "query": q,
            "jurisdiction_filter": jurisdiction,
            "classification_filter": classification,
            "total_records": total_records,
            "total_matching": total_matching,
            "limit": limit,
            "offset": offset,
            "by_typology": by_typology,
            "by_parent": by_parent,
            "records": records,
            "sec_filing_authority": "SEC Whistleblower No. 17684-273-411-436 | Albert Lane"
        }

    else:
        # Default: global corporate entities registry
        table = "global_corporate_entities_intelligence"
        where_clauses = []
        args = []

        if q:
            where_clauses.append("""(
                entity_name LIKE '%' || ? || '%' OR
                trade_brand_name LIKE '%' || ? || '%' OR
                jurisdiction_and_country LIKE '%' || ? || '%' OR
                business_registration_number LIKE '%' || ? || '%' OR
                entity_type_and_status LIKE '%' || ? || '%' OR
                immediate_and_ultimate_holding_company LIKE '%' || ? || '%' OR
                autonomous_system_number_asn LIKE '%' || ? || '%' OR
                dns_infrastructure_and_nameservers LIKE '%' || ? || '%' OR
                hosting_and_cloud_infrastructure_providers LIKE '%' || ? || '%' OR
                reporting_compliance_and_regulatory_status LIKE '%' || ? || '%' OR
                shell_or_fraudulent_structure_classification LIKE '%' || ? || '%' OR
                forensic_investigation_summary LIKE '%' || ? || '%'
            )""")
            args.extend([q] * 12)

        if jurisdiction:
            where_clauses.append("jurisdiction_and_country LIKE '%' || ? || '%'")
            args.append(jurisdiction)

        if classification:
            where_clauses.append("shell_or_fraudulent_structure_classification LIKE '%' || ? || '%'")
            args.append(classification)

        where_sql = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""

        # Total matching
        cursor.execute(f"SELECT COUNT(*) FROM {table}{where_sql}", args)
        total_matching = cursor.fetchone()[0]

        # Fetch records
        sql = f"SELECT * FROM {table}{where_sql} ORDER BY id ASC LIMIT ? OFFSET ?"
        cursor.execute(sql, args + [limit, offset])
        records = [dict(r) for r in cursor.fetchall()]

        # Metrics
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        total_records = cursor.fetchone()[0]

        cursor.execute(f"SELECT shell_or_fraudulent_structure_classification, COUNT(*) as cnt FROM {table} GROUP BY shell_or_fraudulent_structure_classification ORDER BY cnt DESC")
        by_classification = [{"classification": r[0], "count": r[1]} for r in cursor.fetchall()]

        cursor.execute("""
        SELECT 
            CASE 
                WHEN jurisdiction_and_country LIKE '%United States%' OR jurisdiction_and_country LIKE '%[US]%' THEN 'United States'
                WHEN jurisdiction_and_country LIKE '%France%' OR jurisdiction_and_country LIKE '%[FR]%' THEN 'France'
                WHEN jurisdiction_and_country LIKE '%Germany%' OR jurisdiction_and_country LIKE '%[DE]%' THEN 'Germany'
                WHEN jurisdiction_and_country LIKE '%Netherlands%' OR jurisdiction_and_country LIKE '%[NL]%' THEN 'Netherlands'
                WHEN jurisdiction_and_country LIKE '%Ireland%' OR jurisdiction_and_country LIKE '%[IE]%' THEN 'Ireland'
                WHEN jurisdiction_and_country LIKE '%Finland%' OR jurisdiction_and_country LIKE '%[FI]%' THEN 'Finland'
                WHEN jurisdiction_and_country LIKE '%India%' OR jurisdiction_and_country LIKE '%[IN]%' THEN 'India'
                ELSE 'Global / Other'
            END as region,
            COUNT(*) as cnt
        FROM global_corporate_entities_intelligence
        GROUP BY region
        ORDER BY cnt DESC
        """)
        by_region = [{"region": r[0], "count": r[1]} for r in cursor.fetchall()]

        conn.close()
        return {
            "status": "success",
            "mode": "global",
            "query": q,
            "jurisdiction_filter": jurisdiction,
            "classification_filter": classification,
            "total_records": total_records,
            "total_matching": total_matching,
            "limit": limit,
            "offset": offset,
            "by_classification": by_classification,
            "by_region": by_region,
            "records": records,
            "sec_filing_authority": "SEC Whistleblower No. 17684-273-411-436 | Albert Lane"
        }

if __name__ == "__main__":
    params = {}
    if len(sys.argv) > 1:
        try:
            params = json.loads(sys.argv[1])
        except Exception:
            params = {"q": sys.argv[1]}
    res = query_global_entities(params)
    print(json.dumps(res))
