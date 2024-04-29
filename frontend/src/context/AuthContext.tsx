"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { useActiveAccount } from "thirdweb/react";

export interface AuthContextProps {
  children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
  //const { data: users } = api.user.getAll.useQuery()
  const { mutate } = api.user.create.useMutation()
  const activeAccount = useActiveAccount();

  useEffect(() => {
    if (activeAccount?.address) {
      console.log('mutate! create account', activeAccount.address);
      
      mutate({
        address: activeAccount.address
      })
    }
  }, [activeAccount])

  return <SessionProvider>{children}</SessionProvider>;
}
