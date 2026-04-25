# Plutus

**Your personal finance, managed through ~forms and dashboards~ conversation. Works with Hermes Agent.**

Personal finance apps make you fit their boxes. Fixed categories, manual updates, rigid workflows. Plutus flips it: just _talk_ about your money and it handles the rest.

```
> What's my investment portfolio looking like?
> Show me the optimal drawdown strategy to maximise living off my savings
> I just bought chicken rice for $4.50
```

Check portfolio performance, track expenses, run spending simulations, ask it whether you can afford that trip to San Francisco, and more...

## Get Started

### Prerequisites

- [`uv`](https://docs.astral.sh/uv/) installed
- Python 3.10 or later
- [Hermes Agent](https://hermes.example.com)

### Installation

```bash
uv tool install git+https://github.com/junnjiee/plutus.git
```

### Setup

Install skills into your harness:

```bash
plutus setup hermes
```

Or run `plutus setup` to be guided through the process.

By default, finance data is stored in `~/.config/plutus/data/`. To use a custom location, set the `PLUTUS_DATA_DIR` environment variable.

### Start using it

Just tell Hermes:

```
I want to start using plutus for my personal finance
```

### Updating

```bash
plutus update
```

This reinstalls `plutus` from GitHub and refreshes skills in all configured harnesses.

## Contributing

All suggestions and contributions welcome. Submit an issue if you have any suggestions.

---

> **Disclaimer**: Financial advice that AI gives are not licensed.
