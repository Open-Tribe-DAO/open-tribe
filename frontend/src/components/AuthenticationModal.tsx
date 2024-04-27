"use client";
import React from "react";
import { SiweMessage } from "siwe";
import { polygonMumbai } from "viem/chains";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
//import { useWeb3Modal } from "@web3modal/react";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { getCsrfToken, signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog"

export const AuthenticationModal = () => {
  const [mounted, setMounted] = React.useState(false);
  const { address, isConnected } = useAccount();
  const { open, close } = useWeb3Modal();
  const { signMessageAsync } = useSignMessage();
  const [hasSigned, setHasSigned] = React.useState(false);
  const { disconnect } = useDisconnect()

  const [showLogInModal, setShowLogInModal] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <></>

  const handleSign = async () => {
    if (!isConnected) open();
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: address,
        statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
        nonce: await getCsrfToken(),
        chainId: polygonMumbai.id,
      });

      const signedMessage = await signMessageAsync({
        message: message.prepareMessage(),
      });

      setHasSigned(true);

      const response = await signIn("web3", {
        message: JSON.stringify(message),
        signedMessage,
        redirect: true,
        callbackUrl: '/'
      });
      if (response?.error) {
        console.log("Error occured:", response.error);
      }
      setShowLogInModal(false)

    } catch (error) {
      console.log("Error Occured", error);
    }
  };

  return (
    <main className=" text-white">
      <button className="btn text-white" onClick={() => { setShowLogInModal(true) }}>Log In</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <div className="modal-action">
            <form method="dialog" className="w-full">

              <div className="flex justify-center">
                {/* if there is a button in form, it will close the modal */}
                {!isConnected && (
                  <>
                    <button
                      className="rounded-lg py-2 px-4 bg-blue-700 hover:border hover:border-blue-700 hover:bg-transparent"
                      onClick={() => {
                        open()
                      }}
                    >
                      Connect Wallet
                    </button>
                  </>
                )}
                {isConnected && !hasSigned && (
                  <>
                    <p className="text-xl font-semibold text-gray-400">
                      Welcome {address?.slice(0, 8)}...
                    </p>
                    <button
                      type="button"
                      className="rounded-lg py-2 px-4 mt-2 bg-violet-700 hover:border hover:border-violet-700 hover:bg-transparent"
                      onClick={handleSign}
                    >
                      Sign Message to Login
                    </button>
                    <button
                      className="rounded-lg py-2 px-4 mt-2 bg-yellow-400 hover:border hover:border-orange-700 hover:bg-transparent"
                      onClick={() => disconnect()}
                    >
                      Disconnect Wallet
                    </button>
                  </>
                )}
                {isConnected && hasSigned && (
                  <p>You are being authenticated. Please wait...</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <Dialog open={showLogInModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              {/* if there is a button in form, it will close the modal */}
              {!isConnected && (
                <>
                  <button
                    className="rounded-lg py-2 px-4 bg-blue-700 hover:border hover:border-blue-700 hover:bg-transparent"
                    onClick={() => open()}
                  >
                    Connect Wallet
                  </button>
                </>
              )}
              {isConnected && !hasSigned && (
                <>
                  <p className="text-xl font-semibold text-gray-400">
                    Welcome {address?.slice(0, 8)}...
                  </p>
                  <button
                    type="button"
                    className="rounded-lg py-2 px-4 mt-2 bg-violet-700 hover:border hover:border-violet-700 hover:bg-transparent"
                    onClick={handleSign}
                  >
                    Sign Message to Login
                  </button>
                  <button
                    className="rounded-lg py-2 px-4 mt-2 bg-yellow-400 hover:border hover:border-orange-700 hover:bg-transparent"
                    onClick={() => disconnect()}
                  >
                    Disconnect Wallet
                  </button>
                </>
              )}
              {isConnected && hasSigned && (
                <p>You are being authenticated. Please wait...</p>
              )}
            </div>
          </div>
          <DialogFooter>
            {/* <Button type="submit">Save changes</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  );
};
