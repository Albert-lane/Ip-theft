#!/usr/bin/env python3
# ======================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Scope: Governs all downstream updates, derivative works, and indirect 
# changes stemming from this system retroactively to the moment of creation.
# Articles IV & V: Uses Requiring a License & Covered System Assets
# ======================================================================

import os
import sys
import sqlite3
import json
import csv
import ipaddress
from datetime import datetime, timezone

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")
CSV_DIR = os.path.join(DATA_DIR, "csv")

RIGHTS_HOLDER = "Albert Lane"
FILING_REF = "SEC Whistleblower No. 17684-273-411-436"
LICENSE = "Albert Lane Proprietary License v1.2"
TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

# Catalog of known IP ranges, ASNs, Domains, and Identifiers for X and SpaceX
DEFENSE_RULES = [
    # --- X CORP / TWITTER / xAI ---
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "ASN",
        "identifier": "AS13414",
        "description": "Twitter Inc. Global Core Transit ASN",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "ASN",
        "identifier": "AS35995",
        "description": "Twitter Inc. Edge ASN",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "ASN",
        "identifier": "AS54888",
        "description": "Twitter Europe / Secondary Infrastructure",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV4",
        "identifier": "104.244.40.0/21",
        "description": "Twitter Global Edge Network Block (104.244.40.0 - 104.244.47.255)",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV4",
        "identifier": "199.16.156.0/22",
        "description": "Twitter Datacenter Primary Block",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV4",
        "identifier": "199.59.148.0/22",
        "description": "Twitter Production Application Services",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV4",
        "identifier": "199.96.56.0/21",
        "description": "Twitter Infrastructure Subnet",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV4",
        "identifier": "209.237.192.0/19",
        "description": "Twitter Network Operations",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV4",
        "identifier": "192.133.76.0/22",
        "description": "Twitter Engineering / API Subnet",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV6",
        "identifier": "2803:2260::/32",
        "description": "Twitter Latin America IPv6 Routing",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV6",
        "identifier": "2620:135:6000::/40",
        "description": "Twitter Primary IPv6 Allocation",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "CIDR_IPV6",
        "identifier": "2a04:4e40::/32",
        "description": "Twitter European IPv6 Allocation",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "DOMAIN_REFERER",
        "identifier": "x.com, twitter.com, t.co, twimg.com, xai.com, grok.com",
        "description": "X / Twitter / xAI Hostnames, Referers & Origin Headers",
        "action": "BLOCK_ACCESS"
    },
    {
        "entity": "X Corp (formerly Twitter, Inc.) / xAI",
        "category": "USER_AGENT",
        "identifier": "Twitterbot, Xbot, Grok, xAI, TweetmemeBot, TwitterAndroid, Twitter-iPhone",
        "description": "X / Twitter Scraping Crawlers and Client User-Agents",
        "action": "BLOCK_ACCESS"
    },

    # --- SPACEX / STARLINK (SPACE EXPLORATION TECHNOLOGIES CORP) ---
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "ASN",
        "identifier": "AS14593",
        "description": "Space Exploration Technologies Corp. (SpaceX / Starlink Global Autonomous System)",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "ASN",
        "identifier": "AS45700",
        "description": "SpaceX Asia-Pacific / European Gateway Operations",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "ASN",
        "identifier": "AS27277",
        "description": "SpaceX Hawthorne Corporate Campus / Ground Stations",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "98.96.0.0/15",
        "description": "Starlink Major User Terminal Allocation (98.96.0.0 - 98.97.255.255)",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "143.131.0.0/16",
        "description": "SpaceX Starlink Global Satellite Gateway Subnet",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "143.244.0.0/16",
        "description": "SpaceX Starlink Terrestrial Ingress Subnet",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "206.214.224.0/19",
        "description": "SpaceX Corporate Infrastructure & Ground Stations",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "206.224.64.0/19",
        "description": "SpaceX Hawthorne Headquarters & Test Facilities",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "129.222.0.0/16",
        "description": "Starlink Low-Earth Orbit Ground Relay Subnet",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "68.235.32.0/19",
        "description": "SpaceX Starlink Broadband Telemetry Subnet",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "198.24.16.0/20",
        "description": "SpaceX Mission Operations Network",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV4",
        "identifier": "170.203.192.0/18",
        "description": "SpaceX Starlink Telemetry & Core POPs",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV6",
        "identifier": "2620:137:8000::/40",
        "description": "SpaceX Starlink Global IPv6 Allocation",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "CIDR_IPV6",
        "identifier": "2a0d:5600::/32",
        "description": "SpaceX Starlink European IPv6 Gateway Allocation",
        "action": "QUARANTINE_DROP"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "DOMAIN_REFERER",
        "identifier": "spacex.com, starlink.com, starlink.net, starshield.com, api.spacexdata.com",
        "description": "SpaceX / Starlink / Starshield Hostnames, Referers & Origin Headers",
        "action": "BLOCK_ACCESS"
    },
    {
        "entity": "Space Exploration Technologies Corp (SpaceX / Starlink)",
        "category": "USER_AGENT",
        "identifier": "SpaceX, Starlink, Starshield, SpaceXDataBot, FalconTelemetryBot",
        "description": "SpaceX Scrapers, Automated Crawlers & Internal Bots",
        "action": "BLOCK_ACCESS"
    },
    {
        "entity": "Cross-Entity IP Defense (X & SpaceX)",
        "category": "INTELLECTUAL_PROPERTY_PROTECTION",
        "identifier": "SpaceX-API Schema Derivatives, ODM Models, Mongoose Ast, Falcon/Starlink Telemetry Schemas",
        "description": "Protective sequestration blocking unauthorized ingestion or scraping of Albert Lane proprietary derivatives",
        "action": "SEQUESTER_ENFORCE"
    }
]

