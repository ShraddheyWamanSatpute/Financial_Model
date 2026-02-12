**COMPLETE DATA REQUIREMENTS SPECIFICATION**

Version 2.0 --- All 160 Data Fields

StockPulse - Indian Stock Analysis Platform

12 Categories • Complete Extraction Guide • Historical Depth • Update
Frequencies

**EXECUTIVE SUMMARY**

This document specifies every data field required by StockPulse. Use
this as the definitive reference for building your data extraction
pipeline.

  ----------------- ----------------- ----------------- --------------------
  **Priority**      **Count**         **Description**   **Implementation**

  **🔴 CRITICAL**   **58**            System cannot     Phase 1 - Before
                                      function without  Go-Live
                                      these             

  **🟡 IMPORTANT**  **52**            Significantly     Phase 2 - First
                                      improves analysis Month
                                      quality           

  **🟢 STANDARD**   **35**            Enhances specific Phase 3 - Within 3
                                      features and ML   Months

  **⚪ OPTIONAL**   **7**             Future advanced   Phase 4 - Future
                                      features          

  **🔵 METADATA**   **3**             System tracking   Phase 2
                                      for confidence    
                                      scoring           

  **💭              **5**             Manual assessment Phase 3
  QUALITATIVE**                       or LLM-generated  

  **TOTAL**         **160**           Complete platform \-
                                      data requirements 
  ----------------- ----------------- ----------------- --------------------

**Categories Overview**

  ----------- -------------- ------------ --------------- ------------- ------------
  **\#**      **Category**   **Fields**   **Primary       **History**   **Update**
                                          Source**                      

  1           Stock Master   14           NSE/BSE,        N/A           On Change
              Data                        Screener.in                   

  2           Price & Volume 13           NSE Bhavcopy    10 Years      Daily
              (OHLCV)                                                   

  3           Derived Price  11           Calculated      10 Years      Daily
              Metrics                                                   

  4           Income         18           Screener.in     10 Years      Quarterly
              Statement                                                 

  5           Balance Sheet  17           Screener.in     10 Years      Annual

  6           Cash Flow      8            Screener.in     10 Years      Annual
              Statement                                                 

  7           Financial      11           Calculated      10 Years      Quarterly
              Ratios                                                    

  8           Valuation      17           Calculated      10 Years      Daily
              Metrics                                                   

  9           Shareholding   10           BSE Filings     5-7 Years     Quarterly
              Pattern                                                   

  10          Corporate      10           BSE/NSE         10 Years      On Event
              Actions &                                                 
              Events                                                    

  11          News &         8            RSS Feeds       30 Days       Real-time
              Sentiment                                                 

  12          Technical      15           pandas-ta       10 Years      Daily
              Indicators                                                

  13          Qualitative &  8            Manual/System   Current       On Event
              Metadata                                                  
  ----------- -------------- ------------ --------------- ------------- ------------

**CATEGORY 1: STOCK MASTER DATA (14 Fields)**

Basic identifying information about each stock. Reference data that
rarely changes.

  -------- ------------------------- ------------ --------------- ------------ -------------- ---------------- -------------
  **\#**   **Field Name**            **Type**     **Example**     **Update**   **Priority**   **Used For**     **Source**

  1        **symbol**                String       RELIANCE        On listing   **🔴           Primary          NSE/BSE
                                                                               Critical**     identifier       

  2        **company_name**          String       Reliance        On change    **🔴           UI display name  NSE/BSE
                                                  Industries Ltd               Critical**                      

  3        **isin**                  String(12)   INE002A01018    Never        **🔴           Cross-exchange   NSE/BSE
                                                                               Critical**     ID               

  4        **nse_code**              String       RELIANCE        On change    **🔴           NSE trading      NSE
                                                                               Critical**     symbol           

  5        **bse_code**              String       500325          On change    **🟡           BSE scrip code   BSE
                                                                               Important**                     

  6        **sector**                String       Oil & Gas       On change    **🔴           Sector           Screener.in
                                                                               Critical**     comparison       

  7        **industry**              String       Refineries      On change    **🔴           Industry peer    Screener.in
                                                                               Critical**     comparison       

  8        **market_cap_category**   Enum         Large Cap       Daily        **🟡           Size             Calculated
                                                                               Important**    classification   

  9        **listing_date**          Date         1977-01-01      Never        **🟢           Company age      NSE/BSE
                                                                               Standard**     analysis         

  10       **face_value**            Decimal      10.00           On split     **🟢           Corp action      NSE/BSE
                                                                               Standard**     adjustment       

  11       **shares_outstanding**    Integer      6,766,000,000   Quarterly    **🟡           Market cap, EPS  BSE Filings
                                                                               Important**    calc             

  12       **free_float_shares**     Integer      3,200,000,000   Quarterly    **🟢           Float analysis   BSE Filings
                                                                               Standard**                      

  13       **website**               URL          www.ril.com     Never        **⚪           Company research Screener.in
                                                                               Optional**                      

  14       **registered_office**     String       Mumbai, MH      Never        **⚪           Company info     BSE
                                                                               Optional**                      
  -------- ------------------------- ------------ --------------- ------------ -------------- ---------------- -------------

