// ==============================================================================
// [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
// Rights Holder: Albert Lane
// Filing Reference: SEC Whistleblower No. 17684-273-411-436
// License: Albert Lane Proprietary License v1.2
// Enforcement: Automated Defense Blocker Against X Corp & SpaceX/Starlink Infrastructure
// ==============================================================================

import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { exec, execSync } from "child_process";

export interface DefenseRule {
  id: string;
  entity: "X Corp / Twitter / xAI" | "SpaceX / Starlink";
  category: "CIDR_IPV4" | "CIDR_IPV6" | "USER_AGENT" | "DOMAIN_REFERER" | "INTELLECTUAL_PROPERTY";
  pattern: string;
  description: string;
}

// Pre-computed IPv4 CIDR blocks for ultra-fast bitwise matching
interface Ipv4Cidr {
  network: number;
  mask: number;
  cidr: string;
  entity: "X Corp / Twitter / xAI" | "SpaceX / Starlink";
  description: string;
}

function ipToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let res = 0;
  for (let i = 0; i < 4; i++) {
    const octet = parseInt(parts[i], 10);
    if (isNaN(octet) || octet < 0 || octet > 255) return null;
    res = (res << 8) | octet;
  }
  return res >>> 0;
}

function parseCidr(cidr: string, entity: "X Corp / Twitter / xAI" | "SpaceX / Starlink", description: string): Ipv4Cidr | null {
  const [ipStr, prefixStr] = cidr.split("/");
  const prefix = parseInt(prefixStr, 10);
  const ip = ipToInt(ipStr);
  if (ip === null || isNaN(prefix) || prefix < 0 || prefix > 32) return null;
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  return { network, mask, cidr, entity, description };
}

// X Corp (Twitter) & SpaceX (Starlink) CIDR ranges
const RAW_IPV4_CIDRS: Array<[string, "X Corp / Twitter / xAI" | "SpaceX / Starlink", string]> = [
  // X Corp / Twitter
  ["104.244.40.0/21", "X Corp / Twitter / xAI", "Twitter Global Ingress Edge Block"],
  ["199.16.156.0/22", "X Corp / Twitter / xAI", "Twitter Datacenter Primary Block"],
  ["199.59.148.0/22", "X Corp / Twitter / xAI", "Twitter Production Application Services"],
  ["199.96.56.0/21", "X Corp / Twitter / xAI", "Twitter Infrastructure Subnet"],
  ["209.237.192.0/19", "X Corp / Twitter / xAI", "Twitter Network Operations"],
  ["192.133.76.0/22", "X Corp / Twitter / xAI", "Twitter Engineering / API Subnet"],
  
  // SpaceX / Starlink
  ["98.96.0.0/15", "SpaceX / Starlink", "Starlink Major User Terminal Allocation (98.96.0.0 - 98.97.255.255)"],
  ["143.131.0.0/16", "SpaceX / Starlink", "SpaceX Starlink Global Satellite Gateway Subnet"],
  ["143.244.0.0/16", "SpaceX / Starlink", "SpaceX Starlink Terrestrial Ingress Subnet"],
  ["206.214.224.0/19", "SpaceX / Starlink", "SpaceX Corporate Infrastructure & Ground Stations"],
  ["206.224.64.0/19", "SpaceX / Starlink", "SpaceX Hawthorne Headquarters & Test Facilities"],
  ["129.222.0.0/16", "SpaceX / Starlink", "Starlink Low-Earth Orbit Ground Relay Subnet"],
  ["68.235.32.0/19", "SpaceX / Starlink", "SpaceX Starlink Broadband Telemetry Subnet"],
  ["198.24.16.0/20", "SpaceX / Starlink", "SpaceX Mission Operations Network"],
  ["170.203.192.0/18", "SpaceX / Starlink", "SpaceX Starlink Telemetry & Core POPs"],
];

const PARSED_IPV4_CIDRS: Ipv4Cidr[] = RAW_IPV4_CIDRS
  .map(([cidr, entity, desc]) => parseCidr(cidr, entity, desc))
  .filter((c): c is Ipv4Cidr => c !== null);

