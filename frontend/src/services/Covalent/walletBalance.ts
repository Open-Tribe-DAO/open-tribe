import { CovalentClient } from "@covalenthq/client-sdk";

const walletBalance = async (): Promise<any> => {
    // Replace with your Covalent API key
    if(!process.env.NEXT_PUBLIC_COVALENT_API_KEY) {
        throw new Error("Add your Covalent API key to the .env file.")
    }
    console.log(process.env.NEXT_PUBLIC_COVALENT_API_KEY)
    const client = new CovalentClient(process.env.NEXT_PUBLIC_COVALENT_API_KEY); 
    return await client.BalanceService.getTokenBalancesForWalletAddress("scroll-sepolia-testnet", "0xc1d457128dEcAE1CC092728262469Ee796F1Ac45"); 
}

export default walletBalance;
