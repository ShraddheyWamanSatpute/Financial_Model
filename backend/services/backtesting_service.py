"""
Backtesting Service for StockPulse
Provides backtesting engine with multiple trading strategies
"""

import logging
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple

from models.backtest_models import (
    BacktestConfig, BacktestResult, Trade, TradeType,
    StrategyType, StrategyInfo
)

logger = logging.getLogger(__name__)


# Strategy definitions
STRATEGIES = {
    StrategyType.SMA_CROSSOVER: StrategyInfo(
        id=StrategyType.SMA_CROSSOVER,
        name="SMA Crossover",
        description="Buy when short-term SMA crosses above long-term SMA, sell on cross below",
        parameters=[
            {"name": "short_period", "type": "int", "min": 5, "max": 50, "description": "Short SMA period"},
            {"name": "long_period", "type": "int", "min": 20, "max": 200, "description": "Long SMA period"},
        ],
        default_params={"short_period": 20, "long_period": 50}
    ),
    StrategyType.RSI: StrategyInfo(
        id=StrategyType.RSI,
        name="RSI Strategy",
        description="Buy when RSI is oversold, sell when overbought",
        parameters=[
            {"name": "period", "type": "int", "min": 7, "max": 28, "description": "RSI period"},
            {"name": "oversold", "type": "int", "min": 20, "max": 40, "description": "Oversold threshold"},
            {"name": "overbought", "type": "int", "min": 60, "max": 80, "description": "Overbought threshold"},
        ],
        default_params={"period": 14, "oversold": 30, "overbought": 70}
    ),
    StrategyType.MACD: StrategyInfo(
        id=StrategyType.MACD,
        name="MACD Strategy",
        description="Buy on MACD line crossing above signal line, sell on cross below",
        parameters=[
            {"name": "fast_period", "type": "int", "min": 8, "max": 16, "description": "Fast EMA period"},
            {"name": "slow_period", "type": "int", "min": 20, "max": 30, "description": "Slow EMA period"},
            {"name": "signal_period", "type": "int", "min": 6, "max": 12, "description": "Signal line period"},
        ],
        default_params={"fast_period": 12, "slow_period": 26, "signal_period": 9}
    ),
    StrategyType.BOLLINGER_BANDS: StrategyInfo(
        id=StrategyType.BOLLINGER_BANDS,
        name="Bollinger Bands",
        description="Buy at lower band, sell at upper band",
        parameters=[
            {"name": "period", "type": "int", "min": 10, "max": 30, "description": "SMA period"},
            {"name": "std_dev", "type": "float", "min": 1.5, "max": 3.0, "description": "Standard deviations"},
        ],
        default_params={"period": 20, "std_dev": 2.0}
    ),
    StrategyType.MOMENTUM: StrategyInfo(
        id=StrategyType.MOMENTUM,
        name="Momentum Strategy",
        description="Buy when momentum is positive, sell when negative",
        parameters=[
            {"name": "period", "type": "int", "min": 5, "max": 30, "description": "Momentum period"},
            {"name": "threshold", "type": "float", "min": 0, "max": 5, "description": "Entry threshold %"},
        ],
        default_params={"period": 14, "threshold": 2.0}
    ),
}


def calculate_sma(prices: List[float], period: int) -> List[Optional[float]]:
    """Calculate Simple Moving Average"""
    sma = [None] * len(prices)
    for i in range(period - 1, len(prices)):
        sma[i] = sum(prices[i - period + 1:i + 1]) / period
    return sma


def calculate_ema(prices: List[float], period: int) -> List[Optional[float]]:
    """Calculate Exponential Moving Average"""
    ema = [None] * len(prices)
    multiplier = 2 / (period + 1)
    
    # First EMA is SMA
    if len(prices) >= period:
        ema[period - 1] = sum(prices[:period]) / period
        
        for i in range(period, len(prices)):
            ema[i] = (prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier))
    
    return ema


