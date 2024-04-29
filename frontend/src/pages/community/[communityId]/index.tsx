
import { useRouter } from 'next/router';
import { Layout } from '~/components/Layout';
import { api } from "~/utils/api";
import { TaskCard } from '~/components/TaskCard';
import { Button } from '~/components/ui/button';

export default function TicketDetailsPage() {
  const router = useRouter();
  const id = Array.isArray(router.query.communityId) ? router.query.communityId[0] : router.query.communityId;

  const { data: community } = api.community.getOne.useQuery({ id: `${id}` })
  const { data: tasks } = api.task.getAll.useQuery()

  return (
    <Layout >
      <div className="px-[10px] mt-[30px] text-white">
        <h1 className='text-3xl'>{community?.name}</h1>
        <p className='text-lg'>{community?.description}</p>

        {community?.owner && <p>Owner: {community?.owner}</p>}

        <div className='mt-[20px]'>
          <div className='flex mb-[10px]'>
            <h2 className='text-2xl mr-[10px]'>Tasks</h2>
            {community?.id && <Button onClick={() => router.push(`/community/${community?.id}/create-task`)}>Create Task</Button>}
          </div>
          {tasks?.map((item, index) => {
            if (id != item.communityId) return (<></>)
            return (
              <TaskCard item={item} key={index} />
            )
          })}
        </div>
      </div>
    </Layout>
  );
}
