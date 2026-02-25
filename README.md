# Finance Agent

**Your finances, managed through ~forms and dashboards~ conversation.**

Finance apps make you fit their boxes. Fixed categories, manual updates, rigid workflows. Finance Agent flips it: just _talk_ about your money and it handles the rest.

```
> What's my financial status looking like?
> Show me the optimal drawdown strategy to maximise living off my savings
> I just bought 50 shares of VOO
```

Fetch live prices, run calculations, ask for advice, create custom visualizations, and more. All you need is [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## Privacy First

All data stays on your machine in `data/`. Nothing leaves your laptop.

## What It Does

- **Net worth tracking** with live portfolio pricing and multi-currency support
- **Runway projections** — simulate how long you can live off your savings/investments
- **Savings rate** and **liability tracking** computed from your actual data
- **Financial goals** with progress tracking and required contribution calculations
- **Modular add-ons** — liquidity tiers, tax-advantaged flags, asset class tags, currency exposure

## Get Started

```bash
git clone <repo-url> && cd finance-agent
uv sync
```

Open Claude Code in the project directory and `/onboard` to get started.

---

> **Disclaimer**: This is not licensed financial advice.
