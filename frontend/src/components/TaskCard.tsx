import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { readContract } from 'thirdweb';
import { taskManagerContract } from '~/utils/thirdweb';
import { getShortAddress, weiToEth } from '~/utils/utils';

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
        params: [item.taskId ?? 0],
      } as never);
      console.log('fetchedTask', fetchedTask);

      setTask(fetchedTask as any);
    };

    if (item.taskId) {
      fetchTask();
    }
  }, []);


  // {
  //   "internalType": "address",
  //   "name": "assignee",
  //   "type": "address"
  // },
  // {
  //   "internalType": "address",
  //   "name": "creator",
  //   "type": "address"
  // },
  // {
  //   "internalType": "uint256",
  //   "name": "reward",
  //   "type": "uint256"
  // },
  // {
  //   "internalType": "bool",
  //   "name": "isCompleted",
  //   "type": "bool"
  // },
  // {
  //   "internalType": "bool",
  //   "name": "isCancelled",
  //   "type": "bool"
  // }


  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <Link href={`/task/${item.id}`} className='flex border-2 border-solid border-gray-300 rounded-md h-[80px] w-full p-[10px] mb-[10px]'>
      <div>
        <div className='flex'>
          <p className='text-xl'>{item.name}</p>
          <div className={`ml-2 w-[10px] h-[10px] rounded-full ${task[3] === false && task[4] === false ? 'bg-red-500' : 'bg-green-500'}`}></div>
        </div>
        <div className='flex flex-wrap'>
          <p className='mr-[10px]'>Reward: {weiToEth(task[2])}</p>
          <p><span className='font-bold'>Assignee:</span> {getShortAddress(task[0])}</p>
        </div>
      </div>
    </Link>
  );
}
