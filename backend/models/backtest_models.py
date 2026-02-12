"""
Backtest Models for StockPulse
Defines data models for backtesting configurations, trades, and results
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class StrategyType(str, Enum):
    """Available backtesting strategies"""
    SMA_CROSSOVER = "sma_crossover"
    RSI = "rsi"
    MACD = "macd"
    BOLLINGER_BANDS = "bollinger_bands"
    MOMENTUM = "momentum"


class TradeType(str, Enum):
    """Trade type"""
    BUY = "buy"
    SELL = "sell"


class BacktestConfig(BaseModel):
    """Configuration for running a backtest"""
    symbol: str = Field(..., description="Stock symbol to backtest")
    strategy: StrategyType = Field(..., description="Strategy to use")
    start_date: Optional[str] = Field(None, description="Start date (YYYY-MM-DD)")
    end_date: Optional[str] = Field(None, description="End date (YYYY-MM-DD)")
    initial_capital: float = Field(default=100000, description="Starting capital in INR")
    
    # Strategy-specific parameters
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Strategy parameters")


class Trade(BaseModel):
    """Individual trade record"""
    date: str
    type: TradeType
    price: float
    quantity: int
    value: float
    signal: str
    portfolio_value: float


class BacktestResult(BaseModel):
    """Result of a backtest run"""
    symbol: str
    strategy: StrategyType
    strategy_name: str
    parameters: Dict[str, Any]
    
    # Performance metrics
    initial_capital: float
    final_value: float
    total_return: float
    total_return_percent: float
    annualized_return: float
    
    # Risk metrics
    max_drawdown: float
    sharpe_ratio: float
    volatility: float
    
    # Trade statistics
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float
    avg_win: float
    avg_loss: float
    profit_factor: float
    
    # Trade history
    trades: List[Trade]
    
    # Equity curve (for charting)
    equity_curve: List[Dict[str, Any]]
    
    # Period info
    start_date: str
    end_date: str
    trading_days: int


class StrategyInfo(BaseModel):
    """Information about a strategy"""
    id: StrategyType
    name: str
    description: str
    parameters: List[Dict[str, Any]]
    default_params: Dict[str, Any]


class BacktestSummary(BaseModel):
    """Summary for comparing multiple backtests"""
    symbol: str
    strategy: str
    total_return_percent: float
    sharpe_ratio: float
    max_drawdown: float
    win_rate: float
    total_trades: int
