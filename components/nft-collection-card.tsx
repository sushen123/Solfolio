import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface NFTCollectionCardProps {
  collection: any;
  onOpenModal: (collection: any) => void;
}

export function NFTCollectionCard({ collection, onOpenModal }: NFTCollectionCardProps) {
  const name = collection.attributes.collection_info?.name || "Unknown Collection";
  const imageUrl = collection.attributes.collection_info?.content?.icon?.url || "/placeholder.svg";
  const floorPrice = collection.attributes.total_floor_price || 0;
  const nftCount = collection.attributes.nfts_count || 0;

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="relative">
            <Image src={imageUrl} alt={name} width={300} height={300} className="w-full h-48 object-cover" />
            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <ImageIcon size={14} />
                <span>Image</span>
            </div>
        </div>
        <CardHeader>
            <CardTitle>{name}</CardTitle>
        </CardHeader>
      </div>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Floor Price</p>
            <p className="font-bold text-foreground">${floorPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground text-right">NFTs</p>
            <p className="font-bold text-foreground text-right">{nftCount}</p>
          </div>
        </div>
        <Button onClick={() => onOpenModal(collection)} className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}