def calculate_rsi(prices: List[float], period: int = 14) -> List[Optional[float]]:
    """Calculate Relative Strength Index"""
    rsi = [None] * len(prices)
    
    if len(prices) < period + 1:
        return rsi
    
    gains = []
    losses = []
    
    for i in range(1, len(prices)):
        change = prices[i] - prices[i - 1]
        gains.append(max(change, 0))
        losses.append(abs(min(change, 0)))
    
    for i in range(period, len(prices)):
        avg_gain = sum(gains[i - period:i]) / period
        avg_loss = sum(losses[i - period:i]) / period
        
        if avg_loss == 0:
            rsi[i] = 100
        else:
            rs = avg_gain / avg_loss
            rsi[i] = 100 - (100 / (1 + rs))
    
    return rsi


def calculate_macd(
    prices: List[float],
    fast: int = 12,
    slow: int = 26,
    signal: int = 9
) -> Tuple[List[Optional[float]], List[Optional[float]], List[Optional[float]]]:
    """Calculate MACD, Signal, and Histogram"""
    fast_ema = calculate_ema(prices, fast)
    slow_ema = calculate_ema(prices, slow)
    
    macd = [None] * len(prices)
    for i in range(len(prices)):
        if fast_ema[i] is not None and slow_ema[i] is not None:
            macd[i] = fast_ema[i] - slow_ema[i]
    
    # Calculate signal line (EMA of MACD)
    macd_values = [m for m in macd if m is not None]
    signal_line = [None] * len(prices)
    
    if len(macd_values) >= signal:
        first_valid = next(i for i, m in enumerate(macd) if m is not None)
        signal_ema = calculate_ema(macd_values, signal)
        
        for i, s in enumerate(signal_ema):
            if s is not None:
                signal_line[first_valid + i] = s
    
    # Calculate histogram
    histogram = [None] * len(prices)
    for i in range(len(prices)):
        if macd[i] is not None and signal_line[i] is not None:
            histogram[i] = macd[i] - signal_line[i]
    
    return macd, signal_line, histogram


def calculate_bollinger_bands(
    prices: List[float],
    period: int = 20,
    std_dev: float = 2.0
) -> Tuple[List[Optional[float]], List[Optional[float]], List[Optional[float]]]:
    """Calculate Bollinger Bands (middle, upper, lower)"""
    middle = calculate_sma(prices, period)
    upper = [None] * len(prices)
    lower = [None] * len(prices)
    
    for i in range(period - 1, len(prices)):
        std = np.std(prices[i - period + 1:i + 1])
        if middle[i] is not None:
            upper[i] = middle[i] + (std_dev * std)
            lower[i] = middle[i] - (std_dev * std)
    
    return middle, upper, lower


def run_sma_crossover(
    prices: List[Dict],
    short_period: int = 20,
    long_period: int = 50
) -> List[Dict[str, Any]]:
    """Run SMA Crossover strategy"""
    closes = [p["close"] for p in prices]
    short_sma = calculate_sma(closes, short_period)
    long_sma = calculate_sma(closes, long_period)
    
    signals = []
    position = 0  # 0 = no position, 1 = long
    
    for i in range(1, len(prices)):
        if short_sma[i] is None or long_sma[i] is None:
            continue
        if short_sma[i - 1] is None or long_sma[i - 1] is None:
            continue
        
        # Buy signal: short crosses above long
        if short_sma[i - 1] <= long_sma[i - 1] and short_sma[i] > long_sma[i] and position == 0:
            signals.append({
                "date": prices[i]["date"],
                "type": "buy",
                "price": closes[i],
                "signal": f"SMA{short_period} crossed above SMA{long_period}"
            })
            position = 1
        
        # Sell signal: short crosses below long
        elif short_sma[i - 1] >= long_sma[i - 1] and short_sma[i] < long_sma[i] and position == 1:
            signals.append({
                "date": prices[i]["date"],
                "type": "sell",
                "price": closes[i],
                "signal": f"SMA{short_period} crossed below SMA{long_period}"
            })
            position = 0
    
    return signals


