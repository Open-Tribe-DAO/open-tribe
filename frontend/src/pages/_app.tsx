import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { arbitrum, mainnet, scrollSepolia } from 'wagmi/chains'
import AuthContext from "~/context/AuthContext";
import { WagmiProvider } from 'wagmi'

import { http, createConfig } from 'wagmi'


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID ?? ''

  // 2. Create wagmiConfig
  const metadata = {
    name: 'Open Tribe',
    description: 'Web3Modal Open Tribe',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const chains = [mainnet, arbitrum, scrollSepolia] as const
  const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    //...wagmiOptions // Optional - Override createConfig parameters
  })

  // 3. Create modal
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
  })
  //<SessionProvider session={session}>
  return (
    <WagmiProvider config={config}>
      <AuthContext>
        <main className={`font-sans ${inter.variable}`}>
          <Component {...pageProps} />
        </main>
      </AuthContext>
    </WagmiProvider>
  );
};

export default api.withTRPC(MyApp);


