import json
import subprocess
import sys
from pathlib import Path

import typer
from rich.console import Console

console = Console()

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
        with console.status("Stashing local changes..."):
            stash = subprocess.run(
                ["git", "-C", str(repo_root), "stash"],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
        if stash.returncode != 0:
            console.print("[red]Failed to stash changes.[/red]")
            raise typer.Exit(1)

    with console.status("Pulling latest changes from GitHub..."):
        result = subprocess.run(
            ["git", "-C", str(repo_root), "pull"],
            capture_output=True, text=True,
        )
    pull_failed = result.returncode != 0
    already_up_to_date = "Already up to date." in result.stdout

    if has_changes:
        with console.status("Restoring stashed changes..."):
            subprocess.run(
                ["git", "-C", str(repo_root), "stash", "pop"],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )

    if pull_failed:
        console.print("[red]git pull failed.[/red]")
        raise typer.Exit(1)

    if already_up_to_date:
        console.print("Already up to date.")

    with console.status("Reinstalling mtool and refreshing skills..."):
        result = subprocess.run(
            [sys.executable, str(repo_root / "setup.py"), "--update"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
    if result.returncode != 0:
        console.print("[red]Setup refresh failed.[/red]")
        raise typer.Exit(1)

    console.print("[green]Done.[/green]")


if __name__ == "__main__":
    app()
