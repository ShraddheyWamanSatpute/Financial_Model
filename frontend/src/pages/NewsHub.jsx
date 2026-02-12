import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNews, getNewsSummary } from "@/lib/api";
import { cn, getSentimentColor } from "@/lib/utils";
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewsHub() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await getNews({ limit: 30 });
      setNews(response.data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const response = await getNewsSummary();
      setSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const filteredNews =
    filter === "all" ? news : news.filter((n) => n.sentiment === filter.toUpperCase());

  const sentimentCounts = {
    positive: news.filter((n) => n.sentiment === "POSITIVE").length,
    negative: news.filter((n) => n.sentiment === "NEGATIVE").length,
    neutral: news.filter((n) => n.sentiment === "NEUTRAL").length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="news-hub">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">News Hub</h1>
        <p className="text-muted-foreground">Market news with sentiment analysis</p>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#18181B] border-[#27272A] md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Positive</span>
                </div>
                <span className="font-mono text-green-500">{sentimentCounts.positive}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Negative</span>
                </div>
                <span className="font-mono text-red-500">{sentimentCounts.negative}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="font-mono text-muted-foreground">{sentimentCounts.neutral}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="bg-[#18181B] border-[#27272A] md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                AI Market Summary
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSummary}
                disabled={summaryLoading}
                data-testid="generate-summary-btn"
              >
                {summaryLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Summary"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {summary.summary}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Click &quot;Generate Summary&quot; to get an AI-powered overview of today&apos;s market news.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-[#18181B] border border-[#27272A]">
          <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
          <TabsTrigger value="positive" data-testid="filter-positive">
            Positive ({sentimentCounts.positive})
          </TabsTrigger>
          <TabsTrigger value="negative" data-testid="filter-negative">
            Negative ({sentimentCounts.negative})
          </TabsTrigger>
          <TabsTrigger value="neutral" data-testid="filter-neutral">
            Neutral ({sentimentCounts.neutral})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <Card
            key={item.id}
            className="bg-[#18181B] border-[#27272A] hover:border-[#3B82F6]/50 transition-colors"
            data-testid={`news-item-${item.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-1 h-full min-h-[60px] rounded-full",
                    item.sentiment === "POSITIVE"
                      ? "bg-green-500"
                      : item.sentiment === "NEGATIVE"
                      ? "bg-red-500"
                      : "bg-muted"
                  )}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
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
                        <span className="text-xs text-muted-foreground">
                          • {item.published_date}
                        </span>
                      </div>
                      <h3 className="font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {item.related_stocks?.map((symbol) => (
                      <button
                        key={symbol}
                        className="text-xs font-mono text-[#3B82F6] hover:underline"
                        onClick={() => navigate(`/analyzer?symbol=${symbol}`)}
                      >
                        {symbol}
                      </button>
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">
                      Sentiment Score: {item.sentiment_score?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
