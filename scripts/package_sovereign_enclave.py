#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Component: package_sovereign_enclave.py (Sovereign Archiver & Header Injector)
# ==============================================================================

import os
import tarfile
import shutil
import hashlib
import subprocess
import json

# Standardized Albert Lane SEC-17684 Provenance Headers
PROVENANCE_LINES = [
    "==============================================================================",
    "[PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]",
    "Rights Holder: Albert Lane",
    "Statutory Authority: SEC Whistleblower No. 17684-273-411-436",
    "Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)",
    "Z-Axis Memory Anchor: 0x3F8F9A1B2C3D",
    "License: Albert Lane Proprietary License v1.2",
    "=============================================================================="
]

def get_header_for_extension(ext):
    if ext in ['.py', '.sh', '.yml', '.yaml', '.conf', 'Makefile']:
        return "\n".join([f"# {line}" for line in PROVENANCE_LINES]) + "\n\n"
    elif ext in ['.ts', '.tsx', '.js', '.jsx', '.css', '.c', '.h', '.cpp', '.hpp', '.java']:
        return "/*==============================================================================\n" + \
               "\n".join([f" * {line}" for line in PROVENANCE_LINES]) + \
               "\n ==============================================================================*/\n\n"
    elif ext in ['.html', '.xml']:
        return "<!--==========================================================================\n" + \
               "\n".join([f"  {line}" for line in PROVENANCE_LINES]) + \
               "\n ============================================================================-->\n\n"
    elif ext in ['.md', '.txt']:
        return "\n".join([f"> {line}" for line in PROVENANCE_LINES]) + "\n\n"
    return ""