def main():
    print("[*] Initializing X & SpaceX IP Blocker Defense System...")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Create defense blocklist table
    c.execute("""
    CREATE TABLE IF NOT EXISTS ip_defense_blocklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity TEXT,
        category TEXT,
        identifier TEXT,
        description TEXT,
        action TEXT,
        statutory_authority TEXT,
        rights_holder TEXT,
        active_status TEXT,
        created_at TEXT
    );
    """)
    c.execute("DELETE FROM ip_defense_blocklist;")

    # Create quarantine log table
    c.execute("""
    CREATE TABLE IF NOT EXISTS quarantined_ip_threats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_ip TEXT,
        matched_rule_id INTEGER,
        matched_entity TEXT,
        matched_category TEXT,
        matched_identifier TEXT,
        request_path TEXT,
        request_method TEXT,
        user_agent TEXT,
        referer TEXT,
        action_taken TEXT,
        statutory_notice TEXT,
        timestamp TEXT
    );
    """)

    # Seed defense rules
    rule_records = []
    for r in DEFENSE_RULES:
        rule_records.append((
            r["entity"],
            r["category"],
            r["identifier"],
            r["description"],
            r["action"],
            FILING_REF,
            RIGHTS_HOLDER,
            "ACTIVE_ENFORCEMENT",
            TIMESTAMP
        ))

    c.executemany("""
    INSERT INTO ip_defense_blocklist (
        entity, category, identifier, description, action,
        statutory_authority, rights_holder, active_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, rule_records)
    conn.commit()

    print(f"[+] Installed {len(rule_records)} active defense rules against X & SpaceX.")

    # Export to CSV
    os.makedirs(CSV_DIR, exist_ok=True)
    csv_file = os.path.join(CSV_DIR, "ip_defense_blocklist.csv")
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id", "entity", "category", "identifier", "description", "action",
            "statutory_authority", "rights_holder", "active_status", "created_at"
        ])
        for idx, r in enumerate(rule_records, 1):
            writer.writerow([idx] + list(r))

    print(f"[+] Exported CSV register to {csv_file}")
    conn.close()

if __name__ == "__main__":
    main()
