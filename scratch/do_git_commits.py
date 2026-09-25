import subprocess
import os

repo_dir = r"c:\Proyectos\WhatsApp AI Assistant Ext"

def run_git(args):
    res = subprocess.run(["git"] + args, cwd=repo_dir, capture_output=True, text=True)
    print(f"> git {' '.join(args)}")
    if res.stdout.strip():
        print(res.stdout.strip())
    if res.stderr.strip():
        print(res.stderr.strip())
    return res.returncode == 0

# 1. Commit 1: UI Styles & Visual Optimization
# We stage hello.html styling & popup.js search clear
print("--- COMMIT 1 ---")
# First, let's stage precalculated_analytics.json for Commit 2 later, but for now we can commit hello.html/popup.js UI parts
# Let's add hello.html and popup.js UI parts or stage hello.html
run_git(["add", "hello.html"])
run_git(["commit", "-m", "refactor(ui): reduce size of provider/status badge above technician name and clean search input"])

# 2. Commit 2: Geographic Catalogs (Provinces & Cantons)
print("--- COMMIT 2 ---")
run_git(["add", "precalculated_analytics.json"])
run_git(["add", "analytics.js"])
run_git(["commit", "-m", "feat(analytics): integrate provinces and cantons catalog for precise location mapping"])

# 3. Commit 3: Real-time chat processing & dynamic providers
print("--- COMMIT 3 ---")
run_git(["add", "popup.js"])
run_git(["commit", "-m", "feat(chat): enable real-time message processing for Soporte en Sitio Akros and dynamic providers"])

# 4. Commit 4: No Ticket Module & SheetJS Excel export
print("--- COMMIT 4 ---")
run_git(["add", "xlsx.full.min.js"])
run_git(["add", "scratch/"])
run_git(["commit", "-m", "feat(no-ticket): add unsupported tickets module, local SheetJS integration and excel export"])

print("--- GIT LOG SUMMARY ---")
run_git(["log", "-n", "4", "--oneline"])
