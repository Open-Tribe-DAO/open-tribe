import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { type PreparedTransaction, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { CommunityCard } from "~/components/CommunityCard";
import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";
import { taskManagerContract, thirdwebClient } from "~/utils/thirdweb";
import { defineChain } from "thirdweb/chains";
import TokenMinterABI from "~/abi/TokenMinter";
import { type Abi } from "viem";
import { TASK_MANAGER_CONTRACT_ADDRESS, TOKEN_MINTER_CONTRACT_ADDRESS } from "~/utils/utils";

const contract = getContract({
  client: thirdwebClient,
  chain: defineChain(534351),
  address: TOKEN_MINTER_CONTRACT_ADDRESS,
  abi: TokenMinterABI as Abi,
});

export default function Admin() {
  //const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { data: users } = api.user.getAll.useQuery()
  const { data: communities } = api.community.getAll.useQuery()
  const { mutate, status, error } = api.user.create.useMutation()
  ///hello.useQuery({ text: "from tRPC" });

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const approveTaskManager = async () => {
    const transaction = prepareContractCall({
      contract: contract,
      method: "approve",
      params: [TASK_MANAGER_CONTRACT_ADDRESS, "1000000000000000000"],
    } as never);
    sendTransaction(transaction as PreparedTransaction);
  };

  const createTask = async () => {
    const transaction = prepareContractCall({
      contract: taskManagerContract,
      method: "createTask",
      params: [
        "0x44b49653d0Db62DEeAB2f2a7B3C555AA2bFf90A2",
        "1000000000000000",
      ],
    } as never);
    sendTransaction(transaction as PreparedTransaction);
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
                approveTaskManager()
              }}
            >
              Approve Task Manager on Token Minter
            </button>

            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={() => {
                createTask()
              }}
            >
              Create Task
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
                      image={item.image ?? ""}
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
