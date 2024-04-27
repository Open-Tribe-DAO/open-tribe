import { mainnet, sepolia } from "@wagmi/core/chains";
import { createConfig, http } from "wagmi";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http("https://scroll-sepolia.drpc.org"),
  },
});