// IPv6 Prefix strings
const IPV6_PREFIXES: Array<{ prefix: string; entity: "X Corp / Twitter / xAI" | "SpaceX / Starlink"; desc: string }> = [
  { prefix: "2803:2260:", entity: "X Corp / Twitter / xAI", desc: "Twitter IPv6 LatAm Block" },
  { prefix: "2620:135:6000:", entity: "X Corp / Twitter / xAI", desc: "Twitter Primary IPv6 Allocation" },
  { prefix: "2a04:4e40:", entity: "X Corp / Twitter / xAI", desc: "Twitter European IPv6 Allocation" },
  { prefix: "2620:137:8000:", entity: "SpaceX / Starlink", desc: "SpaceX Starlink Global IPv6 Allocation" },
  { prefix: "2a0d:5600:", entity: "SpaceX / Starlink", desc: "SpaceX Starlink European IPv6 Gateway" },
];

// Blocked User-Agent regex patterns
const BLOCKED_USER_AGENTS: Array<{ regex: RegExp; entity: "X Corp / Twitter / xAI" | "SpaceX / Starlink"; desc: string }> = [
  { regex: /twitterbot/i, entity: "X Corp / Twitter / xAI", desc: "Twitterbot Web Crawler" },
  { regex: /xbot/i, entity: "X Corp / Twitter / xAI", desc: "X Corp Automated Bot" },
  { regex: /\bgrok\b/i, entity: "X Corp / Twitter / xAI", desc: "xAI Grok Ingestion Crawler" },
  { regex: /\bxai\b/i, entity: "X Corp / Twitter / xAI", desc: "xAI Corporate Automated Client" },
  { regex: /tweetmemebot/i, entity: "X Corp / Twitter / xAI", desc: "Twitter / Tweetmeme Scraper" },
  { regex: /spacex/i, entity: "SpaceX / Starlink", desc: "SpaceX Automated Scraper / Client" },
  { regex: /starlink/i, entity: "SpaceX / Starlink", desc: "Starlink Telemetry Agent" },
  { regex: /starshield/i, entity: "SpaceX / Starlink", desc: "Starshield Defense Network Agent" },
  { regex: /spacexdata/i, entity: "SpaceX / Starlink", desc: "SpaceX Data Plane Harvester" },
];

// Blocked Domains, Referers & Origins
const BLOCKED_DOMAINS: Array<{ keyword: string; entity: "X Corp / Twitter / xAI" | "SpaceX / Starlink"; desc: string }> = [
  { keyword: "x.com", entity: "X Corp / Twitter / xAI", desc: "X Corp Domain Origin" },
  { keyword: "twitter.com", entity: "X Corp / Twitter / xAI", desc: "Twitter Domain Origin" },
  { keyword: "t.co", entity: "X Corp / Twitter / xAI", desc: "Twitter Short URL Ingress" },
  { keyword: "xai.com", entity: "X Corp / Twitter / xAI", desc: "xAI Artificial Intelligence Domain" },
  { keyword: "grok.com", entity: "X Corp / Twitter / xAI", desc: "Grok Web Platform" },
  { keyword: "spacex.com", entity: "SpaceX / Starlink", desc: "SpaceX Corporate Domain" },
  { keyword: "starlink.com", entity: "SpaceX / Starlink", desc: "Starlink Network Domain" },
  { keyword: "starlink.net", entity: "SpaceX / Starlink", desc: "Starlink Infrastructure Host" },
  { keyword: "starshield.com", entity: "SpaceX / Starlink", desc: "Starshield Domain" },
];

// Telemetry counters
let totalQuarantinedCount = 0;
const recentQuarantines: Array<{
  timestamp: string;
  ip: string;
  entity: string;
  reason: string;
  path: string;
  userAgent: string;
}> = [];

function cleanClientIp(ip: string): string {
  if (!ip) return "";
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip.trim();
}

