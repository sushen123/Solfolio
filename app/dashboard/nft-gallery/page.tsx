'use client';

import { useState, useEffect } from "react";
import { NFTCard } from "@/components/nft-card";
import { NFTCollectionCard } from "@/components/nft-collection-card";
import NFTDetailModal from "@/components/nft-detail-modal";
import NFTCollectionDetailModal from "@/components/nft-collection-detail-modal";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFTCardSkeleton } from "@/components/nft-card-skeleton";
import { NFTCollectionCardSkeleton } from "@/components/nft-collection-card-skeleton";

export default function NFTGallery() {
  const { data: session } = useSession();
  const connectedAddress = (session as any)?.publicKey;
  const [positions, setPositions] = useState<any[] | null>(null);
  const [collections, setCollections] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('positions');

  useEffect(() => {
    if (connectedAddress) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic emtfZGV2XzY2NzE3YjMzOTMwNTRhZDdhZmY2YzViNWE4NTA5YTZiOg=='
        }
      };

      if (activeTab === 'positions' && !positions) {
        fetch(`https://api.zerion.io/v1/wallets/${connectedAddress}/nft-positions/?currency=usd&page[size]=100`, options)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch positions`);
            return res.json();
          })
          .then(data => setPositions(data.data))
          .catch(err => setError(err.message));
      } else if (activeTab === 'collections' && !collections) {
        fetch(`https://api.zerion.io/v1/wallets/${connectedAddress}/nft-collections/?currency=usd&page[size]=100`, options)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch collections`);
            return res.json();
          })
          .then(data => setCollections(data.data))
          .catch(err => setError(err.message));
      }
    }
  }, [connectedAddress, activeTab, positions, collections]);

  const openNftModal = (nft: any) => {
    setSelectedNFT(nft);
  };

  const closeNftModal = () => {
    setSelectedNFT(null);
  };

  const openCollectionModal = (collection: any) => {
    setSelectedCollection(collection);
  };

  const closeCollectionModal = () => {
    setSelectedCollection(null);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">NFT Gallery</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="positions">
          {!positions ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <NFTCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {positions.map((nft) => (
                <NFTCard key={nft.id} nft={nft} onOpenModal={openNftModal} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="collections">
          {!collections ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <NFTCollectionCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <NFTCollectionCard key={collection.id} collection={collection} onOpenModal={openCollectionModal} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {selectedNFT && (
        <NFTDetailModal
          nft={selectedNFT}
          isOpen={!!selectedNFT}
          onClose={closeNftModal}
        />
      )}
      {selectedCollection && (
        <NFTCollectionDetailModal
          collection={selectedCollection}
          isOpen={!!selectedCollection}
          onClose={closeCollectionModal}
        />
      )}
    </>
  );
}