def run_rsi_strategy(
    prices: List[Dict],
    period: int = 14,
    oversold: int = 30,
    overbought: int = 70
) -> List[Dict[str, Any]]:
    """Run RSI strategy"""
    closes = [p["close"] for p in prices]
    rsi = calculate_rsi(closes, period)
    
    signals = []
    position = 0
    
    for i in range(1, len(prices)):
        if rsi[i] is None or rsi[i - 1] is None:
            continue
        
        # Buy when RSI crosses above oversold
        if rsi[i - 1] <= oversold and rsi[i] > oversold and position == 0:
            signals.append({
                "date": prices[i]["date"],
                "type": "buy",
                "price": closes[i],
                "signal": f"RSI crossed above {oversold} (oversold)"
            })
            position = 1
        
        # Sell when RSI crosses above overbought
        elif rsi[i - 1] <= overbought and rsi[i] > overbought and position == 1:
            signals.append({
                "date": prices[i]["date"],
                "type": "sell",
                "price": closes[i],
                "signal": f"RSI crossed above {overbought} (overbought)"
            })
            position = 0
    
    return signals


def run_macd_strategy(
    prices: List[Dict],
    fast_period: int = 12,
    slow_period: int = 26,
    signal_period: int = 9
) -> List[Dict[str, Any]]:
    """Run MACD strategy"""
    closes = [p["close"] for p in prices]
    macd, signal_line, histogram = calculate_macd(closes, fast_period, slow_period, signal_period)
    
    signals = []
    position = 0
    
    for i in range(1, len(prices)):
        if macd[i] is None or signal_line[i] is None:
            continue
        if macd[i - 1] is None or signal_line[i - 1] is None:
            continue
        
        # Buy when MACD crosses above signal
        if macd[i - 1] <= signal_line[i - 1] and macd[i] > signal_line[i] and position == 0:
            signals.append({
                "date": prices[i]["date"],
                "type": "buy",
                "price": closes[i],
                "signal": "MACD crossed above signal line"
            })
            position = 1
        
        # Sell when MACD crosses below signal
        elif macd[i - 1] >= signal_line[i - 1] and macd[i] < signal_line[i] and position == 1:
            signals.append({
                "date": prices[i]["date"],
                "type": "sell",
                "price": closes[i],
                "signal": "MACD crossed below signal line"
            })
            position = 0
    
    return signals


def run_bollinger_strategy(
    prices: List[Dict],
    period: int = 20,
    std_dev: float = 2.0
) -> List[Dict[str, Any]]:
    """Run Bollinger Bands strategy"""
    closes = [p["close"] for p in prices]
    middle, upper, lower = calculate_bollinger_bands(closes, period, std_dev)
    
    signals = []
    position = 0
    
    for i in range(1, len(prices)):
        if lower[i] is None or upper[i] is None:
            continue
        
        # Buy when price touches lower band
        if closes[i] <= lower[i] and position == 0:
            signals.append({
                "date": prices[i]["date"],
                "type": "buy",
                "price": closes[i],
                "signal": "Price touched lower Bollinger Band"
            })
            position = 1
        
        # Sell when price touches upper band
        elif closes[i] >= upper[i] and position == 1:
            signals.append({
                "date": prices[i]["date"],
                "type": "sell",
                "price": closes[i],
                "signal": "Price touched upper Bollinger Band"
            })
            position = 0
    
    return signals


