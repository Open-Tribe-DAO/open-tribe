import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import TaskManagerABI from "~/abi/TaskManager";
import { type Abi } from "viem";

export const thirdwebClient = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? '' });

export const taskManagerContract = getContract({
  client: thirdwebClient,
  chain: defineChain(534351), 
  address: "0x1B2539b195aF04f4EAb550650E588916aafA7F44",
  abi: TaskManagerABI as Abi,
});