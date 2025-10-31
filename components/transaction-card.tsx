
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dummyTransactions } from "@/lib/dummy-transactions";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  CheckCircle,
  ShieldCheck,
  FileImage,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";

const operationIcons: { [key: string]: React.ReactNode } = {
  send: <ArrowUpRight className="w-4 h-4" />,
  receive: <ArrowDownLeft className="w-4 h-4" />,
  trade: <Repeat className="w-4 h-4" />,
  approve: <ShieldCheck className="w-4 h-4" />,
  deposit: <ArrowDownLeft className="w-4 h-4" />,
  withdraw: <ArrowUpRight className="w-4 h-4" />,
};

const TransferDetail = ({ transfer }: { transfer: any }) => {
  const isNft = !!transfer.nft_info;
  const info = isNft ? transfer.nft_info : transfer.fungible_info;
  const imageUrl = isNft 
    ? info?.content?.preview?.url 
    : info?.icon?.url;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={info?.name || "Token Icon"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <FileImage className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <div>
          <p className="font-medium text-foreground">{info?.name || "Unknown Asset"}</p>
          <p className="text-sm text-muted-foreground">
            {transfer.quantity.numeric} {info?.symbol}
          </p>
        </div>
      </div>
      <div className="text-right">
        {isNft ? (
          <div className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
            NFT
          </div>
        ) : (
          <p className="font-medium text-foreground">
            ${transfer.value?.toFixed(2) || "0.00"}
          </p>
        )}
      </div>
    </div>
  );
};


const TransactionCard = ({
  transaction,
}: {
  transaction: (typeof dummyTransactions)[0];
}) => {
  const { attributes } = transaction;
  const {
    operation_type,
    mined_at,
    status,
    hash,
    fee,
    transfers,
    application_metadata,
  } = attributes;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sentTransfers = transfers.filter((t) => t.direction === "out");
  const receivedTransfers = transfers.filter((t) => t.direction === "in");

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <div className="flex items-center gap-3">
          {application_metadata?.icon?.url && (
            <Image
              src={application_metadata.icon.url}
              alt={application_metadata.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div>
            <CardTitle className="text-base capitalize">{operation_type}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {new Date(mined_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {operationIcons[operation_type]}
          <span className="text-xs">{application_metadata?.name || "Direct Transfer"}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sentTransfers.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Sent</h4>
            <div className="space-y-3">
              {sentTransfers.map((transfer, index) => (
                <TransferDetail key={`sent-${index}`} transfer={transfer} />
              ))}
            </div>
          </div>
        )}
        {receivedTransfers.length > 0 && (
           <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Received</h4>
            <div className="space-y-3">
              {receivedTransfers.map((transfer, index) => (
                <TransferDetail key={`received-${index}`} transfer={transfer} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Hash</span>
            </>
          )}
        </button>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="capitalize">{status}</span>
        </div>
        <span>Fee: ${fee?.value?.toFixed(2) ?? '0.00'}</span>
      </CardFooter>
    </Card>
  );
};

export default TransactionCard;
