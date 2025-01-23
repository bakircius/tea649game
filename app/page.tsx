"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractInteraction from './components/contract-interaction';
import Header from "./components/header";
import { Text } from "@radix-ui/themes";

export default function Page() {
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        if ((window as any).ethereum) {
            (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
                setAccount(accounts[0] || null);
            });
        }
    }, []);

    const connectWallet = async () => {
        if ((window as any).ethereum) {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
        } else {
            console.error('MetaMask is not installed');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    return (
        <>
            <Header account={account} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
            <main className="p-4">
                <ContractInteraction account={account} />
            </main>
            <footer className="bg-gray-100 text-black p-4 text-center">

               <Text size={"5"} weight="bold">COUPONS & PLAY</Text>

                <p>Each coupon has 6 INTEGER numbers</p>

                <p>Integer Numbers are between [1-49]</p>

                <p>There must be at least 10 coupons for play.</p>

                <p>Each play is exactly at each hour start.</p>

                <p>There will be 6 winner strict random different INTEGER numbers [1-49] produced by contract in every hour</p>

                <p>1 coupon price 1 TEA</p>

                <p>There will be Game TEA Stakers</p>

                <Text size={"4"} weight="bold">PRIZES</Text>

                <p>40% to STAKERS - 60% to WINNER PLAYERS FOR EACH GAME</p>

                <p>6 / 6 winner evm addresses get 15% of total TEA coupon prizes</p>

                <p>5 / 6 winner evm addresses get 15% of total TEA coupon prizes (if there is no 6 / 6, 5 / 6 winners get this extra prizes)</p>

                <p>4 / 6 winner evm addresses get 15% of total TEA coupon prizes (if there is no 5 / 6 or 6 / 6 winners,  4/6 winners get this extra prizes)</p>

                <p>3 / 6 winner evm addresses get 15% of total TEA coupon prizes (if there is no 6 / 6,
                                    5 / 6 winners get this extra %15)</p>

                <p> 2 / 6 , 1 / 6 and 0 / 6 coupon prizes (40%) to Staker evm addresses.</p>

                <p>Each coupon has 1% dev fee.</p>

            </footer>
        </>
    );
}