**CATEGORY 2: PRICE & VOLUME DATA (13 Fields)**

Daily trading data. Foundation for technical analysis, valuations, and
ML features.

  -------- ------------------------- ---------- ---------- ------------- ------------- -------------- --------------- ------------
  **\#**   **Field Name**            **Type**   **Unit**   **Example**   **History**   **Priority**   **Used For**    **Source**

  15       **date**                  Date       \-         2025-02-10    10 yr         **🔴           Time series key NSE Bhavcopy
                                                                                       Critical**                     

  16       **open**                  Decimal    ₹          2845.50       10 yr         **🔴           Candlestick,    NSE Bhavcopy
                                                                                       Critical**     gap analysis    

  17       **high**                  Decimal    ₹          2878.90       10 yr         **🔴           Range,          NSE Bhavcopy
                                                                                       Critical**     resistance      

  18       **low**                   Decimal    ₹          2832.15       10 yr         **🔴           Range, support  NSE Bhavcopy
                                                                                       Critical**                     

  19       **close**                 Decimal    ₹          2867.35       10 yr         **🔴           All             NSE Bhavcopy
                                                                                       Critical**     calculations    

  20       **adjusted_close**        Decimal    ₹          2867.35       10 yr         **🔴           Accurate        yfinance
                                                                                       Critical**     returns         

  21       **volume**                Integer    shares     8,542,367     10 yr         **🔴           Liquidity, D10  NSE Bhavcopy
                                                                                       Critical**                     

  22       **delivery_volume**       Integer    shares     4,521,890     10 yr         **🟡           Genuine buying  NSE Bhavcopy
                                                                                       Important**                    

  23       **delivery_percentage**   Decimal    \%         52.94         10 yr         **🟡           Buyer           NSE Bhavcopy
                                                                                       Important**    conviction      

  24       **turnover**              Decimal    ₹ Cr       245.67        10 yr         **🟡           Value traded    NSE Bhavcopy
                                                                                       Important**                    

  25       **trades_count**          Integer    \-         142,567       10 yr         **🟡           Participation   NSE Bhavcopy
                                                                                       Important**    breadth         

  26       **prev_close**            Decimal    ₹          2845.50       10 yr         **🟢           Daily change    NSE Bhavcopy
                                                                                       Standard**     calc            

  27       **vwap**                  Decimal    ₹          2856.78       1 yr          **🟢           Institutional   NSE
                                                                                       Standard**     benchmark       
  -------- ------------------------- ---------- ---------- ------------- ------------- -------------- --------------- ------------

**CATEGORY 3: DERIVED PRICE METRICS (11 Fields)**

Calculated from OHLCV data. Not fetched directly.

  ----------- ---------------------------- ---------------- ------------- -------------- --------------
  **\#**      **Field Name**               **Calculation    **History**   **Priority**   **Used For**
                                           Formula**                                     

  28          **daily_return_pct**         ((close -        10 yr         **🔴           Return
                                           prev_close) /                  Critical**     analysis,
                                           prev_close) ×                                 volatility, ML
                                           100                                           

  29          **return_5d_pct**            ((close -        10 yr         **🟢           ML feature -
                                           close_5d_ago) /                Standard**     5-day momentum
                                           close_5d_ago) ×                               
                                           100                                           

  30          **return_20d_pct**           ((close -        10 yr         **🟢           ML feature -
                                           close_20d_ago) /               Standard**     20-day
                                           close_20d_ago) ×                              momentum
                                           100                                           

  31          **return_60d_pct**           ((close -        10 yr         **🟢           ML feature -
                                           close_60d_ago) /               Standard**     60-day
                                           close_60d_ago) ×                              momentum
                                           100                                           

  32          **day_range_pct**            ((high - low) /  10 yr         **🟢           Intraday
                                           low) × 100                     Standard**     volatility, ML

  33          **gap_percentage**           ((open -         10 yr         **🟢           Gap detection,
                                           prev_close) /                  Standard**     ML feature
                                           prev_close) ×                                 
                                           100                                           

  34          **52_week_high**             MAX(high) over   10 yr         **🔴           Technical
                                           252 trading days               Critical**     analysis, Q8
                                                                                         booster

  35          **52_week_low**              MIN(low) over    10 yr         **🔴           Support
                                           252 trading days               Critical**     detection

  36          **distance_from_52w_high**   ((52w_high -     10 yr         **🟡           R6 penalty
                                           close) /                       Important**    (\>30%)
                                           52w_high) × 100                               

  37          **volume_ratio**             volume /         10 yr         **🟡           Volume spike,
                                           avg_volume_20d                 Important**    ML feature

  38          **avg_volume_20d**           AVG(volume) over 10 yr         **🔴           D10
                                           20 days                        Critical**     deal-breaker
                                                                                         (\<50k)
  ----------- ---------------------------- ---------------- ------------- -------------- --------------

