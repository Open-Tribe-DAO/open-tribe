import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { CommunityCard } from "~/components/CommunityCard";
import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";

export default function Home() {
  const { data: communities } = api.community.getAll.useQuery()

  return (
    <Layout>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Open Tribe
          </h1>

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
  );
}
