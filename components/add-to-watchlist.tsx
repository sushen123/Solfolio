'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useDebounce } from "@/lib/use-debounce";
import Image from "next/image";

interface AddToWatchlistProps {
  onAdd: (tokenId: string) => void;
}

export function AddToWatchlist({ onAdd }: AddToWatchlistProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Basic emtfZGV2XzY2NzE3YjMzOTMwNTRhZDdhZmY2YzViNWE4NTA5YTZiOg=='
      }
    };

    fetch(`https://api.zerion.io/v1/fungibles/?filter[search_query]=${debouncedSearchQuery}`, options)
      .then(res => res.json())
      .then(data => {
        setSearchResults(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [debouncedSearchQuery]);

  return (
    <Card className="bg-card border-border mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add to Watchlist
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Search and add tokens to track</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Image src={token.attributes.icon?.url || '/placeholder.svg'} alt={token.attributes.name} width={32} height={32} className="rounded-full" />
                    <div>
                      <p className="font-medium text-foreground">{token.attributes.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.attributes.name}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onAdd(token.id);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              searchQuery.trim() !== "" && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No tokens found</p>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}