
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NFTMedia } from "./nft-media";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

const chainExplorerMap: { [key: string]: string } = {
  ethereum: "https://etherscan.io/token",
  base: "https://basescan.org/token",
  polygon: "https://polygonscan.com/token",
  optimism: "https://optimistic.etherscan.io/token",
  arbitrum: "https://arbiscan.io/token",
};

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default function NFTDetailModal({
  nft,
  isOpen,
  onClose,
}: {
  nft: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !nft) {
    return null;
  }

  const { nft_info, collection_info, amount, value, price } = nft.attributes;
  const chainId = nft.relationships.chain.data.id;

  const mediaUrl = nft_info.content?.video?.url || nft_info.content?.detail?.url || nft_info.content?.preview?.url || "/placeholder.svg";
  const name = nft_info.name || "Untitled NFT";
  const description = collection_info?.description || "No description available.";
  const collectionName = collection_info?.name || "Unknown Collection";
  const explorerBaseUrl = chainExplorerMap[chainId];
  const contractUrl = explorerBaseUrl ? `${explorerBaseUrl}/${nft_info.contract_address}?a=${nft_info.token_id}` : null;
  const mediaType = nft_info.content?.video?.url ? "video" : (nft_info.content?.audio?.url ? "audio" : "image");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{name}</DialogTitle>
          <p className="text-sm text-primary">{collectionName}</p>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg overflow-hidden border border-border">
              <NFTMedia
                src={mediaUrl}
                alt={name}
                width={600}
                height={600}
                className="w-full h-auto object-contain aspect-square"
                mediaType={mediaType}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                {description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-background border border-border space-y-3">
              <h3 className="font-semibold text-lg text-foreground">Details</h3>
              <DetailItem label="Chain" value={
                <div className="flex items-center gap-2">
                  <Image src={`/logos/${chainId}.svg`} alt={chainId} width={16} height={16} />
                  <span className="capitalize">{chainId}</span>
                </div>
              } />
              <DetailItem label="Value" value={`${(value || 0).toFixed(2)}`} />
              <DetailItem label="Price" value={`${(price || 0).toFixed(2)}`} />
              <DetailItem label="Quantity" value={amount} />
              <DetailItem label="Standard" value={nft_info.interface} />
              <DetailItem label="Media Type" value={mediaType} />
            </div>
            <div className="p-4 rounded-lg bg-background border border-border space-y-3">
              <h3 className="font-semibold text-lg text-foreground">Contract Info</h3>
              <DetailItem label="Contract Address" value={
                <span className="font-mono text-xs">{nft_info.contract_address}</span>
              } />
              <DetailItem label="Token ID" value={
                <span className="font-mono text-xs">{nft_info.token_id}</span>
              } />
              {contractUrl && (
                <a href={contractUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline pt-2">
                  View on Explorer <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
