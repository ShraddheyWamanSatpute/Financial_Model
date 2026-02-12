import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { screenStocks, getScreenerPresets } from "@/lib/api";
import { cn, formatCurrency, formatPercent, getVerdictColor, getScoreColor } from "@/lib/utils";
import { Search, Filter, X, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

const AVAILABLE_METRICS = [
  { value: "roe", label: "ROE (%)", type: "fundamental" },
  { value: "revenue_growth_yoy", label: "Revenue Growth (%)", type: "fundamental" },
  { value: "operating_margin", label: "Operating Margin (%)", type: "fundamental" },
  { value: "debt_to_equity", label: "Debt/Equity", type: "fundamental" },
  { value: "interest_coverage", label: "Interest Coverage", type: "fundamental" },
  { value: "pe_ratio", label: "P/E Ratio", type: "valuation" },
  { value: "peg_ratio", label: "PEG Ratio", type: "valuation" },
  { value: "pb_ratio", label: "P/B Ratio", type: "valuation" },
  { value: "dividend_yield", label: "Dividend Yield (%)", type: "valuation" },
  { value: "rsi_14", label: "RSI (14)", type: "technical" },
  { value: "promoter_holding", label: "Promoter Holding (%)", type: "shareholding" },
  { value: "fii_holding", label: "FII Holding (%)", type: "shareholding" },
];

const OPERATORS = [
  { value: "gt", label: ">" },
  { value: "gte", label: "≥" },
  { value: "lt", label: "<" },
  { value: "lte", label: "≤" },
  { value: "between", label: "Between" },
];

export default function Screener() {
  const navigate = useNavigate();
  const [presets, setPresets] = useState([]);
  const [filters, setFilters] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const response = await getScreenerPresets();
      setPresets(response.data);
    } catch (error) {
      console.error("Failed to fetch presets:", error);
    }
  };

  const addFilter = () => {
    setFilters([...filters, { metric: "roe", operator: "gt", value: 15, value2: null }]);
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const applyPreset = (preset) => {
    setFilters(preset.filters.map(f => ({ ...f, value2: f.value2 || null })));
  };

  const runScreener = async () => {
    setLoading(true);
    try {
      const response = await screenStocks({
        filters,
        sort_by: sortBy,
        sort_order: sortOrder,
        limit: 50,
      });
      setResults(response.data.stocks || []);
    } catch (error) {
      console.error("Screener failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="screener">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Screener</h1>
        <p className="text-muted-foreground">Filter stocks by your criteria</p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset)}
            data-testid={`preset-${preset.id}`}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-[#18181B] border-[#27272A]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex flex-wrap items-end gap-3">
              <div className="min-w-[180px]">
                <Label className="text-xs">Metric</Label>
                <Select
                  value={filter.metric}
                  onValueChange={(v) => updateFilter(index, "metric", v)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_METRICS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[100px]">
                <Label className="text-xs">Operator</Label>
                <Select
                  value={filter.operator}
                  onValueChange={(v) => updateFilter(index, "operator", v)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[100px]">
                <Label className="text-xs">Value</Label>
                <Input
                  type="number"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, "value", parseFloat(e.target.value))}
                  className="bg-background"
                />
              </div>

              {filter.operator === "between" && (
                <div className="min-w-[100px]">
                  <Label className="text-xs">Value 2</Label>
                  <Input
                    type="number"
                    value={filter.value2 || ""}
                    onChange={(e) => updateFilter(index, "value2", parseFloat(e.target.value))}
                    className="bg-background"
                  />
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(index)}
                className="text-muted-foreground hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={addFilter} data-testid="add-filter-btn">
              + Add Filter
            </Button>
            <Button onClick={runScreener} disabled={loading} data-testid="run-screener-btn">
              {loading ? "Screening..." : "Run Screener"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Results ({results.length} stocks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#27272A]">
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Verdict</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((stock) => (
                    <TableRow
                      key={stock.symbol}
                      className="border-[#27272A] cursor-pointer hover:bg-[#27272A]/50"
                      onClick={() => navigate(`/analyzer?symbol=${stock.symbol}`)}
                      data-testid={`screener-row-${stock.symbol}`}
                    >
                      <TableCell className="font-mono font-semibold">{stock.symbol}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{stock.name}</TableCell>
                      <TableCell className="text-muted-foreground">{stock.sector}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(stock.current_price)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono",
                          stock.price_change_percent >= 0 ? "text-green-500" : "text-red-500"
                        )}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {stock.price_change_percent >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {formatPercent(stock.price_change_percent)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-mono font-semibold",
                            getScoreColor(stock.analysis?.long_term_score || 0)
                          )}
                        >
                          {Math.round(stock.analysis?.long_term_score || 0)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn("text-xs", getVerdictColor(stock.analysis?.verdict))}>
                          {stock.analysis?.verdict || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