**CATEGORY 4: INCOME STATEMENT (18 Fields)**

Quarterly and annual financial performance. Core inputs for fundamental
analysis.

  -------- ------------------------ ---------- ---------- ------------- ---------- --------- -------------- --------------- -------------
  **\#**   **Field Name**           **Type**   **Unit**   **Example**   **Hist**   **Upd**   **Priority**   **Used For**    **Source**

  39       **revenue**              Decimal    ₹ Cr       245,678       10 yr      Qtr       **🔴           D3, growth, P/S Screener.in
                                                                                             Critical**                     

  40       **revenue_growth_yoy**   Decimal    \%         15.67         10 yr      Qtr       **🔴           Scoring         Calculated
                                                                                             Critical**     (\>15%=100)     

  41       **revenue_growth_qoq**   Decimal    \%         3.45          10 yr      Qtr       **🟡           Quarterly       Calculated
                                                                                             Important**    momentum        

  42       **operating_profit**     Decimal    ₹ Cr       45,678        10 yr      Qtr       **🔴           Op margin calc  Screener.in
                                                                                             Critical**                     

  43       **operating_margin**     Decimal    \%         18.59         10 yr      Qtr       **🔴           Q7 (\>25%), R7  Screener.in
                                                                                             Critical**                     

  44       **gross_profit**         Decimal    ₹ Cr       67,890        10 yr      Ann       **🟡           Gross margin    Screener.in
                                                                                             Important**                    

  45       **gross_margin**         Decimal    \%         27.63         10 yr      Ann       **🟡           Pricing power   Calculated
                                                                                             Important**                    

  46       **net_profit**           Decimal    ₹ Cr       23,456        10 yr      Qtr       **🔴           EPS, P/E        Screener.in
                                                                                             Critical**                     

  47       **net_profit_margin**    Decimal    \%         9.54          10 yr      Qtr       **🔴           Profitability   Calculated
                                                                                             Critical**                     

  48       **eps**                  Decimal    ₹          34.67         10 yr      Qtr       **🔴           P/E, EPS growth Screener.in
                                                                                             Critical**                     

  49       **eps_growth_yoy**       Decimal    \%         18.34         10 yr      Qtr       **🔴           PEG calculation Calculated
                                                                                             Critical**                     

  50       **interest_expense**     Decimal    ₹ Cr       1,234         10 yr      Qtr       **🔴           Interest        Screener.in
                                                                                             Critical**     coverage        

  51       **depreciation**         Decimal    ₹ Cr       5,678         10 yr      Qtr       **🟡           EBITDA calc     Screener.in
                                                                                             Important**                    

  52       **ebitda**               Decimal    ₹ Cr       51,357        10 yr      Qtr       **🟡           EV/EBITDA       Screener.in
                                                                                             Important**                    

  53       **ebit**                 Decimal    ₹ Cr       45,678        10 yr      Qtr       **🟡           Interest        Calculated
                                                                                             Important**    coverage        

  54       **other_income**         Decimal    ₹ Cr       3,456         10 yr      Qtr       **🟡           Core vs         Screener.in
                                                                                             Important**    non-core        

  55       **tax_expense**          Decimal    ₹ Cr       12,345        10 yr      Qtr       **🟢           Tax rate        Screener.in
                                                                                             Standard**                     

  56       **effective_tax_rate**   Decimal    \%         25.67         10 yr      Ann       **🟢           Tax efficiency  Calculated
                                                                                             Standard**                     
  -------- ------------------------ ---------- ---------- ------------- ---------- --------- -------------- --------------- -------------

**CATEGORY 5: BALANCE SHEET (17 Fields)**

