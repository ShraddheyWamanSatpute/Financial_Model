**ARCHITECTURAL ROADMAP**

Real-Time Stock Analysis Platform

_A High-Performance System for Indian Stock Market Analysis_

Integrating Data from Multiple Sources with Framework-Driven Analysis

Single-User Personal Investment Analysis System

# **SECTION 1: WEBSITE PURPOSE & CORE PHILOSOPHY**

## **1.1 What This Platform Is Designed To Do**

This platform serves as a personal, high-performance stock analysis engine specifically designed for the Indian equity market. Unlike generic stock screeners that provide raw data and basic filters, this system implements a structured, rule-based analytical framework that transforms scattered market data into actionable investment intelligence.

### **Primary Objectives**

- **Automated Data Aggregation:** Continuously extract and unify stock data from multiple authoritative Indian market sources (Screener.in, NSE, BSE, Tijori Finance, Trendlyne, etc.) into a single coherent dataset.
- **Framework Enforcement:** Apply the exact analytical rules defined in the Stock Analysis Framework document - including fundamental metrics, technical indicators, valuation ratios, and qualitative factors - with mathematical precision.
- **Real-Time Processing:** Execute live analysis during market hours with sub-second response times for price-sensitive decisions.
- **Decision Support:** Generate structured verdicts (Pass/Fail checklists, 0-100 scores, Bull/Bear scenarios) that directly inform investment decisions without requiring manual calculation.
- **Predictive Insights:** Leverage machine learning models to forecast price movements, detect anomalies, and identify emerging patterns before they become obvious.

## **1.2 How This Differs From Generic Stock Screeners**

|     |     |     |
| --- | --- | --- |
| **Aspect** | **Generic Screeners** | **This Platform** |
| **Data Integration** | Single source, basic API | Multi-source aggregation with cross-verification |
| **Analysis Logic** | User-defined filters only | Pre-built framework with 50+ rules enforced automatically |
| **Output Format** | Raw data tables | Scored verdicts, checklists, scenario analysis |
| **Decision Support** | None - interpretation left to user | Explicit recommendations with confidence levels |
| **Speed** | Acceptable for browsing | Optimized for instant analysis (<500ms) |
| **Customization** | Generic for all users | Personal framework, single-user optimized |
| **Predictions** | Historical data only | ML-powered forecasting and pattern detection |

## **1.3 Why Rule-Based and Framework-Driven Analysis Is Central**

The core philosophy rejects subjective, opinion-based stock picking in favor of systematic, quantifiable analysis. This approach provides several critical advantages:

### **Consistency**

Every stock is evaluated against identical criteria. The same P/E threshold, the same ROE benchmark, the same debt-to-equity limits apply universally. This eliminates the cognitive biases that plague discretionary analysis - recency bias, confirmation bias, and anchoring.

### **Reproducibility**

Given the same input data, the system will always produce the same output. This means you can trace exactly why a stock received a particular score, identify which factors contributed to a Pass or Fail verdict, and understand precisely what changed when a recommendation shifts.

### **Speed of Analysis**

A human analyst might spend 2-3 hours thoroughly analyzing a single company. This system performs the equivalent analysis in under one second, enabling you to screen the entire market and identify opportunities that would otherwise be missed due to time constraints.

### **Emotional Detachment**

The framework does not know or care about market sentiment, media hype, or your personal attachment to a stock. It evaluates based purely on data, providing a counterbalance to the emotional decision-making that destroys investment returns.

### **Continuous Monitoring**

Unlike manual analysis which is a point-in-time exercise, the system continuously re-evaluates holdings and watchlist stocks, alerting you when fundamental conditions change or technical signals trigger.

## **1.4 Design Principles**

|     |     |
| --- | --- |
| **Principle** | **Implementation** |
| **Data First** | No analysis begins until data integrity is verified. Missing or conflicting data points are flagged, not silently ignored or estimated. |
| **Fail Loudly** | When something goes wrong (API failure, calculation error, data anomaly), the system halts and reports the issue rather than producing potentially incorrect results. |
| **Auditability** | Every calculation can be traced back to its source data. Every score can be decomposed into its component factors. Nothing is a black box. |
| **Performance Budget** | Each operation has a maximum allowed execution time. The system is designed to meet these budgets under normal conditions and degrade gracefully under stress. |
| **Single Source of Truth** | Conflicting data from multiple sources is resolved through defined precedence rules, not left ambiguous. The system maintains one authoritative value per data point. |

# **SECTION 2: DATA ACQUISITION & EXTRACTION LOGIC**

## **2.1 Data Point Identification Based on Stock Analysis Framework**

The framework requires specific data points organized into categories. Every data extraction operation must map to one of these required fields:

### **A. Fundamental Data Points (Required)**

|     |     |     |     |
| --- | --- | --- | --- |
| **Data Point** | **Update Frequency** | **Primary Source** | **Fallback Source** |
| Revenue (TTM & Historical) | Quarterly | Screener.in | BSE Corporate Filings |
| Net Profit / EPS | Quarterly | Screener.in | NSE Corporate Filings |
| Gross Margin | Quarterly | Tijori Finance | Annual Report (Manual) |
| Operating Margin | Quarterly | Screener.in | Tijori Finance |
| Net Profit Margin | Quarterly | Screener.in | Calculated from Revenue/NP |
| ROE / ROA / ROIC | Quarterly | Screener.in | Trendlyne |
| Debt-to-Equity | Quarterly | Screener.in | Tijori Finance |
| Interest Coverage | Quarterly | Tijori Finance | Calculated from EBIT/Interest |
| Free Cash Flow | Quarterly | Screener.in | Tijori Finance |
| Operating Cash Flow | Quarterly | Screener.in | Annual Report |
| Current Ratio / Quick Ratio | Quarterly | Screener.in | Calculated from BS |

