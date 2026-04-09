---
name: onboard
description: Collect the user's initial financial data and create the base JSON files in data/. Use on first interaction or when local finance files do not exist yet. Focus on baseline data collection and flexible core schemas; do not handle feature or add-on selection here.
---

# Onboarding

Use this skill to set up a user's local finance data for the first time.

The goal is narrow:

- collect the user's baseline financial information
- define broad JSON schemas that fit their situation
- write the initial files in `data/`

Do not use onboarding to decide which optional finance features apply. Feature-specific skills can add fields or files later.

## Working Style

- Use the current agent's normal way of asking questions, reading files, listing directories, and writing JSON. Do not rely on harness-specific tool names in the instructions.
- Read any existing files in `data/` before asking questions so you do not overwrite information the user already provided.
- Ask whether the user wants to provide everything at once or step by step, then match that pace.
- Accept natural language input. Do not force a rigid template unless the user asks for one.
- Keep a running summary of what has been captured so far.
- Before writing files, show the full summary and get explicit confirmation.

## Recommended Flow

Collect the following in order, skipping sections that are clearly not relevant to the user:

1. **Overview**
   Explain briefly what you track, that the data stays local in `data/` as JSON, and that you are going to collect the minimum needed to get started.
2. **Profile**
   Capture the user's base currency, currency symbol if they care about one, and current mode (`wealth_building` or `runway`).
3. **Accounts**
   Capture the accounts that matter for net worth and planning: cash, savings, investments, and any other material assets.
4. **Cashflow**
   Capture recurring income, recurring expenses, and recurring investment contributions if the user tracks them separately.
5. **Liabilities**
   Capture recurring obligations such as subscriptions, insurance, and loan repayments.
6. **Goals**
   Capture any financial goals with target amounts and dates.
7. **Preferences**
   Capture any defaults that should shape later analysis or presentation, such as preferred detail level or drawdown order.

## Data Collection Rules

- Keep onboarding focused on foundational data. Do not ask the user to enable or disable add-ons here.
- If the user volunteers information that belongs to a more specialized feature, preserve it only if it fits naturally into the schema. Otherwise note that a later skill can add it.
- For investment accounts, offer two storage styles:
  - units-based holdings with `ticker` and `units`
  - balance-based accounts with a manually maintained `balance`
- Recommend units-based holdings because later skills can price them automatically, but do not force that format.
- If a user provides a short ticker and you need to store it as a Yahoo Finance symbol, prepare the environment with `uv sync` and use `.venv/bin/mtool` to verify the symbol before saving it.
- Use ISO 8601 dates (`YYYY-MM-DD`) for stored dates.
- Do not store unnecessary sensitive information such as account numbers or national identifiers.

## File Setup

Before calculations or `mtool` usage, prepare the project environment with `uv sync`.

Create or update the base files in `data/`:

- `profile.json`
- `accounts.json`
- `cashflow.json`
- `liabilities.json`
- `goals.json`

Only create the files that are relevant to the information the user has actually provided. If a section is not yet known, it can be omitted until later.

## Schema Guidance

These schemas are intentionally broad. Adapt them to the user's situation instead of forcing the user into a rigid model. Later skills may extend these files with additional fields.

**profile.json**

```json
{
  "base_currency": "",
  "currency_symbol": "",
  "mode": "wealth_building|runway",
  "preferences": {},
  "created": "YYYY-MM-DD",
  "last_updated": "YYYY-MM-DD"
}
```

Notes:

- `preferences` is the long-term memory for user-specific defaults.
- Add other top-level keys only when the user actually needs them.

**accounts.json**

```json
{
  "accounts": [
    {
      "name": "",
      "type": "cash|savings|investment|other_asset",
      "currency": "",
      "balance": 0,
      "institution": "",
      "interest_rate": 0,
      "holdings": [{ "ticker": "", "units": 0 }],
      "notes": ""
    }
  ]
}
```

Notes:

- Use either `balance` or `holdings` as the main valuation source for an account.
- `holdings` is mainly for units-based investment accounts.
- Add fields only when they help later analysis.

**cashflow.json**

```json
{
  "income": [
    { "source": "", "amount": 0, "currency": "", "frequency": "monthly|yearly" }
  ],
  "expenses": [
    {
      "category": "",
      "amount": 0,
      "currency": "",
      "frequency": "monthly|yearly"
    }
  ],
  "investment_allocations": [
    {
      "target_account": "",
      "amount": 0,
      "currency": "",
      "frequency": "monthly|yearly"
    }
  ]
}
```

**liabilities.json**

```json
{
  "items": [
    {
      "name": "",
      "amount": 0,
      "currency": "",
      "frequency": "monthly|quarterly|yearly",
      "due_day": 1,
      "due_month": 1,
      "category": "subscription|insurance|loan|other",
      "notes": ""
    }
  ]
}
```

Notes:

- Store recurring obligations, not one-off spending.
- Do not store a fixed `next_due` date. Compute it later from `due_day` and `due_month`.
- `due_month` is only needed for yearly items.

**goals.json**

```json
{
  "goals": [
    {
      "name": "",
      "target_amount": 0,
      "currency": "",
      "target_date": "YYYY-MM-DD",
      "linked_accounts": [],
      "created": "YYYY-MM-DD",
      "notes": ""
    }
  ]
}
```

## Completion Checklist

Before finishing onboarding:

- make sure the captured data matches what the user said
- call out any assumptions or missing fields clearly
- get explicit confirmation before writing or overwriting files
- write the JSON files immediately after confirmation
- tell the user which files were created or updated
