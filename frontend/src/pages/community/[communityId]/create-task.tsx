import { CreateTaskForm } from "~/components/CreateTaskForm";
import { Layout } from "~/components/Layout";

export default function CreateTask() {

  return (
    <Layout>
      <div className="px-[10px] mt-[30px]">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Create Task
        </h1>

        <CreateTaskForm />
      </div>
    </Layout>
  );
}