export function evaluateThreat(
  clientIp: string,
  userAgent: string,
  referer: string,
  origin: string,
  requestPath: string
): { blocked: boolean; entity?: "X Corp / Twitter / xAI" | "SpaceX / Starlink"; reason?: string; ruleType?: string } {
  const cleanIp = cleanClientIp(clientIp);

  // 1. Check IPv4 CIDR
  const ipInt = ipToInt(cleanIp);
  if (ipInt !== null) {
    for (const cidr of PARSED_IPV4_CIDRS) {
      if ((ipInt & cidr.mask) >>> 0 === cidr.network) {
        return {
          blocked: true,
          entity: cidr.entity,
          reason: `Matched quarantined IPv4 subnet: ${cidr.cidr} (${cidr.description})`,
          ruleType: "CIDR_IPV4"
        };
      }
    }
  }

  // 2. Check IPv6 Prefix
  for (const v6 of IPV6_PREFIXES) {
    if (cleanIp.toLowerCase().startsWith(v6.prefix.toLowerCase())) {
      return {
        blocked: true,
        entity: v6.entity,
        reason: `Matched quarantined IPv6 subnet: ${v6.prefix}* (${v6.desc})`,
        ruleType: "CIDR_IPV6"
      };
    }
  }

  // 3. Check User-Agent
  for (const ua of BLOCKED_USER_AGENTS) {
    if (ua.regex.test(userAgent)) {
      return {
        blocked: true,
        entity: ua.entity,
        reason: `Matched quarantined User-Agent pattern: ${ua.desc}`,
        ruleType: "USER_AGENT"
      };
    }
  }

  // 4. Check Referer & Origin
  const sourceRef = `${referer} ${origin}`.toLowerCase();
  for (const d of BLOCKED_DOMAINS) {
    if (sourceRef.includes(d.keyword)) {
      return {
        blocked: true,
        entity: d.entity,
        reason: `Origin/Referer provenance originates from blocked entity: ${d.keyword} (${d.desc})`,
        ruleType: "DOMAIN_REFERER"
      };
    }
  }

  // 5. Intellectual Property Protection (Derivatives Sequestration)
  // Block any automated or unauthorized probe of SpaceX models from external crawlers
  const lowerPath = requestPath.toLowerCase();
  if (
    lowerPath.includes("spacex_derivatives") ||
    lowerPath.includes("spacex_models") ||
    lowerPath.includes("spacex-api")
  ) {
    // If incoming request has suspicious scraping characteristics or lacks internal authority
    if (
      userAgent.toLowerCase().includes("bot") ||
      userAgent.toLowerCase().includes("crawler") ||
      userAgent.toLowerCase().includes("python-requests") ||
      userAgent.toLowerCase().includes("curl")
    ) {
      return {
        blocked: true,
        entity: "SpaceX / Starlink",
        reason: "Unauthorized programmatic crawler probing sequestered SpaceX model derivatives",
        ruleType: "INTELLECTUAL_PROPERTY"
      };
    }
  }

  return { blocked: false };
}

