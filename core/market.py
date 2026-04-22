import yfinance as yf


def get_ticker_data(symbols: list[str]) -> dict[str, dict]:
    results: dict[str, dict] = {}
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        price = info.get("currentPrice") or info.get("regularMarketPrice")
        if price is None:
            results[symbol.upper()] = {"error": "No price available"}
            continue
        results[symbol.upper()] = {
            "name": info.get("shortName"),
            "price": price,
            "currency": info.get("currency"),
            "market_cap": info.get("marketCap"),
            "52w_high": info.get("fiftyTwoWeekHigh"),
            "52w_low": info.get("fiftyTwoWeekLow"),
            "pe_ratio": info.get("trailingPE"),
            "dividend_yield": info.get("dividendYield"),
            "sector": info.get("sector"),
        }
    return results


def get_ticker_history(symbols: list[str], period: str = "1y") -> dict[str, dict]:
    results: dict[str, dict] = {}
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period=period)
        if history.empty:
            results[symbol.upper()] = {"error": "No data available"}
            continue
        start_price = history["Close"].iloc[0]
        end_price = history["Close"].iloc[-1]
        total_return = (end_price - start_price) / start_price
        trading_days = len(history)
        annualized_return = (1 + total_return) ** (252 / trading_days) - 1

        results[symbol.upper()] = {
            "period": period,
            "start_date": str(history.index[0].date()),
            "end_date": str(history.index[-1].date()),
            "start_price": round(float(start_price), 2),
            "end_price": round(float(end_price), 2),
            "total_return_pct": round(total_return * 100, 2),
            "annualized_return_pct": round(annualized_return * 100, 2),
        }
    return results
