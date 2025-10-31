'use client';

import { useState, useEffect } from "react";
import { WatchlistTable } from "@/components/watchlist-table";
import { AddToWatchlist } from "@/components/add-to-watchlist";
import { useSession } from "next-auth/react";

export default function WatchlistPage() {
  const { data: session } = useSession();
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [tokenData, setTokenData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch('/api/watchlist');
      if (!res.ok) throw new Error('Failed to fetch watchlist');
      const data = await res.json();
      setWatchlistIds(data.map((item: any) => item.tokenId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [session]);

  useEffect(() => {
    if (watchlistIds.length === 0) {
      setTokenData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Basic emtfZGV2XzY2NzE3YjMzOTMwNTRhZDdhZmY2YzViNWE4NTA5YTZiOg=='
      }
    };

    const ids = watchlistIds.join(',');
    fetch(`https://api.zerion.io/v1/fungibles/?filter[fungible_ids]=${ids}`, options)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch token data');
        return res.json();
      })
      .then(fungiblesData => {
        const tokens = fungiblesData.data;
        const chartPromises = tokens.map((token: any) => 
          fetch(`https://api.zerion.io/v1/fungibles/${token.id}/charts/day`, options)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch chart for ${token.id}`);
                return res.json();
            })
        );

        return Promise.all(chartPromises).then(chartsData => {
            const combinedData = tokens.map((token: any, index: number) => {
              const chartStats = chartsData[index]?.data?.attributes?.stats;
              return {
                ...token,
                day_high: chartStats?.max || 0,
                day_low: chartStats?.min || 0,
              };
            });
            setTokenData(combinedData);
        });
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [watchlistIds]);

  const handleAddToken = async (tokenId: string) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId }),
      });
      if (!res.ok) throw new Error('Failed to add token to watchlist');
      fetchWatchlist(); // Refetch watchlist
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveToken = async (tokenId: string) => {
    try {
      const res = await fetch(`/api/watchlist/${tokenId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove token from watchlist');
      fetchWatchlist(); // Refetch watchlist
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Watchlist</h1>
        <p className="text-muted-foreground">Track your favorite tokens and monitor their performance</p>
      </div>

      <AddToWatchlist onAdd={handleAddToken} />
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}
      <WatchlistTable watchlist={tokenData} onRemove={handleRemoveToken} loading={loading} />
    </div>
  );
}