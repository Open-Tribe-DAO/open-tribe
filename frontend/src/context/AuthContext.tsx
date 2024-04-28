"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { api } from "~/utils/api";

export interface AuthContextProps {
  children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
  //const { address } = useAccount();
  const { data: users } = api.user.getAll.useQuery()
  const { mutate } = api.user.create.useMutation()

  // useEffect(() => {
  //   if (address && users) {
  //     mutate({
  //       address: address
  //     })
  //   }
  // }, [users])

  return <SessionProvider>{children}</SessionProvider>;
}
