#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# ==============================================================================

import os
import tarfile
import shutil
import hashlib

def main():
    staging_dir = "sovereign_monorepo_export"
    if os.path.exists(staging_dir):
        shutil.rmtree(staging_dir)

    os.makedirs(f"{staging_dir}/crypto", exist_ok=True)
    os.makedirs(f"{staging_dir}/terminal", exist_ok=True)
    os.makedirs(f"{staging_dir}/package_manager", exist_ok=True)
    os.makedirs(f"{staging_dir}/engine", exist_ok=True)
    os.makedirs(f"{staging_dir}/security", exist_ok=True)
    os.makedirs(f"{staging_dir}/provenance", exist_ok=True)
    os.makedirs(f"{staging_dir}/ui", exist_ok=True)
    os.makedirs(f"{staging_dir}/config", exist_ok=True)
    os.makedirs(f"{staging_dir}/lane_vm", exist_ok=True)

    # 1. Crypto Subsystem
    shutil.copy("server/security/sovereign_crypto.py", f"{staging_dir}/crypto/sovereign_crypto.py")
    shutil.copy("sovereign_crypto.py", f"{staging_dir}/crypto/entrypoint_crypto.py")
    shutil.copy("src/lib/vibeCrypto.ts", f"{staging_dir}/crypto/vibeCrypto.ts")

    # 2. Terminal & CLI
    shutil.copy("src/components/VibeTerminalEnclave.tsx", f"{staging_dir}/terminal/VibeTerminalEnclave.tsx")
    shutil.copy("server/security/vibeTerminalEngine.ts", f"{staging_dir}/terminal/vibeTerminalEngine.ts")
    if os.path.exists("scripts/sec17684_cli_daemon.py"):
        shutil.copy("scripts/sec17684_cli_daemon.py", f"{staging_dir}/terminal/sec17684_cli_daemon.py")

    # 3. Package Manager
    shutil.copy("package.json", f"{staging_dir}/package_manager/package.json")
    if os.path.exists("bun.lock"):
        shutil.copy("bun.lock", f"{staging_dir}/package_manager/bun.lock")

    # 4. Engine & Server
    shutil.copy("server.ts", f"{staging_dir}/engine/server.ts")
    if os.path.exists("server/lib/jsonExtractor.ts"):
        shutil.copy("server/lib/jsonExtractor.ts", f"{staging_dir}/engine/jsonExtractor.ts")
    if os.path.exists("server/lib/agentClient.ts"):
        shutil.copy("server/lib/agentClient.ts", f"{staging_dir}/engine/agentClient.ts")

    # 5. Security & Auditing
    shutil.copy("server/security/networkEgressGraph.ts", f"{staging_dir}/security/networkEgressGraph.ts")
    shutil.copy("server/security/starlinkAuditEngine.ts", f"{staging_dir}/security/starlinkAuditEngine.ts")
    shutil.copy("server/security/ipBlocker.ts", f"{staging_dir}/security/ipBlocker.ts")

    # 6. Provenance & Attestations
    for f in [
        "vault/PROVENANCE_SHA256_DISTRIBUTION.txt",
        "vault/provenance_distribution_manifest.json",
        "vault/sovereign_ed25519_provenance_attestation.json"
    ]:
        if os.path.exists(f):
            shutil.copy(f, f"{staging_dir}/provenance/{os.path.basename(f)}")

    # 7. UI Components
    for f in [
        "src/components/NetworkEgressGraph.tsx",
        "src/components/StarlinkTerminalAuditView.tsx",
        "src/components/McpProvenanceView.tsx",
        "src/App.tsx",
        "src/types.ts",
        "src/main.tsx"
    ]:
        if os.path.exists(f):
            shutil.copy(f, f"{staging_dir}/ui/{os.path.basename(f)}")

    # 8. Config
    for f in [
        "vite.config.ts",
        "tsconfig.json",
        "metadata.json",
        "docker-compose.yml"
    ]:
        if os.path.exists(f):
            shutil.copy(f, f"{staging_dir}/config/{os.path.basename(f)}")

    # 9. Lane-VM Proprietary C++ & XML.C Architecture
    if os.path.exists("server/lane_vm"):
        for f in os.listdir("server/lane_vm"):
            fp = os.path.join("server/lane_vm", f)
            if os.path.isfile(fp):
                shutil.copy(fp, f"{staging_dir}/lane_vm/{f}")

    # Generate Manifest & README
    readme_content = """# Albert Lane Sovereign Enclave & Vibe Terminal Architecture
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
License: Albert Lane Proprietary License v1.2

## Monorepo Redesign & Meta AI Deployment Package

This tarball packages your proprietary custom terminal, CLI, unified package managers,
core engine, and pure Python/TypeScript cryptographic subsystems for integration into your GitHub monorepo redesign.

### Modular Architecture:
1. `crypto/`
   - `sovereign_crypto.py`: Pure Python AES-256 block cipher (FIPS 197, 14 rounds, GF(2^8) S-box), AES-GCM Galois Counter Mode over GF(2^128) polynomial field, native SHA-256 (64-round), PBKDF2-HMAC-SHA256 (10,000 rounds), and Albert Lane Fibonacci-Galois Golden Ratio (0x9E3779B9) diffusion operator.
   - `entrypoint_crypto.py`: CLI testing and JSON-RPC IPC runner (`--test`, `--rpc`).
   - `vibeCrypto.ts`: Browser WebCrypto API AES-256-GCM decryption, constant-time tag verification, and zero-knowledge streaming sorter.
2. `terminal/`
   - `VibeTerminalEnclave.tsx`: FROI.OS interactive PTY terminal UI with wire crypto inspector, live packet decryption, and tabbed package manager.
   - `vibeTerminalEngine.ts`: WebSocket PTY streaming broker, IPC bridge to Python, and AES-256-GCM envelope multiplexer.
   - `sec17684_cli_daemon.py`: CLI daemon and command interceptor.
3. `package_manager/`
   - Multi-ecosystem resolver (`lane-pm`, `bun`, `npm`, `cargo`, `pip`, `termux`) with conversational intent translation and AST cryptographic integrity seals.
4. `engine/`
   - `server.ts`: Express + Vite full-stack server with REST API (`/api/vibe/crypto/status`, `/api/vibe/packages`, `/api/vibe/translate`, `/api/vibe/execute`), WebSocket upgrade (`/ws/vibe-terminal`), and cryptographic status headers.
5. `security/`
   - `networkEgressGraph.ts`: Live destination IP auditor and D3 graph engine.
   - `starlinkAuditEngine.ts`: Starlink RF uplink telemetry and ground station verification.
   - `ipBlocker.ts`: Automated IP sequestration and anti-exfiltration firewall.
6. `provenance/`
   - Immutable audit logs, SHA-256 distribution proofs, and Ed25519 attestations under SEC Whistleblower No. 17684-273-411-436.
7. `ui/`
   - Responsive mathematical visualization components and React state orchestration.
8. `config/`
   - Vite, TypeScript, and Docker configuration files.

### Verification & Deployment Instructions (Meta AI Integration):
```bash
# 1. Unpack into your monorepo
tar -xzvf sovereign-enclave-monorepo.tar.gz

# 2. Verify pure Python cryptographic self-tests
python3 crypto/entrypoint_crypto.py --test

# 3. Boot full-stack development service
npm install && npm run dev
```
"""
    with open(f"{staging_dir}/README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)

    tarball_name = "sovereign-enclave-monorepo.tar.gz"
    with tarfile.open(tarball_name, "w:gz") as tar:
        tar.add(staging_dir, arcname="sovereign-enclave-monorepo")

    # Clean up uncompressed staging directory to keep workspace clean
    shutil.rmtree(staging_dir)

    # Compute SHA-256 of the tarball
    with open(tarball_name, "rb") as f:
        tarball_hash = hashlib.sha256(f.read()).hexdigest()

    # Place in public directory for browser / curl download
    os.makedirs("public", exist_ok=True)
    shutil.copy(tarball_name, f"public/{tarball_name}")
    shutil.copy(tarball_name, "public/albert-lane-sovereign-enclave.tar.gz")

    with open("public/sovereign-enclave-monorepo.sha256", "w") as f:
        f.write(f"{tarball_hash}  {tarball_name}\n")

    size_bytes = os.path.getsize(tarball_name)
    print(f"SUCCESS: Created {tarball_name}")
    print(f"File Size: {size_bytes / 1024:.2f} KB ({size_bytes} bytes)")
    print(f"SHA-256 Seal: {tarball_hash}")

if __name__ == "__main__":
    main()