Annual and quarterly balance sheet data for financial health and
leverage analysis.

  -------- ---------------------------- ---------- ---------- ------------- ---------- --------- -------------- --------------- -------------
  **\#**   **Field Name**               **Type**   **Unit**   **Example**   **Hist**   **Upd**   **Priority**   **Used For**    **Source**

  57       **total_assets**             Decimal    ₹ Cr       567,890       10 yr      Ann       **🔴           ROA calculation Screener.in
                                                                                                 Critical**                     

  58       **total_equity**             Decimal    ₹ Cr       234,567       10 yr      Ann       **🔴           ROE, D/E, BV    Screener.in
                                                                                                 Critical**                     

  59       **total_debt**               Decimal    ₹ Cr       123,456       10 yr      Qtr       **🔴           D/E, D8         Screener.in
                                                                                                 Critical**     deal-breaker    

  60       **long_term_debt**           Decimal    ₹ Cr       98,765        10 yr      Ann       **🟡           Debt structure  Screener.in
                                                                                                 Important**                    

  61       **short_term_debt**          Decimal    ₹ Cr       24,691        10 yr      Ann       **🟡           Short-term      Screener.in
                                                                                                 Important**    liquidity       

  62       **cash_and_equivalents**     Decimal    ₹ Cr       45,678        10 yr      Qtr       **🔴           Net debt, Q3    Screener.in
                                                                                                 Critical**                     

  63       **net_debt**                 Decimal    ₹ Cr       77,777        10 yr      Qtr       **🟡           EV calculation  Calculated
                                                                                                 Important**                    

  64       **current_assets**           Decimal    ₹ Cr       123,456       10 yr      Ann       **🟡           Current ratio   Screener.in
                                                                                                 Important**                    

  65       **current_liabilities**      Decimal    ₹ Cr       98,765        10 yr      Ann       **🟡           Current/Quick   Screener.in
                                                                                                 Important**    ratio           

  66       **inventory**                Decimal    ₹ Cr       34,567        10 yr      Ann       **🟡           Quick ratio     Screener.in
                                                                                                 Important**                    

  67       **receivables**              Decimal    ₹ Cr       23,456        10 yr      Ann       **🟢           Receivables     Screener.in
                                                                                                 Standard**     turnover        

  68       **payables**                 Decimal    ₹ Cr       12,345        10 yr      Ann       **🟢           Payables        Screener.in
                                                                                                 Standard**     turnover        

  69       **fixed_assets**             Decimal    ₹ Cr       234,567       10 yr      Ann       **🟢           Asset turnover  Screener.in
                                                                                                 Standard**                     

  70       **intangible_assets**        Decimal    ₹ Cr       12,345        10 yr      Ann       **🟢           Goodwill        Screener.in
                                                                                                 Standard**     analysis        

  71       **reserves_and_surplus**     Decimal    ₹ Cr       198,765       10 yr      Ann       **🟢           Retained        Screener.in
                                                                                                 Standard**     earnings        

  72       **book_value_per_share**     Decimal    ₹          345.67        10 yr      Ann       **🟡           P/B ratio       Screener.in
                                                                                                 Important**                    

  73       **contingent_liabilities**   Decimal    ₹ Cr       5,678         10 yr      Ann       **🟢           R10 penalty     Annual Report
                                                                                                 Standard**                     
  -------- ---------------------------- ---------- ---------- ------------- ---------- --------- -------------- --------------- -------------

**CATEGORY 6: CASH FLOW STATEMENT (8 Fields)**

Cash generation and usage analysis.

  -------- ------------------------- ---------- ---------- ------------- ---------- --------- -------------- ------------- -------------
  **\#**   **Field Name**            **Type**   **Unit**   **Example**   **Hist**   **Upd**   **Priority**   **Used For**  **Source**

  74       **operating_cash_flow**   Decimal    ₹ Cr       34,567        10 yr      Ann       **🔴           OCF \> NI     Screener.in
                                                                                              Critical**     check, FCF    

  75       **investing_cash_flow**   Decimal    ₹ Cr       -23,456       10 yr      Ann       **🔴           CapEx         Screener.in
                                                                                              Critical**     analysis      

  76       **financing_cash_flow**   Decimal    ₹ Cr       -12,345       10 yr      Ann       **🟡           Debt/equity   Screener.in
                                                                                              Important**    financing     

  77       **capital_expenditure**   Decimal    ₹ Cr       18,765        10 yr      Ann       **🔴           FCF = OCF -   Screener.in
                                                                                              Critical**     CapEx         

  78       **free_cash_flow**        Decimal    ₹ Cr       15,802        10 yr      Ann       **🔴           D5, FCF       Calculated
                                                                                              Critical**     yield, Q9     

  79       **dividends_paid**        Decimal    ₹ Cr       5,678         10 yr      Ann       **🟡           Dividend      Screener.in
                                                                                              Important**    payout        

  80       **debt_repayment**        Decimal    ₹ Cr       12,345        10 yr      Ann       **🟢           Debt          Screener.in
                                                                                              Standard**     servicing     

  81       **equity_raised**         Decimal    ₹ Cr       0.00          10 yr      Ann       **🟢           Dilution      Screener.in
                                                                                              Standard**     tracking      
  -------- ------------------------- ---------- ---------- ------------- ---------- --------- -------------- ------------- -------------

