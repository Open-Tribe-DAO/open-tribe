import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { CommunityCard } from "~/components/CommunityCard";
import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";
import { thirdwebClient } from "~/utils/thirdweb";
import { defineChain } from "thirdweb/chains";
import TokenMinterABI from "~/abi/TokenMinter";

const contract = getContract({
  client: thirdwebClient,
  chain: defineChain(534351), 
  address: "0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6",
  abi: TokenMinterABI
});

export default function Home() {
  //const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { data: users } = api.user.getAll.useQuery()
  const { data: communities } = api.community.getAll.useQuery()
  const { mutate, status, error } = api.user.create.useMutation()
  ///hello.useQuery({ text: "from tRPC" });

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  console.log(isPending, 'contract', contract);
  
  const onClick = async () => {
    const transaction = prepareContractCall({
      contract,
      method: "mint",
      params: [
        "0xc1d457128dEcAE1CC092728262469Ee796F1Ac45",
        "100000000000000",
      ],
    });
    sendTransaction(transaction);
  };

  return (
    <>
      <Head>
        <title>Open Tribe</title>
        <meta
          name="description"
          content="Uniendo Fuerzas, Abriendo Posibilidades"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className=" flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Open Tribe
            </h1>

            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => {
                // writeContract({
                //   abi: TokenMinterABI,
                //   address: '0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6',
                //   functionName: 'mint',
                //   args: [
                //     "0xc1d457128dEcAE1CC092728262469Ee796F1Ac45",
                //     "100000000000000",
                //   ],
                // });
                onClick()
              }}
            >
              Transfer
            </button>

            <div className="mt-[100px] flex w-full flex-col gap-2 text-white">
              <h2 className="text-2xl">Communities</h2>
              {communities &&
                communities?.map((item) => {
                  return (
                    <CommunityCard
                      key={item.id}
                      id={item.id}
                      name={item.name ?? ""}
                    />
                  );
                })}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  // const { data: secretMessage } = api.post.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {/* {secretMessage && <span> - {secretMessage}</span>} */}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>



    </div>
  );
}
