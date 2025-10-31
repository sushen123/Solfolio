'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// --- Data and Interfaces ---
interface Token {
  symbol: string;
  name: string;
  logo: string;
}

const dummyTokens: Token[] = [
  { symbol: "SOL", name: "Solana", logo: "/logos/solana.svg" },
  { symbol: "USDC", name: "USD Coin", logo: "/placeholder-logo.svg" },
  { symbol: "ETH", name: "Ethereum", logo: "/logos/ethereum.svg" },
  { symbol: "BTC", name: "Bitcoin", logo: "/placeholder-logo.svg" },
];

const dummyBalances: { [key: string]: number } = {
  SOL: 10.5,
  USDC: 500.25,
  ETH: 2.1,
  BTC: 0.5,
};

const dummyPrices: { [key: string]: number } = {
  SOL: 150.75,
  USDC: 1,
  ETH: 3000,
  BTC: 60000,
};

const dummyNetworks = [
    { name: "Solana", logo: "/logos/solana.svg" },
    { name: "Ethereum", logo: "/logos/ethereum.svg" },
    { name: "Polygon", logo: "/logos/polygon.svg" },
];

const PhantomIcon = () => (
    <Image src="/placeholder-logo.svg" alt="Phantom" width={24} height={24} />
);

export const SwapSidebar = () => {
    const { publicKey, signTransaction } = useWallet();
    const [payToken, setPayToken] = useState<Token | null>(dummyTokens[0]);
    const [receiveToken, setReceiveToken] = useState<Token | null>(dummyTokens[1]);
    const [payAmount, setPayAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNetwork, setSelectedNetwork] = useState(dummyNetworks[0]);
    const [isSwapping, setIsSwapping] = useState(false);
    const [swapStatus, setSwapStatus] = useState("");
    
    const walletAddress = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'Not Connected';

    const receiveAmount = useMemo(() => {
        if (!payToken || !receiveToken || !payAmount) return "";
        const payPrice = dummyPrices[payToken.symbol];
        const receivePrice = dummyPrices[receiveToken.symbol];
        const amount = parseFloat(payAmount);
        if (!payPrice || !receivePrice || isNaN(amount)) return "";
        return ((amount * payPrice) / receivePrice).toFixed(4);
    }, [payToken, receiveToken, payAmount]);

    const handleFlip = () => {
        setPayToken(receiveToken);
        setReceiveToken(payToken);
    };

    const handleSwap = async () => {
        if (!payToken || !receiveToken || !payAmount || !publicKey || !signTransaction) return;

        setIsSwapping(true);
        setSwapStatus("Getting swap offers...");

        try {
            // 1. Get offers from Zerion
            const offersRes = await fetch('/api/swap/zerion-offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sell_token: payToken.address,
                    buy_token: receiveToken.address,
                    sell_amount: payAmount,
                }),
            });
            const offersData = await offersRes.json();
            if (!offersRes.ok) throw new Error(offersData.details?.message || 'Failed to get swap offers');

            const bestOffer = offersData.data[0]; // Assuming the first offer is the best
            const unsignedTx = bestOffer.transaction;

            setSwapStatus("Optimizing transaction...");

            // 2. Optimize with Sanctum
            const optimizeRes = await fetch('/api/swap/sanctum-optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unsigned_transaction: unsignedTx }),
            });
            const optimizeData = await optimizeRes.json();
            if (!optimizeRes.ok) throw new Error(optimizeData.details?.message || 'Failed to optimize transaction');

            const optimizedTxData = optimizeData.result.transaction;
            const transaction = Transaction.from(Buffer.from(optimizedTxData, 'base64'));

            setSwapStatus("Waiting for signature...");

            // 3. Sign the transaction
            const signedTransaction = await signTransaction(transaction);

            setSwapStatus("Submitting transaction...");

            // 4. Send to Sanctum
            const sendRes = await fetch('/api/swap/sanctum-send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signed_transaction: signedTransaction.serialize().toString('base64') }),
            });
            const sendData = await sendRes.json();
            if (!sendRes.ok) throw new Error(sendData.details?.message || 'Failed to send transaction');

            setSwapStatus(`Swap successful! Transaction hash: ${sendData.result}`);

        } catch (error: any) {
            setSwapStatus(`Error: ${error.message}`);
        } finally {
            setIsSwapping(false);
        }
    };

    const balance = payToken ? dummyBalances[payToken.symbol] : 0;
    const canSwap = payToken && receiveToken && parseFloat(payAmount) > 0 && parseFloat(payAmount) <= balance && !isSwapping;

    const filteredTokens = dummyTokens.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const TokenDropdown = ({ onSelect, children }: { onSelect: (token: Token) => void, children: React.ReactNode }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-zinc-800 border-zinc-700 text-white">
                <div className="p-2">
                    <Input 
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-zinc-900 border-zinc-700"
                    />
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {filteredTokens.map(token => (
                        <DropdownMenuItem key={token.symbol} onClick={() => onSelect(token)} className="hover:bg-zinc-700 focus:bg-zinc-700">
                            <div className="flex items-center gap-2">
                                <Image src={token.logo} alt={token.name} width={24} height={24} />
                                <div>
                                    <p>{token.name}</p>
                                    <p className="text-xs text-zinc-400">{token.symbol}</p>
                                </div>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <div className="bg-zinc-900 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-auto text-white font-sans">
            
            <div className="flex items-center space-x-3 mb-4">
                <PhantomIcon />
                <div>
                    <p className="text-sm font-medium">Phantom</p>
                    <p className="text-xs text-zinc-400">{walletAddress}</p>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 bg-zinc-800 p-2 rounded-lg w-full mb-4 hover:bg-zinc-700 transition-colors">
                        <Image src={selectedNetwork.logo} alt={selectedNetwork.name} width={24} height={24} />
                        <span className="text-sm font-medium">{selectedNetwork.name}</span>
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-zinc-800 border-zinc-700 text-white">
                    {dummyNetworks.map(network => (
                        <DropdownMenuItem key={network.name} onClick={() => setSelectedNetwork(network)} className="hover:bg-zinc-700 focus:bg-zinc-700">
                            <div className="flex items-center gap-2">
                                <Image src={network.logo} alt={network.name} width={24} height={24} />
                                <span>{network.name}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative">
                <div className="bg-zinc-800 rounded-lg p-4 mb-1">
                    <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
                        <span>Pay</span>
                        <span>Balance: {balance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <TokenDropdown onSelect={setPayToken}>
                            <button className="flex items-center space-x-2">
                                {payToken ? <Image src={payToken.logo} alt={payToken.name} width={24} height={24} /> : <div className="h-6 w-6 rounded-full bg-zinc-700"/>}
                                <span className="text-lg font-medium">{payToken?.symbol || 'Select Coin'}</span>
                                <ChevronDown className="h-5 w-5 text-zinc-400" />
                            </button>
                        </TokenDropdown>
                        <input 
                            type="number"
                            placeholder="0"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            className="text-2xl font-mono bg-transparent text-right w-1/2 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="absolute w-full flex justify-center" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <button onClick={handleFlip} className="bg-zinc-700 h-9 w-9 rounded-full flex items-center justify-center border-4 border-zinc-900 hover:bg-zinc-600 transition-colors">
                        <ArrowDown className="h-5 w-5 text-zinc-300" />
                    </button>
                </div>
                
                <div className="bg-zinc-800 rounded-lg p-4 mt-1">
                    <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
                        <span>Receive</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <TokenDropdown onSelect={setReceiveToken}>
                            <button className="flex items-center space-x-2">
                                {receiveToken ? <Image src={receiveToken.logo} alt={receiveToken.name} width={24} height={24} /> : <div className="h-6 w-6 rounded-full bg-zinc-700"/>}
                                <span className="text-lg font-medium">{receiveToken?.symbol || 'Select Coin'}</span>
                                <ChevronDown className="h-5 w-5 text-zinc-400" />
                            </button>
                        </TokenDropdown>
                        <input 
                            type="number"
                            placeholder="0"
                            value={receiveAmount}
                            readOnly
                            className="text-2xl font-mono bg-transparent text-right w-1/2 focus:outline-none text-zinc-400"
                        />
                    </div>
                </div>
            </div>

            {swapStatus && <p className="text-sm text-center mt-4 text-zinc-400">{swapStatus}</p>}

            <button 
                onClick={handleSwap}
                disabled={!canSwap}
                className="w-full mt-4 bg-blue-600 h-14 rounded-lg text-lg font-semibold hover:bg-blue-500 transition-colors disabled:bg-zinc-700 disabled:text-zinc-500"
            >
                {isSwapping ? "Swapping..." : (canSwap ? "Swap" : (payToken && parseFloat(payAmount) > balance ? "Insufficient balance" : "Select a coin to pay"))}
            </button>
        </div>
    );
};
