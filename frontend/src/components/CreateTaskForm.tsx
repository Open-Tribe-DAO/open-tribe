"use client"
import { useEffect, useState } from "react"
//import { uuid } from "uuidv4"
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
import { Textarea } from "src/components/ui/textarea"
//import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router"
import { api } from "~/utils/api";
import { useAccount } from "wagmi"
import { defineChain, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import TaskManagerABI from "~/abi/TaskManager"
import { thirdwebClient } from "~/utils/thirdweb"
//import { taskManagerContract } from "~/utils/thirdweb"

const taskManagerContract = getContract({
  client: thirdwebClient,
  chain: defineChain(534351),
  address: "0x1B2539b195aF04f4EAb550650E588916aafA7F44",
  abi: TaskManagerABI
});

const notEmpty = z.string().trim().min(1, { message: "Required" });

const FormSchema = z.object({
  name: z.string().pipe(notEmpty),
  description: z.string().optional(),
  taskId: z.string().optional(),
  communityId: z.string().optional(),
  image: z.string().optional(),
  owner: z.string().optional()
})

interface Step1Props {
  id?: string
  step: number
  setStep: (step: number) => void
  //eventInfo?: EventType
}

export const CreateTaskForm = ({ }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  //const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [existingSlugError, setExistingSlugError] = useState('')
  const { mutate, status, error } = api.community.create.useMutation()
  //const { address } = useAccount();

  //console.log('address', address);

  console.log('status mutation', status);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      taskId: "",
      communityId: "",
      image: "",
      owner: ""
    },
  })

  // useEffect(() => {
  //   if (address) {
  //     form.reset({
  //       ...form.getValues(), // Retains any existing form values
  //       //name: eventInfo?.name,
  //       owner: address
  //     });
  //   }
  // }, [address, form]);

  const { setValue, handleSubmit, watch, register, formState } = form;
  const { errors } = formState;
  console.log('errors', errors);

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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('SUBMIT', data);
    mutate(data)
  }

  const createTask = async () => {
    const transaction = prepareContractCall({
      taskManagerContract,
      method: "createTask",
      params: [
        "0x44b49653d0Db62DEeAB2f2a7B3C555AA2bFf90A2",
        "100000000000000",
      ],
    });
    sendTransaction(transaction);
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

          <button type="button" onClick={() => {
            createTask()
          }}>Create Task</button>

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
            name="taskId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Task Id</FormLabel>
                <FormControl>
                  <Input placeholder="Task Id" {...field} />
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

          <FormField
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
          />

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