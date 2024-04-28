import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { readContract } from 'thirdweb';
import { taskManagerContract } from '~/utils/thirdweb';
import { weiToEth } from '~/utils/utils';

interface TaskCardProps {
  item: any
}

export const TaskCard = ({ item }: TaskCardProps) => {
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      const fetchedTask = await readContract({
        contract: taskManagerContract,
        method: "tasks",
        params: [item.taskId],
      });
      console.log('fetchedTask', fetchedTask);

      setTask(fetchedTask);
    };

    fetchTask();
  }, [item.taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <Link href={`/task/${item.id}`} className='flex border-2 border-solid border-gray-300 rounded-md h-[80px] w-full p-[10px]'>
      <div>
        <p className='text-xl'>{item.name}</p>
        <p>Reward: {weiToEth(task[2])}</p>
      </div>
    </Link>
  );
}