**CATEGORY 7: FINANCIAL RATIOS (11 Fields)**

Key ratios derived from financial statements.

  ---------- --------------------------- ------------- ---------- ---------- -------------- ---------------
  **\#**     **Ratio Name**              **Formula**   **Hist**   **Upd**    **Priority**   **Used For
                                                                                            (Threshold)**

  82         **roe**                     Net Profit /  10 yr      Qtr        **🔴           Q1 (\>20% 5yr),
                                         Total Equity                        Critical**     R3 (\<10%)
                                         × 100                                              

  83         **roa**                     Net Profit /  10 yr      Ann        **🟡           Asset
                                         Total Assets                        Important**    efficiency
                                         × 100                                              

  84         **roic**                    NOPAT /       10 yr      Ann        **🟡           Capital
                                         Invested                            Important**    efficiency
                                         Capital × 100                                      

  85         **debt_to_equity**          Total Debt /  10 yr      Qtr        **🔴           D8 (\>5), R1,
                                         Total Equity                        Critical**     Q3 (0)

  86         **interest_coverage**       EBIT /        10 yr      Qtr        **🔴           D1 (\<2x), R2
                                         Interest                            Critical**     (2-3x)
                                         Expense                                            

  87         **current_ratio**           Current       10 yr      Ann        **🟡           Liquidity
                                         Assets /                            Important**    (\>1.5)
                                         Current                                            
                                         Liabilities                                        

  88         **quick_ratio**             (Current      10 yr      Ann        **🟢           Short-term
                                         Assets -                            Standard**     liquidity
                                         Inventory) /                                       
                                         Current Liab                                       

  89         **asset_turnover**          Revenue /     10 yr      Ann        **🟢           Efficiency
                                         Total Assets                        Standard**     analysis

  90         **inventory_turnover**      COGS /        10 yr      Ann        **🟢           Working capital
                                         Average                             Standard**     
                                         Inventory                                          

  91         **receivables_turnover**    Revenue /     10 yr      Ann        **🟢           Collection
                                         Average                             Standard**     efficiency
                                         Receivables                                        

  92         **dividend_payout_ratio**   Dividends /   10 yr      Ann        **🟡           Q4 (10yr
                                         Net Profit ×                        Important**    consecutive)
                                         100                                                
  ---------- --------------------------- ------------- ---------- ---------- -------------- ---------------

**CATEGORY 8: VALUATION METRICS (17 Fields)**

