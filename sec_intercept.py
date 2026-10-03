# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Enforcement: All intellectual property, AST structural representations,
# models, and data pipelines are sequestered and protected under federal law.
# ==============================================================================

#!/usr/bin/env python3
import sys
import os
import subprocess
from datetime import datetime, timezone

def log_provenance(manager, packages):
    """Writes the interception event to the immutable ledger."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    log_file = os.path.join("vault", "compliance_master.log")
    
    pkg_str = ", ".join(packages)
    entry = f"[{timestamp}] SEQUESTRATION INTERCEPT: Manager [{manager}] requested [{pkg_str}] | SEC Whistleblower No. 17684-273-411-436 ENFORCED\n"
    
    os.makedirs("vault", exist_ok=True)
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(entry)
        
    print(f"\n\033[1;33m[!] SEC PROVENANCE ENFORCED:\033[0m Intercepted request for {pkg_str} via {manager}")
    print(f"\033[1;32m[+] Logging complete. Releasing execution to native binary...\033[0m\n")

def main():
    if len(sys.argv) < 2:
        print("Usage: sec_intercept.py <package_manager> [args...]")
        sys.exit(1)

    manager = sys.argv[1]
    args = sys.argv[2:]

    # Detect if the command is pulling new software (install, add, etc.)
    install_keywords = ["install", "add", "i", "update"]
    is_install = any(kw in args for kw in install_keywords)

    if is_install:
        # Extract target package names (ignoring flags like -y or --save)
        packages = [arg for arg in args if not arg.startswith("-") and arg not in install_keywords]
        if packages:
            log_provenance(manager, packages)

    # Execute the actual native command
    cmd = [manager] + args
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        sys.exit(e.returncode)
    except FileNotFoundError:
        print(f"\033[1;31m[!] FATAL: Native package manager '{manager}' not found on host.\033[0m")

if __name__ == "__main__":
    main()
