**TECHNOLOGY STACK**

Process-Oriented Architecture

Single-User Stock Analysis Platform

_Focus: Data Pipeline Performance, Analysis Accuracy, System Reliability_

# **DESIGN PHILOSOPHY**

## **Single-User Optimization Principles**

Since this platform serves exactly one user, the architecture prioritizes different concerns than a typical web application:

|     |     |     |
| --- | --- | --- |
| **Concern** | **Multi-User System** | **This System (Single-User)** |
| **Scaling** | Horizontal scaling, load balancing | Vertical optimization, single machine |
| **Database** | Distributed, sharded, replicated | Single instance, maximum throughput |
| **Caching** | Distributed cache (Redis cluster) | In-process memory + single Redis |
| **Authentication** | Complex auth, sessions, OAuth | Simple local auth or none |
| **API Rate Limiting** | Per-user quotas, throttling | Not needed - you are the only user |
| **Primary Focus** | Request handling, user management | Data pipeline, processing speed, ML inference |

## **What Actually Matters**

- **Data Extraction Reliability:** Scrapers must work 99%+ of the time, handle failures gracefully, and recover automatically
- **Processing Throughput:** Analyze 500+ stocks in under 30 seconds for market-wide screening
- **ML Inference Speed:** Predictions must complete within 500ms to not block the analysis pipeline
- **Data Integrity:** Financial data must be accurate - wrong numbers lead to wrong decisions
- **Automation:** System should run unattended - fetch data, update models, generate alerts without manual intervention
- **Resource Efficiency:** Run effectively on a single machine (your laptop or a modest VPS)

# **SYSTEM PROCESS FLOW**

The technology stack is organized around six core system processes. Each process has specific requirements that drive technology selection:

|     |     |     |     |
| --- | --- | --- | --- |
| **#** | **Process Layer** | **Function** | **Critical Requirement** |
| **1** | **Data Ingestion** | Extract data from 15+ sources (APIs, web scraping, files) | Reliability, resilience to failures |
| **2** | **Data Processing** | Clean, validate, normalize, transform raw data | Speed, accuracy, consistency |
| **3** | **Analysis Engine** | Apply framework rules, calculate scores, generate verdicts | Computational efficiency |
| **4** | **ML Inference** | Run prediction models, sentiment analysis, anomaly detection | Low latency inference |
| **5** | **Data Persistence** | Store historical data, cache results, maintain state | Query speed, data integrity |
| **6** | **Automation & Orchestration** | Schedule jobs, manage pipelines, handle failures | Reliability, self-healing |

### **Data Flow Sequence**

**SOURCES → INGESTION → PROCESSING → STORAGE → ANALYSIS → ML → OUTPUT**

# **LAYER 1: DATA INGESTION**

**Purpose: Extract raw data from external sources into the system**

## **1.1 Core Technology: Python Ecosystem**

Python is the only sensible choice for data ingestion because:

- Best-in-class scraping libraries (Playwright, BeautifulSoup, Scrapy)
- Seamless integration with data processing (pandas, numpy)
- Direct path to ML models (no language boundary)
- Mature async support for concurrent fetching

## **1.2 Technology Selection**

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Why This Choice** |
| **Dynamic Web Scraping** | Playwright | Handles JavaScript-rendered pages (Screener.in, Trendlyne). Async by design. Better than Selenium - faster, more reliable, modern API. |
| **Static HTML Parsing** | BeautifulSoup4 + lxml | Fast parsing for non-JS pages. lxml backend is C-based, extremely fast. Use when Playwright overhead not needed. |
| **HTTP Client** | httpx | Modern async HTTP client. Better than requests - native async, HTTP/2 support, connection pooling. Essential for parallel API calls. |
| **API Integration** | httpx + pydantic | pydantic for response validation and type safety. Catch API changes immediately through validation failures. |
| **PDF Extraction** | PyMuPDF (fitz) | Fastest PDF library. Extract text, tables from annual reports. 10x faster than PyPDF2. Handles scanned PDFs with OCR integration. |
| **Excel/CSV Parsing** | pandas + openpyxl | pandas read_excel/read_csv are battle-tested. openpyxl for .xlsx files. Handle NSE/BSE bhavcopy downloads. |
| **RSS/Atom Feeds** | feedparser | Standard library for news feeds. Parse Moneycontrol, ET, BS RSS feeds for real-time news ingestion. |

## **1.3 Scraper Architecture Pattern**

