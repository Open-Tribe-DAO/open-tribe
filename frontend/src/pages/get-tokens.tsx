import { Layout } from "~/components/Layout";
import { GetTokensForm } from "~/components/GetTokensForm";

export default function GetTokens() {

  return (
    <Layout title="Get Tokens">
      <div className="px-[10px] mt-[30px]">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Get Tokens for the community leader
        </h1>

        <GetTokensForm />
      </div>
    </Layout>
  );
}