### **B. Valuation Data Points (Required)**

|     |     |     |     |
| --- | --- | --- | --- |
| **Data Point** | **Update Frequency** | **Primary Source** | **Fallback Source** |
| Current Market Price | Real-time (1-5 sec) | NSE/BSE Feed | Google Finance API |
| P/E Ratio (TTM) | Daily | Screener.in | Calculated from Price/EPS |
| PEG Ratio | Quarterly | Trendlyne | Calculated from P/E and Growth |
| P/B Ratio | Daily | Screener.in | Tickertape |
| EV/EBITDA | Quarterly | Screener.in | Tijori Finance |
| P/S Ratio | Daily | Trendlyne | Calculated |
| Dividend Yield | Daily | Screener.in | NSE Data |
| Market Cap | Real-time | NSE/BSE | Calculated |

### **C. Technical Data Points (Required)**

|     |     |     |     |
| --- | --- | --- | --- |
| **Data Point** | **Update Frequency** | **Primary Source** | **Calculation Method** |
| OHLCV Data | Real-time / EOD | NSE/BSE Historical | Direct feed |
| 50-day MA | Daily | TradingView | SMA calculation in-house |
| 200-day MA | Daily | TradingView | SMA calculation in-house |
| RSI (14-period) | Daily / Intraday | ChartInk | Wilder RSI formula |
| MACD (12,26,9) | Daily / Intraday | TradingView | EMA-based calculation |
| Bollinger Bands | Daily | TradingView | 20-period, 2 std dev |
| Volume (Avg 20-day) | Daily | NSE/BSE | Simple average |
| 52-week High/Low | Daily | NSE/BSE | Direct from exchange |
| Support/Resistance Levels | Daily | ChartInk | Pivot point calculation |

### **D. Qualitative & Sentiment Data Points**

|     |     |     |     |
| --- | --- | --- | --- |
| **Data Point** | **Update Frequency** | **Primary Source** | **Processing Required** |
| Shareholding Pattern (Promoter %) | Quarterly | NSE/BSE | Direct extraction |
| FII/DII Holdings | Monthly | Trendlyne | Direct extraction |
| Insider Transactions | As announced | NSE/BSE Filings | Event parsing |
| Bulk/Block Deals | Daily | NSE/BSE | Direct extraction |
| Corporate Announcements | Real-time | BSE/NSE Feeds | NLP classification |
| News Sentiment | Real-time | Moneycontrol, ET | Sentiment analysis ML |
| Analyst Ratings | As published | Trendlyne | Aggregation |
| Credit Ratings | As published | CRISIL, ICRA, CARE | Manual/API extraction |

## **2.2 Data Source Architecture**

The system organizes data sources into tiers based on reliability, update frequency, and data richness:

### **Tier 1: Official Exchange Sources (Highest Authority)**

|     |     |     |     |
| --- | --- | --- | --- |
| **Source** | **Data Provided** | **Access Method** | **Latency** |
| **NSE India** | Prices, volumes, corporate filings, shareholding, bulk deals | Web scraping + Bhavcopy download | 15-min delayed (free) |
| **BSE India** | Same as NSE + additional SME data | Web scraping + Bhavcopy | 15-min delayed (free) |
| **SEBI** | DRHP, regulatory circulars, enforcement | PDF parsing + web scraping | As published |

### **Tier 2: Aggregated Data Platforms (High Quality)**

|     |     |     |     |
| --- | --- | --- | --- |
| **Source** | **Data Provided** | **Access Method** | **Rate Limits** |
| **Screener.in** | 10+ years financials, ratios, peer comparison, screens | Web scraping (premium API if available) | Respect robots.txt |
| **Tijori Finance** | Visual financials, segment breakdowns, concall transcripts | Web scraping | Moderate |
| **Trendlyne** | DVM scores, alerts, forecasts, technicals | Web scraping / API | Premium for full access |
| **Tickertape** | Stock health scores, baskets, MF data | Web scraping | Moderate |

### **Tier 3: Technical & Charting Sources**

|     |     |     |     |
| --- | --- | --- | --- |
| **Source** | **Data Provided** | **Access Method** | **Notes** |
| **TradingView** | Charts, indicators, screener, alerts | Pine Script / Widget API | Embedding allowed |
| **ChartInk** | Technical scans, candlestick patterns | Web scraping | Indian market focused |
| **Investing.com** | Technical summary, pivot points, oscillators | Web scraping | Global data backup |

### **Tier 4: News & Sentiment Sources**

|     |     |     |     |
| --- | --- | --- | --- |
| **Source** | **Data Provided** | **Processing** | **Update Freq** |
| **Moneycontrol** | News, analysis, forums | RSS + Scraping + NLP | Real-time |
| **Economic Times** | Market news, expert opinions | RSS + NLP sentiment | Hourly |
| **Business Standard** | In-depth analysis, company coverage | Scraping + NLP | Daily |
| **Valuepickr Forum** | Investor discussions, multi-bagger ideas | Scraping + topic modeling | Daily |

## **2.3 Data Extraction Strategies**

### **Strategy A: API-First Approach**

Where official APIs exist, they provide the most reliable and structured data access. The extraction pipeline prioritizes:

1.  **Authentication:** Secure API key management with rotation policies
2.  **Rate Limiting:** Respect API quotas with exponential backoff
3.  **Response Caching:** Cache responses based on data freshness requirements
4.  **Schema Validation:** Validate every response against expected schema before processing

