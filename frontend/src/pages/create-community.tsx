import Head from "next/head";
import Link from "next/link";
import { AuthenticationModal } from "~/components/AuthenticationModal";
import { CreateCommunityForm } from "~/components/CreateCommunityForm";
import { Layout } from "~/components/Layout";

import { api } from "~/utils/api";

export default function CreateCommunity() {
  const { data: users } = api.user.getAll.useQuery()
  
  return (
    <>
      <Layout>
        <div className="px-[10px] mt-[30px]">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Create Community
          </h1>

          {/* <div className="flex flex-col items-center gap-2 text-white">
              <h2 className="text-2xl">Users</h2>

              {users && users?.map((item) => {
                return (
                  <div className="border-solid border-2 border-red-600">

                    <p>{item.name}</p>
                    <p>{item.email}</p>
                  </div>
                )
              })}
            </div> */}

          <CreateCommunityForm  />

        </div>
      </Layout>
    </>
  );
}
