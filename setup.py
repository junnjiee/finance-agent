"""
setup.py — Interactive setup for finance-agent.

Usage:
    bash setup.sh
    uv run python setup.py
"""

import os
import subprocess
import sys
from pathlib import Path

import pyperclip
import questionary

REPO_ROOT = Path(__file__).parent.resolve()
GITHUB_REPO = "git+https://github.com/junnjiee/finance-agent.git"
DEFAULT_DATA_DIR = str(Path.home() / ".config" / "finance_agent" / "data")

HARNESS_CHOICE = "Coding harnesses (Claude Code, Codex, Opencode, etc.)"
OPENCLAW_CHOICE = "OpenClaw"
HERMES_CHOICE = "Hermes Agent"


def install_mtool() -> bool:
    print("\nInstalling mtool globally via uv tool...")
    result = subprocess.run(
        ["uv", "tool", "install", "--reinstall", GITHUB_REPO],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"  FAILED:\n{result.stderr.strip()}")
        return False
    print("  OK  mtool")
    return True


def prompt_data_dir() -> str:
    raw = input(f"\nData directory path [{DEFAULT_DATA_DIR}]: ").strip()
    return str(Path(raw or DEFAULT_DATA_DIR).expanduser().resolve())


def show_env_export(data_dir: str):
    export_line = f'export FINANCE_AGENT_DATA_DIR="{data_dir}"'
    print("\n  Add this to your shell profile (~/.zshrc, ~/.bashrc, etc.):")
    print(f"\n    {export_line}\n")

    input("  Press Enter to copy to clipboard...")
    pyperclip.copy(export_line)
    print("  Copied.")


def prompt_harnesses() -> list[str]:
    choices = [HARNESS_CHOICE, OPENCLAW_CHOICE, HERMES_CHOICE]
    selected = questionary.checkbox(
        "Where will you use finance-agent? (space to select, enter to confirm)",
        choices=choices,
    ).ask()
    return selected or []


def run_subscript(script: Path, data_dir: str):
    cmd = [sys.executable, str(script), "--data-dir", data_dir]
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"\n  WARNING: {script.name} exited with code {result.returncode}")


def main():
    print("finance-agent setup")
    print("=" * 40)

    if not REPO_ROOT.joinpath(".agents", "skills").exists():
        print(
            f"ERROR: skills directory not found at {REPO_ROOT / '.agents' / 'skills'}"
        )
        sys.exit(1)

    # 1. Install mtool
    if not install_mtool():
        print("\nSetup cannot continue without mtool.")
        sys.exit(1)

    # 2. Data directory
    data_dir = prompt_data_dir()

    # 3. Env var instructions (only when non-default)
    if data_dir != str(Path(DEFAULT_DATA_DIR).expanduser().resolve()):
        show_env_export(data_dir)

    # 4. Harness selection
    selected = prompt_harnesses()
    if not selected:
        print("\nNothing selected — nothing else to do.")
        print("Run this script again any time to update your setup.")
        return

    print()

    # 5. Coding harnesses — nothing extra needed
    if HARNESS_CHOICE in selected:
        print("Coding harnesses: open your harness in this directory and you're ready.")
        print(f"  Data directory: {data_dir}")

    # 6. OpenClaw
    if OPENCLAW_CHOICE in selected:
        openclaw_home = Path(os.environ.get("OPENCLAW_HOME", Path.home() / ".openclaw"))
        if openclaw_home.exists():
            print("\nRunning OpenClaw setup...")
            run_subscript(REPO_ROOT / "openclaw" / "setup.py", data_dir)
        else:
            print(
                f"\nSkipping OpenClaw: {openclaw_home} not found. Install OpenClaw first."
            )

    # 7. Hermes
    if HERMES_CHOICE in selected:
        hermes_home = Path(os.environ.get("HERMES_HOME", Path.home() / ".hermes"))
        if hermes_home.exists():
            print("\nRunning Hermes setup...")
            run_subscript(REPO_ROOT / "hermes" / "setup.py", data_dir)
        else:
            print(
                f"\nSkipping Hermes: {hermes_home} not found. Install Hermes Agent first."
            )

    print("\nDone.")


if __name__ == "__main__":
    main()
