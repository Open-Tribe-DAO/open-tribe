import { signOut } from "next-auth/react";

import { useAccount, useDisconnect } from "wagmi";
import { Layout } from "~/components/Layout";


export default function Home() {
  const { disconnectAsync } = useDisconnect();
  const handleSignout = async () => {
    await disconnectAsync();
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Layout>
        <main className=" flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Your Account
            </h1>

            <button
              className="rounded-lg py-2 px-4 mt-6 bg-red-700 hover:border hover:border-red-700 hover:bg-transparent"
              onClick={handleSignout}
            >
              Sign Out
            </button>
          </div>
        </main>
      </Layout>
    </>
  );
}
