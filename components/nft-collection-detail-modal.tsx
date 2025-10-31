import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default function NFTCollectionDetailModal({
  collection,
  isOpen,
  onClose,
}: {
  collection: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !collection) {
    return null;
  }

  const { collection_info, total_floor_price, nfts_count } = collection.attributes;
  const name = collection_info?.name || "Unknown Collection";
  const description = collection_info?.description || "No description available.";
  const bannerUrl = collection_info?.content?.banner?.url;
  const chainId = collection.relationships.chains.data[0].id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
          <div className="flex flex-col gap-4">
            {bannerUrl && (
              <div className="rounded-lg overflow-hidden border border-border">
                <Image
                  src={bannerUrl}
                  alt={name}
                  width={600}
                  height={200}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
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
              <DetailItem label="Floor Price" value={`$${(total_floor_price || 0).toFixed(2)}`} />
              <DetailItem label="NFT Count" value={nfts_count} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
