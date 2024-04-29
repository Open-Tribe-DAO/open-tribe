import { useRouter } from 'next/router';
import { CreateTaskForm } from "~/components/CreateTaskForm";
import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";

export default function CreateTask() {
  const router = useRouter();
  const { data: users } = api.user.getAll.useQuery();
  const communityId = Array.isArray(router.query.communityId) ? router.query.communityId[0] : router.query.communityId;

  return (
    <>
      <Layout>
        <div className="px-[10px] mt-[30px]">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Create Task
          </h1>

          <CreateTaskForm communityId={communityId ?? ''} />
        </div>
      </Layout>
    </>
  );
}
