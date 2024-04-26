import { useAccount } from "wagmi";
import { getShortAddress } from "~/utils/utils";

export const Layout = ({ children }: any) => {
  const { address, isConnected } = useAccount();
  return (
    <div className=" bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-full h-[50px] flex justify-between px-[10px]">
        <div className="my-auto">
          <p className="text-white text-2xl font-bold">Open Tribe</p>
        </div>

        <div className="border-solid border-gray-500 border-[1px] rounded-xl my-auto px-2">
          <p className="text-white">{getShortAddress(address)}</p>
        </div>
      </div>

      <div>
        {children}
      </div>
    </div>
  )
}