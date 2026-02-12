import React from "react";
import { cn, getScoreColor, getScoreBgColor } from "@/lib/utils";

export default function ScoreCard({
  label,
  score,
  subtitle,
  size = "default",
  showGauge = true,
  className,
}) {
  const radius = size === "large" ? 45 : 35;
  const strokeWidth = size === "large" ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {showGauge && (
        <div className="relative">
          <svg
            width={radius * 2 + strokeWidth * 2}
            height={radius * 2 + strokeWidth * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke={
                score >= 70
                  ? "#22C55E"
                  : score >= 40
                  ? "#EAB308"
                  : "#EF4444"
              }
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "font-mono font-bold",
                getScoreColor(score),
                size === "large" ? "text-3xl" : "text-2xl"
              )}
            >
              {Math.round(score)}
            </span>
          </div>
        </div>
      )}
      {label && (
        <span
          className={cn(
            "mt-2 font-medium text-center",
            size === "large" ? "text-base" : "text-sm"
          )}
        >
          {label}
        </span>
      )}
      {subtitle && (
        <span className="text-xs text-muted-foreground mt-0.5">{subtitle}</span>
      )}
    </div>
  );
}

export function ScoreBar({ label, score, className }) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn("font-mono text-sm font-medium", getScoreColor(score))}>
          {Math.round(score)}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getScoreBgColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
