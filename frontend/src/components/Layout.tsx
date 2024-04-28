import Link from "next/link";
import { getShortAddress } from "~/utils/utils";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { thirdwebClient } from "~/utils/thirdweb";
import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode
  title?: string
}

export const Layout = ({ children, title }: LayoutProps) => {
  //const { address, isConnected } = useAccount();
  const headerlinks = [
    { title: 'Create community', link: '/create-community' }
  ]

  const wallets = [
    inAppWallet(),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

  return (
    <div>
      <Head>
        <title>Open Tribe | {title ?? title}</title>
        <meta
          name="description"
          content="Uniendo Fuerzas, Abriendo Posibilidades"
        />
      </Head>
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="w-full h-[90px] flex justify-between px-[10px] py-[10px]">
          <div className="my-auto">
            <Link className="text-white mr-3  text-2xl font-bold" href={"/"} >
              Open Tribe
            </Link>
          </div>
          <div className="flex">
            <div className="my-auto">
              {headerlinks.map((item, index) => {
                return (
                  <Link className="text-white mr-3" href={item.link} key={index}>{item.title}</Link>
                )
              })}
            </div>
            {/* {address &&
            <Link href={'/account'} className="border-solid border-gray-500 border-[1px] rounded-xl my-auto px-2">
              <p className="text-white">{getShortAddress(address)}</p>
            </Link>
          }
          {!address &&
            <Link href={'/auth'} className="border-solid border-gray-500 border-[1px] rounded-xl my-auto px-2">
              <p className="text-white">Log In</p>
            </Link>
          } */}

            <div>
              <ConnectButton client={thirdwebClient} wallets={wallets} />
            </div>
          </div>
        </div>
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}