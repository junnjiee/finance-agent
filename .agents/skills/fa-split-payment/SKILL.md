---
name: fa-split-payment
description: Track shared expenses and what others owe you. Use when the user wants to log a split expense, check who owes them money, record a settlement, view outstanding balances, or manage split groups.
---

# Split Payment Tracker

Use this skill to manage shared expenses from your perspective — you paid, others owe you. All splits are single-sided: you are always the payer, and participants are the people who owe you their share.

## Load Context

Resolve the data directory first: use `FINANCE_AGENT_DATA_DIR` if set, otherwise `~/.config/finance_agent/data/`.

- Read `profile.json` to load `base_currency`, `currency_symbol`, and `name` (used to identify the self participant)
- If `profile.json` has no `name` field, ask the user for their name before proceeding and store it in `profile.json`
- Read `split_groups.json` from the data directory if it exists, to resolve group names and default members

## Data Files

**`split_groups.json`** — optional, stores recurring split groups for convenience. Groups are only used at split-creation time to pre-populate participants — they are not stored on the split record itself.

```json
{
  "groups": [
    {
      "name": "Household",
      "members": ["Alice", "Bob"],
      "default_split_type": "equal"
    }
  ]
}
```

Create this file if it doesn't exist and the user wants to set up a group.

## CLI Reference

All split operations go through `mtool splits`. All commands return JSON.

Before using any subcommand, run `mtool splits --help` or `mtool splits <subcommand> --help` to discover available commands and their flags. Do not rely on memorized syntax — always confirm with `--help` first.

## Split Types

| Type | Input | How participant share is computed |
|---|---|---|
| `equal` | Number of other participants (n) | `total / (n + 1)` — you and n others share equally |
| `exact` | Explicit amount per person | As specified |
| `percentage` | % per person (excluding you) | `total * pct / 100` per person; your share = `total - sum(others)` |
| `shares` | Shares per person (excluding you) | `total * their_shares / total_shares_including_yours` |

## Logging a Split

When the user describes a shared expense:

1. Identify: name, total amount, currency, who paid (must be the user), participants, and split type
2. Ask for any missing required fields before proceeding
3. Infer split type from context if not stated (equal is the default)
4. Create the split header via `mtool splits add`
5. Add the user as a participant with their computed share and `amount_owed` set to 0 (since they already paid) via `mtool splits add-participant`
6. Add each other participant with their computed share via `mtool splits add-participant`
7. After all participants are added, show a summary table:

   | Participant | Share | Owes You |
   |---|---|---|
   | You | $30.00 | — |
   | Alice | $30.00 | $30.00 |
   | Bob | $30.00 | $30.00 |

8. Confirm what was logged and ask if anything needs correcting
9. If the user corrects anything, update the relevant rows or delete and re-log

## Viewing Balances

When the user asks who owes them or what the current balance is, use `mtool splits balance`.

The command returns one row per outstanding participant entry, joined with split name, date, and currency. Reason over the rows to summarize who owes what — people may share a name, so use context (split name, date, amount) to disambiguate if needed.

To drill into a specific person, use `--person` on both `balance` and `list`.

## Settling Up

When the user says someone paid them back:

1. Identify the person and amount received
2. Fetch their open splits via `mtool splits list` filtered to that person and unsettled
3. Show the open items and ask which split(s) the payment covers (or apply to oldest first if user doesn't specify)
4. Compute the new `amount_owed` (current `amount_owed` minus amount received, floored at 0) and update via `mtool splits edit-participant`
5. Confirm the updated balance for that person

## Viewing Splits

- Default: show unsettled splits from the current month
- Use `mtool splits list` with filters for settled status, person, or date range
- Use `mtool splits show <id>` for full detail of one split

For display, render as a table with columns: ID, Date, Name, Total, Currency, Your Share, Outstanding.

## Managing Groups

Groups live in `split_groups.json`. When the user wants to:

- **Create a group**: add an entry with a `name`, `members` list, and optionally `default_split_type`.
- **Use a group**: when the user references a group by name, look it up in `split_groups.json`, pre-populate participants from its `members` list, and apply its `default_split_type` if set. Groups are a shortcut — nothing is stored on the split record itself.
- **Edit/delete a group**: update or remove the entry in `split_groups.json` directly.

## Guardrails

- Never log a split where someone other than the user is the payer — if someone else paid, direct the user to log it as a personal expense instead.
- Never delete a split without showing its participants and total first.
- Never modify `original_amount_owed` without confirming with the user — it is the immutable source of truth for the original agreement.
- When `amount_owed` reaches 0 for all non-self participants, the split is fully settled. Surface this to the user.
- Verify `sum(original_amount_owed across all participants) == total_amount` after creating a split. If it doesn't match, surface the discrepancy and ask the user to confirm.