Current and historical valuation for relative and absolute analysis.

  -------- -------------------------- ----------------- ---------- --------- -------------- ----------------- -------------
  **\#**   **Field Name**             **Calculation**   **Hist**   **Upd**   **Priority**   **Used For**      **Source**

  93       **market_cap**             Price × Shares    10 yr      Daily     **🔴           Size, EV calc     Calculated
                                      Outstanding                            Critical**                       

  94       **enterprise_value**       Market Cap + Net  10 yr      Daily     **🔴           EV/EBITDA         Calculated
                                      Debt                                   Critical**                       

  95       **pe_ratio**               Price / EPS (TTM) 10 yr      Daily     **🔴           Valuation, R8     Calculated
                                                                             Critical**                       

  96       **pe_ratio_forward**       Price / Estimated 3 yr       Qtr       **🔴           Forward valuation Trendlyne
                                      EPS (FY+1)                             Critical**                       

  97       **peg_ratio**              P/E / EPS Growth  10 yr      Qtr       **🔴           Growth-adjusted   Calculated
                                      Rate                                   Critical**     val               

  98       **pb_ratio**               Price / Book      10 yr      Daily     **🟡           Asset-based val   Calculated
                                      Value per Share                        Important**                      

  99       **ps_ratio**               Price / Revenue   10 yr      Daily     **🟡           Revenue-based val Calculated
                                      per Share                              Important**                      

  100      **ev_to_ebitda**           Enterprise Value  10 yr      Qtr       **🔴           Valuation scoring Calculated
                                      / EBITDA                               Critical**                       

  101      **ev_to_sales**            Enterprise Value  10 yr      Qtr       **🟢           Revenue-based EV  Calculated
                                      / Revenue                              Standard**                       

  102      **dividend_yield**         Annual Dividend / 10 yr      Daily     **🟡           Income investing  Calculated
                                      Price × 100                            Important**                      

  103      **fcf_yield**              FCF per Share /   10 yr      Ann       **🟡           Q9 booster (\>5%) Calculated
                                      Price × 100                            Important**                      

  104      **earnings_yield**         EPS / Price × 100 10 yr      Daily     **🟡           Bond yield        Calculated
                                                                             Important**    comparison        

  105      **sector_avg_pe**          Median P/E of     3 yr       Weekly    **🟡           R8 (P/E \> 2x     Screener.in
                                      sector peers                           Important**    sector)           

  106      **sector_avg_roe**         Median ROE of     3 yr       Weekly    **🟡           Sector benchmark  Screener.in
                                      sector peers                           Important**                      

  107      **industry_avg_pe**        Median P/E of     3 yr       Weekly    **🟢           Industry          Screener.in
                                      industry peers                         Standard**     comparison        

  108      **historical_pe_median**   Median P/E over 5 10 yr      Daily     **🟢           Historical        Calculated
                                      years                                  Standard**     valuation         

  109      **sector_performance**     Sector index      1 yr       Daily     **🟡           Sector strength   NSE Indices
                                      return (1m, 3m,                        Important**    check             
                                      1y)                                                                     
  -------- -------------------------- ----------------- ---------- --------- -------------- ----------------- -------------

**CATEGORY 9: SHAREHOLDING PATTERN (10 Fields)**

Quarterly shareholding data from regulatory filings.

  -------- ----------------------------- ---------- ---------- ------------- ---------- --------- -------------- --------------- ---------------
  **\#**   **Field Name**                **Type**   **Unit**   **Example**   **Hist**   **Upd**   **Priority**   **Used For**    **Source**

  110      **promoter_holding**          Decimal    \%         50.29         5-7 yr     Qtr       **🔴           Ownership, R4   BSE Filings
                                                                                                  Critical**                     

  111      **promoter_pledging**         Decimal    \%         12.45         3-5 yr     Qtr       **🔴           D7 (\>80%), R5  BSE/Trendlyne
                                                                                                  Critical**                     

  112      **fii_holding**               Decimal    \%         23.56         5-7 yr     Qtr       **🔴           Q6 booster      BSE Filings
                                                                                                  Critical**                     

  113      **dii_holding**               Decimal    \%         18.34         5-7 yr     Qtr       **🟡           Domestic inst   BSE Filings
                                                                                                  Important**                    

  114      **public_holding**            Decimal    \%         7.81          5-7 yr     Qtr       **🟡           Retail          BSE Filings
                                                                                                  Important**    participation   

  115      **promoter_holding_change**   Decimal    \%         -1.23         5-7 yr     Qtr       **🟡           R4 (↓\>5%), Q5  Calculated
                                                                                                  Important**    (↑)             

  116      **fii_holding_change**        Decimal    \%         +2.34         5-7 yr     Qtr       **🟡           Q6 (↑\>2%)      Calculated
                                                                                                  Important**                    

  117      **num_shareholders**          Integer    \-         2,456,789     5-7 yr     Qtr       **🟢           Retail breadth  BSE Filings
                                                                                                  Standard**                     

  118      **mf_holding**                Decimal    \%         8.45          5-7 yr     Qtr       **🟢           MF interest     BSE Filings
                                                                                                  Standard**                     

  119      **insurance_holding**         Decimal    \%         5.67          5-7 yr     Qtr       **🟢           Insurance       BSE Filings
                                                                                                  Standard**     interest        
  -------- ----------------------------- ---------- ---------- ------------- ---------- --------- -------------- --------------- ---------------

**CATEGORY 10: CORPORATE ACTIONS & EVENTS (10 Fields)**

