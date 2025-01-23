"use client";

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {Flex, Text} from "@radix-ui/themes";

interface AccountInfoProps {
    provider: ethers.BrowserProvider | null;
    contract: ethers.Contract | null;
    address: string;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ provider, contract, address }) => {
    const [teaBalance, setTeaBalance] = useState<string>('');
    const [stakedAmount, setStakedAmount] = useState<string>('');
    const [totalCoupons, setTotalCoupons] = useState<number[]>([]);

    useEffect(() => {
        const fetchAccountInfo = async () => {
            if (provider && contract) {
                const balance = await provider.getBalance(address);
                setTeaBalance(ethers.formatEther(balance));

                const staked = await contract.stakes(address);
                setStakedAmount(ethers.formatEther(staked));

                const currentRound = await contract.currentRound();
                const coupons = [];
                for (let i = 0; i <= currentRound; i++) {
                    const couponCount = await contract.getTotalCoupons(i);
                    coupons.push(couponCount);
                }
                setTotalCoupons(coupons);
            }
        };

        fetchAccountInfo();
    }, [provider, contract, address]);

    return (
        <>


            <Text size="3">
                <Flex direction="column">
                    <Text weight="light">User Address: {address}</Text>
                    <Text weight="regular">
                        <ul>
                            {totalCoupons.map((count, index) => (
                                <li key={index}>
                                    Round: {index}, Total Coupons: {count}
                                </li>
                            ))}
                        </ul>
                    </Text>
                    <Text weight="medium">Staked Amount: {stakedAmount} TEA</Text>
                    <Text weight="bold">Balance: {teaBalance} TEA</Text>
                </Flex>
            </Text>
        </>
    );
};

export default AccountInfo;