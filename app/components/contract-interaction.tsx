"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from './abi';
import {Box, Button, Container, Flex, Grid, Text, TextField} from "@radix-ui/themes";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import AccountInfo from './account-info';
import { Row } from '@radix-ui/themes/dist/cjs/components/table';

const CONTRACT_ADDRESS = '0x314C8Ae00368A0bA2Fd52d8a46b944906B6fe800';

interface ContractInteractionProps {
    account: string | null;
}

const ContractInteraction: React.FC<ContractInteractionProps> = ({ account }) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [stakeAmount, setStakeAmount] = useState<string>('');
    const [unstakeAmount, setUnstakeAmount] = useState<string>('');
    const [couponNumbers, setCouponNumbers] = useState<string>('');
    const [recentResults, setRecentResults] = useState<any[]>([]);
    const [refetch, setRefetch] = useState<boolean>(false);
    const [loadingStake, setLoadingStake] = useState<boolean>(false);
    const [loadingUnstake, setLoadingUnstake] = useState<boolean>(false);
    const [loadingPurchase, setLoadingPurchase] = useState<boolean>(false);

    useEffect(() => {
        if ((window as any).ethereum) {
            const web3Provider = new ethers.BrowserProvider((window as any).ethereum);
            setProvider(web3Provider);
        } else {
            console.error('MetaMask is not installed');
        }
    }, []);

    useEffect(() => {
        if (account && provider) {
            const setupSignerAndContract = async () => {
                const signer = await provider.getSigner();
                setSigner(signer);
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                setContract(contract);
            };
            setupSignerAndContract();
        }
    }, [account, provider]);

    useEffect(() => {
        if (account && contract) {
            updateUIForConnectedWallet(account);
            fetchRecentResults();
        }
    }, [account, contract, refetch]);

    const updateUIForConnectedWallet = async (address: string) => {
        if (provider) {
            const balance = await provider.getBalance(address);
            const teaBalance = ethers.formatEther(balance);
            // Update UI with wallet info
        }
    };

    const fetchRecentResults = async () => {
        if (contract) {
            const currentRound = await contract.currentRound();
            let results = [];
            const startIndex = Math.max(0, Number(currentRound) - 5); // Fetch last 5 rounds

            for (let i = Number(currentRound); i > startIndex; i--) {
                try {
                    const roundData = await contract.rounds(BigInt(i));
                    results.push({
                        round: i,
                        totalPrizePool: ethers.formatEther(roundData.totalPrizePool),
                        winningNumbers: roundData.winningNumbers
                    });
                } catch (error) {
                    console.warn(`Error fetching round ${i}:`, error);
                    continue;
                }
            }

            setRecentResults(results);
        }
    };

    const handleStake = async () => {
        if (contract && signer) {
            setLoadingStake(true);
            try {
                const tx = await contract.stake({ value: ethers.parseEther(stakeAmount) });
                await tx.wait();
                alert('Stake successful');
                setRefetch(!refetch); // Trigger refetch
            } catch (error) {
                console.error('Error staking:', error);
            } finally {
                setLoadingStake(false);
            }
        }
    };

    const handleUnstake = async () => {
        if (contract && signer) {
            setLoadingUnstake(true);
            try {
                const tx = await contract.withdrawStake(ethers.parseEther(unstakeAmount));
                await tx.wait();
                alert('Unstake successful');
                setRefetch(!refetch); // Trigger refetch
            } catch (error) {
                console.error('Error unstaking:', error);
            } finally {
                setLoadingUnstake(false);
            }
        }
    };

    const handlePurchaseCoupon = async () => {
        if (contract && signer) {
            setLoadingPurchase(true);
            const numbers = couponNumbers.split(',').map(Number);
            try {
                const tx = await contract.purchaseCoupon(numbers, { value: ethers.parseEther('1') }); // Ensure the value is 1 ether
                await tx.wait();
                alert('Coupon purchased successfully');
                setRefetch(!refetch); // Trigger refetch
            } catch (error) {
                console.error('Error purchasing coupon:', error);
            } finally {
                setLoadingPurchase(false);
            }
        }
    };

    return (
        <Flex direction={"column"} gap={"3"}>
            {account ? (
                <Container size={"1"}>
                    <Grid gap={"3"}>
                        <Box p={"4"} className={"bg-gray-200 rounded-xl"}>
                            <AccountInfo provider={provider} contract={contract} address={account} />
                        </Box>

                        <Box p={"4"} className={"border rounded-xl"}>
                            <TextField.Root
                                placeholder="Amount to stake (in TEA)"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                            >
                                <TextField.Slot>
                                    <PlusCircledIcon/>
                                </TextField.Slot>
                            </TextField.Root>
                            <Button variant={"surface"} color={"grass"} onClick={handleStake} disabled={loadingStake}>
                                {loadingStake ? 'Staking...' : 'Stake'}
                            </Button>
                        </Box>
                        <Box p={"4"} className={"border rounded-xl"}>
                            <TextField.Root
                                placeholder="Amount to unstake (in TEA)"
                                value={unstakeAmount}
                                onChange={(e) => setUnstakeAmount(e.target.value)}
                            >
                                <TextField.Slot>
                                    <MinusCircledIcon/>
                                </TextField.Slot>
                            </TextField.Root>
                            <Button variant={"surface"} color={"bronze"} onClick={handleUnstake}
                                    disabled={loadingUnstake}>
                                {loadingUnstake ? 'Unstaking...' : 'Unstake'}
                            </Button>
                        </Box>

                        <Box p={"4"} className={"border bg-yellow-100 rounded-xl"}>
                            <TextField.Root placeholder="Enter 6 numbers separated by commas"
                                            value={couponNumbers}
                                            onChange={(e) => setCouponNumbers(e.target.value)}
                            />
                            <Button variant={"surface"} onClick={handlePurchaseCoupon} disabled={loadingPurchase}>
                                {loadingPurchase ? 'Purchasing...' : 'Purchase Coupon'}
                            </Button>
                        </Box>
                        <Box p={"4"} className={"rounded-xl"}>
                            <h2>Recent Game Results</h2>
                            <ul>
                                {recentResults.map((result, index) => (
                                    <li key={index}>
                                        <p>Round: {result.round}</p>
                                        <p>Total Prize Pool: {result.totalPrizePool} TEA</p>
                                        <p>Winning Numbers: {result.winningNumbers.join(', ')}</p>
                                    </li>
                                ))}
                            </ul>
                        </Box>

                    </Grid>
                </Container>
            ) : (
                <Text size={"3"} color={"teal"}>Please connect wallet first!</Text>
            )}
        </Flex>
    );
};

export default ContractInteraction;