Dividends, splits, bonus, events, and stock status.

  -------- ------------------------ ---------------- ---------- ------------- ---------- --------- -------------- -------------- ------------
  **\#**   **Field Name**           **Type**         **Unit**   **Example**   **Hist**   **Upd**   **Priority**   **Used For**   **Source**

  120      **dividend_per_share**   Decimal          ₹          8.50          10 yr      On Event  **🟡           Div yield, Q4  BSE/NSE
                                                                                                   Important**                   

  121      **ex_dividend_date**     Date             \-         2025-02-15    10 yr      On Event  **🟡           Price          BSE/NSE
                                                                                                   Important**    adjustment     

  122      **stock_split_ratio**    String           \-         1:2           10 yr      On Event  **🟡           Price/shares   BSE/NSE
                                                                                                   Important**    adj            

  123      **bonus_ratio**          String           \-         1:1           10 yr      On Event  **🟡           Shares         BSE/NSE
                                                                                                   Important**    adjustment     

  124      **rights_issue_ratio**   String           \-         1:5 @ ₹500    10 yr      On Event  **🟢           Dilution       BSE/NSE
                                                                                                   Standard**     tracking       

  125      **buyback_details**      String           \-         ₹500Cr @      10 yr      On Event  **🟢           Capital return BSE/NSE
                                                                ₹2500                              Standard**                    

  126      **next_earnings_date**   Date             \-         2025-04-15    Current    On Event  **🟡           Checklist item BSE Announce
                                                                                                   Important**                   

  127      **pending_events**       List\[Object\]   \-         \[{AGM,       Current    On Event  **🟡           Catalyst       BSE Announce
                                                                2025-07}\]                         Important**    calendar       

  128      **stock_status**         Enum             \-         ACTIVE        Current    On Event  **🔴           D6             NSE/BSE
                                                                                                   Critical**     deal-breaker   

  129      **sebi_investigation**   Boolean          \-         false         Current    On Event  **🔴           D2             SEBI/News
                                                                                                   Critical**     deal-breaker   
  -------- ------------------------ ---------------- ---------- ------------- ---------- --------- -------------- -------------- ------------

**CATEGORY 11: NEWS & SENTIMENT (8 Fields)**

Real-time news and sentiment analysis data.

  -------- ----------------------------- ---------------- ---------- ------------------ ---------- ----------- -------------- --------------
  **\#**   **Field Name**                **Type**         **Unit**   **Example**        **Hist**   **Upd**     **Priority**   **Used For**

  130      **news_headline**             String           \-         Reliance Q3 profit 30 days    Real-time   **🟡           News display
                                                                     rises                                     Important**    

  131      **news_body_text**            String           \-         (Full article      30 days    Real-time   **🟡           Full sentiment
                                                                     text)                                     Important**    

  132      **news_source**               String           \-         Moneycontrol       30 days    Real-time   **🟢           Source
                                                                                                               Standard**     credibility

  133      **news_timestamp**            DateTime         \-         2025-02-10T14:30   30 days    Real-time   **🟡           Recency weight
                                                                                                               Important**    

  134      **news_sentiment_score**      Decimal          -1 to 1    0.75               30 days    Real-time   **🟡           Sentiment
                                                                                                               Important**    scoring

  135      **stock_tickers_mentioned**   List\[String\]   \-         \[RELIANCE, TCS\]  30 days    Real-time   **🟢           Stock tagging
                                                                                                               Standard**     

  136      **credit_rating**             String           \-         CRISIL AAA         Current    On Change   **🟡           D9
                                                                                                               Important**    deal-breaker

  137      **credit_outlook**            Enum             \-         Stable             Current    On Change   **🟢           Credit trend
                                                                                                               Standard**     
  -------- ----------------------------- ---------------- ---------- ------------------ ---------- ----------- -------------- --------------

**CATEGORY 12: TECHNICAL INDICATORS (15 Fields)**