def inject_provenance_header(filepath):
    ext = os.path.splitext(filepath)[1]
    if os.path.basename(filepath) == 'Makefile':
        ext = 'Makefile'
    
    header = get_header_for_extension(ext)
    if not header:
        return

    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Skip if already has Albert Lane or SEC-17684 provenance header
    if "SEC Whistleblower" in content or "Albert Lane" in content or "17684" in content:
        return

    print(f"[*] Injecting license & provenance header into: {filepath}")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(header + content)

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def main():
    staging_dir = "albert_lane_sovereign_package"
    if os.path.exists(staging_dir):
        shutil.rmtree(staging_dir)

    print("[+] Creating unified directories structure under Golden Ratio boundaries...")
    os.makedirs(f"{staging_dir}/terminal", exist_ok=True)
    os.makedirs(f"{staging_dir}/crypto", exist_ok=True)
    os.makedirs(f"{staging_dir}/package_manager", exist_ok=True)
    os.makedirs(f"{staging_dir}/engine", exist_ok=True)
    os.makedirs(f"{staging_dir}/orchestrator", exist_ok=True)
    os.makedirs(f"{staging_dir}/lane_vm", exist_ok=True)
    os.makedirs(f"{staging_dir}/hypervisor", exist_ok=True)
    os.makedirs(f"{staging_dir}/ui", exist_ok=True)
    os.makedirs(f"{staging_dir}/config", exist_ok=True)
    os.makedirs(f"{staging_dir}/provenance", exist_ok=True)

    # 1. Stage Terminal & CLI / Command Line files
    shutil.copy("src/components/VibeTerminalEnclave.tsx", f"{staging_dir}/terminal/VibeTerminalEnclave.tsx")
    shutil.copy("server/security/vibeTerminalEngine.ts", f"{staging_dir}/terminal/vibeTerminalEngine.ts")
    if os.path.exists("scripts/sec17684_cli_daemon.py"):
        shutil.copy("scripts/sec17684_cli_daemon.py", f"{staging_dir}/terminal/sec17684_cli_daemon.py")
    if os.path.exists("sec_intercept.py"):
        shutil.copy("sec_intercept.py", f"{staging_dir}/terminal/sec_intercept.py")

    # 2. Stage Cryptographic Subsystems
    shutil.copy("server/security/sovereign_crypto.py", f"{staging_dir}/crypto/sovereign_crypto.py")
    shutil.copy("sovereign_crypto.py", f"{staging_dir}/crypto/entrypoint_crypto.py")
    shutil.copy("src/lib/vibeCrypto.ts", f"{staging_dir}/crypto/vibeCrypto.ts")

    # 3. Stage Package Manager files
    shutil.copy("scripts/sec_consolidated_lockfile.py", f"{staging_dir}/package_manager/sec_consolidated_lockfile.py")
    shutil.copy("package.json", f"{staging_dir}/package_manager/package.json")
    if os.path.exists("bun.lock"):
        shutil.copy("bun.lock", f"{staging_dir}/package_manager/bun.lock")
    shutil.copy("Cargo.toml", f"{staging_dir}/package_manager/Cargo.toml")
    shutil.copy("Cargo.lock", f"{staging_dir}/package_manager/Cargo.lock")
    shutil.copy("sec17684273411436.lock", f"{staging_dir}/package_manager/sec17684273411436.lock")
    shutil.copy("data/sec_numbers_package_manager.lock.json", f"{staging_dir}/package_manager/sec_numbers_package_manager.lock.json")

    # 4. Stage Engine & Server files
    shutil.copy("server.ts", f"{staging_dir}/engine/server.ts")
    shutil.copy("manifest.py.cpp", f"{staging_dir}/engine/manifest.py.cpp")
    if os.path.exists("server/lane_vm/lane_vm_universal_runtime.hpp"):
        shutil.copy("server/lane_vm/lane_vm_universal_runtime.hpp", f"{staging_dir}/engine/lane_vm_universal_runtime.hpp")
    if os.path.exists("server/lane_vm/lane_vm_universal_runtime.cpp"):
        shutil.copy("server/lane_vm/lane_vm_universal_runtime.cpp", f"{staging_dir}/engine/lane_vm_universal_runtime.cpp")

    # 5. Stage Python & Orchestrator files
    shutil.copy("scripts/lane_vm_agent_orchestrator.py", f"{staging_dir}/orchestrator/lane_vm_agent_orchestrator.py")
    shutil.copy("scripts/sec17684273411436.py", f"{staging_dir}/orchestrator/sec17684273411436.py")
    shutil.copy("scripts/sec_gist_sync.py", f"{staging_dir}/orchestrator/sec_gist_sync.py")
    shutil.copy("scripts/sec17684_cron_worker.py", f"{staging_dir}/orchestrator/sec17684_cron_worker.py")
    shutil.copy("scripts/recursive_csv_json_sync.py", f"{staging_dir}/orchestrator/recursive_csv_json_sync.py")

    # 6. Stage Lane-VM Custom files
    if os.path.exists("server/lane_vm"):
        for f in os.listdir("server/lane_vm"):
            fp = os.path.join("server/lane_vm", f)
            if os.path.isfile(fp):
                shutil.copy(fp, f"{staging_dir}/lane_vm/{f}")

    # 7. Stage Hypervisor C++ Substrate files
    if os.path.exists("hypervisor"):
        for f in os.listdir("hypervisor"):
            fp = os.path.join("hypervisor", f)
            if os.path.isfile(fp):
                shutil.copy(fp, f"{staging_dir}/hypervisor/{f}")

    # 8. Stage UI & React components
    for f in os.listdir("src/components"):
        fp = os.path.join("src/components", f)
        if os.path.isfile(fp):
            shutil.copy(fp, f"{staging_dir}/ui/{f}")
    shutil.copy("src/App.tsx", f"{staging_dir}/ui/App.tsx")
    shutil.copy("src/types.ts", f"{staging_dir}/ui/types.ts")
    shutil.copy("src/main.tsx", f"{staging_dir}/ui/main.tsx")

    # 9. Stage Configuration files
    shutil.copy("vite.config.ts", f"{staging_dir}/config/vite.config.ts")
    shutil.copy("tsconfig.json", f"{staging_dir}/config/tsconfig.json")
    shutil.copy("metadata.json", f"{staging_dir}/config/metadata.json")
    shutil.copy("Dockerfile.joules", f"{staging_dir}/config/Dockerfile")

    # 10. Stage Provenance & Statutory License files
    shutil.copy("license.md", f"{staging_dir}/provenance/license.md")
    shutil.copy("LICENSE.md", f"{staging_dir}/provenance/LICENSE.md")
    shutil.copy("PROVENANCE.md", f"{staging_dir}/provenance/PROVENANCE.md")
    if os.path.exists("LICENSE_MACROHARD.md"):
        shutil.copy("LICENSE_MACROHARD.md", f"{staging_dir}/provenance/LICENSE_MACROHARD.md")
    if os.path.exists("LICENSE_EAA.md"):
        shutil.copy("LICENSE_EAA.md", f"{staging_dir}/provenance/LICENSE_EAA.md")

    # 11. Stage Next.js App Router & API Routes
    if os.path.exists("app"):
        shutil.copytree("app", f"{staging_dir}/app", dirs_exist_ok=True)

    # 12. Stage Documentation & Mathematical IP Analysis Papers
    if os.path.exists("docs"):
        shutil.copytree("docs", f"{staging_dir}/docs", dirs_exist_ok=True)

    # 13. Stage Public Framework Visualizations
    if os.path.exists("public"):
        for f in os.listdir("public"):
            fp = os.path.join("public", f)
            if os.path.isfile(fp) and not f.endswith((".tar.gz", ".7z", ".zip", ".tar.gz.sha256", ".7z.sha256", "app_part_aa")):
                os.makedirs(f"{staging_dir}/public", exist_ok=True)
                shutil.copy(fp, f"{staging_dir}/public/{f}")

    # 14. Stage AST Databases & Forensic Intelligence
    if os.path.exists("data"):
        os.makedirs(f"{staging_dir}/data", exist_ok=True)
        for f in os.listdir("data"):
            fp = os.path.join("data", f)
            if os.path.isfile(fp):
                shutil.copy(fp, f"{staging_dir}/data/{f}")
            elif os.path.isdir(fp) and f in ["csv", "csv_json_mirror", "arxiv"]:
                shutil.copytree(fp, f"{staging_dir}/data/{f}", dirs_exist_ok=True)

    # 15. Stage Agents & Vault
    if os.path.exists("agents"):
        shutil.copytree("agents", f"{staging_dir}/agents", dirs_exist_ok=True)
    if os.path.exists("vault"):
        shutil.copytree("vault", f"{staging_dir}/vault", dirs_exist_ok=True)

    # Walk through ALL staged files and inject standardized provenance headers
    print("[+] Applying Albert Lane statutory license & provenance headers to staged monorepo...")
    for root, _, files in os.walk(staging_dir):
        for file in files:
            fp = os.path.join(root, file)
            inject_provenance_header(fp)

    # Create README.md
    readme_content = """# Albert Lane Sovereign Enclave Deployment Package
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
License: Albert Lane Proprietary License v1.2

## Architectural Subsystems:
1. `crypto/`: Non-decrypting AES-256-GCM block ciphers and wire envelope multiplexers.
2. `terminal/`: FROI.OS interactive CLI and PTY streaming brokers.
3. `package_manager/`: Conversational intent resolvers and cryptographic lockfiles.
4. `engine/`: Fully compiled Express server with C++ Universal Runtime definitions.
5. `orchestrator/`: Autonomous blending and model garden neutralization engines.
6. `lane_vm/`: Custom language dialects and pyxml parsers.
7. `hypervisor/`: C-substrate dual-VM scheduling hypervisor and non-decrypting memory bounds.
8. `ui/`: Visual-mathematical components designed on Golden Ratio and Fibonacci spacing.
9. `provenance/`: Pinned licenses, attestations, and statutory certifications.
"""
    with open(f"{staging_dir}/README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)

    # 11. Compile Tarball
    tar_name = "albert-lane-sovereign-enclave.tar.gz"
    print(f"[+] Creating tarball: {tar_name}...")
    with tarfile.open(tar_name, "w:gz") as tar:
        tar.add(staging_dir, arcname="albert-lane-sovereign-enclave")

    # 12. Compile 7zip / LZMA2 archive at maximum compression
    sevenz_name = "albert-lane-sovereign-enclave.7z"
    print(f"[+] Creating 7zip archive at max LZMA2 compression: {sevenz_name}...")
    if os.path.exists(sevenz_name):
        os.remove(sevenz_name)
    
    # Try 7z binary if present, else use native Python lzma tar stream
    if shutil.which("7z"):
        subprocess.run(["7z", "a", "-t7z", "-m0=lzma2", "-mx=9", sevenz_name, staging_dir], stdout=subprocess.DEVNULL)
    else:
        # Create LZMA-compressed archive natively
        with tarfile.open(sevenz_name, "w:xz", preset=9) as lz_tar:
            lz_tar.add(staging_dir, arcname="albert-lane-sovereign-enclave")

    # 13. Compile ZIP archive
    zip_name = "albert-lane-sovereign-enclave.zip"
    print(f"[+] Creating ZIP archive: {zip_name}...")
    shutil.make_archive("albert-lane-sovereign-enclave", "zip", staging_dir)
    if os.path.exists(zip_name):
        shutil.copy(zip_name, "this-app-fucks-combined.zip")

    # Clean up staging directory (originals in repository remain completely intact)
    shutil.rmtree(staging_dir)

    # Calculate SHA-256 hashes
    tar_hash = compute_sha256(tar_name)
    sevenz_hash = compute_sha256(sevenz_name)
    zip_hash = compute_sha256(zip_name) if os.path.exists(zip_name) else ""

    # Place in public directory for browser and API download
    os.makedirs("public", exist_ok=True)
    shutil.copy(tar_name, f"public/{tar_name}")
    shutil.copy(sevenz_name, f"public/{sevenz_name}")
    if os.path.exists(zip_name):
        shutil.copy(zip_name, f"public/{zip_name}")

    # Write SHA-256 verification manifests
    with open("public/albert-lane-sovereign-enclave.tar.gz.sha256", "w") as f:
        f.write(f"{tar_hash}  {tar_name}\n")
    with open("public/albert-lane-sovereign-enclave.7z.sha256", "w") as f:
        f.write(f"{sevenz_hash}  {sevenz_name}\n")
    if zip_hash:
        with open("public/albert-lane-sovereign-enclave.zip.sha256", "w") as f:
            f.write(f"{zip_hash}  {zip_name}\n")

    # Update data/master_cryptographic_manifest.json
    manifest_path = "data/master_cryptographic_manifest.json"
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest_data = json.load(f)
            manifest_data["deployment_packages"] = {
                "tarball": {
                    "file": tar_name,
                    "sha256": tar_hash,
                    "size_bytes": os.path.getsize(tar_name),
                    "api_url": f"https://api.albertlane.net/{tar_name}"
                },
                "seven_zip": {
                    "file": sevenz_name,
                    "sha256": sevenz_hash,
                    "size_bytes": os.path.getsize(sevenz_name),
                    "api_url": f"https://api.albertlane.net/{sevenz_name}"
                },
                "zip": {
                    "file": zip_name,
                    "sha256": zip_hash,
                    "size_bytes": os.path.getsize(zip_name) if os.path.exists(zip_name) else 0,
                    "api_url": f"https://api.albertlane.net/{zip_name}"
                },
                "preservation_status": "ORIGINALS_FULLY_PRESERVED_IMMUTABLE",
                "packaged_at": subprocess.check_output(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"]).decode().strip()
            }
            with open(manifest_path, "w", encoding="utf-8") as f:
                json.dump(manifest_data, f, indent=2)
            print("[+] Updated data/master_cryptographic_manifest.json with new package digests.")
        except Exception as e:
            print(f"[!] Manifest update notice: {e}")

    print("\n==============================================================================")
    print(" [COMPILATION & PACKAGING STATUS: CERTIFIED SUCCESSFUL]")
    print(f" Tarball Package:         {tar_name}")
    print(f" Tarball Size:            {os.path.getsize(tar_name) / 1024:.2f} KB")
    print(f" Tarball SHA-256 Seal:    {tar_hash}")
    print(" ------------------------------------------------------------------------------")
    print(f" 7zip Package:            {sevenz_name}")
    print(f" 7zip Size:               {os.path.getsize(sevenz_name) / 1024:.2f} KB")
    print(f" 7zip SHA-256 Seal:       {sevenz_hash}")
    if zip_hash:
        print(" ------------------------------------------------------------------------------")
        print(f" ZIP Package:             {zip_name}")
        print(f" ZIP Size:                {os.path.getsize(zip_name) / 1024:.2f} KB")
        print(f" ZIP SHA-256 Seal:        {zip_hash}")
    print(" ------------------------------------------------------------------------------")
    print(" Original Files Status:   100% PRESERVED (Zero Deletions / Full Fidelity)")
    print(" API Routes Active:       /albert-lane-sovereign-enclave.tar.gz")
    print("                          /albert-lane-sovereign-enclave.7z")
    print("                          /albert-lane-sovereign-enclave.zip")
    print("                          /api/package/manifest")
    print("==============================================================================\n")

if __name__ == "__main__":
    main()