Each data source gets a dedicated scraper class following a standard interface:

|     |     |
| --- | --- |
| **Pattern Element** | **Implementation** |
| **Base Scraper Class** | Abstract class defining: fetch(), parse(), validate(), transform() methods. All scrapers inherit from this. |
| **Retry Logic** | tenacity library - exponential backoff, max 3 retries, specific exception handling. Never fail silently. |
| **Rate Limiting** | Per-source rate limits using asyncio.Semaphore. Respect robots.txt. Configurable delays between requests. |
| **Selector Fallbacks** | Each data point has 2-3 CSS/XPath selectors. Try primary, fallback to secondary if not found. |
| **Output Schema** | pydantic models define expected output structure. Validation happens immediately after extraction. |

# **LAYER 2: DATA PROCESSING**

**Purpose: Transform raw extracted data into clean, validated, analysis-ready datasets**

## **2.1 Technology Selection**

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Why This Choice** |
| **Data Manipulation** | pandas 2.0+ | Industry standard for tabular data. Version 2.0 has Arrow backend - 2-5x faster. Handles financial data transformations perfectly. |
| **Numerical Computing** | NumPy | Foundation for all numerical operations. Vectorized operations for fast ratio calculations across 1000s of stocks. |
| **Data Validation** | pydantic + pandera | pydantic for record-level validation. pandera for DataFrame-level schema validation. Catch data issues before they corrupt analysis. |
| **Technical Indicators** | pandas-ta | 130+ technical indicators. Pure Python (no TA-Lib compilation issues). Integrates directly with pandas DataFrames. |
| **Alternative: TA-Lib** | TA-Lib (C library) | Faster than pandas-ta for large datasets. Use if processing speed becomes bottleneck. Requires C compilation. |
| **Date/Time Handling** | pandas + pytz | Handle IST timezone, market hours, fiscal year quarters. pandas Timestamp is timezone-aware. |

## **2.2 Processing Pipeline Design**

|     |     |     |
| --- | --- | --- |
| **Step** | **Operation** | **Implementation Detail** |
| **1** | Type Coercion | Convert strings to appropriate types. "1,234.56" → 1234.56 (float). "15%" → 0.15 (decimal). Handles Indian number formats. |
| **2** | Missing Value Handling | Strategy per field: Required fields block processing. Optional fields get NaN. Calculated fields attempt derivation from components. |
| **3** | Outlier Detection | IQR-based detection for numerical fields. P/E of 5000 gets flagged. ROE of -500% gets flagged. Human review queue for anomalies. |
| **4** | Cross-Source Reconciliation | Compare same metric from multiple sources. If variance > 5%, use primary source and log discrepancy. Build source reliability scores over time. |
| **5** | Derived Field Calculation | Calculate metrics not directly available: FCF = OCF - CapEx. PEG = P/E / EPS Growth. Interest Coverage = EBIT / Interest Expense. |
| **6** | Normalization | Standardize units: All currency in INR lakhs. All percentages as decimals. All dates in ISO format. Stock symbols to NSE canonical form. |

# **LAYER 3: ANALYSIS ENGINE**

**Purpose: Apply Stock Analysis Framework rules to generate scores and verdicts**

## **3.1 Technology Selection**

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Why This Choice** |
| **Rules Engine** | Custom Python + NumPy | Framework rules are specific to this system. No need for generic rules engine. NumPy vectorization enables batch scoring of all stocks simultaneously. |
| **Configuration** | YAML + pydantic | Scoring thresholds, weights, deal-breaker conditions stored in YAML. pydantic validates config on load. Change rules without code changes. |
| **Computation** | NumPy + Numba | NumPy for vectorized operations. Numba JIT compilation for hot loops (scoring functions called 1000s of times). 10-50x speedup. |
| **Benchmark Data** | Pre-computed sector averages | Sector/industry averages computed daily post-market. Stored in database. Comparison during analysis is just a lookup, not computation. |

## **3.2 Scoring Architecture**

The analysis engine processes stocks in three modes:

|     |     |     |
| --- | --- | --- |
| **Mode** | **Trigger** | **Processing Approach** |
| **Single Stock Analysis** | User request | Full analysis pipeline for one stock. Fetch fresh data if stale. Complete in < 3 seconds. |
| **Batch Screening** | Screener query | Score 500+ stocks against criteria. Use cached data. Vectorized scoring. Complete in < 30 seconds. |
| **Scheduled Refresh** | Post-market job | Re-score all tracked stocks (watchlist + portfolio). Update all caches. Run after market close daily. |

