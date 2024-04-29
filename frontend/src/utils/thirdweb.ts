import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import TaskManagerABI from "~/abi/TaskManager";
import TokenMinterABI from "~/abi/TokenMinter";
import { type Abi } from "viem";
import { TASK_MANAGER_CONTRACT_ADDRESS, TOKEN_MINTER_CONTRACT_ADDRESS } from "./utils";

export const thirdwebClient = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? '' });

// export const TASK_MANAGER_ADDRESS = "0x1B2539b195aF04f4EAb550650E588916aafA7F44"
// export const TOKEN_MINTER_ADDRESS = "0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6"

export const taskManagerContract = getContract({
  client: thirdwebClient,
  chain: defineChain(534351),
  address: TASK_MANAGER_CONTRACT_ADDRESS,
  abi: TaskManagerABI as Abi,
});

export const tokenMinterContract = getContract({
  client: thirdwebClient,
  chain: defineChain(534351),
  address: TOKEN_MINTER_CONTRACT_ADDRESS,
  abi: TokenMinterABI as Abi,
});