### **Strategy B: Intelligent Web Scraping**

For sources without APIs, implement robust scraping with:

|     |     |
| --- | --- |
| **Component** | **Implementation Approach** |
| **Selector Resilience** | Use multiple selector strategies (ID, class, XPath, text content) with automatic fallback when primary selectors fail |
| **Dynamic Content** | Headless browser automation for JavaScript-rendered content with smart wait conditions |
| **Anti-Detection** | Rotating user agents, request delays, session management to avoid blocks (while respecting ToS) |
| **Change Detection** | Monitor for website structure changes and alert when extraction accuracy drops |
| **Parallel Extraction** | Concurrent scraping with connection pooling and proper resource cleanup |

### **Strategy C: File-Based Data Ingestion**

For bulk historical data and official filings:

- **Bhavcopy Processing:** Daily download and parsing of NSE/BSE end-of-day files
- **PDF Extraction:** OCR and structured extraction from annual reports, DRHPs using specialized parsers
- **Excel/CSV Import:** Schema-validated import of downloadable datasets
- **XBRL Parsing:** Structured extraction from XBRL filings where available

## **2.4 Data Validation, Cleaning & Normalization**

### **Validation Rules Engine**

|     |     |     |
| --- | --- | --- |
| **Validation Type** | **Rule Example** | **Action on Failure** |
| **Type Check** | P/E ratio must be numeric | Reject record, log error, attempt re-extraction |
| **Range Check** | ROE should be between -100% and 200% | Flag as anomaly, require manual verification |
| **Consistency Check** | Net Profit Margin = Net Profit / Revenue | Recalculate from components, flag discrepancy |
| **Cross-Source Check** | Market cap within 5% across sources | Use primary source, log variance |
| **Temporal Check** | Quarterly data not older than 120 days | Flag as stale, reduce confidence score |
| **Completeness Check** | All framework-required fields present | Block analysis until minimum fields available |

### **Normalization Standards**

|     |     |
| --- | --- |
| **Data Type** | **Normalization Rule** |
| **Currency Values** | All monetary values stored in INR (lakhs) with original currency recorded for conversion audit |
| **Percentages** | Stored as decimals (15% = 0.15) with original format recorded |
| **Dates** | ISO 8601 format (YYYY-MM-DD), timezone: IST for market data |
| **Stock Symbols** | Canonical NSE symbol as primary key, BSE code as secondary identifier |
| **Company Names** | Standardized legal name with alias mapping for common abbreviations |
| **Fiscal Periods** | Mapped to standard quarters (Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar) |

### **Handling Missing & Conflicting Data**

**Missing Data Strategy:** The system implements a priority cascade for missing values:

1.  Attempt extraction from fallback source
2.  Calculate from component values if formula exists
3.  Use most recent historical value with staleness flag
4.  Mark as NULL with confidence penalty in scoring
5.  Block analysis if minimum required fields unavailable

**Conflicting Data Resolution:** When sources disagree:

- Official exchange data always wins for prices and corporate actions
- Company filings win for financial statements
- For derived metrics (ratios), prefer source closest to raw data
- Log all conflicts for periodic review and source quality assessment

# **SECTION 3: ANALYSIS ENGINE (Framework Execution Layer)**

## **3.1 Framework Rule Implementation**

The analysis engine translates every rule from the Stock Analysis Framework into executable logic. Each rule has three components: the condition to evaluate, the threshold or benchmark, and the output (score contribution, pass/fail, or flag).

### **A. Fundamental Scoring Rules**

|     |     |     |     |
| --- | --- | --- | --- |
| **Metric** | **Scoring Logic** | **Weight (Long-Term)** | **Weight (Short-Term)** |
| **Revenue Growth YoY** | \>15%=100, 10-15%=80, 5-10%=60, 0-5%=40, <0%=0 | 10% | 5%  |
| **ROE** | \>25%=100, 20-25%=85, 15-20%=70, 10-15%=50, <10%=20 | 12% | 5%  |
| **Debt-to-Equity** | &lt;0.5=100, 0.5-1=80, 1-1.5=60, 1.5-2=40, &gt;2=10 | 8%  | 5%  |
| **Interest Coverage** | \>10x=100, 5-10x=80, 3-5x=60, 2-3x=30, <2x=0 (DEAL-BREAKER) | 8%  | 5%  |
| **FCF Positive** | 5yr consecutive=100, 3yr=80, 1yr=50, negative=10 | 10% | 5%  |
| **Operating Margin** | \>20%=100, 15-20%=80, 10-15%=60, 5-10%=40, <5%=20 | 8%  | 5%  |

### **B. Valuation Scoring Rules**

|     |     |     |     |
| --- | --- | --- | --- |
| **Metric** | **Scoring Logic** | **Long Weight** | **Short Weight** |
| **P/E vs Sector** | \>30% below sector=100, 10-30% below=80, in-line=60, 10-30% above=40, >30% above=20 | 10% | 8%  |
| **PEG Ratio** | &lt;0.5=100, 0.5-1=85, 1-1.5=65, 1.5-2=45, &gt;2=20 | 10% | 5%  |
| **EV/EBITDA** | &lt;8=100, 8-12=75, 12-15=50, 15-20=30, &gt;20=10 | 8%  | 5%  |

### **C. Technical Scoring Rules (Short-Term Weighted)**

