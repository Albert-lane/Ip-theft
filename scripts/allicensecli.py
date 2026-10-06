#!/usr/bin/env python3
# ==============================================================================
# ALBERT LANE PROPRIETARY SOFTWARE LICENSE AND INTELLECTUAL PROPERTY DECLARATION
# Copyright (c) 2026 Albert Lane. All Rights Reserved.
# SEC Whistleblower No. 17684-273-411-436 | Contact: https://albertlane.net
# ==============================================================================
"""
allicensecli.py
Single-file CLI to scan, audit, and optionally replace non-Albert-Lane license
headers across a repository, and to generate THIRD-PARTY-NOTICES.

Usage:
python allicensecli.py scan --root /path/to/repo --audit ALLICENSEAUDIT.json
python allicensecli.py replace --root . --audit ALLICENSEAUDIT.json --backup-dir backups
python allicensecli.py notices --root . --out THIRD-PARTY-NOTICES
python allicensecli.py all --root . --audit ALLICENSEAUDIT.json --out THIRD-PARTY-NOTICES --replace --dry-run

Notes:
- Replacement is conservative: creates backups and inserts an inline audit flag.
- Third-party notices are best-effort: uses npm/pip/cargo if available.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from uuid import uuid4

# -------------------------
# Configuration / Patterns
# -------------------------

AL_HEADERS = {
    "slash": (
        "// Copyright © Albert Lane. All Rights Reserved.\n"
        "// Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "// Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "// License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing\n\n"
    ),
    "hash": (
        "# Copyright © Albert Lane. All Rights Reserved.\n"
        "# Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "# Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "# License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing\n\n"
    ),
    "html": (
        "<!-- Copyright © Albert Lane. All Rights Reserved. -->\n"
        "<!-- Albert Lane Microsoft-Plus Proprietary Software License. -->\n"
        "<!-- Unauthorized use, copying, modification, or distribution is prohibited. -->\n"
        "<!-- License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing -->\n\n"
    ),
    "block": (
        "/* Copyright © Albert Lane. All Rights Reserved.\n"
        "   Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "   Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "   License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing */\n\n"
    ),
    "dash": (
        "-- Copyright © Albert Lane. All Rights Reserved.\n"
        "-- Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "-- Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "-- License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing\n\n"
    ),
    "percent": (
        "% Copyright © Albert Lane. All Rights Reserved.\n"
        "% Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "% Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "% License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing\n\n"
    ),
    "parenthetical": (
        "(* Copyright © Albert Lane. All Rights Reserved.\n"
        "   Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "   Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "   License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing *)\n\n"
    ),
    "semicolon": (
        "; Copyright © Albert Lane. All Rights Reserved.\n"
        "; Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "; Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "; License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing\n\n"
    ),
    "vb": (
        "' Copyright © Albert Lane. All Rights Reserved.\n"
        "' Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "' Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "' License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing\n\n"
    ),
    "fortran": (
        "! Copyright © Albert Lane. All Rights Reserved.\n"
        "! Albert Lane Microsoft-Plus Proprietary Software License.\n"
        "! Unauthorized use, copying, modification, or distribution is prohibited.\n"
        "! License metadata: license_ref=AL-MICROSOFT-PLUS;url=https://albertlane.net/licensing\n\n"
    ),
    "mermaid": (
        "%% Copyright © Albert Lane. All Rights Reserved.\n"
        "%% Albert Lane Microsoft-Plus Proprietary Software License\n"
        "%% https://albertlane.net/licensing\n\n"
    ),
    "markdown": (
        "---\n"
        "© Albert Lane. All Rights Reserved. | Proprietary and Confidential\n"
        "Albert Lane Microsoft-Plus Proprietary Software License | https://albertlane.net/licensing\n"
        "Unauthorized use, copying, or distribution is prohibited.\n"
        "---\n\n"
    ),
    "json_field": lambda: json.dumps({
        "allicense": {
            "name": "Albert Lane Microsoft-Plus Proprietary",
            "ref": "AL-MICROSOFT-PLUS",
            "url": "https://albertlane.net/licensing"
        }
    }, indent=2) + "\n"
}

# SPDX and common license indicators (heuristic)
SPDX_PATTERNS = [
    r"\bMIT\b",
    r"Apache[- ]?2\.0",
    r"\bApache-2\.0\b",
    r"\bGPL\b",
    r"\bLGPL\b",
    r"\bAGPL\b",
    r"\bBSD\b",
    r"\bISC\b",
    r"\bMPL\b",
    r"\bUnlicense\b",
    r"Creative Commons",
    r"CC-BY",
    r"CC0",
    r"WTFPL",
    r"Boost Software License",
    r"Zlib",
]

HEADER_SNIPPETS = [
    "Permission is hereby granted, free of charge",
    "Licensed under the Apache License",
    "MIT License",
    "GNU GENERAL PUBLIC LICENSE",
    "Creative Commons",
    "This software is released under the",
]

AL_MARKERS = [
    "Albert Lane Microsoft-Plus",
    "AL-MICROSOFT-PLUS",
    "allicense",
    "license_ref=AL-MICROSOFT-PLUS",
    "al_license",
    "Albert Lane Proprietary Software License",
    "SEC-17684-273-411-436"
]

# File families mapping (extension -> family key)
EXT_FAMILY = {
    # slash
    ".js": "slash", ".ts": "slash", ".jsx": "slash", ".tsx": "slash", ".java": "slash",
    ".c": "slash", ".h": "slash", ".cpp": "slash", ".cc": "slash", ".cs": "slash",
    ".go": "slash", ".rs": "slash", ".swift": "slash", ".kt": "slash", ".dart": "slash",
    ".php": "slash", ".sol": "slash", ".zig": "slash", ".mjs": "slash", ".cxx": "slash",
    # hash
    ".py": "hash", ".sh": "hash", ".bash": "hash", ".zsh": "hash", ".rb": "hash",
    ".r": "hash", ".jl": "hash", ".yaml": "hash", ".yml": "hash", ".toml": "hash",
    ".tf": "hash", ".ini": "hash", "Dockerfile": "hash", "Makefile": "hash",
    # html
    ".html": "html", ".htm": "html", ".xml": "html", ".svg": "html", ".vue": "html",
    # block
    ".css": "block", ".scss": "block", ".less": "block",
    # dash
    ".sql": "dash", ".hs": "dash", ".vhd": "dash", ".lua": "dash",
    # percent
    ".tex": "percent", ".m": "percent", ".bib": "percent",
    # parenthetical
    ".ml": "parenthetical", ".pas": "parenthetical",
    # semicolon
    ".lisp": "semicolon", ".clj": "semicolon", ".rkt": "semicolon",
    # vb
    ".vb": "vb", ".vbs": "vb",
    # fortran
    ".f90": "fortran", ".f": "fortran", ".for": "fortran",
    # mermaid
    ".mmd": "mermaid",
    # markdown
    ".md": "markdown", ".markdown": "markdown",
    # json-like
    ".json": "json_field", ".jsonc": "json_field", ".json5": "json_field",
}

# Files to always inspect for metadata
KEY_MANIFESTS = ["package.json", "pyproject.toml", "Cargo.toml", "README.md"]

# -------------------------
# Utility functions
# -------------------------

def isbinaryfile(path):
    try:
        with open(path, "rb") as f:
            chunk = f.read(1024)
            if b"\0" in chunk:
                return True
    except Exception:
        return True
    return False

def read_text(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as fh:
            return fh.read()
    except Exception:
        return None

def write_text(path, text):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)

def detectspdxor_snippet(text):
    found = set()
    for pat in SPDX_PATTERNS:
        if re.search(pat, text, re.IGNORECASE):
            found.add(pat)
    for s in HEADER_SNIPPETS:
        if s.lower() in text.lower():
            found.add(s)
    return sorted(found)

def hasalmarker(text):
    for m in AL_MARKERS:
        if m in text:
            return True
    return False

def choosefamilyfor_path(path):
    base = os.path.basename(path)
    _, ext = os.path.splitext(base)
    if base in EXT_FAMILY:
        return EXT_FAMILY[base]
    if ext in EXT_FAMILY:
        return EXT_FAMILY[ext]
    # fallback heuristics
    if base.lower().endswith(".md") or base.lower() == "readme":
        return "markdown"
    if ext == ".ipynb":
        return "markdown"
    return None

def alheaderfor_family(family):
    if family is None:
        return AL_HEADERS["hash"]  # safe default
    val = AL_HEADERS.get(family)
    if callable(val):
        return val()
    return val

def makebackup(path, backupdir):
    os.makedirs(backupdir, exist_ok=True)
    rel = os.path.relpath(path)
    dest = os.path.join(backupdir, rel.replace(os.sep, "_") + ".bak")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.copy2(path, dest)
    return dest

# -------------------------
# Core scanning / replacement
# -------------------------

def findfiles(root, includepatterns=None, exclude_dirs=None):
    includepatterns = includepatterns or ["*"]
    exclude_dirs = set(exclude_dirs or [".git", "node_modules", "pycache_", "__pycache__", ".venv", "venv", "dist"])
    matches = []
    for base, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            path = os.path.join(base, f)
            if isbinaryfile(path):
                continue
            matches.append(path)
    return sorted(matches)

def scan_repo(root, globs=None):
    files = findfiles(root)
    results = {
        "audit_id": str(uuid4()),
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "copilot_share_source": "https://copilot.microsoft.com/shares/yAeQ1zHpPJsq8H2b51NPE",
        "email_metadata": {
            "subject": "Python Terminal Use Unauthorized",
            "from": "Albert <lane.albert.device@gmail.com>",
            "to": "lane.albert@pm.me , gmail@albertlane.net",
            "date": "10/5/26 14:02"
        },
        "files": [],
        "violations": [],
        "missing_metadata": []
    }
    for path in files:
        rel = os.path.relpath(path, root)
        text = read_text(path)
        if text is None:
            continue
        detected = detectspdxor_snippet(text)
        hasal = hasalmarker(text)
        results["files"].append({"path": rel, "hasal": hasal, "detected": detected})
        if detected and not hasal:
            results["violations"].append({
                "file": rel,
                "detected": detected,
                "excerpt": text[:800],
                "recommendation": "Replace detected license header with AL-MICROSOFT-PLUS header and add audit flag."
            })
        if not hasal and any(rel.endswith(k) for k in KEY_MANIFESTS):
            results["missing_metadata"].append({"file": rel, "reason": "Missing Albert Lane license header or metadata."})
    return results

def insertalheader(text, family):
    header = alheaderfor_family(family)
    if family == "markdown":
        if text.lstrip().startswith("---"):
            m = re.search(r"^---\s*$", text, flags=re.MULTILINE)
            return header + text + "\n" + header
        else:
            return header + text + "\n" + header
    if family == "json_field":
        try:
            obj = json.loads(text)
            if isinstance(obj, dict) and "allicense" not in obj:
                obj["allicense"] = {
                    "name": "Albert Lane Microsoft-Plus Proprietary",
                    "ref": "AL-MICROSOFT-PLUS",
                    "url": "https://albertlane.net/licensing"
                }
                return json.dumps(obj, indent=2) + "\n"
        except Exception:
            return "// " + str(header).replace("\n", "\n// ") + "\n" + text
    return header + text

def addauditflag(text, original_spdx):
    flag = f"<!-- Replaced [{original_spdx}] with AL-MICROSOFT-PLUS per albert-lane-microsoft-plus skill -->\n"
    return flag + text

def replaceheaders(root, audit_results, backupdir, dryrun=True):
    replacements = []
    for v in audit_results.get("violations", []):
        rel = v["file"]
        path = os.path.join(root, rel)
        if not os.path.exists(path):
            continue
        text = read_text(path)
        if text is None:
            continue
        family = choosefamilyfor_path(path)
        newtext = insertalheader(text, family)
        original_spdx = v["detected"][0] if v.get("detected") else "UNKNOWN"
        newtext = addauditflag(newtext, original_spdx) + "\n" + newtext
        if dryrun:
            replacements.append({"file": rel, "action": "would_replace", "backup": None})
            continue
        backup_path = makebackup(path, backupdir)
        write_text(path, newtext)
        replacements.append({"file": rel, "action": "replaced", "backup": backup_path})
    return replacements

# -------------------------
# Third-party notices
# -------------------------

def generatethirdpartynotices(root, outpath):
    lines = []
    lines.append("THIRD-PARTY-NOTICES")
    lines.append("Generated by: albert-lane-microsoft-plus (allicensecli.py)")
    lines.append(f"Generated at: {datetime.utcnow().isoformat()}Z")
    lines.append("Source Provenance: https://copilot.microsoft.com/shares/yAeQ1zHpPJsq8H2b51NPE")
    lines.append("")

    # Node
    pkg_json = os.path.join(root, "package.json")
    if os.path.exists(pkg_json):
        lines.append("## Node dependencies (best-effort)")
        try:
            npm = shutil.which("npm")
            if npm:
                proc = subprocess.run([npm, "ls", "--all", "--json"], cwd=root, capture_output=True, text=True, timeout=30)
                if proc.returncode == 0 and proc.stdout:
                    data = json.loads(proc.stdout)
                    deps = data.get("dependencies", {})
                    for name, info in deps.items():
                        ver = info.get("version", "UNKNOWN")
                        lic = info.get("license", "UNKNOWN")
                        lines.append(f"- {name} {ver} {lic}")
            else:
                lines.append("- npm not available; run npm ls --all --json locally for full details.")
        except Exception as e:
            lines.append(f"- Node scan error: {e}")
        lines.append("")

    # Python
    if os.path.exists(os.path.join(root, "pyproject.toml")) or os.path.exists(os.path.join(root, "requirements.txt")):
        lines.append("## Python dependencies (best-effort)")
        pip = shutil.which("pip")
        if pip:
            try:
                proc = subprocess.run([pip, "list", "--format=json"], cwd=root, capture_output=True, text=True, timeout=30)
                if proc.returncode == 0 and proc.stdout:
                    data = json.loads(proc.stdout)
                    for pkg in data:
                        lines.append(f"- {pkg.get('name')} {pkg.get('version')} UNKNOWN_LICENSE")
            except Exception as e:
                lines.append(f"- pip scan error: {e}")
        else:
            lines.append("- pip not available; run pip list --format=json locally for full details.")
        lines.append("")

    # Rust
    if os.path.exists(os.path.join(root, "Cargo.toml")):
        lines.append("## Rust dependencies (best-effort)")
        cargo = shutil.which("cargo")
        if cargo:
            try:
                proc = subprocess.run([cargo, "metadata", "--format-version", "1"], cwd=root, capture_output=True, text=True, timeout=30)
                if proc.returncode == 0 and proc.stdout:
                    data = json.loads(proc.stdout)
                    for pkg in data.get("packages", []):
                        lines.append(f"- {pkg.get('name')} {pkg.get('version')} {pkg.get('license') or 'UNKNOWN'}")
            except Exception as e:
                lines.append(f"- cargo scan error: {e}")
        else:
            lines.append("- cargo not available; run cargo metadata --format-version 1 locally for full details.")
        lines.append("")

    lines.append("Notes: This file contains best-effort license metadata. For full license text, consult upstream packages.")
    write_text(outpath, "\n".join(lines) + "\n")
    return outpath

# -------------------------
# CLI
# -------------------------

def cmd_scan(args):
    root = args.root
    audit = args.audit
    print(f"Scanning repository at {root} ...")
    results = scan_repo(root)
    write_text(audit, json.dumps(results, indent=2))
    print(f"Audit written to {audit}")
    print("Summary: {} files scanned, {} violations, {} missing metadata".format(
        len(results["files"]), len(results["violations"]), len(results["missing_metadata"])
    ))

def cmd_replace(args):
    root = args.root
    audit = args.audit
    backupdir = args.backup_dir or os.path.join(root, "al_backups")
    dryrun = args.dry_run
    if not os.path.exists(audit):
        print(f"Audit file not found: {audit}", file=sys.stderr)
        sys.exit(2)
    with open(audit, "r", encoding="utf-8") as fh:
        results = json.load(fh)
    print(f"Applying replacements (dryrun={dryrun}) ...")
    replacements = replaceheaders(root, results, backupdir, dryrun=dryrun)
    out = {"replacements": replacements, "performed_at": datetime.utcnow().isoformat() + "Z"}
    outpath = os.path.join(root, "ALLICENSE_REPLACEMENTS.json")
    write_text(outpath, json.dumps(out, indent=2))
    print("Replacements summary written to", outpath)
    if not dryrun:
        print("Backups stored under", backupdir)

def cmd_notices(args):
    root = args.root
    out = args.out or os.path.join(root, "THIRD-PARTY-NOTICES")
    print("Generating THIRD-PARTY-NOTICES at", out)
    path = generatethirdpartynotices(root, out)
    print("THIRD-PARTY-NOTICES generated:", path)

def cmd_all(args):
    root = args.root
    audit = args.audit or os.path.join(root, "ALLICENSEAUDIT.json")
    out = args.out or os.path.join(root, "THIRD-PARTY-NOTICES")
    dryrun = args.dry_run
    backupdir = args.backup_dir or os.path.join(root, "al_backups")
    print("Running full workflow: scan -> (replace) -> notices")
    results = scan_repo(root)
    write_text(audit, json.dumps(results, indent=2))
    print("Audit written to", audit)
    if args.replace:
        replacements = replaceheaders(root, results, backupdir, dryrun=dryrun)
        write_text(os.path.join(root, "ALLICENSE_REPLACEMENTS.json"), json.dumps({"replacements": replacements}, indent=2))
        print("Replacements summary written.")
    generatethirdpartynotices(root, out)
    print("THIRD-PARTY-NOTICES written to", out)

def main():
    p = argparse.ArgumentParser(prog="allicensecli.py", description="Albert Lane Microsoft-Plus license audit and remediation CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    spscan = sub.add_parser("scan", help="Scan repository and produce ALLICENSEAUDIT.json")
    spscan.add_argument("--root", default=".", help="Repository root")
    spscan.add_argument("--audit", default="ALLICENSEAUDIT.json", help="Audit output path")
    spscan.set_defaults(func=cmd_scan)

    spreplace = sub.add_parser("replace", help="Apply replacements based on an existing audit")
    spreplace.add_argument("--root", default=".", help="Repository root")
    spreplace.add_argument("--audit", default="ALLICENSEAUDIT.json", help="Audit input path")
    spreplace.add_argument("--backup-dir", default=None, help="Directory to store backups")
    spreplace.add_argument("--dry-run", action="store_true", help="Do not modify files; show what would be changed")
    spreplace.set_defaults(func=cmd_replace)

    spnotices = sub.add_parser("notices", help="Generate THIRD-PARTY-NOTICES (best-effort)")
    spnotices.add_argument("--root", default=".", help="Repository root")
    spnotices.add_argument("--out", default=None, help="Output path for THIRD-PARTY-NOTICES")
    spnotices.set_defaults(func=cmd_notices)

    spall = sub.add_parser("all", help="Run scan, optional replace, and generate notices")
    spall.add_argument("--root", default=".", help="Repository root")
    spall.add_argument("--audit", default=None, help="Audit output path")
    spall.add_argument("--out", default=None, help="THIRD-PARTY-NOTICES output path")
    spall.add_argument("--replace", action="store_true", help="Apply replacements after scan")
    spall.add_argument("--backup-dir", default=None, help="Directory to store backups")
    spall.add_argument("--dry-run", action="store_true", help="Do not modify files; show what would be changed")
    spall.set_defaults(func=cmd_all)

    args = p.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
