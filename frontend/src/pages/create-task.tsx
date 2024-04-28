import Head from "next/head";
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

          <CreateTaskForm  />
        </div>
      </Layout>
    </>
  );
}
