"use client";

import { useState, useEffect } from "react";
import TransactionCard from "@/components/transaction-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@heroui/react";
import { useDebounce } from "@/lib/use-debounce";
import { useSession } from "next-auth/react";
import { TransactionCardSkeleton } from "@/components/transaction-card-skeleton";

export default function TransactionsPage() {
  const { data: session } = useSession();
  const connectedAddress = (session as any)?.publicKey;
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [operationType, setOperationType] = useState("all");
  const [dateRange, setDateRange] = useState<any>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (connectedAddress) {
      const fetchTransactions = async () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        
        if (debouncedSearchQuery) {
          params.append("filter[search_query]", debouncedSearchQuery);
        }
        if (operationType !== 'all') {
          params.append("filter[operation_types]", operationType);
        }
        if (dateRange?.start) {
          try {
            params.append("filter[min_mined_at]", dateRange.start.toDate().getTime().toString());
          } catch (e) {
            console.error("Could not get start date", e)
          }
        }
        if (dateRange?.end) {
          try {
            params.append("filter[max_mined_at]", dateRange.end.toDate().getTime().toString());
          } catch (e) {
            console.error("Could not get end date", e)
          }
        }

        try {
          const response = await fetch(`/api/transactions/${connectedAddress}?${params.toString()}`);
          if (!response.ok) {
            throw new Error('Failed to fetch transactions');
          }
          const data = await response.json();
          setTransactions(data.data || []);
        } catch (error) {
          console.error(error);
          setTransactions([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTransactions();
    }
  }, [connectedAddress, debouncedSearchQuery, operationType, dateRange]);

  const handleDateChange = (newDateRange: any) => {
    console.log(newDateRange);
    setDateRange(newDateRange);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transaction History</h1>
      </div>

      <div className="flex flex-wrap items-end gap-7">
        <Input
          placeholder="Search by asset..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setOperationType} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="send">Send</SelectItem>
            <SelectItem value="receive">Receive</SelectItem>
            <SelectItem value="trade">Trade</SelectItem>
            <SelectItem value="approve">Approve</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdraw">Withdraw</SelectItem>
            <SelectItem value="mint">Mint</SelectItem>
            <SelectItem value="burn">Burn</SelectItem>
          </SelectContent>
        </Select>
        <div>
        <DateRangePicker onChange={handleDateChange} className="bg-black text-black" calendarProps={{
        classNames: {
          base: "bg-background",
          headerWrapper: "pt-4 bg-background",
          prevButton: "border-1 border-default-200 rounded-small bg-blue-200",
          nextButton: "border-1 border-default-200 rounded-small bg-blue-200",
          gridHeader: "bg-background shadow-none border-b-1 border-default-100",
          cellButton: [
            "data-[today=true]:bg-background data-[selected=true]:bg-transparent rounded-small",
            // start (pseudo)
            "data-[range-start=true]:before:rounded-l-small ",
            "data-[selection-start=true]:before:rounded-l-small",
            // end (pseudo)
            "data-[range-end=true]:before:rounded-r-small",
            "data-[selection-end=true]:before:rounded-r-small",
            // start (selected)
            "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-small ",
            // end (selected)
            "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-small",
          ],
        },
      }} color="primary"  />
        </div>
      
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <TransactionCardSkeleton key={i} />)
        ) : transactions.length > 0 ? (
          transactions.map((tx: any) => (
            <TransactionCard key={tx.id} transaction={tx} />
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}
