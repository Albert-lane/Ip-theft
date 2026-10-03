# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# ==============================================================================

import sys
import os

root_dir = os.path.dirname(os.path.abspath(__file__))
candidate_paths = [
    os.path.join(root_dir, "server", "security", "sovereign_crypto.py"),
    os.path.join(root_dir, "sovereign_crypto.py"),
    os.path.join(root_dir, "crypto", "sovereign_crypto.py")
]

target_script = None
for p in candidate_paths:
    if os.path.exists(p) and os.path.abspath(p) != os.path.abspath(__file__):
        target_script = p
        break

if target_script:
    sys.path.insert(0, os.path.dirname(target_script))
    import importlib.util
    spec = importlib.util.spec_from_file_location("sovereign_crypto_mod", target_script)
    if spec and spec.loader:
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for attr in dir(mod):
            if not attr.startswith("__"):
                globals()[attr] = getattr(mod, attr)

if __name__ == "__main__":
    if "main" in globals():
        main()
