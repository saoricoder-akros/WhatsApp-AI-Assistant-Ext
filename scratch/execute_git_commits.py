import subprocess
import sys
import os

repo_dir = r"c:\Proyectos\WhatsApp AI Assistant Ext"

def run_git(args):
    result = subprocess.run(["git"] + args, cwd=repo_dir, capture_output=True, text=True)
    print(f"git {' '.join(args)}")
    if result.stdout.strip():
        print(result.stdout.strip())
    if result.stderr.strip():
        print(result.stderr.strip())
    if result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}")
    return result.returncode == 0

# Let's inspect git diff output to separate hunks if needed
print("Executing Git Commits Step by Step...")

# Commit 1: UI Styles & Search Input Refactoring
# Stage hello.html and popup.js UI parts
# We can use git add -p or git diff patch
run_git(["status"])
