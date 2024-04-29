"use client"
import { useEffect, useState } from "react"
//import { uuid } from "uuidv4"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSendTransaction } from "thirdweb/react";
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
import { Textarea } from "src/components/ui/textarea"
//import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router"
import { api } from "~/utils/api";
import { prepareContractCall, readContract, toWei, type PreparedTransaction } from "thirdweb";
import { taskManagerContract } from "~/utils/thirdweb"

const notEmpty = z.string().trim().min(1, { message: "Required" });

const FormSchema = z.object({
  name: z.string().pipe(notEmpty),
  assignee: z.string().pipe(notEmpty),
  tokensAmount: z.number()
    .min(0.0001, { message: "Amount must be at least 0.0001" })  // Ensure the number is at least 0.0001
    .max(2, { message: "Amount must not be greater than 2" }),
  description: z.string().optional(),
  taskId: z.string().optional(),
  communityId: z.string().optional(),
  image: z.string().optional(),
  owner: z.string().optional()
})

export const CreateTaskForm = ({ }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  //const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [existingSlugError, setExistingSlugError] = useState('')
  const { mutate: mutateTask, status, error } = api.task.create.useMutation()
  const { mutate: sendTransaction, isPending, isSuccess, status: transactionStatus, data: transactionData } = useSendTransaction();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      assignee: "",
      tokensAmount: 0.0001,
      description: "",
      taskId: "0",
      communityId: "",
      image: "",
      owner: ""
    },
  })

  const { setValue, handleSubmit, watch, register, formState } = form;
  const { errors } = formState;
  console.log('errors', errors);

  useEffect(() => {
    form.reset({
      ...form.getValues(), // Retains any existing form values
      tokensAmount: 0.0001
    });
  }, [form]);

  useEffect(() => {
    const fetchTask = async () => {
      const fetchedTask = await readContract({
        contract: taskManagerContract,
        method: "nextTaskId",
        params: [],
      } as never);

      const formattedNumber = Number(fetchedTask)
      setValue('taskId', formattedNumber.toString())
    };

    fetchTask();
  }, []);

  // const handleFileChange = (event: any) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const fileName = uuid();
  //   const fileRef = ref(storage, `eventImages/${fileName}`);
  //   const uploadTask = uploadBytesResumable(fileRef, file);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       // Optional: handle progress
  //     },
  //     (error) => {
  //       console.error("Upload error: ", error);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         setValue("bannerImage", downloadURL);
  //       });
  //     }
  //   );
  // };

  const name = watch("name");
  const description = watch("description");
  const taskId = watch("taskId");
  const communityId = watch("communityId");

  const createTask = async (assignee: string, tokensAmount: string) => {
    const transaction = prepareContractCall({
      contract: taskManagerContract,
      method: "createTask",
      params: [
        assignee,
        toWei(tokensAmount),
      ],
    } as never);
    sendTransaction(transaction as PreparedTransaction);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log('SUBMIT', data);
    await createTask(data.assignee, `${data.tokensAmount}`)
  };

  useEffect(() => {
    if (isSuccess) {
      mutateTask({
        name: name,
        description: description,
        taskId: taskId,
        communityId: communityId,
      })
    }
  }, [isSuccess])

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Task Assignee*</FormLabel>
                <FormControl>
                  <Input placeholder="Task Assignee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tokensAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Tokens Amount*</FormLabel>
                <FormControl>
                  <Input placeholder="Tokens Amount" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taskId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Task Id</FormLabel>
                <FormControl>
                  <Input placeholder="Task Id" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="communityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Community Id</FormLabel>
                <FormControl>
                  <Input placeholder="Community Id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Image link</FormLabel>
                <FormControl>
                  <Input placeholder="Image" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Owner</FormLabel>
                <FormControl>
                  <Input placeholder="" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={(content) => {
                      setValue("description", content);
                      //setData({ ...data, description: content })
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Banner Image"
                    type="file"
                    {...field}
                    value={undefined}
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}