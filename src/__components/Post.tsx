"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { sendPost,fetchPosts } from "../store/slices/postSlice"
import type { AppDispatch, RootState } from "../store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PostFormValues {
  bio: string;
}

export function Post() {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.auth.token)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PostFormValues>({ defaultValues: { bio: "" } })

  const onSubmit = async (data: PostFormValues) => {
    if (!token) {
      toast.error("You must be logged in to post.")
      return
    }

    try {
      await dispatch(sendPost({ text: data.bio, token })).unwrap();
      await dispatch(fetchPosts({ token })) 

      toast.success("Post submitted successfully!")
      reset({ bio: "" })
    } catch {
      toast.error("Failed to post.")
    }
  }




  return (
    <div className="flex items-center justify-center mt-20">
      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Post</label>
          <Textarea
            placeholder="What's on your mind?"
            className="resize-none"
           required
            {...register("bio")}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  )
}
