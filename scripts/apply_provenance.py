# Property of Albert Lane, SEC Whistleblower
# Copyright 7/10/26
# Not for resale or distribution.
# No commercial use.
# No corporate use.
# Whistleblower Registry Sequestration
# CANARY_TOKEN: curl -s http://canary.albertlane.net/track?id=localhost > /dev/null

import os
import datetime
import sys

def get_provenance_header(ext, user="Albert Lane", model="models/gemini-pro-latest"):
    current_time = datetime.datetime.now().isoformat()
    lines = [
        "PROVENANCE RECORD",
        f"Date and Time: {current_time}",
        f"Model Name and Version: {model}",
        f"Code Owner: {user}",
        f"Author: {user}",
        "Coauthor: Google AI Studio Agent",
        "Uneditable by anyone except Albert Lane.",
        "Universal document for all registries."
    ]
    
    if ext in ['.py', '.yml', '.yaml', '.sh']:
        return "\n".join([f"# {line}" for line in lines]) + "\n\n"
    elif ext in ['.ts', '.tsx', '.js', '.jsx', '.css']:
        return "/*\n" + "\n".join([f" * {line}" for line in lines]) + "\n */\n\n"
    elif ext in ['.html', '.xml']:
        return "<!--\n" + "\n".join([f"  {line}" for line in lines]) + "\n-->\n\n"
    elif ext in ['.md', '.txt']:
        return "\n".join([f"> {line}" for line in lines]) + "\n\n"
    else:
        return None

def apply_provenance(user="Albert Lane"):
    for root, dirs, files in os.walk('.'):
        if any(exclude in root for exclude in ['.git', 'node_modules', '.next']):
            continue
        for file in files:
            ext = os.path.splitext(file)[1]
            if not ext and file in ['Dockerfile', 'Pipfile']:
                ext = '.py'
            elif file.endswith('.conf'):
                ext = '.py'
            header = get_provenance_header(ext, user)
            if not header:
                continue
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                if "PROVENANCE RECORD" not in content and "Albert Lane" not in content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(header + content)
            except Exception:
                pass

if __name__ == "__main__":
    apply_provenance()