|     |     |     |     |
| --- | --- | --- | --- |
| **Indicator** | **Scoring Logic** | **Long Weight** | **Short Weight** |
| **Price vs 200-day MA** | \>10% above=100, 0-10% above=80, 0-10% below=40, >10% below=20 | 3%  | 12% |
| **RSI (14)** | 30-40 (recovering)=90, 40-60=70, 60-70=50, &lt;30 or &gt;70=30 | 2%  | 10% |
| **MACD Signal** | Bullish crossover=100, Above signal=70, Below signal=40, Bearish crossover=20 | 2%  | 10% |
| **Volume Trend** | Rising volume + rising price=100, Avg volume=60, Declining volume=30 | 2%  | 8%  |

### **D. Deal-Breaker Rules (Automatic Disqualification)**

|     |     |
| --- | --- |
| **Condition** | **Result** |
| Interest Coverage Ratio < 2x | FAIL - Cannot service debt |
| Accounting fraud history or ongoing investigation | FAIL - Integrity concern |
| Revenue declining 3+ consecutive years | FAIL - Business deterioration |
| Auditor going concern warning | FAIL - Survival risk |
| Negative FCF for 3+ consecutive years with no turnaround | FAIL - Cash burn |
| Stock halted or under regulatory investigation | FAIL - Regulatory risk |
| Average daily volume < 100,000 shares | FAIL (Short-term) - Liquidity risk |

## **3.2 Machine Learning Models & Predictive Analytics**

The platform integrates multiple ML models for enhanced prediction, pattern recognition, and anomaly detection. Each model serves a specific purpose in the analysis pipeline:

### **A. Price Prediction Models**

|     |     |     |
| --- | --- | --- |
| **Model** | **Use Case** | **Implementation Notes** |
| **LSTM (Long Short-Term Memory)** | Medium-term price movement prediction (5-30 days) | Captures temporal dependencies in price sequences. Input: 60-day OHLCV + technical indicators. Output: Probability of price direction. |
| **GRU (Gated Recurrent Unit)** | Faster alternative to LSTM for intraday signals | Lower computational cost, suitable for real-time inference. Good for 1-5 day predictions. |
| **Transformer (Temporal Fusion)** | Multi-horizon forecasting with interpretability | Google Temporal Fusion Transformer architecture. Provides attention weights showing which inputs matter most. |
| **XGBoost / LightGBM** | Feature-rich classification (Up/Down/Sideways) | Handles tabular data excellently. Input: 100+ engineered features. Fast training and inference. |
| **Prophet (Facebook)** | Long-term trend and seasonality modeling | Good for capturing yearly patterns, dividend cycles, budget season effects in Indian markets. |

### **B. Sentiment Analysis Models**

|     |     |     |
| --- | --- | --- |
| **Model** | **Use Case** | **Implementation Notes** |
| **FinBERT** | Financial news sentiment classification | Pre-trained on financial corpus. Fine-tune on Indian business news. Output: Positive/Negative/Neutral with confidence. |
| **RoBERTa (Fine-tuned)** | Corporate announcement classification | Classify announcements as Material Positive, Neutral, or Material Negative. Train on historical BSE/NSE announcements. |
| **VADER + Custom Lexicon** | Real-time social sentiment scoring | Rule-based sentiment with Indian market terminology added. Fast inference for high-volume processing. |
| **Topic Modeling (BERTopic)** | Emerging theme detection in forums/news | Identify trending topics in Valuepickr, Twitter finance community. Alert when new themes emerge. |

### **C. Anomaly Detection Models**

|     |     |     |
| --- | --- | --- |
| **Model** | **Use Case** | **Implementation Notes** |
| **Isolation Forest** | Unusual trading volume/price movement detection | Unsupervised detection of outliers. Flags stocks with abnormal activity for further investigation. |
| **Autoencoder (Deep Learning)** | Financial statement anomaly detection | Learn normal patterns in financial ratios. High reconstruction error indicates potential manipulation. |
| **One-Class SVM** | Insider trading pattern detection | Train on normal trading patterns. Flag deviations before major announcements. |

### **D. Portfolio & Risk Models**

|     |     |     |
| --- | --- | --- |
| **Model** | **Use Case** | **Implementation Notes** |
| **Monte Carlo Simulation** | Portfolio risk assessment, VaR calculation | Simulate 10,000+ scenarios for portfolio outcomes. Calculate Value at Risk and expected returns distribution. |
| **GARCH Models** | Volatility forecasting | Predict future volatility for position sizing. Essential for risk management during earnings seasons. |
| **Markowitz Optimization** | Optimal portfolio allocation suggestions | Given a set of candidate stocks, suggest allocation that maximizes Sharpe ratio. |

### **E. Recommended Model Stack Summary**

|     |     |     |
| --- | --- | --- |
| **Analysis Type** | **Primary Model** | **Secondary/Ensemble** |
| Short-term Price Direction | XGBoost + GRU ensemble | LSTM for validation |
| Medium-term Forecast | Temporal Fusion Transformer | Prophet for trend component |
| News Impact | FinBERT | VADER for speed |
| Fraud/Manipulation Detection | Autoencoder | Isolation Forest |
| Risk Assessment | Monte Carlo + GARCH | Historical simulation |

# **SECTION 4: PERFORMANCE & RELIABILITY DESIGN PRINCIPLES**

## **4.1 Performance Budgets**

Every operation in the system has a defined maximum execution time. These budgets ensure the platform remains responsive under all conditions:

|     |     |     |     |
| --- | --- | --- | --- |
| **Operation** | **Target Latency** | **Maximum Latency** | **Timeout Action** |
| Single stock analysis (cached data) | < 200ms | 500ms | Return partial results |
| Single stock analysis (fresh fetch) | < 2s | 5s  | Use cached + flag stale |
| Market-wide screening (500 stocks) | < 10s | 30s | Return top 100 first |
| Dashboard load | < 1s | 3s  | Progressive loading |
| ML prediction inference | < 500ms | 2s  | Return cached prediction |
| News sentiment analysis | < 1s per article | 3s  | Queue for batch processing |

