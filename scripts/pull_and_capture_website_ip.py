#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# Component: pull_and_capture_website_ip.py (Complete Website & Subdomain IP Capturer)
# ==============================================================================

import os
import sys
import ssl
import json
import urllib.request
import hashlib
import sqlite3
from datetime import datetime, timezone

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
CAPTURE_DIR = os.path.join(DATA_DIR, "captured_website")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AlbertLane-Sovereign-Scanner/1.2",
    "Accept": "*/*"
}

def fetch_url(url: str, timeout: int = 10):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            status = r.status
            headers_dict = dict(r.headers)
            body_bytes = r.read()
            return {"ok": True, "status": status, "headers": headers_dict, "body": body_bytes}
    except Exception as e:
        return {"ok": False, "error": str(e), "headers": {}, "body": b""}

def query_doh(domain: str, qtype: str):
    url = f"https://dns.google/resolve?name={domain}&type={qtype}"
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/dns-json"})
        with urllib.request.urlopen(req, timeout=5, context=ctx) as r:
            data = json.loads(r.read().decode())
            return data.get("Answer", [])
    except Exception:
        return []

def capture_all():
    print("==============================================================================")
    print(" [CAPTURING ENTIRE WEBSITE, PRODUCTS, SUBDOMAINS & DNS RECORDS]")
    print(" Target Apex:         albertlane.net")
    print(" Product Target:      https://albertlane.net/products/site-utility-network")
    print(" API Subdomain:       https://api.albertlane.net/")
    print(" SEC Subdomain:       https://sec.albertlane.net/")
    print(" Rights Holder:       Albert Lane | SEC Whistleblower No. 17684-273-411-436")
    print("==============================================================================")

    os.makedirs(CAPTURE_DIR, exist_ok=True)
    manifest = {
        "rights_holder": "Albert Lane",
        "apex_domain": "albertlane.net",
        "captured_at_utc": datetime.now(timezone.utc).isoformat(),
        "sec_filing_ref": "SEC Whistleblower No. 17684-273-411-436",
        "zaxis_anchor": "0x3F8F9A1B2C3D",
        "captured_items": []
    }

    # 1. DNS Records Complete Audit
    dns_audit = {"domain": "albertlane.net", "records": {}, "subdomains": {}}
    for qt in ["A", "AAAA", "TXT", "MX", "NS", "SOA"]:
        ans = query_doh("albertlane.net", qt)
        dns_audit["records"][qt] = ans
        print(f"[+] DNS albertlane.net [{qt}]: {len(ans)} entries")

    subdomains_to_test = ["api.albertlane.net", "www.albertlane.net", "sec.albertlane.net"]
    for sub in subdomains_to_test:
        ans_a = query_doh(sub, "A")
        ans_aaaa = query_doh(sub, "AAAA")
        dns_audit["subdomains"][sub] = {"A": ans_a, "AAAA": ans_aaaa}
        print(f"[+] Subdomain DNS {sub}: {len(ans_a)} A, {len(ans_aaaa)} AAAA entries")

    dns_json_path = os.path.join(CAPTURE_DIR, "dns_records_complete.json")
    with open(dns_json_path, "w", encoding="utf-8") as f:
        json.dump(dns_audit, f, indent=2)

    # 2. Capture Website Targets
    web_targets = [
        {
            "name": "Site Utility Network (Product Page)",
            "url": "https://albertlane.net/products/site-utility-network",
            "file": "site_utility_network.html",
            "is_json": False
        },
        {
            "name": "Albert Lane Apex Homepage",
            "url": "https://albertlane.net/",
            "file": "apex_albertlane_net.html",
            "is_json": False
        },
        {
            "name": "Albert Lane WWW Mirror",
            "url": "https://www.albertlane.net/",
            "file": "www_albertlane_net.html",
            "is_json": False
        },
        {
            "name": "Albert Lane SEC Regulatory Archive",
            "url": "https://sec.albertlane.net/",
            "file": "sec_regulatory_archive.html",
            "is_json": False
        },
        {
            "name": "Meta-Lane-API Root & Policy Manifest",
            "url": "https://api.albertlane.net/",
            "file": "api_root.json",
            "is_json": True
        },
        {
            "name": "Meta-Lane-API Health & AST Guard",
            "url": "https://api.albertlane.net/health",
            "file": "api_health.json",
            "is_json": True
        },
        {
            "name": "Meta-Lane-API Soft Andon Cord Status",
            "url": "https://api.albertlane.net/v1/andon/status",
            "file": "api_andon_status.json",
            "is_json": True
        },
        {
            "name": "Meta-Lane-API Federal Claim Summary",
            "url": "https://api.albertlane.net/v1/federal-claim",
            "file": "api_federal_claim.json",
            "is_json": True
        },
        {
            "name": "Meta-Lane-API Commercial Rate ($104k/mo)",
            "url": "https://api.albertlane.net/v1/rate",
            "file": "api_rate.json",
            "is_json": True
        },
        {
            "name": "Meta-Lane-API Elon Musk Freebie Policy",
            "url": "https://api.albertlane.net/v1/freebie/elon-musk/dominance",
            "file": "api_freebie_elon.json",
            "is_json": True
        },
        {
            "name": "Meta-Lane-API Provenance Registry",
            "url": "https://api.albertlane.net/v1/provenance",
            "file": "api_provenance.json",
            "is_json": True
        }
    ]

    for tgt in web_targets:
        print(f"[*] Fetching: {tgt['url']}...")
        res = fetch_url(tgt["url"])
        save_path = os.path.join(CAPTURE_DIR, tgt["file"])
        if res["ok"] and res["body"]:
            with open(save_path, "wb") as f:
                f.write(res["body"])
            sha = hashlib.sha256(res["body"]).hexdigest()
            print(f"  [+] Saved {len(res['body'])} bytes -> {tgt['file']} (SHA256: {sha[:16]}...)")
            manifest["captured_items"].append({
                "name": tgt["name"],
                "url": tgt["url"],
                "file": tgt["file"],
                "bytes": len(res["body"]),
                "status": res["status"],
                "sha256": sha,
                "headers": {k: v for k, v in res["headers"].items() if k.lower().startswith(("x-", "server", "content-type"))}
            })
        else:
            print(f"  [!] Failed to fetch {tgt['url']}: {res.get('error')}")

    # Write site_manifest.json
    manifest_path = os.path.join(CAPTURE_DIR, "site_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    # 3. Update Database (live_website_ip_registry & dns_records_registry)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS live_website_ip_registry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target_name TEXT,
            url TEXT UNIQUE,
            file_name TEXT,
            size_bytes INTEGER,
            http_status INTEGER,
            ast_guard TEXT,
            d1_binding TEXT,
            sec_seal TEXT,
            andon_policy TEXT,
            sha256_hash TEXT,
            captured_at TEXT
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS dns_records_registry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            domain_name TEXT,
            record_type TEXT,
            ip_or_target TEXT,
            ttl INTEGER,
            sha256_hash TEXT,
            audited_at TEXT
        );
    """)

    now_iso = datetime.now(timezone.utc).isoformat()

    # Insert captured website pages
    for it in manifest["captured_items"]:
        h = it.get("headers", {})
        ast_g = h.get("x-ast-guard", h.get("X-AST-Guard", "0x3F8F9A1B2C3D"))
        d1 = h.get("x-d1", h.get("X-D1", "2bad8c0d-5c28-4f16-9c60-6bd48fb24a24 bound"))
        seal = h.get("x-seal", h.get("X-Seal", "SEC 17684-273-411-436"))
        andon = h.get("x-policy-andon", h.get("X-Policy-Andon", "Soft Andon Cord 2026 Meta-Lane-AI"))

        cur.execute("""
            INSERT OR REPLACE INTO live_website_ip_registry
            (target_name, url, file_name, size_bytes, http_status, ast_guard, d1_binding, sec_seal, andon_policy, sha256_hash, captured_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (it["name"], it["url"], it["file"], it["bytes"], it["status"], ast_g, d1, seal, andon, it["sha256"], now_iso))

    # Insert DNS records
    for qt, rlist in dns_audit["records"].items():
        for r in rlist:
            data_val = r.get("data", "")
            ttl_val = r.get("TTL", 300)
            dh = hashlib.sha256(f"albertlane.net:{qt}:{data_val}".encode()).hexdigest()
            cur.execute("""
                INSERT OR IGNORE INTO dns_records_registry
                (domain_name, record_type, ip_or_target, ttl, sha256_hash, audited_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, ("albertlane.net", qt, data_val, ttl_val, dh, now_iso))

    for sub, recs in dns_audit["subdomains"].items():
        for qt, rlist in recs.items():
            for r in rlist:
                data_val = r.get("data", "")
                ttl_val = r.get("TTL", 300)
                dh = hashlib.sha256(f"{sub}:{qt}:{data_val}".encode()).hexdigest()
                cur.execute("""
                    INSERT OR IGNORE INTO dns_records_registry
                    (domain_name, record_type, ip_or_target, ttl, sha256_hash, audited_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (sub, qt, data_val, ttl_val, dh, now_iso))

    conn.commit()

    cur.execute("SELECT COUNT(*) FROM live_website_ip_registry")
    total_pages = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM dns_records_registry")
    total_dns = cur.fetchone()[0]

    conn.close()

    print(f"\n[+] Total Live Website & Subdomain Assets Captured: {total_pages}")
    print(f"[+] Total Verified DNS Records Indexed:              {total_dns}")
    print(f"[+] Artifacts saved to:                              {CAPTURE_DIR}")
    print("==============================================================================\n")

if __name__ == "__main__":
    capture_all()
