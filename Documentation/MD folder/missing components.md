**ARCHITECTURE ADDENDUM**

Critical Missing Components

Rule Priority | Confidence Scoring | Manual Overrides | Failure Modes

# **ADDENDUM 1: EXPLICIT RULE PRIORITY SYSTEM**

Rules execute in strict hierarchical order. Higher tiers can short-circuit lower tiers. This prevents garbage-in-garbage-out scenarios.

## **1.1 Four-Tier Rule Hierarchy**

|     |     |     |     |
| --- | --- | --- | --- |
| **Tier** | **Name** | **Effect** | **Execution Logic** |
| **1** | **HARD DEAL-BREAKERS** | Fail → Immediate Reject | If ANY fires: STOP. Verdict = STRONG AVOID. No score calculated. |
| **2** | **RISK PENALTIES** | Subtract from score | Each risk factor subtracts 5-15 points. Cumulative. |
| **3** | **QUALITY BOOSTERS** | Add to score | Each quality factor adds 3-15 points. Cumulative. Capped at +30 total. |
| **4** | **ML CONFIDENCE MODIFIER** | Adjust ±10% max | ML can only modify final score by ±10 points. Never overrides deal-breakers. |

## **1.2 Tier 1: Hard Deal-Breakers**

If ANY condition is TRUE, stock is immediately rejected. No exceptions.

|     |     |     |
| --- | --- | --- |
| **#** | **Condition** | **Why Fatal** |
| **D1** | Interest Coverage Ratio < 2.0x | Cannot service debt - bankruptcy risk |
| **D2** | Accounting fraud history OR ongoing SEBI investigation | Financial statements untrustworthy |
| **D3** | Revenue declining 3+ consecutive years | Business structurally failing |
| **D4** | Auditor going concern warning | Professional opinion: survival uncertain |
| **D5** | Negative FCF for 3+ years with no turnaround plan | Cash burn spiral |
| **D6** | Stock halted/suspended/delisting announced | Untradeable |
| **D7** | Promoter pledging > 80% | Forced selling imminent |
| **D8** | Debt-to-Equity > 5.0 (non-financial) | Insolvency risk |
| **D9** | Credit rating = D (Default) or withdrawn | Default imminent or occurred |
| **D10** | Average daily volume < 50,000 (short-term only) | Liquidity trap - cannot exit |

## **1.3 Tier 2: Risk Penalties**

Each triggered condition SUBTRACTS from base score. Cumulative.

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **#** | **Risk Condition** | **LT Penalty** | **ST Penalty** | **Rationale** |
| R1  | D/E between 2.0 - 5.0 | \-15 pts | \-10 pts | High leverage |
| R2  | Interest coverage 2.0x - 3.0x | \-10 pts | \-5 pts | Thin margin |
| R3  | ROE < 10% for 2+ years | \-12 pts | \-5 pts | Poor returns |
| R4  | Promoter holding decreased > 5% in year | \-8 pts | \-10 pts | Insider selling |
| R5  | Promoter pledging 30-80% | \-10 pts | \-15 pts | Promoter stress |
| R6  | Price > 30% below 52-week high | \-3 pts | \-10 pts | Downtrend |
| R7  | Operating margin declining 2+ years | \-8 pts | \-5 pts | Margin pressure |
| R8  | P/E > 2x industry average | \-10 pts | \-5 pts | Overvaluation |

## **1.4 Tier 3: Quality Boosters**

