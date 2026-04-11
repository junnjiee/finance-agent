import json
import subprocess
import sys
from pathlib import Path

import typer

from mtool import expenses
from mtool import market

app = typer.Typer()
app.add_typer(expenses.app, name="expenses")
app.add_typer(market.app, name="market")

GLOBAL_CONFIG = Path.home() / ".config" / "finance_agent" / "mtool.json"


@app.command()
def update():
    """Pull the latest changes from GitHub and refresh skills."""
    if not GLOBAL_CONFIG.exists():
        print("No setup config found. Run setup first: bash setup.sh")
        raise typer.Exit(1)

    repo_root = Path(json.loads(GLOBAL_CONFIG.read_text())["repo_root"])
    if not repo_root.exists():
        print(f"Repo not found at {repo_root}. Re-run bash setup.sh to reconfigure.")
        raise typer.Exit(1)

    # Check for uncommitted changes
    status = subprocess.run(
        ["git", "-C", str(repo_root), "status", "--porcelain"],
        capture_output=True, text=True,
    )
    has_changes = bool(status.stdout.strip())

    if has_changes:
        print("Stashing local changes...")
        stash = subprocess.run(
            ["git", "-C", str(repo_root), "stash"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        if stash.returncode != 0:
            print("Failed to stash changes.")
            raise typer.Exit(1)

    print(f"Pulling latest changes from GitHub ({repo_root})...")
    result = subprocess.run(
        ["git", "-C", str(repo_root), "pull"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    pull_failed = result.returncode != 0

    if has_changes:
        print("Restoring stashed changes...")
        subprocess.run(
            ["git", "-C", str(repo_root), "stash", "pop"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )

    if pull_failed:
        print("git pull failed.")
        raise typer.Exit(1)

    print("\nRefreshing mtool and skills...")
    result = subprocess.run(
        [sys.executable, str(repo_root / "setup.py"), "--update"],
        text=True,
    )
    if result.returncode != 0:
        print("Setup refresh failed.")
        raise typer.Exit(1)


if __name__ == "__main__":
    app()
