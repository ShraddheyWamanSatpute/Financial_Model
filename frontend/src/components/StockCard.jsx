import React from "react";
import { cn, formatCurrency, formatPercent, getChangeColor, getVerdictColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MiniSparkline } from "@/components/Charts";
import { useNavigate } from "react-router-dom";

export default function StockCard({ stock, showAnalysis = false, className }) {
  const navigate = useNavigate();
  const priceChange = stock.price_change_percent || 0;

  const handleClick = () => {
    navigate(`/analyzer?symbol=${stock.symbol}`);
  };

  return (
    <Card
      className={cn(
        "bg-[#18181B] border-[#27272A] hover:border-[#3B82F6]/50 transition-colors cursor-pointer",
        className
      )}
      onClick={handleClick}
      data-testid={`stock-card-${stock.symbol}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg">{stock.symbol}</span>
              {showAnalysis && stock.analysis?.verdict && (
                <Badge
                  className={cn(
                    "text-xs font-medium",
                    getVerdictColor(stock.analysis.verdict)
                  )}
                >
                  {stock.analysis.verdict}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
              {stock.name}
            </p>
          </div>
          <MiniSparkline data={stock.price_history?.slice(-30)} />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xl font-semibold">
              {formatCurrency(stock.current_price)}
            </p>
            <div className={cn("flex items-center gap-1", getChangeColor(priceChange))}>
              {priceChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : priceChange < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span className="font-mono text-sm">{formatPercent(priceChange)}</span>
            </div>
          </div>

          {showAnalysis && stock.analysis && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Score</p>
              <p
                className={cn(
                  "font-mono text-lg font-bold",
                  stock.analysis.long_term_score >= 70
                    ? "text-green-500"
                    : stock.analysis.long_term_score >= 40
                    ? "text-yellow-500"
                    : "text-red-500"
                )}
              >
                {Math.round(stock.analysis.long_term_score)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[#27272A]">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stock.sector}</span>
            <span>{stock.market_cap_category} Cap</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StockRowCompact({ stock, onClick }) {
  const priceChange = stock.price_change_percent || 0;

  return (
    <div
      className="flex items-center justify-between py-3 px-2 hover:bg-[#18181B] rounded-sm cursor-pointer transition-colors"
      onClick={onClick}
      data-testid={`stock-row-${stock.symbol}`}
    >
      <div className="flex items-center gap-3">
        <div>
          <span className="font-mono font-semibold">{stock.symbol}</span>
          <p className="text-xs text-muted-foreground">{stock.sector}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm">{formatCurrency(stock.current_price)}</p>
        <p className={cn("font-mono text-xs", getChangeColor(priceChange))}>
          {formatPercent(priceChange)}
        </p>
      </div>
    </div>
  );
}
