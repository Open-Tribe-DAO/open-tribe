
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Layout } from '~/components/Layout';
import { api } from "~/utils/api";
import { prepareContractCall, readContract } from "thirdweb";
import { taskManagerContract } from '~/utils/thirdweb';
import { weiToEth } from '~/utils/utils';
import { TransactionButton } from 'thirdweb/react';

export default function TicketDetailsPage() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const { data: taskDB } = api.task.getOne.useQuery({ id: `${id}` })
  const { data: tasks } = api.task.getAll.useQuery()
  const [task, setTask] = useState(null);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false)
  const [isTaskCanceled, setIsTaskCanceled] = useState(false)

  const readTask = useCallback(async () => {
    const taskContract = await readContract({
      contract: taskManagerContract,
      method: "tasks",
      params: [taskDB?.taskId],
    } as never);

    setTask(taskContract as any)
    setIsTaskCompleted(taskContract[3] as boolean)
    setIsTaskCanceled(taskContract[4] as boolean)
  }, [taskDB]);

  const setStatus = (task: any): string => {
    let status = 'Pending';

    if (isTaskCompleted) {
      status = 'Completed'
    } else if (task[4]) {
      status = 'Canceled'
    }

    return status
  }

  useEffect(() => {
    if (taskDB?.taskId) {
      readTask()
    }
  }, [taskDB, readTask])

  return (
    <Layout >
      <div className="px-[10px] mt-[30px] text-white">
        <div className='mt-[20px]'>
          <div className='flex'>
            <h2 className='text-3xl'>{taskDB?.name}</h2>
            <div className={`ml-2 w-[10px] h-[10px] rounded-full ${task && (task[3] || task[4]) ? 'bg-red-500' : 'bg-green-500'}`}></div>
          </div>
          <p>{taskDB?.description}</p>
          <div className='mt-[10px]'>
            {task && task[0] && <p><span className='font-bold'>Assignee:</span> {task[0]}</p>}
            {task && task[2] && <p><span className='font-bold'>Reward:</span> {weiToEth(task[2])}</p>}
            {task && <p><span className='font-bold'>Status:</span> {setStatus(task)}</p>}
          </div>

          {!isTaskCompleted || !isTaskCanceled && (
            <div className='mt-[20px] flex sm:space-x-2'>
              <TransactionButton
                transaction={() => {
                  // Create a transaction object and return it
                  const tx = prepareContractCall({
                    contract: taskManagerContract,
                    method: "completeTask",
                    params: [taskDB?.taskId],
                  } as never);
                  console.log('tx', tx);

                  return tx;
                }}
                onTransactionSent={(result) => {
                  console.log("Transaction submitted", result.transactionHash);
                }}
                onTransactionConfirmed={(receipt) => {
                  console.log("Transaction confirmed", receipt.transactionHash);
                  setIsTaskCompleted(true)
                }}
                onError={(error) => {
                  console.error("Transaction error", error);
                }}
              >
                Confirm Task
              </TransactionButton>

              <TransactionButton
                transaction={() => {
                  // Create a transaction object and return it
                  const tx = prepareContractCall({
                    contract: taskManagerContract,
                    method: "cancelTask",
                    params: [taskDB?.taskId],
                  } as never);
                  console.log('tx', tx);

                  return tx;
                }}
                onTransactionSent={(result) => {
                  console.log("Transaction submitted", result.transactionHash);
                  setIsTaskCanceled(true)
                }}
                onTransactionConfirmed={(receipt) => {
                  console.log("Transaction confirmed", receipt.transactionHash);
                }}
                onError={(error) => {
                  console.error("Transaction error", error);
                }}
              >
                Cancel Task
              </TransactionButton>
            </div>
          )}
        </div>
      </div>
    </Layout >
  );
}
