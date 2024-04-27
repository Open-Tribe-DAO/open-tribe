import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useAccount, useReadContract } from "wagmi";
import { CommunityCard } from "~/components/CommunityCard";
import { Layout } from "~/components/Layout";

import { api } from "~/utils/api";

import { useWriteContract } from "wagmi";

import TaskManagerAbi from "~/abi/TaskManager";

import { config } from "~/lib/config";






export default function Home() {
  //const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { data: users } = api.user.getAll.useQuery()
  const { data: communities } = api.community.getAll.useQuery()
  const { mutate, status, error } = api.user.create.useMutation()
  ///hello.useQuery({ text: "from tRPC" });
  const { address, isConnected } = useAccount();

  const { writeContract, isPending } = useWriteContract({config });
  // const { request } = await useWriteContract({
  //   address: '0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6',
  //   abi: TaskManager.abi,
  //   functionName: 'mint',
  // })

  // const { config, error } = usePrepareContractWrite({
  //   address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
  //   abi:TaskManager.abi,
  //   functionName: 'feed',
  // })
  // const { hash } = await writeContract(request)

  // const getTokens=()=>{
  //   writeContract({}) 
  // }

  // const { data: balance } = useReadContract({
  //   ...TaskManager,
  //   functionName: 'name',
  //   args: ['0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6'],
  // })

  // const web3 = new Web3(window?.ethereum);

  // const contract = new web3.eth.Contract(
  //   TaskManager.abi,
  //   "0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6"
  // );

  console.log("address", address);

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
                writeContract({
                  address: "0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6",
                  abi: TaskManagerAbi,
                  functionName: "createTask",
                  args: [
                    "0xc1d457128dEcAE1CC092728262469Ee796F1Ac45",
                    "100000000000000",
                  ],
                });
              }}
            >
              {isPending ? "Loading": "Transfer"}
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