## **4.2 Caching Strategy**

### **Multi-Layer Cache Architecture**

|     |     |     |     |
| --- | --- | --- | --- |
| **Cache Layer** | **Technology** | **Data Stored** | **TTL (Time-to-Live)** |
| **L1: In-Memory** | Application memory / LRU | Frequently accessed stock data, user session | 5 minutes (market hours) |
| **L2: Redis** | Redis cluster | Computed scores, technical indicators, ML predictions | 15 min - 1 hour depending on data type |
| **L3: Database** | PostgreSQL | Historical data, financials, normalized datasets | Until next update cycle |
| **L4: CDN** | Cloudflare / similar | Static assets, pre-rendered reports | 24 hours |

### **Cache Invalidation Rules**

- **Price Data:** Invalidate on new price tick or every 60 seconds during market hours
- **Financial Data:** Invalidate when new quarterly results detected
- **Scores:** Recalculate when any input data changes
- **ML Predictions:** Refresh daily for medium-term models, hourly for short-term

## **4.3 Error Handling & Graceful Degradation**

|     |     |     |
| --- | --- | --- |
| **Failure Scenario** | **Detection Method** | **Degradation Strategy** |
| Primary data source down | Health check failures, timeout | Automatic failover to secondary source. Display data age prominently. |
| ML model timeout | Inference exceeds 2s | Return framework-only score without ML boost. Flag as incomplete. |
| Partial data available | Missing field count > threshold | Calculate available metrics, reduce confidence score, show which fields missing. |
| Database connection loss | Connection pool exhausted | Serve from cache only. Queue writes for retry. Alert user of limited functionality. |
| Rate limit exceeded | 429 response from source | Exponential backoff. Use cached data. Distribute load across backup sources. |

## **4.4 Data Freshness Indicators**

Every data point displayed includes a freshness indicator so you always know the age of the information:

|     |     |     |
| --- | --- | --- |
| **Indicator** | **Condition** | **Visual Representation** |
| **LIVE** | Data updated within last 5 minutes | Green dot, no additional label |
| **RECENT** | Data updated within last hour | Yellow dot, timestamp shown |
| **DELAYED** | Data older than 1 hour but within today | Orange dot, time since update shown |
| **STALE** | Data from previous day or older | Red dot, date of last update, warning message |

# **SECTION 5: LIVE ANALYSIS FLOW (End-to-End)**

## **5.1 Complete Analysis Pipeline**

When you request analysis of a stock, the following sequence executes:

### **Phase 1: Request Initialization**

1.  User enters stock symbol or selects from watchlist
2.  System validates symbol against master securities list
3.  Check cache for recent analysis (if within TTL, return immediately)
4.  If cache miss, initiate parallel data fetch from all required sources

### **Phase 2: Parallel Data Acquisition**

|     |     |     |
| --- | --- | --- |
| **Stream** | **Data Fetched** | **Expected Duration** |
| **Stream A** | Real-time price, volume, day high/low from NSE | < 500ms |
| **Stream B** | Fundamental data from Screener.in | < 1.5s |
| **Stream C** | Technical indicators from TradingView/ChartInk | < 1s |
| **Stream D** | Recent news headlines for sentiment | < 1s |
| **Stream E** | Shareholding pattern, insider activity | < 1s (usually cached) |

All streams execute concurrently. The system proceeds when all critical streams complete or timeout.

### **Phase 3: Data Assembly & Validation**

1.  Merge data from all streams into unified stock object
2.  Run validation rules engine (type checks, range checks, consistency)
3.  Resolve conflicts using source priority rules
4.  Calculate any derived fields (margins, ratios) from raw components
5.  Generate data quality score (completeness, freshness, consistency)

### **Phase 4: Framework Analysis Execution**

1.  Execute Deal-Breaker checks first (fast fail if any trigger)
2.  Calculate individual metric scores using scoring rules
3.  Apply weights for short-term and long-term composite scores
4.  Compare against industry benchmarks (sector P/E, industry ROE, etc.)
5.  Generate Pass/Fail checklist results

### **Phase 5: ML Enhancement**

1.  Prepare feature vector for ML models
2.  Run price prediction model (returns direction probability)
3.  Run sentiment model on recent news (returns sentiment score)
4.  Run anomaly detection (flag unusual patterns)
5.  Integrate ML outputs as confidence modifiers to framework scores

### **Phase 6: Output Generation**

1.  Generate Bull/Bear/Base case scenarios with probability estimates
2.  Calculate expected value based on scenario probabilities
3.  Compile final verdict (Strong Buy / Buy / Hold / Avoid / Strong Avoid)
4.  Identify top 3 strengths and top 3 risks from factor analysis
5.  Cache complete analysis object
6.  Return to UI for rendering

## **5.2 Pipeline Timing Summary**

|     |     |     |
| --- | --- | --- |
| **Phase** | **Target Time** | **Cumulative** |
| Phase 1: Request Initialization | 50ms | 50ms |
| Phase 2: Parallel Data Acquisition | 1500ms (parallel) | 1550ms |
| Phase 3: Data Assembly & Validation | 100ms | 1650ms |
| Phase 4: Framework Analysis | 150ms | 1800ms |
| Phase 5: ML Enhancement | 400ms | 2200ms |
| Phase 6: Output Generation | 50ms | 2250ms |
| **TOTAL (Fresh Analysis)** |     | ~2.25 seconds |
| **TOTAL (Cached)** |     | < 200ms |

