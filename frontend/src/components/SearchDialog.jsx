import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchStocks } from "@/lib/api";
import { TrendingUp, Building2 } from "lucide-react";

export default function SearchDialog({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const search = useCallback(async (q) => {
    if (!q || q.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await searchStocks(q);
      setResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const handleSelect = (symbol) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/analyzer?symbol=${symbol}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search stocks by name or symbol..."
        value={query}
        onValueChange={setQuery}
        data-testid="search-input"
      />
      <CommandList>
        {loading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        )}
        {!loading && query && results.length === 0 && (
          <CommandEmpty>No stocks found.</CommandEmpty>
        )}
        {!loading && results.length > 0 && (
          <CommandGroup heading="Stocks">
            {results.map((stock) => (
              <CommandItem
                key={stock.symbol}
                value={stock.symbol}
                onSelect={() => handleSelect(stock.symbol)}
                className="cursor-pointer"
                data-testid={`search-result-${stock.symbol}`}
              >
                <TrendingUp className="w-4 h-4 mr-2 text-[#3B82F6]" />
                <div className="flex-1">
                  <span className="font-mono font-semibold">{stock.symbol}</span>
                  <span className="mx-2 text-muted-foreground">-</span>
                  <span>{stock.name}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="w-3 h-3" />
                  {stock.sector}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