def run_momentum_strategy(
    prices: List[Dict],
    period: int = 14,
    threshold: float = 2.0
) -> List[Dict[str, Any]]:
    """Run Momentum strategy"""
    closes = [p["close"] for p in prices]
    
    signals = []
    position = 0
    
    for i in range(period, len(prices)):
        momentum = ((closes[i] - closes[i - period]) / closes[i - period]) * 100
        prev_momentum = ((closes[i - 1] - closes[i - period - 1]) / closes[i - period - 1]) * 100
        
        # Buy when momentum crosses above threshold
        if prev_momentum <= threshold and momentum > threshold and position == 0:
            signals.append({
                "date": prices[i]["date"],
                "type": "buy",
                "price": closes[i],
                "signal": f"Momentum crossed above {threshold}%"
            })
            position = 1
        
        # Sell when momentum crosses below negative threshold
        elif prev_momentum >= -threshold and momentum < -threshold and position == 1:
            signals.append({
                "date": prices[i]["date"],
                "type": "sell",
                "price": closes[i],
                "signal": f"Momentum crossed below -{threshold}%"
            })
            position = 0
    
    return signals


def execute_trades(
    signals: List[Dict],
    initial_capital: float,
    prices: List[Dict]
) -> Tuple[List[Trade], List[Dict[str, Any]]]:
    """Execute trades based on signals and calculate results"""
    trades = []
    equity_curve = []
    
    cash = initial_capital
    position = 0
    shares = 0
    
    price_lookup = {p["date"]: p["close"] for p in prices}
    
    for signal in signals:
        price = signal["price"]
        
        if signal["type"] == "buy" and position == 0:
            # Buy with all cash
            shares = int(cash / price)
            if shares > 0:
                cost = shares * price
                cash -= cost
                position = 1
                
                portfolio_value = cash + (shares * price)
                trades.append(Trade(
                    date=signal["date"],
                    type=TradeType.BUY,
                    price=price,
                    quantity=shares,
                    value=cost,
                    signal=signal["signal"],
                    portfolio_value=portfolio_value
                ))
        
        elif signal["type"] == "sell" and position == 1:
            # Sell all shares
            proceeds = shares * price
            cash += proceeds
            position = 0
            
            portfolio_value = cash
            trades.append(Trade(
                date=signal["date"],
                type=TradeType.SELL,
                price=price,
                quantity=shares,
                value=proceeds,
                signal=signal["signal"],
                portfolio_value=portfolio_value
            ))
            shares = 0
    
    # Build equity curve
    for p in prices:
        current_price = p["close"]
        if position == 1:
            value = cash + (shares * current_price)
        else:
            value = cash
        
        equity_curve.append({
            "date": p["date"],
            "value": round(value, 2),
            "price": current_price
        })
    
    return trades, equity_curve


