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
import { tokenMinterContract } from "~/utils/thirdweb"
import { prepareContractCall, PreparedTransaction, toWei } from "thirdweb"
import { useSendTransaction } from "thirdweb/react"

const notEmpty = z.string().trim().min(1, { message: "Required" });

const FormSchema = z.object({
  tokensAmount: z.number()
    .min(0.0001, { message: "Amount must be at least 0.0001" })  // Ensure the number is at least 0.0001
    .max(2, { message: "Amount must not be greater than 2" }),
  communityLeader: z.string().pipe(notEmpty),
})

export const GetTokensForm = ({ }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tokensAmount: 0,
      communityLeader: ""
    },
  })

  useEffect(() => {
    form.reset({
      ...form.getValues(), // Retains any existing form values
      tokensAmount: 0.0001
    });
  }, [form]);

  const { setValue, handleSubmit, watch, register, formState } = form;
  const { errors } = formState;
  console.log('errors', errors);

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
    console.log('toWei(tokensAmount)', toWei(`${data.tokensAmount}`));
    mintTokens(data.communityLeader, `${data.tokensAmount}`)
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="tokensAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Amount* (ETH)</FormLabel>
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

          <div className="flex justify-end">
            <Button type="submit">Get Tokens</Button>
          </div>
        </form>
      </Form>

      <div className="text-white mb-[10px]">
        <h2 className="text-2xl">Your tokens</h2>

        <p className="text-lg">0.2 OTTO</p>
      </div>

      <Button type="button" onClick={() => { router.push('/account') }}>Go to your account</Button>
    </div>
  )
}