Each triggered condition ADDS to base score. Cumulative. Total boost capped at +30.

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **#** | **Quality Condition** | **LT Boost** | **ST Boost** | **Rationale** |
| Q1  | ROE > 20% for 5+ consecutive years | +15 pts | +5 pts | Proven returns |
| Q2  | Revenue CAGR > 15% over 5 years | +12 pts | +5 pts | Growth machine |
| Q3  | Zero debt or net cash positive | +10 pts | +5 pts | Fortress balance |
| Q4  | Dividend paid 10+ consecutive years | +8 pts | +3 pts | Shareholder focus |
| Q5  | Promoter increased holding in last year | +8 pts | +10 pts | Insider confidence |
| Q6  | FII holding increased > 2% in quarter | +5 pts | +8 pts | Smart money inflow |
| Q7  | Operating margin > 25% | +10 pts | +5 pts | Pricing power |
| Q8  | Breaking to new 52-week high with volume | +3 pts | +12 pts | Momentum |

## **1.5 Tier 4: ML Modifier Rules**

- **ML can NEVER override a Tier 1 deal-breaker**
- Maximum adjustment: ±10 points
- If ML confidence < 55%, adjustment is halved
- Applied LAST after all other tiers

# **ADDENDUM 2: CONFIDENCE & UNCERTAINTY OUTPUT**

A score without confidence is dangerous. Every output includes uncertainty quantification.

## **2.1 Output Structure Example**

┌─────────────────────────────────────────────────┐

│ RELIANCE INDUSTRIES │

│ ───────────────────────────────────────────── │

**│ Final Score: 78 / 100 Verdict: BUY │**

│ Confidence: MEDIUM (0.68) │

│ ───────────────────────────────────────────── │

│ Data Completeness: 0.85 (17/20 metrics) │

│ Data Freshness: 0.92 (Fin: 12 days old) │

│ Source Agreement: 0.78 (P/E varies 3%) │

│ ML Confidence: 0.62 │

│ ───────────────────────────────────────────── │

│ Missing: Promoter pledging, Contingent liab. │

└─────────────────────────────────────────────────┘

## **2.2 Confidence Calculation**

|     |     |     |
| --- | --- | --- |
| **Factor** | **Weight** | **Calculation** |
| **Data Completeness** | 40% | Available Required Metrics / Total Required Metrics |
| **Data Freshness** | 30% | Weighted avg of metric ages. Price: <1hr=1.0, <1day=0.8. Financials: <30d=1.0, <90d=0.7 |
| **Source Agreement** | 15% | 1.0 - (avg variance across sources). P/E diff of 4% = agreement of 0.96 |
| **ML Confidence** | 15% | Average confidence from all ML models used |

## **2.3 Confidence Levels**

|     |     |     |
| --- | --- | --- |
| **Level** | **Score** | **Action** |
| **HIGH** | 0.80 - 1.00 | Analysis reliable. Proceed with standard decision process. |
| **MEDIUM** | 0.60 - 0.79 | Mostly reliable. Review missing/stale metrics manually. |
| **LOW** | 0.40 - 0.59 | Significant gaps. Verify critical metrics from primary sources. |
| **INSUFFICIENT** | < 0.40 | Analysis BLOCKED. Too much data missing. Shows what is needed. |

# **ADDENDUM 3: MANUAL OVERRIDE & NOTES LAYER**

You will disagree with the system. Those overrides must be RECORDED for learning.

## **3.1 Override Types**

|     |     |     |
| --- | --- | --- |
| **Override Type** | **When to Use** | **System Behavior** |
| **VERDICT OVERRIDE** | Disagree with final verdict | Stores both verdicts. Tracks for learning. |
| **SCORE ADJUSTMENT** | Factor weighted wrong for this stock | Records adjustment and reason. Recalculates. |
| **DEAL-BREAKER EXCEPTION** | Deal-breaker is false positive | Requires detailed justification. Still flagged. |
| **DATA CORRECTION** | Extracted data is wrong | Stores correction with source. Re-analyzes. |
| **CONTEXTUAL NOTE** | Additional context | Attached to record. Shown on future views. |

## **3.2 Override Record Fields**

