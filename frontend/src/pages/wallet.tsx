"use client";
import { BalancesResponse } from "@covalenthq/client-sdk";
import React, { useEffect, useState } from "react";
import { walletBalance } from "~/services";

const WalletPage = () => {
    const [balance, setBalance] = useState(null);
    const [walletErrors, setWalletErrors] = useState<Array<String>>([]);
    useEffect(() => {
        walletBalance().then((walletBalanceResponse) => {
            console.log(walletBalanceResponse);
            if (walletBalanceResponse?.error) {
              const errorMessage = walletBalanceResponse?.error_message
                setWalletErrors(['Error fetching wallet balance:', errorMessage]);
                return;
            }
            setBalance(walletBalanceResponse.data);
        });
    }, []);

    if (walletErrors.length > 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                {walletErrors.map((error) => (
                    <div className="text-red-500">{error}</div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">

            Your balance is:
            <h1 className="text-5xl tracking-tight font-extrabold text-gray-300">
                {balance ? '100 USD' : (
                    <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 bg-slate-700 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                                        <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </h1>
        </div>
    );
};

export default WalletPage;
