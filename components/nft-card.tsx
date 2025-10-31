
import { Button } from "@/components/ui/button";
import { NFTMedia } from "./nft-media";
import { Video, Music, Image as ImageIcon } from "lucide-react";

interface NFTCardProps {
  nft: any;
  onOpenModal: (nft: any) => void;
}

const getMediaType = (nft: any) => {
  if (nft.attributes.nft_info.content?.video?.url) return { type: "Video", icon: <Video size={14} /> };
  if (nft.attributes.nft_info.content?.audio?.url) return { type: "Audio", icon: <Music size={14} /> };
  return { type: "Image", icon: <ImageIcon size={14} /> };
};

export function NFTCard({ nft, onOpenModal }: NFTCardProps) {
  const mediaUrl = nft.attributes.nft_info.content?.video?.url || nft.attributes.nft_info.content?.audio?.url || nft.attributes.nft_info.content?.preview?.url || "/placeholder.svg";
  const name = nft.attributes.nft_info.name || "Untitled NFT";
  const collectionName = nft.attributes.collection_info?.name || "Unknown Collection";
  const value = nft.attributes.value || 0;
  const amount = nft.attributes.amount;
  const { type, icon } = getMediaType(nft);
  const mediaType = nft.attributes.nft_info.content?.video?.url ? "video" : (nft.attributes.nft_info.content?.audio?.url ? "audio" : "image");

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col justify-between bg-card">
      <div>
        <div className="relative">
          <NFTMedia
            src={mediaUrl}
            alt={name}
            width={300}
            height={300}
            className="w-full h-48 object-cover"
            mediaType={mediaType}
          />
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            {icon}
            <span>{type}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg truncate text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">
            {collectionName}
          </p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Value</p>
            <p className="font-bold text-foreground">${value.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground text-right">Quantity</p>
            <p className="font-bold text-foreground text-right">{amount}</p>
          </div>
        </div>
        <Button onClick={() => onOpenModal(nft)} className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}