function logQuarantineEvent(
  ip: string,
  entity: string,
  reason: string,
  requestPath: string,
  method: string,
  userAgent: string,
  referer: string
) {
  totalQuarantinedCount++;
  const timestamp = new Date().toISOString();
  
  const record = {
    timestamp,
    ip,
    entity,
    reason,
    path: requestPath,
    userAgent: userAgent.slice(0, 150)
  };
  
  recentQuarantines.unshift(record);
  if (recentQuarantines.length > 50) recentQuarantines.pop();

  // 1. Write to immutable compliance master log
  try {
    const logPath = path.join(process.cwd(), "vault", "compliance_master.log");
    const logEntry = `[${timestamp}] IP_QUARANTINE_DROP: Blocked [${entity}] from IP [${ip}] on [${method} ${requestPath}] | Reason: ${reason} | SEC Whistleblower No. 17684-273-411-436\n`;
    fs.appendFileSync(logPath, logEntry, "utf-8");
  } catch (err) {
    console.error("[ipBlocker] Failed to write compliance log:", err);
  }

  // 2. Asynchronously log to SQLite database
  try {
    const dbPath = path.join(process.cwd(), "data", "codebase_ast.db");
    const safeReason = reason.replace(/'/g, "''");
    const safeIp = ip.replace(/'/g, "''");
    const safeEntity = entity.replace(/'/g, "''");
    const safePath = requestPath.replace(/'/g, "''");
    const safeMethod = method.replace(/'/g, "''");
    const safeUa = userAgent.replace(/'/g, "''").slice(0, 200);
    const safeRef = referer.replace(/'/g, "''").slice(0, 200);

    const cmd = `python3 -c "
import sqlite3
try:
    conn = sqlite3.connect('${dbPath}')
    c = conn.cursor()
    c.execute('''INSERT INTO quarantined_ip_threats 
        (client_ip, matched_rule_id, matched_entity, matched_category, matched_identifier, request_path, request_method, user_agent, referer, action_taken, statutory_notice, timestamp)
        VALUES ('${safeIp}', 0, '${safeEntity}', 'AUTOMATED_DROP', '${safeReason}', '${safePath}', '${safeMethod}', '${safeUa}', '${safeRef}', 'QUARANTINE_DROP', 'SEC Whistleblower No. 17684-273-411-436', '${timestamp}')''')
    conn.commit()
    conn.close()
except Exception as e:
    pass
"`;
    exec(cmd);
  } catch (err) {
    // Non-blocking
  }
}

/**
 * Express Middleware enforcing immediate quarantine against X Corp and SpaceX/Starlink
 */
export function xSpaceXBlockerMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow internal status check endpoints to function
  if (req.path.startsWith("/api/sovereign/ip-blocker")) {
    return next();
  }

  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
                   (req.headers["cf-connecting-ip"] as string) ||
                   (req.headers["x-real-ip"] as string) ||
                   req.ip ||
                   req.socket.remoteAddress ||
                   "";

  const userAgent = (req.headers["user-agent"] as string) || "";
  const referer = (req.headers["referer"] as string) || "";
  const origin = (req.headers["origin"] as string) || "";

  const check = evaluateThreat(clientIp, userAgent, referer, origin, req.path);

  if (check.blocked && check.entity) {
    logQuarantineEvent(
      clientIp,
      check.entity,
      check.reason || "Matched defensive quarantine filter",
      req.path,
      req.method,
      userAgent,
      referer
    );

    res.setHeader("X-Provenance-Authority", "Albert Lane");
    res.setHeader("X-SEC-Filing-Reference", "17684-273-411-436");
    res.setHeader("X-Quarantine-Enforcement", "ACTIVE_DROP");

    return res.status(403).json({
      status: "QUARANTINED_AND_BLOCKED",
      threat_entity: check.entity,
      matched_rule: check.reason,
      client_ip: clientIp,
      reason: "Unauthorized access attempt blocked by Sovereign Sequestration Engine. Protective isolation active.",
      statutory_authority: "SEC Whistleblower No. 17684-273-411-436",
      rights_holder: "Albert Lane",
      timestamp: new Date().toISOString(),
      enforcement: "Federal Whistleblower Sequestration & Trade Secret Protection"
    });
  }

  next();
}

export function getBlockerStats() {
  return {
    status: "ACTIVE_ARMED",
    statutory_authority: "SEC Whistleblower No. 17684-273-411-436",
    rights_holder: "Albert Lane",
    blocked_entities: [
      {
        entity: "X Corp / Twitter / xAI",
        asns: ["AS13414", "AS35995", "AS54888", "AS63293", "AS394205"],
        ipv4_cidrs_count: 6,
        ipv6_cidrs_count: 3,
        domains: ["x.com", "twitter.com", "t.co", "xai.com", "grok.com"]
      },
      {
        entity: "SpaceX / Starlink",
        asns: ["AS14593", "AS45700", "AS27277"],
        ipv4_cidrs_count: 9,
        ipv6_cidrs_count: 2,
        domains: ["spacex.com", "starlink.com", "starlink.net", "starshield.com"]
      }
    ],
    total_quarantined_attempts: totalQuarantinedCount,
    recent_quarantines: recentQuarantines.slice(0, 15)
  };
}

export function getDatabaseRules() {
  try {
    const dbPath = path.join(process.cwd(), "data", "codebase_ast.db");
    const out = execSync(`python3 -c "
import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
c.execute('SELECT id, entity, category, identifier, description, action, statutory_authority, rights_holder, active_status FROM ip_defense_blocklist;')
rows = c.fetchall()
keys = ['id', 'entity', 'category', 'identifier', 'description', 'action', 'statutory_authority', 'rights_holder', 'active_status']
data = [dict(zip(keys, r)) for r in rows]
conn.close()
print(json.dumps(data))
"`).toString();
    return JSON.parse(out);
  } catch (err) {
    return [];
  }
}

export function getDatabaseQuarantineLog() {
  try {
    const dbPath = path.join(process.cwd(), "data", "codebase_ast.db");
    const out = execSync(`python3 -c "
import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()
c.execute('SELECT id, client_ip, matched_entity, matched_category, matched_identifier, request_path, request_method, user_agent, action_taken, timestamp FROM quarantined_ip_threats ORDER BY id DESC LIMIT 100;')
rows = c.fetchall()
keys = ['id', 'client_ip', 'matched_entity', 'matched_category', 'matched_identifier', 'request_path', 'request_method', 'user_agent', 'action_taken', 'timestamp']
data = [dict(zip(keys, r)) for r in rows]
conn.close()
print(json.dumps(data))
"`).toString();
    return JSON.parse(out);
  } catch (err) {
    return [];
  }
}

