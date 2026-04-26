import shutil
import subprocess

import typer

from plutus.constants import GITHUB_REPO

app = typer.Typer(help="Update plutus to the latest version.", invoke_without_command=True)


@app.callback()
def update():
    """Pull the latest version from GitHub and refresh skills."""
    uv = shutil.which("uv")
    if uv is None:
        typer.echo("uv not found. Install uv first: https://docs.astral.sh/uv/", err=True)
        raise typer.Exit(1)

    typer.echo("Updating plutus...")
    result = subprocess.run(
        [uv, "tool", "install", "--force", GITHUB_REPO],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        typer.echo(f"Failed to update plutus:\n{result.stderr}", err=True)
        raise typer.Exit(1)

    typer.echo("Refreshing skills...")
    result = subprocess.run(["plutus", "setup", "--saved"])
    if result.returncode != 0:
        typer.echo("Skill refresh failed.", err=True)
        raise typer.Exit(1)

    typer.echo("Done.")
