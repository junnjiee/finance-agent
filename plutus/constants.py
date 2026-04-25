"""Shared constants for plutus."""

from __future__ import annotations

from pathlib import Path

GITHUB_REPO = "git+https://github.com/junnjiee/plutus.git"
GLOBAL_CONFIG = Path.home() / ".config" / "plutus" / "plutus.json"
DEFAULT_DATA_DIR = str(Path.home() / ".config" / "plutus" / "data")

HERMES_META: dict[str, dict] = {
    "plutus-onboard": {
        "tags": ["finance", "personal-finance", "setup", "onboarding"],
        "related_skills": [
            "plutus-net-worth",
            "plutus-analyze-cashflow",
            "plutus-liability-tracker",
        ],
    },
    "plutus-net-worth": {
        "tags": ["finance", "personal-finance", "net-worth", "portfolio"],
        "related_skills": [
            "plutus-onboard",
            "plutus-analyze-cashflow",
            "plutus-liability-tracker",
        ],
    },
    "plutus-analyze-cashflow": {
        "tags": ["finance", "personal-finance", "cashflow", "runway", "savings"],
        "related_skills": [
            "plutus-onboard",
            "plutus-net-worth",
            "plutus-liability-tracker",
        ],
    },
    "plutus-liability-tracker": {
        "tags": ["finance", "personal-finance", "liabilities", "subscriptions"],
        "related_skills": [
            "plutus-onboard",
            "plutus-analyze-cashflow",
            "plutus-net-worth",
        ],
    },
    "plutus-expense-tracker": {
        "tags": ["finance", "personal-finance", "expenses", "spending", "budget"],
        "related_skills": [
            "plutus-onboard",
            "plutus-analyze-cashflow",
            "plutus-liability-tracker",
        ],
    },
    "plutus-email-receipts": {
        "tags": ["finance", "personal-finance", "expenses", "email", "receipts"],
        "related_skills": ["plutus-expense-tracker", "google-workspace", "himalaya"],
    },
}

HERMES_ADAPTER_NOTE = """\
> **Hermes adapter note:** When instructions refer to "the data directory", use
> the `finance_agent.data_dir` value in your config.yaml.
>
> **Output formatting:** Check the injected platform context to determine the user's messaging platform.
> If the platform is a messaging app (Telegram, WhatsApp, Signal, iMessage, or similar),
> Do NOT use markdown tables, labeled lines, or any other table-like format, bullet lists only.
> This overrides any skill instruction that says to use tables.
> On messaging platforms, you MUST use emojis — this is not optional.
> Every section header must start with a relevant emoji.
> Use emojis as visual separators between sections. Numbers, amounts, and key values should be paired with a contextual emoji.
> In a terminal or markdown-rendering environment, tables are fine and emojis are optional.
"""
