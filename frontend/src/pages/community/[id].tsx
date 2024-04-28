
import { useRouter } from 'next/router';
import { Layout } from '~/components/Layout';
import { api } from "~/utils/api";
import { TaskCard } from '~/components/TaskCard';

export default function TicketDetailsPage() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const { data: community } = api.community.getOne.useQuery({ id: `${id}` })
  const { data: tasks } = api.task.getAll.useQuery()

  return (
    <Layout >
      <div className="px-[10px] mt-[30px] text-white">
        <h1 className='text-3xl'>{community?.name}</h1>
        <p className='text-lg'>{community?.description}</p>

        {community?.owner && <p>Owner: {community?.owner}</p>}

        <div className='mt-[20px]'>
          <h2 className='text-2xl'>Tasks</h2>
          {tasks?.map((item, index) => {

            return (
              <div key={index}>
                <TaskCard item={item} />
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  );
}