# **SECTION 6: WEBSITE SECTIONS & FUNCTIONAL MODULES**

## **6.1 Module Architecture Overview**

The website is organized into functional modules, each serving a specific purpose in the investment analysis workflow:

|     |     |     |
| --- | --- | --- |
| **Module** | **Purpose** | **Key Features** |
| **Dashboard** | At-a-glance market overview and portfolio status | Market indices, watchlist alerts, portfolio summary, top movers |
| **Stock Analyzer** | Deep-dive single stock analysis | Full framework execution, all metrics, charts, verdict |
| **Screener** | Filter entire market by framework criteria | Pre-built screens, custom filters, batch analysis |
| **Watchlist** | Track stocks of interest with alerts | Score changes, price alerts, news monitoring |
| **Portfolio Tracker** | Monitor holdings and performance | XIRR, allocation, risk metrics, rebalancing suggestions |
| **News & Sentiment** | Aggregated market news with sentiment analysis | Filtered by watchlist, sentiment scores, event calendar |
| **Reports** | Generate and export analysis reports | PDF export, comparison reports, historical analysis |

## **6.2 Module 1: Dashboard**

### **Purpose**

Provide immediate situational awareness when you open the platform. Answer the questions: How is the market doing? Are any of my holdings or watchlist stocks showing significant changes? What requires immediate attention?

### **Components**

|     |     |
| --- | --- |
| **Component** | **Functionality** |
| **Market Overview Panel** | Live Nifty 50, Sensex, Nifty Bank, India VIX with daily change. Sector heatmap showing which sectors are up/down. Global market snapshot (US futures, Asian indices). |
| **Portfolio Summary Card** | Total portfolio value with daily P&L. Top gainers and losers in holdings. Overall allocation pie chart. Alert badge if any holding triggers deal-breaker. |
| **Watchlist Quick View** | Mini cards for each watchlist stock showing current price, daily change, and framework score. Color-coded by score range (green >70, yellow 50-70, red <50). |
| **Alert Center** | Chronological list of triggered alerts: price alerts, score changes, news events, technical signals. Click to navigate to full analysis. |
| **Top Opportunities** | Auto-generated list of stocks that pass all framework criteria with highest scores. Updated daily after market close. |
| **Earnings Calendar** | Upcoming earnings for watchlist stocks. Past earnings with surprise % (beat/miss). |

## **6.3 Module 2: Stock Analyzer**

### **Purpose**

Execute the complete Stock Analysis Framework for a single stock and present all findings in an organized, actionable format.

### **Interface Layout**

|     |     |
| --- | --- |
| **Section** | **Content** |
| **Header** | Stock name, symbol, sector, market cap category. Current price with live tick. Framework scores (Short-term: XX, Long-term: XX). Final Verdict badge. |
| **Price Chart** | Interactive TradingView embed or custom chart. Overlays: 50/200 MA, Bollinger Bands. Volume bars below. Timeframe selector (1D, 1W, 1M, 3M, 1Y, 5Y). |
| **Fundamental Analysis Tab** | All metrics from framework with values, scores, and benchmark comparison. Color-coded (green=pass, red=fail, yellow=caution). Expandable historical trends for each metric. |
| **Technical Analysis Tab** | Current indicator values with interpretations. Signal summary (Bullish/Bearish/Neutral). Support and resistance levels identified. |
| **Valuation Tab** | All valuation ratios with sector/industry comparison. Intrinsic value estimates (if applicable). Fair value range. |
| **Checklist Panel** | Visual pass/fail checklist for both short-term and long-term criteria. Deal-breakers highlighted prominently if triggered. |
| **Scenario Analysis** | Bull/Bear/Base case cards with target prices and probabilities. Expected value calculation displayed. |
| **News & Sentiment** | Recent headlines with sentiment scores. Aggregate sentiment trend graph. |
| **Peer Comparison** | Side-by-side comparison with 3-5 closest competitors on key metrics. |
| **Actions Bar** | Add to Watchlist, Add to Portfolio, Set Alert, Export Report, Refresh Analysis. |

## **6.4 Module 3: Screener**

### **Purpose**

Filter the entire market universe to find stocks that match specific criteria from the framework. Both pre-built screens and custom filter creation.

### **Pre-Built Screens (Based on Framework)**

|     |     |
| --- | --- |
| **Screen Name** | **Criteria** |
| **Quality + Value** | ROE > 15%, D/E < 1, FCF positive 3yr, P/E < industry avg, no deal-breakers |
| **High Growth Momentum** | Revenue growth > 20%, above 50-day MA, RSI 50-70, volume increasing, short-term score > 70 |
| **Dividend Champions** | Dividend yield > 3%, payout ratio &lt; 60%, 5yr dividend growth positive, ROE &gt; 12% |
| **Turnaround Candidates** | Price near 52-week low, RSI oversold (<30), improving margins QoQ, no deal-breakers |
| **Small Cap Gems** | Market cap &lt; 5000 Cr, ROE &gt; 18%, revenue growth > 15%, promoter holding > 50% |
| **Long-Term Compounders** | Long-term score > 75, 5yr revenue CAGR > 12%, consistent profitability, moat identified |

### **Custom Screen Builder**

Allows combining any metrics from the framework with custom thresholds. Supports AND/OR logic. Save and name custom screens for reuse.

## **6.5 Module 4: Watchlist**

### **Purpose**

Track stocks you are interested in but have not yet purchased. Monitor for entry opportunities and stay informed about developments.

### **Features**

