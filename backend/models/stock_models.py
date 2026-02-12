from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid


class StockPrice(BaseModel):
    model_config = ConfigDict(extra="ignore")
    open: float
    high: float
    low: float
    close: float
    volume: int
    date: str


class FundamentalData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    revenue_ttm: float = 0
    revenue_growth_yoy: float = 0
    net_profit: float = 0
    eps: float = 0
    gross_margin: float = 0
    operating_margin: float = 0
    net_profit_margin: float = 0
    roe: float = 0
    roa: float = 0
    roic: float = 0
    debt_to_equity: float = 0
    interest_coverage: float = 0
    free_cash_flow: float = 0
    operating_cash_flow: float = 0
    current_ratio: float = 0
    quick_ratio: float = 0


class ValuationData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    pe_ratio: float = 0
    peg_ratio: float = 0
    pb_ratio: float = 0
    ev_ebitda: float = 0
    ps_ratio: float = 0
    dividend_yield: float = 0
    market_cap: float = 0


class TechnicalData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    sma_50: float = 0
    sma_200: float = 0
    rsi_14: float = 50
    macd: float = 0
    macd_signal: float = 0
    macd_histogram: float = 0
    bollinger_upper: float = 0
    bollinger_lower: float = 0
    bollinger_middle: float = 0
    volume_avg_20: int = 0
    high_52_week: float = 0
    low_52_week: float = 0
    support_level: float = 0
    resistance_level: float = 0


class ShareholdingData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    promoter_holding: float = 0
    fii_holding: float = 0
    dii_holding: float = 0
    public_holding: float = 0
    promoter_pledging: float = 0


class DealBreaker(BaseModel):
    model_config = ConfigDict(extra="ignore")
    rule: str
    triggered: bool
    value: Optional[float] = None
    threshold: Optional[float] = None
    description: str


class ScoreBreakdown(BaseModel):
    model_config = ConfigDict(extra="ignore")
    fundamental_score: float = 0
    valuation_score: float = 0
    technical_score: float = 0
    quality_score: float = 0
    risk_score: float = 0
    ml_adjustment: float = 0


class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    short_term_score: float = 0
    long_term_score: float = 0
    verdict: str = "HOLD"
    confidence_level: str = "MEDIUM"
    confidence_score: float = 0.5
    score_breakdown: ScoreBreakdown
    deal_breakers: List[DealBreaker] = []
    top_strengths: List[str] = []
    top_risks: List[str] = []
    bull_case: Dict[str, Any] = {}
    bear_case: Dict[str, Any] = {}
    base_case: Dict[str, Any] = {}


class MLPrediction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    price_direction_short: str = "NEUTRAL"
    price_direction_probability: float = 0.5
    volatility_forecast: float = 0
    anomaly_score: float = 0
    sentiment_score: float = 0


class Stock(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    symbol: str
    name: str
    sector: str
    industry: str
    market_cap_category: str  # Large, Mid, Small
    current_price: float
    price_change: float
    price_change_percent: float
    fundamentals: FundamentalData
    valuation: ValuationData
    technicals: TechnicalData
    shareholding: ShareholdingData
    price_history: List[StockPrice] = []
    analysis: Optional[AnalysisResult] = None
    ml_prediction: Optional[MLPrediction] = None
    llm_insight: Optional[str] = None
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WatchlistItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    symbol: str
    name: str
    added_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None
    notes: Optional[str] = None
    alerts_enabled: bool = True


class PortfolioHolding(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    symbol: str
    name: str
    quantity: int
    avg_buy_price: float
    buy_date: str
    current_price: float = 0
    current_value: float = 0
    profit_loss: float = 0
    profit_loss_percent: float = 0
    sector: str = ""


class Portfolio(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    holdings: List[PortfolioHolding] = []
    total_invested: float = 0
    current_value: float = 0
    total_profit_loss: float = 0
    total_profit_loss_percent: float = 0
    xirr: float = 0


class NewsItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    summary: str
    source: str
    url: str
    published_date: str
    sentiment: str = "NEUTRAL"  # POSITIVE, NEGATIVE, NEUTRAL
    sentiment_score: float = 0
    related_stocks: List[str] = []


class ScreenerFilter(BaseModel):
    model_config = ConfigDict(extra="ignore")
    metric: str
    operator: str  # gt, lt, eq, gte, lte, between
    value: float
    value2: Optional[float] = None  # For 'between' operator


class ScreenerRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    filters: List[ScreenerFilter] = []
    sort_by: str = "market_cap"
    sort_order: str = "desc"
    limit: int = 50


class LLMInsightRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    symbol: str
    analysis_type: str = "full"  # full, score_explanation, news_summary, risk_assessment