# **LAYER 4: ML INFERENCE**

**Purpose: Run trained ML models to generate predictions and enhance analysis**

## **4.1 Technology Selection**

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Why This Choice** |
| **Deep Learning Framework** | PyTorch | More Pythonic than TensorFlow. Easier debugging. Strong for LSTM/GRU/Transformer models. Single-user means no need for TF Serving complexity. |
| **Gradient Boosting** | LightGBM | Faster than XGBoost for training. Lower memory usage. Excellent for tabular financial data. Native categorical feature handling. |
| **NLP / Sentiment** | Hugging Face Transformers | FinBERT for financial sentiment. Easy fine-tuning on Indian market news. transformers library is the standard. |
| **Time Series** | Prophet + statsmodels | Prophet for trend/seasonality decomposition. statsmodels for ARIMA, GARCH volatility. Both are lightweight, no GPU needed. |
| **Inference Optimization** | ONNX Runtime | Convert trained PyTorch/LightGBM models to ONNX. 2-5x faster inference. CPU-optimized. No need for GPU in production. |
| **Feature Engineering** | pandas-ta + custom | Technical indicators as features. Custom features for fundamental ratios. Feature store pattern for consistency between training and inference. |

## **4.2 Model Deployment Strategy**

For a single-user system, model serving is simplified:

|     |     |
| --- | --- |
| **Approach** | **Implementation** |
| **In-Process Loading** | Models loaded directly into the Python backend process. No separate model server needed. Simplest approach for single-user. |
| **Lazy Loading** | Models loaded on first use, then cached in memory. Avoids loading all models at startup. ~500MB-1GB memory for all models. |
| **ONNX Conversion** | Train in PyTorch/LightGBM, export to ONNX for inference. ONNX Runtime is optimized for CPU inference. Consistent performance. |
| **Batch vs Real-time** | Batch predictions run post-market (all stocks). Real-time predictions only for actively analyzed stocks. Saves compute. |

## **4.3 Model Inventory**

|     |     |     |     |
| --- | --- | --- | --- |
| **Model** | **Architecture** | **Input** | **Output** |
| **Price Direction (Short)** | LightGBM Classifier | 100+ engineered features | Up/Down/Sideways probability |
| **Price Direction (Medium)** | LSTM / GRU | 60-day OHLCV sequence | 30-day direction probability |
| **News Sentiment** | FinBERT (fine-tuned) | News headline + snippet | Positive/Negative/Neutral score |
| **Volatility Forecast** | GARCH(1,1) | Historical returns | Next 5-day volatility estimate |
| **Anomaly Detection** | Isolation Forest | Price/volume features | Anomaly score (0-1) |

# **LAYER 5: DATA PERSISTENCE**

**Purpose: Store, retrieve, and cache data efficiently for all system operations**

## **5.1 Technology Selection**

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Why This Choice** |
| **Primary Database** | PostgreSQL 15+ | Rock-solid reliability. Excellent for financial data. JSON support for semi-structured data. Single instance handles single-user load easily. |
| **Time-Series Optimization** | TimescaleDB extension | Hypertables for OHLCV data. 10-100x faster time-range queries. Automatic partitioning by time. Compression for historical data. |
| **Cache Layer** | Redis | Sub-millisecond reads. Perfect for caching computed scores, API responses. Single instance sufficient. Also used for task queue. |
| **In-Memory Cache** | Python lru_cache + cachetools | Function-level memoization for expensive computations. No network hop. Invalidated on process restart (acceptable for single-user). |
| **ORM** | SQLAlchemy 2.0 | Mature, well-documented. Async support. Type hints. Handles complex queries. Alembic for migrations. |
| **File Storage** | Local filesystem | PDF reports, downloaded bhavcopies, model checkpoints. No need for S3 at single-user scale. Simple, fast, reliable. |

## **5.2 Database Schema Strategy**

|     |     |     |
| --- | --- | --- |
| **Data Category** | **Storage Type** | **Design Notes** |
| **Stock Master Data** | PostgreSQL (relational) | Company info, sector, industry. Slowly changing. Normalized schema with foreign keys. |
| **Price History (OHLCV)** | TimescaleDB hypertable | Partitioned by month. Compressed after 30 days. Indexed on (symbol, timestamp). Years of history. |
| **Financial Statements** | PostgreSQL (relational) | Quarterly/annual financials. Versioned (track historical reports). One row per company-period. |
| **Computed Scores** | Redis (cache) + PostgreSQL (persist) | Hot data in Redis (TTL 1 hour). Persisted daily to PostgreSQL for history. Enables score trend analysis. |
| **News & Sentiment** | PostgreSQL + JSONB | Article metadata in columns. Full content in JSONB. Sentiment scores indexed for filtering. |
| **User Data** | PostgreSQL (relational) | Watchlists, portfolio holdings, alerts. Simple schema. Single user means no multi-tenancy complexity. |