def calculate_metrics(
    trades: List[Trade],
    equity_curve: List[Dict],
    initial_capital: float,
    trading_days: int
) -> Dict[str, Any]:
    """Calculate performance metrics"""
    if not trades:
        return {
            "total_return": 0,
            "total_return_percent": 0,
            "annualized_return": 0,
            "max_drawdown": 0,
            "sharpe_ratio": 0,
            "volatility": 0,
            "total_trades": 0,
            "winning_trades": 0,
            "losing_trades": 0,
            "win_rate": 0,
            "avg_win": 0,
            "avg_loss": 0,
            "profit_factor": 0,
        }
    
    final_value = equity_curve[-1]["value"]
    total_return = final_value - initial_capital
    total_return_percent = (total_return / initial_capital) * 100
    
    # Annualized return
    years = trading_days / 252
    if years > 0 and final_value > 0:
        annualized_return = ((final_value / initial_capital) ** (1 / years) - 1) * 100
    else:
        annualized_return = 0
    
    # Max drawdown
    peak = initial_capital
    max_drawdown = 0
    for point in equity_curve:
        if point["value"] > peak:
            peak = point["value"]
        drawdown = (peak - point["value"]) / peak * 100
        max_drawdown = max(max_drawdown, drawdown)
    
    # Daily returns for volatility and Sharpe
    daily_returns = []
    for i in range(1, len(equity_curve)):
        prev_val = equity_curve[i - 1]["value"]
        curr_val = equity_curve[i]["value"]
        if prev_val > 0:
            daily_returns.append((curr_val - prev_val) / prev_val)
    
    if daily_returns:
        volatility = np.std(daily_returns) * np.sqrt(252) * 100
        avg_return = np.mean(daily_returns) * 252
        sharpe_ratio = avg_return / (volatility / 100) if volatility > 0 else 0
    else:
        volatility = 0
        sharpe_ratio = 0
    
    # Trade statistics
    wins = []
    losses = []
    
    for i in range(0, len(trades) - 1, 2):
        if i + 1 < len(trades):
            buy_trade = trades[i]
            sell_trade = trades[i + 1]
            
            if buy_trade.type == TradeType.BUY and sell_trade.type == TradeType.SELL:
                pnl = sell_trade.value - buy_trade.value
                if pnl > 0:
                    wins.append(pnl)
                else:
                    losses.append(abs(pnl))
    
    total_trades = len(wins) + len(losses)
    winning_trades = len(wins)
    losing_trades = len(losses)
    win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
    avg_win = np.mean(wins) if wins else 0
    avg_loss = np.mean(losses) if losses else 0
    profit_factor = sum(wins) / sum(losses) if losses and sum(losses) > 0 else 0
    
    return {
        "total_return": round(total_return, 2),
        "total_return_percent": round(total_return_percent, 2),
        "annualized_return": round(annualized_return, 2),
        "max_drawdown": round(max_drawdown, 2),
        "sharpe_ratio": round(sharpe_ratio, 2),
        "volatility": round(volatility, 2),
        "total_trades": total_trades,
        "winning_trades": winning_trades,
        "losing_trades": losing_trades,
        "win_rate": round(win_rate, 2),
        "avg_win": round(avg_win, 2),
        "avg_loss": round(avg_loss, 2),
        "profit_factor": round(profit_factor, 2),
    }


async def run_backtest(
    config: BacktestConfig,
    price_history: List[Dict]
) -> BacktestResult:
    """Run a complete backtest"""
    
    # Get strategy info
    strategy_info = STRATEGIES.get(config.strategy)
    if not strategy_info:
        raise ValueError(f"Unknown strategy: {config.strategy}")
    
    # Merge default params with provided params
    params = {**strategy_info.default_params, **config.parameters}
    
    # Run strategy
    if config.strategy == StrategyType.SMA_CROSSOVER:
        signals = run_sma_crossover(price_history, **params)
    elif config.strategy == StrategyType.RSI:
        signals = run_rsi_strategy(price_history, **params)
    elif config.strategy == StrategyType.MACD:
        signals = run_macd_strategy(price_history, **params)
    elif config.strategy == StrategyType.BOLLINGER_BANDS:
        signals = run_bollinger_strategy(price_history, **params)
    elif config.strategy == StrategyType.MOMENTUM:
        signals = run_momentum_strategy(price_history, **params)
    else:
        signals = []
    
    # Execute trades
    trades, equity_curve = execute_trades(signals, config.initial_capital, price_history)
    
    # Calculate metrics
    metrics = calculate_metrics(
        trades, 
        equity_curve, 
        config.initial_capital,
        len(price_history)
    )
    
    return BacktestResult(
        symbol=config.symbol.upper(),
        strategy=config.strategy,
        strategy_name=strategy_info.name,
        parameters=params,
        initial_capital=config.initial_capital,
        final_value=equity_curve[-1]["value"] if equity_curve else config.initial_capital,
        trades=[t for t in trades],
        equity_curve=equity_curve,
        start_date=price_history[0]["date"] if price_history else "",
        end_date=price_history[-1]["date"] if price_history else "",
        trading_days=len(price_history),
        **metrics
    )


def get_available_strategies() -> List[StrategyInfo]:
    """Get list of available strategies"""
    return list(STRATEGIES.values())


def get_strategy_info(strategy_type: StrategyType) -> Optional[StrategyInfo]:
    """Get info for a specific strategy"""
    return STRATEGIES.get(strategy_type)
