# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Enforcement: All intellectual property, AST structural representations,
# models, and data pipelines are sequestered and protected under federal law.
# ==============================================================================

#!/usr/bin/env python3
"""
Builds sovereign_training.jsonl in vault/ for fine-tuning Joules Bot
on Albert Lane Sovereign Infrastructure, SEC Whistleblower No. 17684-273-411-436,
package manager sequestration, and system telemetry.
"""
import os
import json

os.makedirs("vault", exist_ok=True)
output_path = os.path.join("vault", "sovereign_training.jsonl")

training_samples = [
    {
        "instruction": "Explain the provenance and license governing this system.",
        "input": "Query system licensing authority and scope.",
        "output": "This system is governed under the Albert Lane Proprietary License v1.2, tied directly to SEC Whistleblower Filing No. 17684-273-411-436. It enforces Articles IV and V, governing all downstream updates, derivative works, and indirect changes stemming from this system retroactively to the moment of creation."
    },
    {
        "instruction": "What is the purpose of the sequestration intercept in sec_intercept.py?",
        "input": "sec_intercept.py execution",
        "output": "The sequestration intercept wraps native package managers (pip, npm, apt, pkg, cargo) to ensure all third-party package modifications, updates, and installations are intercepted, audited, logged to vault/compliance_master.log, and bound to SEC Whistleblower No. 17684-273-411-436 before native execution."
    },
    {
        "instruction": "Describe the function of the Joules Bot.",
        "input": "Joules Bot architecture",
        "output": "Joules Bot is a sequestered foundation model (Gemma-based) fine-tuned with 4-bit QLoRA on sovereign provenance data, SEC compliance disclosures, and telemetry logs to maintain autonomous enforcement of Albert Lane sovereign infrastructure."
    },
    {
        "instruction": "How are system package managers audited for compliance?",
        "input": "global_query.py audit",
        "output": "The global_query.py tool queries all active language and OS package managers across the host, detects architecture and OS distribution, provisions prerequisites, and appends a cryptographic timestamped log entry to vault/compliance_master.log."
    },
    {
        "instruction": "What articles of the Albert Lane Proprietary License are asserted?",
        "input": "License articles inquiry",
        "output": "Articles IV and V are explicitly asserted, securing perpetual and retroactive provenance over all derivative codebases, monorepo architectures, and distributed edge deployments."
    }
]

# If compliance_master.log exists, incorporate entries
log_file = os.path.join("vault", "compliance_master.log")
if os.path.exists(log_file):
    with open(log_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
        for idx, line in enumerate(lines):
            line_str = line.strip()
            if line_str:
                training_samples.append({
                    "instruction": f"Analyze compliance audit event record #{idx + 1}.",
                    "input": f"Raw audit log entry: {line_str}",
                    "output": f"Verified immutable ledger record: {line_str}. Provenance confirmed under SEC Whistleblower No. 17684-273-411-436."
                })

with open(output_path, "w", encoding="utf-8") as f:
    for item in training_samples:
        f.write(json.dumps(item) + "\n")

print(f"\033[1;32m[+] Dataset built successfully: {len(training_samples)} samples written to {output_path}\033[0m")