|     |     |     |
| --- | --- | --- |
| **Field** | **Description** | **Required** |
| timestamp | When override was made | Auto |
| stock_symbol | Stock this applies to | Auto |
| override_type | Category from above | Yes |
| system_value | What system calculated | Auto |
| override_value | What you're changing to | Yes |
| **reason** | Why you're overriding (min 20 chars) | REQUIRED |
| confidence | Your confidence: HIGH / MEDIUM / LOW | Yes |
| price_at_override | Stock price when made (for tracking) | Auto |
| outcome | Filled later: Was override correct? | Later |

## **3.3 Learning from Overrides**

- **Monthly Review:** Report of all overrides and their outcomes
- **Pattern Detection:** Are you consistently overriding a rule? Maybe adjust it.
- **Accuracy Tracking:** 6-month returns: System vs Your override. Who was right?

# **ADDENDUM 4: FAILURE MODE DEFINITIONS**

Every component WILL fail. The system must define exactly what happens. No undefined behavior.

## **4.1 Data Source Failures**

|     |     |     |
| --- | --- | --- |
| **Failure** | **Detection** | **Response** |
| **Source down** | HTTP 5xx, timeout > 30s | Switch to fallback. If none, use cache with STALE flag. Alert user. |
| **Partial data** | < 80% expected fields | Store available. Log missing. Reduce confidence. Show warning. |
| **Rate limited** | HTTP 429, CAPTCHA | Exponential backoff (1m, 5m, 15m, 1hr). Switch to fallback. |
| **Structure changed** | Selectors fail, parsing errors | HALT scraping. ALERT: "Scraper broken". Use cache + fallback. |
| **Source gone** | 404 for > 7 days | Disable in config. Promote fallback. Alert for manual review. |

## **4.2 Critical Metric Rules**

Some metrics are so important that their absence blocks analysis:

|     |     |
| --- | --- |
| **Critical Metric** | **If Missing** |
| **Revenue (TTM)** | BLOCK ANALYSIS. Display: "Analysis blocked: Revenue unavailable" |
| **Net Profit / EPS** | BLOCK ANALYSIS. Cannot calculate P/E. |
| **Total Debt** | BLOCK ANALYSIS. Cannot assess leverage or deal-breakers. |
| **Current Price** | BLOCK REAL-TIME. Show historical analysis only. |

## **4.3 Graceful Degradation Levels**

|     |     |     |     |
| --- | --- | --- | --- |
| **Level** | **Condition** | **Available** | **Disabled** |
| **FULL** | All operational | Everything | None |
| **DEGRADED-1** | 1-2 secondary sources down | Full with fallback data | Some confidence |
| **DEGRADED-2** | Primary source OR ML down | Framework only, cached ML | Fresh predictions |
| **DEGRADED-3** | Multiple primary down | Cached analysis, alerts | New analysis, screening |
| **EMERGENCY** | Database/infra down | Error page, status | All features |

## **4.4 Alert Severity Matrix**

|     |     |     |     |
| --- | --- | --- | --- |
| **Severity** | **Examples** | **Channel** | **Response** |
| **CRITICAL** | Database down, all sources failed | Telegram + Email + Sound | Immediate |
| **HIGH** | Primary source down during market | Telegram + Email | < 15 minutes |
| **MEDIUM** | Secondary source down | Email only | < 1 hour |
| **LOW** | Single stock data missing | Log only | Daily review |

# **SUMMARY**

|     |     |
| --- | --- |
| **Component** | **Key Addition** |
| **Rule Priority** | 4-tier hierarchy: Deal-breakers (halt) → Penalties (subtract) → Boosters (add) → ML (±10 max) |
| **Confidence Output** | Every score has: Level (HIGH/MED/LOW), numeric score, breakdown, missing metrics list |
| **Manual Override** | 5 override types. Mandatory reason. Outcome tracking. Monthly learning reports. |
| **Failure Modes** | Every failure defined. Critical metrics block analysis. 5-level degradation. Alert matrix. |

**Implementation Priority:** All four components should be built BEFORE going live. They prevent false certainty and undefined failures.