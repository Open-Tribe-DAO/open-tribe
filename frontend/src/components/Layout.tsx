import Link from "next/link";
import { getShortAddress } from "~/utils/utils";
import { AuthenticationModal } from "./AuthenticationModal";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useConnect } from "thirdweb/react";
import { injectedProvider } from "thirdweb/wallets";
import { ConnectEmbed } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { thirdwebClient } from "~/utils/thirdweb";

export const Layout = ({ children }: any) => {
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
        {/* <AuthenticationModal /> */}
      </div>
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  )
}