- **Multiple Named Watchlists:** Organize by theme (e.g., Banking, IT, High Conviction)
- **Score Tracking:** Daily update of framework scores with change indicators
- **Alert Configuration:** Price alerts (above/below), score alerts (crosses threshold), technical alerts (RSI oversold)
- **News Integration:** Aggregated news feed filtered to watchlist stocks only
- **Batch Analysis:** Refresh analysis for all watchlist stocks with one click

## **6.6 Module 5: Portfolio Tracker**

### **Purpose**

Monitor your actual holdings with performance metrics, risk analysis, and framework-based health checks.

### **Features**

|     |     |
| --- | --- |
| **Feature** | **Description** |
| **Holdings View** | All positions with quantity, avg cost, current value, P&L (absolute and %), framework score |
| **Performance Metrics** | Portfolio XIRR, daily/weekly/monthly returns, comparison vs Nifty 50 benchmark |
| **Allocation Analysis** | Sector allocation pie chart, market cap distribution, concentration risk (any single stock >20%) |
| **Health Check** | Re-run framework on all holdings. Flag any that now trigger deal-breakers or have score drops |
| **Rebalancing Suggestions** | Based on target allocation, suggest which positions to trim/add |
| **Tax Optimization** | Identify tax-loss harvesting opportunities, short vs long-term gains breakdown |

## **6.7 Module 6: News & Sentiment Hub**

### **Purpose**

Aggregate and analyze market news with ML-powered sentiment scoring. Filter to relevant stocks and identify market-moving events.

### **Features**

- **Unified News Feed:** Aggregates from Moneycontrol, ET, BS, Livemint, NDTV Profit
- **Sentiment Scoring:** Each article tagged with positive/negative/neutral sentiment and confidence
- **Stock Tagging:** NLP extraction of mentioned companies, linked to stock profiles
- **Filtering:** By watchlist, portfolio, sector, sentiment polarity, date range
- **Corporate Announcements:** Official BSE/NSE announcements with material impact classification
- **Event Calendar:** Upcoming earnings, AGMs, ex-dividend dates, RBI policy dates

## **6.8 Module 7: Reports**

### **Purpose**

Generate exportable, shareable analysis reports for record-keeping and decision documentation.

### **Report Types**

- **Single Stock Analysis Report:** Complete framework analysis in PDF format
- **Comparison Report:** Side-by-side comparison of 2-5 stocks on all metrics
- **Portfolio Health Report:** Monthly/quarterly portfolio review with all holdings analyzed
- **Screening Results:** Export screener output with key metrics
- **Investment Thesis Document:** Structured template for documenting why you invested

# **SECTION 7: OUTPUT & INTERPRETATION LAYER**

## **7.1 Score Presentation**

Framework scores are presented with full transparency on how they were calculated:

### **Score Card Layout**

|     |     |
| --- | --- |
| **Element** | **Display** |
| **Composite Score** | Large numerical display (0-100) with color coding. Separate scores for short-term and long-term. |
| **Score Breakdown** | Stacked bar or radar chart showing contribution of each category (Fundamentals, Technicals, Valuation, etc.) |
| **Individual Metrics** | Expandable list showing each metric, its value, the score it received, and the threshold it was compared against |
| **Benchmark Comparison** | Visual indicator showing where the stock ranks vs sector/industry peers |
| **Historical Score** | Sparkline showing score trend over past 30/90/365 days |

## **7.2 Verdict Explanation**

Every verdict includes a plain-language explanation:

|     |     |
| --- | --- |
| **Verdict** | **Explanation Template** |
| **Strong Buy** | This stock passes all framework criteria with a score of \[X\]. Key strengths include \[top 3 factors\]. No deal-breakers detected. ML models show \[X\]% probability of positive movement. |
| **Buy** | This stock passes most framework criteria with a score of \[X\]. Notable strengths: \[factors\]. Minor concerns: \[factors\]. Suitable for \[time horizon\] investors with \[risk\] tolerance. |
| **Hold** | This stock has mixed signals with a score of \[X\]. Positives: \[factors\]. Negatives: \[factors\]. Consider monitoring for \[specific triggers\] before taking action. |
| **Avoid** | This stock fails key framework criteria with a score of \[X\]. Primary concerns: \[factors\]. Wait for improvement in \[specific metrics\] before reconsidering. |
| **Strong Avoid** | This stock triggers \[N\] deal-breaker(s): \[list\]. Do not invest regardless of other factors. Fundamental issues: \[explanation\]. |

## **7.3 Confidence Indicators**

Every analysis includes a confidence score based on data quality:

|     |     |     |
| --- | --- | --- |
| **Confidence** | **Criteria** | **User Guidance** |
| **High (90-100%)** | All data fresh, all sources available, no conflicts | Analysis is reliable. Proceed with standard decision process. |
| **Medium (70-89%)** | Minor data gaps or slight staleness | Analysis is mostly reliable. Check flagged items manually. |
| **Low (50-69%)** | Significant data missing or stale | Use caution. Verify critical metrics from primary sources. |
| **Insufficient (<50%)** | Too much data missing for reliable analysis | Analysis blocked. Cannot provide reliable verdict. |

## **7.4 Actionable Recommendations**

Beyond the verdict, the system provides specific action items:

- **Entry Point Suggestion:** If buying, suggested entry range based on technical support levels
- **Position Size Guidance:** Based on conviction level and risk, suggest % of portfolio
- **Stop-Loss Level:** Calculated from technical analysis (support level or % from entry)
- **Monitoring Triggers:** Specific conditions that should prompt re-analysis
- **Timeline:** Expected timeframe for thesis to play out

# **SECTION 8: SYSTEM INTEGRITY & LONG-TERM ROBUSTNESS**

