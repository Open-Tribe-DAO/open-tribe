import Head from "next/head";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AuthenticationModal } from "~/components/AuthenticationModal";
import { CreateCommunityForm } from "~/components/CreateCommunityForm";
import { CreateTaskForm } from "~/components/CreateTaskForm";
import { Layout } from "~/components/Layout";

import { api } from "~/utils/api";

export default function CreateTask() {
  const { data: users } = api.user.getAll.useQuery()
  
  return (
    <>
      <Layout>
        <div className="px-[10px] mt-[30px]">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Create Task
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

          <CreateTaskForm  />
        </div>
      </Layout>
    </>
  );
}