## **5.3 Caching Strategy**

|     |     |     |     |
| --- | --- | --- | --- |
| **Data Type** | **Cache Location** | **TTL** | **Invalidation Trigger** |
| **Current Prices** | Redis | 60 seconds (market hours) | New price tick received |
| **Framework Scores** | Redis + In-memory | 1 hour | Any input data change |
| **ML Predictions** | Redis | Until next batch run | Post-market refresh |
| **News Sentiment** | PostgreSQL (permanent) | Never expires | N/A - append only |
| **Scraped HTML (debug)** | Filesystem | 24 hours | Scheduled cleanup |

# **LAYER 6: AUTOMATION & ORCHESTRATION**

**Purpose: Schedule and manage all background processes, handle failures, maintain system health**

## **6.1 Technology Selection**

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Why This Choice** |
| **Task Queue** | Celery | Battle-tested for Python. Handles async job execution. Retry logic built-in. Works with Redis as broker. Perfect for scraping jobs. |
| **Message Broker** | Redis | Already using Redis for caching. Dual-purpose: cache + message broker. Simpler than adding RabbitMQ. Sufficient for single-user load. |
| **Scheduler** | Celery Beat | Cron-like scheduling integrated with Celery. Define schedules in config. Runs post-market jobs, hourly refreshes, etc. |
| **Workflow Orchestration** | Celery Canvas (chains, groups) | Define complex workflows: fetch → process → analyze → notify. Built into Celery. No need for Airflow at this scale. |
| **Process Management** | Supervisor or systemd | Keep backend, Celery worker, Celery beat running. Auto-restart on crash. Standard Linux process management. |

## **6.2 Scheduled Jobs**

|     |     |     |
| --- | --- | --- |
| **Job** | **Schedule** | **Description** |
| **Price Data Fetch** | Every 1 min (market hours) | Fetch current prices for watchlist + portfolio stocks from NSE |
| **EOD Bhavcopy Download** | 6:00 PM IST daily | Download and process NSE/BSE bhavcopy files after market close |
| **Fundamental Data Refresh** | Daily at 7:00 PM IST | Scrape updated financials from Screener.in for all tracked stocks |
| **News Ingestion** | Every 15 min | Fetch RSS feeds, run sentiment analysis, store results |
| **Score Refresh** | Daily at 8:00 PM IST | Recalculate framework scores for all watchlist/portfolio stocks |
| **ML Batch Predictions** | Daily at 9:00 PM IST | Run price direction models for all tracked stocks |
| **Quarterly Financials Check** | Daily at 10:00 AM IST | Check for new quarterly results announcements, trigger deep refresh if found |
| **Database Backup** | Daily at 11:00 PM IST | pg_dump to backup directory, rotate old backups |
| **Cache Cleanup** | Daily at midnight | Clear expired cache entries, remove old temp files |

# **PRESENTATION LAYER (UI)**

While the focus is on backend processes, you still need a way to interact with the system. For a single-user system, the UI can be simpler:

## **Technology Selection**

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Why This Choice** |
| **Web Framework** | FastAPI | Already using for backend API. Serves both API endpoints and static files. No need for separate frontend server. |
| **Frontend Framework** | React + TypeScript | You already know it. Type safety. Rich ecosystem for charts. Build as static files, serve from FastAPI. |
| **Styling** | TailwindCSS | Utility-first. Fast development. No context switching to CSS files. Consistent design system. |
| **Charts** | TradingView Lightweight Charts | Professional financial charts. Free and open source. Better than building custom with D3. Handles OHLCV natively. |
| **Data Tables** | TanStack Table | Headless table library. Sorting, filtering, pagination built-in. Style with Tailwind. |
| **State Management** | TanStack Query | Server state management. Automatic caching, background refetch. Pairs with FastAPI perfectly. |
| **Notifications** | Telegram Bot API | Push alerts to your phone. Simple API. No need for email infrastructure. Price alerts, score changes, deal-breaker triggers. |

