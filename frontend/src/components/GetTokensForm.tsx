"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "src/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form"
import { Input } from "src/components/ui/input"
import { useRouter } from "next/router"
import { taskManagerContract, tokenMinterContract } from "~/utils/thirdweb"
import { prepareContractCall, PreparedTransaction, readContract, toWei } from "thirdweb"
import { useSendTransaction } from "thirdweb/react"

const notEmpty = z.string().trim().min(1, { message: "Required" });

const FormSchema = z.object({
  usdAmount: z.string(),
  communityLeader: z.string().pipe(notEmpty),
})

export const GetTokensForm = ({ }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [latestEthPrice, setLatestEthPrice] = useState(0)
  const [usdToEthPrice, setUsdToEthPrice] = useState(0)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usdAmount: '0',
      communityLeader: ""
    },
  })

  useEffect(() => {
    form.reset({
      ...form.getValues(), // Retains any existing form values
      usdAmount: '1'
    });
  }, [form]);

  const { setValue, handleSubmit, watch, register, formState } = form;
  const { errors } = formState;
  console.log('errors', errors);

  const usdAmount = watch("usdAmount");
  const communityLeader = watch("communityLeader");

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const mintTokens = async (communityLeader: string, tokensAmount: string) => {
    const transaction = prepareContractCall({
      contract: tokenMinterContract,
      method: "mint",
      params: [communityLeader, toWei(tokensAmount)],
    } as never);

    sendTransaction(transaction as PreparedTransaction);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('SUBMIT', data);
    //mutate(data)
    console.log('toWei(tokensAmount)', toWei(`${usdToEthPrice}`));
    mintTokens(data.communityLeader, `${usdToEthPrice}`)
  }

  // useEffect(() => {
  //   const getLatestEthPrice = async () => {
  //     const ethPrice = await readContract({
  //       contract: taskManagerContract,
  //       method: "getLatestEthPrice",
  //       params: [],
  //     } as never);
  //     console.log('ethPrice!', ethPrice);

  //     setLatestEthPrice(ethPrice as any);
  //   };

  //   console.log('getLatestEthPrice', getLatestEthPrice);

  //   getLatestEthPrice();
  // }, []);

  const ethPriceFormatter = (valor: number) => {
    const divisor = 10000000000; // Esto es 10^10
    const resultado = valor / divisor;
    return resultado.toFixed(10); // Retorna el resultado con 10 decimales
  }

  useEffect(() => {
    const getLatestUsdToEthPrice = async () => {
      const ethPrice = await readContract({
        contract: taskManagerContract,
        method: "usdToEth",
        params: [usdAmount],
      } as never);
      const formattedPrice = ethPriceFormatter(Number(ethPrice))
      setUsdToEthPrice(formattedPrice as any);
    };

    getLatestUsdToEthPrice();
  }, [usdAmount]);

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="usdAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Amount* (USD)</FormLabel>
                <FormControl>
                  <Input placeholder="Amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communityLeader"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Send To*</FormLabel>
                <FormControl>
                  <Input placeholder="Send to" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-white">
            <h3>You are sending</h3>
            <div>
              <p><span className="font-bold">{usdToEthPrice} OTTO</span> to <span className="font-bold">{communityLeader}</span></p>
            </div>

            <p>Powered by <a href="https://docs.chain.link/data-feeds/price-feeds/addresses" className="underline">Chainlink Data Feeds</a></p>
          </div>


          <div className="flex justify-end">
            <Button type="submit">Get Tokens</Button>
          </div>
        </form>
      </Form>

      {/* <div className="text-white mb-[10px]">
        <h2 className="text-2xl">Your tokens</h2>

        <p className="text-lg">0.2 OTTO</p>
      </div> */}

      {/* <Button type="button" onClick={() => { router.push('/account') }}>Go to your account</Button> */}
    </div>
  )
}