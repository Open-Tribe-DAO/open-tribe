import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import AuthContext from "~/context/AuthContext";
import { ThirdwebProvider } from "thirdweb/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <ThirdwebProvider>
      <AuthContext>
        <main className={`font-sans ${inter.variable}`}>
          <Component {...pageProps} />
        </main>
      </AuthContext>
    </ThirdwebProvider>
  );
};

export default api.withTRPC(MyApp);