# **INFRASTRUCTURE & DEPLOYMENT**

## **Deployment Architecture**

For a single-user system, keep infrastructure simple. Everything runs on one machine:

|     |     |     |
| --- | --- | --- |
| **Component** | **Technology** | **Configuration** |
| **Containerization** | Docker | Each service in its own container. Consistent environment. Easy deployment to any machine. |
| **Orchestration** | Docker Compose | Single docker-compose.yml defines all services. One command to start everything. No Kubernetes needed. |
| **Reverse Proxy** | Caddy | Simpler than Nginx. Automatic HTTPS. Single config file. Handles SSL certificates automatically. |
| **Monitoring** | Prometheus + Grafana | Prometheus scrapes metrics from all services. Grafana for dashboards. Alert on failures. |
| **Logging** | Loki + Promtail | Lightweight log aggregation. Integrates with Grafana. Search logs from all containers in one place. |

## **Hosting Options**

|     |     |     |     |
| --- | --- | --- | --- |
| **Option** | **Cost/Month** | **Specs Needed** | **Best For** |
| **Local Machine (Dev)** | Free | 8GB RAM, SSD | Development and testing |
| **DigitalOcean Droplet** | $24-48 | 4-8GB RAM, 2-4 vCPU | Production - good balance of cost and reliability |
| **Hetzner Cloud** | €10-20 | 4-8GB RAM, 2-4 vCPU | Best value for European hosting |
| **AWS EC2 t3.medium** | $30-40 | 4GB RAM, 2 vCPU | If you want AWS ecosystem |
| **Home Server / Raspberry Pi 5** | Electricity only | 8GB RAM Pi 5 | Always-on local, no monthly cost |

## **Docker Compose Services**

|     |     |     |     |
| --- | --- | --- | --- |
| **Service** | **Port** | **Image** | **Purpose** |
| **backend** | 8000 | Custom (FastAPI) | API server, serves frontend |
| **celery-worker** | \-  | Same as backend | Executes background tasks |
| **celery-beat** | \-  | Same as backend | Schedules periodic tasks |
| **postgres** | 5432 | timescale/timescaledb | Primary database |
| **redis** | 6379 | redis:alpine | Cache + message broker |
| **caddy** | 80, 443 | caddy:alpine | Reverse proxy, HTTPS |
| **prometheus** | 9090 | prom/prometheus | Metrics collection |
| **grafana** | 3000 | grafana/grafana | Dashboards, alerting |

# **FINAL TECHNOLOGY STACK SUMMARY**

## **By Process Layer**

|     |     |
| --- | --- |
| **Layer** | **Technologies** |
| **1\. Data Ingestion** | Python, Playwright, BeautifulSoup, httpx, PyMuPDF, feedparser, pydantic |
| **2\. Data Processing** | pandas 2.0, NumPy, pandas-ta, pandera, pydantic |
| **3\. Analysis Engine** | NumPy, Numba, YAML config, custom Python |
| **4\. ML Inference** | PyTorch, LightGBM, Hugging Face Transformers, ONNX Runtime, Prophet |
| **5\. Data Persistence** | PostgreSQL + TimescaleDB, Redis, SQLAlchemy 2.0 |
| **6\. Automation** | Celery, Celery Beat, Redis (broker), Supervisor |
| **7\. Presentation** | FastAPI, React, TypeScript, TailwindCSS, TradingView Charts, TanStack Query |
| **8\. Infrastructure** | Docker, Docker Compose, Caddy, Prometheus, Grafana, Loki |

## **Core Language Decision**

|     |     |
| --- | --- |
| **Component** | **Language** |
| **Backend (Everything)** | Python 3.11+ — Single language for API, scraping, processing, ML. No language boundaries. Maximum ecosystem leverage. |
| **Frontend** | TypeScript — Type safety for UI. Compiles to static files served by Python backend. |

## **Resource Requirements**

|     |     |     |
| --- | --- | --- |
| **Resource** | **Minimum** | **Recommended** |
| **RAM** | 4 GB | 8 GB (ML models in memory) |
| **CPU** | 2 cores | 4 cores (parallel scraping) |
| **Storage** | 20 GB SSD | 50 GB SSD (historical data) |
| **GPU** | Not required | Not required (ONNX CPU inference) |

_This technology stack is optimized for a single-user stock analysis platform focused on the Indian market. The choices prioritize data pipeline reliability, processing speed, and system maintainability over multi-user scalability._