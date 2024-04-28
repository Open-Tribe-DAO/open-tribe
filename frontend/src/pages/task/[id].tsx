
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Layout } from '~/components/Layout';
import { api } from "~/utils/api";
import { prepareContractCall, PreparedTransaction, readContract, resolveMethod, sendTransaction, simulateTransaction, waitForReceipt } from "thirdweb";
import { taskManagerContract, thirdwebClient } from '~/utils/thirdweb';
import { TaskCard } from '~/components/TaskCard';
import { weiToEth } from '~/utils/utils';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import { TransactionButton } from 'thirdweb/react';

export default function TicketDetailsPage() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const { data: taskDB } = api.task.getOne.useQuery({ id: `${id}` })
  const { data: tasks } = api.task.getAll.useQuery()
  const [task, setTask] = useState()

  const readTask = async () => {
    const taskContract = await readContract({
      contract: taskManagerContract,
      method: "tasks",
      params: [taskDB.taskId],
    });

    setTask(taskContract)
  };

  useEffect(() => {
    if (taskDB?.taskId) {
      readTask()
    }
  }, [taskDB])

  return (
    <Layout >
      <div className="px-[10px] mt-[30px] text-white">
        <div className='mt-[20px]'>
          <h2 className='text-3xl'>{taskDB?.name}</h2>
          <p>{taskDB?.description}</p>
          <div>
            {task && task[0] && <p>Assignee: {task[0]}</p>}
            {task && task[2] && <p>Reward: {weiToEth(task[2])}</p>}
            {task && <p>Is Completed: {task[3] ? 'true' : 'false'}</p>}
            {task && <p>Is Canceled: {task[4] ? 'true' : 'false'}</p>}
          </div>
          
          <TransactionButton
            transaction={() => {
              // Create a transaction object and return it
              const tx = prepareContractCall({
                contract: taskManagerContract,
                method: "completeTask",
                params: [0],
              });
              console.log('tx', tx);

              return tx;
            }}
            onTransactionSent={(result) => {
              console.log("Transaction submitted", result.transactionHash);
            }}
            onTransactionConfirmed={(receipt) => {
              console.log("Transaction confirmed", receipt.transactionHash);
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
                method: "completeTask",
                params: [0],
              });
              console.log('tx', tx);

              return tx;
            }}
            onTransactionSent={(result) => {
              console.log("Transaction submitted", result.transactionHash);
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
      </div>
    </Layout >
  );
}
