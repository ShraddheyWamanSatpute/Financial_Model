import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-sm px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-mono" style={{ color: entry.color }}>
          {entry.name}: {formatter ? formatter(entry.value) : formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
};

export function PriceChart({ data, dataKey = "close", color = "#3B82F6", height = 200, showAxis = false }) {
  if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-muted-foreground">No data</div>;

  const minValue = Math.min(...data.map((d) => d[dataKey])) * 0.98;
  const maxValue = Math.max(...data.map((d) => d[dataKey])) * 1.02;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showAxis && (
          <>
            <XAxis
              dataKey="date"
              tick={{ fill: "#A1A1AA", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis
              domain={[minValue, maxValue]}
              tick={{ fill: "#A1A1AA", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(value)}
              width={60}
            />
          </>
        )}
        <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill="url(#colorPrice)"
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function VolumeChart({ data, height = 100 }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Tooltip content={<CustomTooltip formatter={(v) => formatNumber(v, 0)} />} />
        <Bar dataKey="volume" fill="#3B82F6" opacity={0.5} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AllocationPieChart({ data, height = 250 }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="percent"
          nameKey="sector"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-[#18181B] border border-[#27272A] rounded-sm px-3 py-2 shadow-lg">
                <p className="text-sm font-medium">{payload[0].payload.sector}</p>
                <p className="text-sm font-mono text-muted-foreground">
                  {formatNumber(payload[0].value)}%
                </p>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ScoreRadarChart({ data, height = 250 }) {
  if (!data) return null;

  const radarData = [
    { subject: "Fundamental", value: data.fundamental_score || 0 },
    { subject: "Valuation", value: data.valuation_score || 0 },
    { subject: "Technical", value: data.technical_score || 0 },
    { subject: "Quality", value: data.quality_score || 0 },
    { subject: "Risk", value: data.risk_score || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={radarData}>
        <PolarGrid stroke="#27272A" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#A1A1AA", fontSize: 11 }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function SectorPerformanceChart({ data, height = 200 }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 50, bottom: 5 }}>
        <XAxis type="number" tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="sector"
          tick={{ fill: "#A1A1AA", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip formatter={(v) => `${v > 0 ? "+" : ""}${formatNumber(v)}%`} />} />
        <Bar
          dataKey="change_percent"
          radius={[0, 4, 4, 0]}
          fill="#3B82F6"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.change_percent >= 0 ? "#22C55E" : "#EF4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniSparkline({ data, dataKey = "close", color, width = 80, height = 30 }) {
  if (!data || data.length === 0) return null;

  const lastValue = data[data.length - 1]?.[dataKey];
  const firstValue = data[0]?.[dataKey];
  const lineColor = color || (lastValue >= firstValue ? "#22C55E" : "#EF4444");

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
