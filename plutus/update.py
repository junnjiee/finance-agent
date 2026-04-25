"""CLI wrapper for plutus update command."""

from __future__ import annotations

import shutil
import subprocess

import typer

from plutus.constants import GITHUB_REPO


def update():
    """Pull the latest version from GitHub and refresh skills."""
    uv = shutil.which("uv")
    if uv is None:
        print("uv not found. Install uv first: https://docs.astral.sh/uv/")
        raise typer.Exit(1)

    print("Updating plutus...")
    result = subprocess.run(
        [uv, "tool", "install", "--force", GITHUB_REPO],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Failed to update plutus:\n{result.stderr}")
        raise typer.Exit(1)

    print("Refreshing skills...")
    result = subprocess.run(["plutus", "setup", "--saved"])
    if result.returncode != 0:
        print("Skill refresh failed.")
        raise typer.Exit(1)

    print("Done.")
