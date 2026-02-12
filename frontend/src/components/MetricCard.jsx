import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({
  title,
  value,
  change,
  changePercent,
  subtitle,
  icon: Icon,
  trend,
  className,
}) {
  const getTrendIcon = () => {
    if (trend === "up" || (changePercent !== undefined && changePercent > 0)) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend === "down" || (changePercent !== undefined && changePercent < 0)) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (trend === "up" || (changePercent !== undefined && changePercent > 0)) {
      return "text-green-500";
    } else if (trend === "down" || (changePercent !== undefined && changePercent < 0)) {
      return "text-red-500";
    }
    return "text-muted-foreground";
  };

  return (
    <Card className={cn("bg-[#18181B] border-[#27272A]", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono">{value}</div>
        {(change !== undefined || changePercent !== undefined) && (
          <div className={cn("flex items-center gap-1 mt-1", getTrendColor())}>
            {getTrendIcon()}
            <span className="text-sm font-mono">
              {change !== undefined && change}
              {changePercent !== undefined && ` (${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}%)`}
            </span>
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatRow({ label, value, subvalue, className }) {
  return (
    <div className={cn("flex justify-between items-center py-2", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="font-mono text-sm font-medium">{value}</span>
        {subvalue && (
          <span className="text-xs text-muted-foreground ml-2">{subvalue}</span>
        )}
      </div>
    </div>
  );
}

export function IndexCard({ name, value, change, changePercent }) {
  const isPositive = changePercent >= 0;

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-3">
      <p className="text-xs text-muted-foreground mb-1">{name}</p>
      <p className="font-mono text-lg font-semibold">
        {typeof value === "number" ? value.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : value}
      </p>
      <div className={cn("flex items-center gap-1", isPositive ? "text-green-500" : "text-red-500")}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span className="font-mono text-xs">
          {change !== undefined && `${isPositive ? "+" : ""}${change.toLocaleString()}`}
          {changePercent !== undefined && ` (${isPositive ? "+" : ""}${changePercent.toFixed(2)}%)`}
        </span>
      </div>
    </div>
  );
}
