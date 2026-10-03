#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2 (Articles 3-12, 14, 15)
# Component: Sovereign Intellectual Property Multi-Corpus Query Executor
# ==============================================================================

import os
import sys
import json
import sqlite3

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(WORKSPACE, "data", "codebase_ast.db")
LICENSE_PATH = os.path.join(WORKSPACE, "license.md")

def query_ip(params):
    q = params.get("query", "").strip()
    category = params.get("category", "ALL").upper() # ALL, META_ARCHIVES, REPOSITORIES, OPENSOURCE, VIOLATIONS
    article_filter = params.get("article", "").strip().upper()
    min_score = float(params.get("min_score", 0.0))
    limit = min(max(int(params.get("limit", 50)), 1), 200)

    if not os.path.exists(DB_PATH):
        return {"error": "Database not found", "results": {}}

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    results = {}

    # 1. Meta Archives Query
    if category in ["ALL", "META_ARCHIVES"]:
        sql = """
        SELECT id, archive_name, archive_type, file_path, size_bytes, file_count,
               sha256, worm_compliance_status, governing_license_article,
               sec_provenance_binding, last_verified_utc
        FROM ip_meta_archives
        WHERE (archive_name LIKE '%' || ? || '%' OR archive_type LIKE '%' || ? || '%' OR governing_license_article LIKE '%' || ? || '%')
        """
        args = [q, q, q]
        if article_filter:
            sql += " AND governing_license_article LIKE '%' || ? || '%'"
            args.append(article_filter)
        sql += " LIMIT ?"
        args.append(limit)
        cursor.execute(sql, args)
        cols = [c[0] for c in cursor.description]
        results["meta_archives"] = [dict(zip(cols, r)) for r in cursor.fetchall()]

    # 2. Repositories Audit Query
    if category in ["ALL", "REPOSITORIES"]:
        sql = """
        SELECT id, repo_name, repo_role, origin_path_or_url, primary_language,
               file_count, total_ast_nodes, license_header_compliance,
               governing_license_article, canonical_sha256, provenance_binding, audited_at
        FROM ip_repositories_audit
        WHERE (repo_name LIKE '%' || ? || '%' OR repo_role LIKE '%' || ? || '%' OR primary_language LIKE '%' || ? || '%')
        """
        args = [q, q, q]
        if article_filter:
            sql += " AND governing_license_article LIKE '%' || ? || '%'"
            args.append(article_filter)
        sql += " LIMIT ?"
        args.append(limit)
        cursor.execute(sql, args)
        cols = [c[0] for c in cursor.description]
        results["repositories"] = [dict(zip(cols, r)) for r in cursor.fetchall()]

    # 3. Open Source Code Analysis Query
    if category in ["ALL", "OPENSOURCE"]:
        sql = """
        SELECT id, package_name, version, declared_license, license_category,
               anti_dilution_status, structural_overlap_risk, analyzed_syntax_keys_count,
               shared_ast_signatures, governing_license_article, integrity_hash_sha256,
               sec_provenance_binding, recorded_at
        FROM ip_opensource_analysis
        WHERE (package_name LIKE '%' || ? || '%' OR declared_license LIKE '%' || ? || '%' OR shared_ast_signatures LIKE '%' || ? || '%')
        """
        args = [q, q, q]
        if article_filter:
            sql += " AND governing_license_article LIKE '%' || ? || '%'"
            args.append(article_filter)
        sql += " LIMIT ?"
        args.append(limit)
        cursor.execute(sql, args)
        cols = [c[0] for c in cursor.description]
        results["opensource_analysis"] = [dict(zip(cols, r)) for r in cursor.fetchall()]

    # 4. License Violations & Structural / Cryptographic Evidence Query
    if category in ["ALL", "VIOLATIONS"]:
        sql = """
        SELECT id, infringing_entity, infringement_category, infringing_artifact_or_path,
               misappropriated_asset, violated_license_article, article_title,
               structural_similarity_score, structural_evidence_keys, cryptographic_evidence_sha256,
               severity_level, remedy_enforcement_status, statutory_authority, detected_at
        FROM ip_license_violations
        WHERE (infringing_entity LIKE '%' || ? || '%' OR misappropriated_asset LIKE '%' || ? || '%' OR structural_evidence_keys LIKE '%' || ? || '%')
          AND structural_similarity_score >= ?
        """
        args = [q, q, q, min_score]
        if article_filter:
            sql += " AND (violated_license_article LIKE '%' || ? || '%' OR article_title LIKE '%' || ? || '%')"
            args.extend([article_filter, article_filter])
        sql += " ORDER BY structural_similarity_score DESC LIMIT ?"
        args.append(limit)
        cursor.execute(sql, args)
        cols = [c[0] for c in cursor.description]
        results["license_violations"] = [dict(zip(cols, r)) for r in cursor.fetchall()]

    # 5. Endpoint License Violations & Traversal Log Query
    if category in ["ALL", "ENDPOINTS"]:
        ep_sql = """
        SELECT id, entity_name, endpoint_path_or_uri, traversal_method, timestamp_utc,
               network_traversal, network_lookups, violations_quantity, cumulative_violations_over_time,
               violated_license_articles, infringement_classification, structural_evidence_summary,
               cryptographic_proof_sha256, sec_statutory_authority
        FROM endpoint_license_violations_traversal_log
        WHERE (entity_name LIKE '%' || ? || '%' OR endpoint_path_or_uri LIKE '%' || ? || '%' OR
               traversal_method LIKE '%' || ? || '%' OR network_lookups LIKE '%' || ? || '%')
        """
        ep_args = [q, q, q, q]
        if article_filter:
            ep_sql += " AND violated_license_articles LIKE '%' || ? || '%'"
            ep_args.append(article_filter)
        ep_sql += " ORDER BY entity_name ASC, endpoint_path_or_uri ASC, timestamp_utc ASC LIMIT ?"
        ep_args.append(limit)
        cursor.execute(ep_sql, ep_args)
        cols = [c[0] for c in cursor.description]
        results["endpoint_traversals"] = [dict(zip(cols, r)) for r in cursor.fetchall()]

    # Summary Statistics
    counts = {
        "meta_archives_total": cursor.execute("SELECT count(*) FROM ip_meta_archives").fetchone()[0],
        "repositories_total": cursor.execute("SELECT count(*) FROM ip_repositories_audit").fetchone()[0],
        "opensource_analyzed_total": cursor.execute("SELECT count(*) FROM ip_opensource_analysis").fetchone()[0],
        "license_violations_total": cursor.execute("SELECT count(*) FROM ip_license_violations").fetchone()[0],
        "critical_violations": cursor.execute("SELECT count(*) FROM ip_license_violations WHERE severity_level = 'CRITICAL'").fetchone()[0],
        "endpoint_traversals_total": cursor.execute("SELECT count(*) FROM endpoint_license_violations_traversal_log").fetchone()[0],
        "endpoint_violations_quantified": cursor.execute("SELECT sum(violations_quantity) FROM endpoint_license_violations_traversal_log").fetchone()[0] or 0
    }

    conn.close()

    return {
        "query": q,
        "category": category,
        "article_filter": article_filter,
        "min_score": min_score,
        "summary": counts,
        "results": results,
        "statutory_authority": "SEC Whistleblower No. 17684-273-411-436",
        "rights_holder": "Albert Lane",
        "governing_license": "Albert Lane Proprietary License v1.2"
    }

def main():
    if len(sys.argv) > 1:
        try:
            params = json.loads(sys.argv[1])
        except Exception:
            params = {"query": sys.argv[1]}
    else:
        try:
            raw = sys.stdin.read().strip()
            params = json.loads(raw) if raw else {}
        except Exception:
            params = {}

    output = query_ip(params)
    print(json.dumps(output))

if __name__ == "__main__":
    main()
