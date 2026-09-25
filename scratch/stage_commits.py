import subprocess
import os

repo_dir = r"c:\Proyectos\WhatsApp AI Assistant Ext"

def run_cmd(cmd):
    result = subprocess.run(cmd, cwd=repo_dir, capture_output=True, text=True, shell=True)
    print(f"[{cmd}] Exit code: {result.returncode}")
    if result.stdout.strip():
        print(result.stdout.strip())
    if result.stderr.strip():
        print(result.stderr.strip())
    return result

print("Checking git diff...")
run_cmd("git status")
