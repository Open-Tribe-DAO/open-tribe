import { SiweMessage } from 'siwe'
import { createSIWEConfig } from '@web3modal/siwe'
import { getCsrfToken, signIn, signOut, getSession } from 'next-auth/react'
import type { SIWECreateMessageArgs, SIWESession, SIWEVerifyMessageArgs } from '@web3modal/siwe'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'

export const siweConfig = createSIWEConfig({
  createMessage: ({ nonce, address, chainId }: SIWECreateMessageArgs) =>
    new SiweMessage({
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: 'Sign in With Ethereum.'
    }).prepareMessage(),
  getNonce: async () => {
    const nonce = await getCsrfToken()
    if (!nonce) {
      throw new Error('Failed to get nonce!')
    }

    return nonce
  },
  getSession: async () => {
    const session = await getSession()
    if (!session) {
      throw new Error('Failed to get session!')
    }

    const { address, chainId } = session as unknown as SIWESession

    return { address, chainId }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: false
      })

      return true
    } catch (error) {
      return false
    }
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn('credentials', {
        message,
        redirect: false,
        signature,
        callbackUrl: '/protected'
      })

      return Boolean(success?.ok)
    } catch (error) {
      return false
    }
  },
})

 // verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
  //   try {
  //     const success = await signIn('credentials', {
  //       message,
  //       redirect: false,
  //       signature,
  //       callbackUrl: '/protected'
  //     })

  //     return Boolean(success?.ok)
  //   } catch (error) {
  //     return false
  //   }
  // },


// const chains = [mainnet, arbitrum] as const
// const projectId = 'YOUR_PROJECT_ID'

// const metadata = {
//   name: 'Web3Modal',
//   description: 'Web3Modal Example',
//   url: 'https://web3modal.com', // origin must match your domain & subdomain
//   icons: ['https://avatars.githubusercontent.com/u/37784886']
// }

// const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   //...wagmiOptions // Optional - Override createConfig parameters
// })

// createWeb3Modal({
//   siweConfig,
//   // Refer to https://docs.walletconnect.com/web3modal/react/about for the other options.
//   wagmiConfig: config, // or ethersConfig
//   projectId
// })