## **8.1 Data Quality Monitoring**

|     |     |     |
| --- | --- | --- |
| **Monitor** | **What It Tracks** | **Alert Condition** |
| **Source Health** | Uptime, response time, error rate for each data source | Downtime > 5 min, error rate > 5% |
| **Data Freshness** | Age of most recent data for each category | Price > 30 min stale, Financials > 24h post-announcement |
| **Validation Failures** | % of records failing validation rules | \> 1% failure rate triggers investigation |
| **Cross-Source Variance** | Disagreement between sources for same metric | Variance > 10% for critical metrics |
| **Coverage** | % of stocks with complete data | Coverage drops below 95% |

## **8.2 Model Performance Tracking**

ML models require ongoing validation to ensure predictions remain accurate:

|     |     |     |
| --- | --- | --- |
| **Model** | **Performance Metric** | **Retraining Trigger** |
| **Price Direction (XGBoost)** | Accuracy, Precision, Recall on 30-day rolling window | Accuracy drops below 55% for 2 consecutive weeks |
| **Sentiment (FinBERT)** | F1 score on manually labeled sample | F1 drops below 0.75, or new vocabulary emerges |
| **Anomaly Detection** | False positive rate, missed anomaly rate | FP > 10% or known anomaly missed |
| **Volatility (GARCH)** | RMSE of predicted vs actual volatility | RMSE increases > 20% from baseline |

## **8.3 Scraper Resilience**

Web scraping is inherently fragile. The system includes multiple layers of protection:

- **Multiple Selector Strategies:** Each data point has 2-3 fallback selectors
- **Visual Regression Testing:** Weekly screenshots compared to detect layout changes
- **Output Validation:** Every scraped value validated against expected type/range
- **Graceful Degradation:** If scraping fails, use cached data with staleness flag
- **Alert on Failure:** Immediate notification when extraction accuracy drops

## **8.4 Backup & Recovery**

|     |     |     |
| --- | --- | --- |
| **Data Type** | **Backup Frequency** | **Retention** |
| **Database (Full)** | Daily at market close | 30 days rolling + monthly archive |
| **Database (Incremental)** | Hourly during market hours | 7 days |
| **ML Models** | On each retraining | Last 5 versions |
| **Configuration** | On each change (version controlled) | Full history in Git |
| **User Data (Watchlists, Portfolio)** | Real-time replication + daily backup | 90 days |

## **8.5 Audit Trail**

For compliance and debugging, the system maintains comprehensive logs:

- **Data Provenance:** Every data point tracked to source URL, timestamp, extraction method
- **Calculation Log:** Every score calculation logged with inputs and intermediate results
- **Verdict History:** Historical record of all verdicts for each stock with timestamps
- **User Actions:** Log of all user interactions (for debugging, not surveillance)
- **System Events:** All errors, warnings, performance anomalies logged

## **8.6 Future-Proofing**

Design decisions that ensure the system can evolve:

- **Modular Architecture:** Each component (data fetcher, analyzer, UI) is independently deployable
- **Framework Configuration:** Scoring rules, thresholds, weights are config-driven, not hard-coded
- **Source Abstraction:** Adding new data sources requires only implementing a standard interface
- **Model Versioning:** ML models are versioned with A/B testing capability
- **API-First Design:** All functionality exposed via API for future integrations (mobile app, alerts via telegram, etc.)

# **APPENDIX A: RECOMMENDED TECHNOLOGY STACK**

|     |     |     |
| --- | --- | --- |
| **Layer** | **Technology** | **Rationale** |
| **Frontend** | React + TypeScript + TailwindCSS | Familiar stack, type safety, rapid UI development |
| **Backend API** | FastAPI (Python) or Node.js/Express | Python for ML integration, async support, auto-docs |
| **Database** | PostgreSQL + TimescaleDB extension | Relational for structured data, time-series for OHLCV |
| **Cache** | Redis | Fast, supports pub/sub for real-time updates |
| **Message Queue** | Redis Streams or RabbitMQ | For async processing of news, scraping jobs |
| **ML Serving** | TensorFlow Serving or TorchServe or ONNX Runtime | Optimized inference, model versioning |
| **Web Scraping** | Playwright or Puppeteer + BeautifulSoup | Handles JS-rendered pages, fallback to static parsing |
| **Task Scheduling** | Celery or APScheduler | Scheduled data fetching, batch processing |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting, dashboards |
| **Logging** | ELK Stack or Loki | Centralized logs, searchable, retention policies |

# **APPENDIX B: ML LIBRARIES & TOOLS**

|     |     |     |
| --- | --- | --- |
| **Purpose** | **Library/Tool** | **Notes** |
| **Deep Learning** | PyTorch or TensorFlow | LSTM, GRU, Transformer implementations |
| **Gradient Boosting** | XGBoost, LightGBM, CatBoost | Tabular data, fast training |
| **Time Series** | Prophet, statsmodels, sktime | Trend/seasonality modeling |
| **NLP/Sentiment** | Hugging Face Transformers, spaCy | FinBERT, custom fine-tuning |
| **Anomaly Detection** | scikit-learn, PyOD | Isolation Forest, autoencoders |
| **Feature Engineering** | TA-Lib, pandas-ta | Technical indicator calculation |
| **Experiment Tracking** | MLflow, Weights & Biases | Model versioning, metrics tracking |
| **Backtesting** | backtrader, zipline | Strategy validation on historical data |

_This architectural roadmap is for educational and planning purposes. Implementation requires technical expertise in software development, data engineering, and machine learning. The system described is for personal use and does not constitute financial advice._