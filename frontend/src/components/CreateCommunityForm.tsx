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
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];



const notEmpty = z.string().trim().min(1, { message: "Required" });

const FormSchema = z.object({
  name: z.string().pipe(notEmpty),
  description: z.string().optional(),
  image: z.any().optional(),
  owner: z.string().optional()
})

interface Step1Props {
  id?: string
  step: number
  setStep: (step: number) => void
  //eventInfo?: EventType
}

export const CreateCommunityForm = ({ }) => {
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
  const name = watch("name");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const image = data.image[0];
    const imageName = image.name;

    // return false;
    if (process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL &&
      process.env.NEXT_PUBLIC_CLOUDFLARE_AUTH_KEY_SECRET
    ) {
      const request = await fetch(`${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}/${imageName}`, {
        method: "POST",
        body: image,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Custom-Auth-Key": process.env.NEXT_PUBLIC_CLOUDFLARE_AUTH_KEY_SECRET
        }
      }).catch((error) => {
        // TODO: FIX CORS Always returning error even if I set the headers
        console.error('Error', error)
      });
      if (request?.ok) {
        console.log('Success', request.statusText)
      } else {
        console.error('Error happened', request?.statusText)
      }
    }

    data.image = imageName;
    mutate(data)
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
    setShowSuccessModal(true)
    setTimeout(() => {
      router.push('/')
    }, 3000); // 3 seconds
  }

  return (
    <div className="">

      {showSuccessModal && (
        <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg></div>
            <div>
              <p className="font-bold">Community Created Successfully!</p>
              <p className="text-sm">You&apos;ll be redirected soon.</p>
            </div>
          </div>
        </div>
      )}

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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Image</FormLabel>
                <FormControl>
                  <Input type="file"
                    onChange={(event) => {
                      return field.onChange(event.target.files);
                    }}
                    placeholder="Image"
                  />
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