All calculated from OHLCV using pandas-ta. Not fetched directly.

  -------- ---------------------- ----------------- ------------- ---------- --------- -------------- -----------------
  **\#**   **Indicator**          **Calculation**   **Library**   **Hist**   **Upd**   **Priority**   **Used For**

  138      **sma_20**             SMA(close, 20)    pandas-ta     10 yr      Daily     **🟡           Short-term trend
                                                                                       Important**    

  139      **sma_50**             SMA(close, 50)    pandas-ta     10 yr      Daily     **🔴           Medium trend,
                                                                                       Critical**     checklist

  140      **sma_200**            SMA(close, 200)   pandas-ta     10 yr      Daily     **🔴           Long-term trend
                                                                                       Critical**     

  141      **ema_12**             EMA(close, 12)    pandas-ta     10 yr      Daily     **🟡           MACD calculation
                                                                                       Important**    

  142      **ema_26**             EMA(close, 26)    pandas-ta     10 yr      Daily     **🟡           MACD calculation
                                                                                       Important**    

  143      **rsi_14**             RSI(close, 14)    pandas-ta     10 yr      Daily     **🔴           Overbought/sold
                                                                                       Critical**     (30-70)

  144      **macd**               EMA(12) - EMA(26) pandas-ta     10 yr      Daily     **🔴           Momentum scoring
                                                                                       Critical**     

  145      **macd_signal**        EMA(MACD, 9)      pandas-ta     10 yr      Daily     **🔴           Signal crossovers
                                                                                       Critical**     

  146      **bollinger_upper**    SMA(20) +         pandas-ta     10 yr      Daily     **🟡           Volatility bands
                                  2×StdDev                                             Important**    

  147      **bollinger_lower**    SMA(20) -         pandas-ta     10 yr      Daily     **🟡           Volatility bands
                                  2×StdDev                                             Important**    

  148      **atr_14**             ATR(14)           pandas-ta     10 yr      Daily     **🟡           Stop-loss calc
                                                                                       Important**    

  149      **adx_14**             ADX(14)           pandas-ta     10 yr      Daily     **🟢           Trend strength
                                                                                       Standard**     

  150      **obv**                On Balance Volume pandas-ta     10 yr      Daily     **🟢           Volume
                                                                                       Standard**     confirmation

  151      **support_level**      Pivot low         Custom        1 yr       Daily     **🟡           Stop-loss,
                                  calculation                                          Important**    checklist

  152      **resistance_level**   Pivot high        Custom        1 yr       Daily     **🟡           Target, checklist
                                  calculation                                          Important**    
  -------- ---------------------- ----------------- ------------- ---------- --------- -------------- -----------------

**CATEGORY 13: QUALITATIVE & METADATA (8 Fields)**

Manual assessments, LLM-generated, and system tracking fields.

  ----------- -------------------------------- ---------------------- -------------- ------------- ---------------
  **\#**      **Field Name**                   **Type**               **Used For**   **Input       **Priority**
                                                                                     Method**      

  153         **moat_assessment**              Enum/String            Long-term      Manual/LLM    **💭
                                                                      checklist:                   Qualitative**
                                                                      Competitive                  
                                                                      moat                         

  154         **management_assessment**        Enum/String            Long-term      Manual/LLM    **💭
                                                                      checklist:                   Qualitative**
                                                                      Management                   
                                                                      track record                 

  155         **industry_growth_assessment**   Enum/String            Long-term      Manual/LLM    **💭
                                                                      checklist:                   Qualitative**
                                                                      Industry                     
                                                                      tailwinds                    

  156         **disruption_risk**              Enum/String            Long-term      Manual/LLM    **💭
                                                                      checklist:                   Qualitative**
                                                                      Existential                  
                                                                      disruption                   

  157         **fraud_history**                Boolean                Long-term      Manual/News   **💭
                                                                      checklist: No                Qualitative**
                                                                      accounting                   
                                                                      fraud                        

  158         **field_availability**           Dict\[str,Bool\]       Confidence:    System        **🔵 Metadata**
                                                                      Data                         
                                                                      Completeness                 
                                                                      (40%)                        

  159         **field_last_updated**           Dict\[str,DateTime\]   Confidence:    System        **🔵 Metadata**
                                                                      Data Freshness               
                                                                      (30%)                        

  160         **multi_source_values**          Dict\[str,Dict\]       Confidence:    System        **🔵 Metadata**
                                                                      Source                       
                                                                      Agreement                    
                                                                      (15%)                        
  ----------- -------------------------------- ---------------------- -------------- ------------- ---------------

**Primary Data Sources Summary**

  ----------------- ----------------- ----------------- -----------------
  **Source**        **Data Provided** **Fields**        **Cost**

  **Screener.in**   All fundamentals, 60+               Free / ₹4k/yr
                    ratios, 10-year                     
                    history, peer                       
                    data                                

  **NSE Bhavcopy**  Official EOD      15                Free
                    OHLCV, delivery                     
                    data, bulk deals                    

  **BSE Filings**   Shareholding,     15                Free
                    corporate                           
                    announcements,                      
                    results                             

  **Trendlyne**     FII/DII changes,  8                 Free (limited)
                    pledging trends                     

  **yfinance**      Adjusted close,   10                Free
                    backup prices                       

  **RSS Feeds**     News from         4                 Free
                    Moneycontrol, ET,                   
                    BS                                  

  **Rating          Credit ratings    3                 Free
  Agencies**        (CRISIL, ICRA,                      
                    CARE)                               

  **pandas-ta**     All technical     15                Free (library)
                    indicators                          
                    (calculated)                        
  ----------------- ----------------- ----------------- -----------------

*This document specifies all 160 data fields for StockPulse. Use as your
definitive reference for the data extraction pipeline.*
