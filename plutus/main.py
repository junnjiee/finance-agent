import sys

import typer

from plutus import expenses
from plutus import serve
from plutus import setup
from plutus import update

app = typer.Typer()
app.add_typer(setup.app, name="setup")
app.add_typer(expenses.app, name="expenses")
app.add_typer(update.app, name="update")
app.add_typer(serve.app, name="serve")

# market imports yfinance/pandas which are heavy — lazy load for commands that don't need them
if len(sys.argv) < 2 or sys.argv[1] not in ("setup", "update", "serve"):
    from plutus import market

    app.add_typer(market.app, name="market")


if __name__ == "__main__":
    app()
