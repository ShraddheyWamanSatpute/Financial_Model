import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IndexCard } from "@/components/MetricCard";
import StockCard from "@/components/StockCard";
import { SectorPerformanceChart } from "@/components/Charts";
import { getMarketOverview, getStocks, getNews } from "@/lib/api";
import { cn, getSentimentColor, formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
  Activity,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [topStocks, setTopStocks] = useState([]);
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketRes, stocksRes, newsRes] = await Promise.all([
          getMarketOverview(),
          getStocks({ limit: 8 }),
          getNews({ limit: 5 }),
        ]);
        setMarketData(marketRes.data);
        setTopStocks(stocksRes.data);
        setNews(newsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const { nifty_50, sensex, nifty_bank, india_vix, market_breadth, fii_dii, sector_performance } =
    marketData || {};

  const fiiNet = (fii_dii?.fii_buy || 0) - (fii_dii?.fii_sell || 0);
  const diiNet = (fii_dii?.dii_buy || 0) - (fii_dii?.dii_sell || 0);

  return (
    <div className="space-y-6" data-testid="dashboard">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Indian Market Overview</p>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <IndexCard
          name="NIFTY 50"
          value={nifty_50?.value}
          change={nifty_50?.change}
          changePercent={nifty_50?.change_percent}
        />
        <IndexCard
          name="SENSEX"
          value={sensex?.value}
          change={sensex?.change}
          changePercent={sensex?.change_percent}
        />
        <IndexCard
          name="BANK NIFTY"
          value={nifty_bank?.value}
          change={nifty_bank?.change}
          changePercent={nifty_bank?.change_percent}
        />
        <IndexCard
          name="INDIA VIX"
          value={india_vix?.value}
          change={india_vix?.change}
          changePercent={india_vix?.change_percent}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Market Breadth & FII/DII */}
        <div className="space-y-6">
          {/* Market Breadth */}
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#3B82F6]" />
                Market Breadth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advances</span>
                  </div>
                  <span className="font-mono text-green-500">
                    {market_breadth?.advances || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Declines</span>
                  </div>
                  <span className="font-mono text-red-500">
                    {market_breadth?.declines || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unchanged</span>
                  <span className="font-mono text-muted-foreground">
                    {market_breadth?.unchanged || 0}
                  </span>
                </div>
                {/* Breadth Bar */}
                <div className="h-2 bg-[#27272A] rounded-full overflow-hidden flex">
                  <div
                    className="bg-green-500 h-full"
                    style={{
                      width: `${((market_breadth?.advances || 0) /
                        ((market_breadth?.advances || 0) + (market_breadth?.declines || 1))) *
                        100}%`,
                    }}
                  />
                  <div className="bg-red-500 h-full flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FII/DII Activity */}
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#3B82F6]" />
                FII / DII Activity (Cr)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">FII Net</span>
                    <span
                      className={cn(
                        "font-mono text-sm",
                        fiiNet >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {fiiNet >= 0 ? "+" : ""}
                      {fiiNet.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Buy: {formatCurrency(fii_dii?.fii_buy)}</span>
                    <span>Sell: {formatCurrency(fii_dii?.fii_sell)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">DII Net</span>
                    <span
                      className={cn(
                        "font-mono text-sm",
                        diiNet >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {diiNet >= 0 ? "+" : ""}
                      {diiNet.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Buy: {formatCurrency(fii_dii?.dii_buy)}</span>
                    <span>Sell: {formatCurrency(fii_dii?.dii_sell)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector Performance */}
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Sector Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <SectorPerformanceChart data={sector_performance} height={200} />
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Top Stocks */}
        <div className="lg:col-span-1">
          <Card className="bg-[#18181B] border-[#27272A] h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Top Stocks</span>
                <button
                  onClick={() => navigate("/screener")}
                  className="text-xs text-[#3B82F6] hover:underline"
                  data-testid="view-all-stocks-btn"
                >
                  View All
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topStocks.slice(0, 6).map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between py-2 px-2 hover:bg-[#27272A] rounded-sm cursor-pointer transition-colors"
                  onClick={() => navigate(`/analyzer?symbol=${stock.symbol}`)}
                  data-testid={`dashboard-stock-${stock.symbol}`}
                >
                  <div>
                    <span className="font-mono font-semibold">{stock.symbol}</span>
                    <p className="text-xs text-muted-foreground">{stock.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">
                      {formatCurrency(stock.current_price)}
                    </p>
                    <p
                      className={cn(
                        "font-mono text-xs",
                        stock.price_change_percent >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {stock.price_change_percent >= 0 ? "+" : ""}
                      {stock.price_change_percent?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - News */}
        <div>
          <Card className="bg-[#18181B] border-[#27272A] h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-[#3B82F6]" />
                  <span>Latest News</span>
                </div>
                <button
                  onClick={() => navigate("/news")}
                  className="text-xs text-[#3B82F6] hover:underline"
                  data-testid="view-all-news-btn"
                >
                  View All
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="pb-3 border-b border-[#27272A] last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <Badge
                      className={cn(
                        "text-xs",
                        item.sentiment === "POSITIVE"
                          ? "bg-green-500/10 text-green-500"
                          : item.sentiment === "NEGATIVE"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.sentiment}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.related_stocks?.map((sym) => (
                      <span key={sym} className="text-xs text-[#3B82F6] font-mono">
                        {sym}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {item.published_date?.split(" ")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className="bg-[#18181B] border-[#27272A] hover:border-[#3B82F6]/50 cursor-pointer transition-colors"
          onClick={() => navigate("/analyzer")}
          data-testid="quick-action-analyzer"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-[#3B82F6]/10 rounded-sm">
              <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <p className="font-medium">Analyze Stock</p>
              <p className="text-xs text-muted-foreground">Deep-dive analysis</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-[#18181B] border-[#27272A] hover:border-[#3B82F6]/50 cursor-pointer transition-colors"
          onClick={() => navigate("/screener")}
          data-testid="quick-action-screener"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-green-500/10 rounded-sm">
              <BarChart3 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Screen Stocks</p>
              <p className="text-xs text-muted-foreground">Filter by criteria</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-[#18181B] border-[#27272A] hover:border-[#3B82F6]/50 cursor-pointer transition-colors"
          onClick={() => navigate("/watchlist")}
          data-testid="quick-action-watchlist"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-yellow-500/10 rounded-sm">
              <TrendingDown className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="font-medium">Watchlist</p>
              <p className="text-xs text-muted-foreground">Track favorites</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-[#18181B] border-[#27272A] hover:border-[#3B82F6]/50 cursor-pointer transition-colors"
          onClick={() => navigate("/portfolio")}
          data-testid="quick-action-portfolio"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-purple-500/10 rounded-sm">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium">Portfolio</p>
              <p className="text-xs text-muted-foreground">Track holdings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
