import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function WatchlistTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12 mt-1" />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell className="text-center"><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  );
}