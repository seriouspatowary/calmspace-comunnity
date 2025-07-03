"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPosts } from "@/store/slices/postSlice"
import type { AppDispatch, RootState } from "@/store"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PostList() {
  const dispatch = useDispatch<AppDispatch>()
  const { posts } = useSelector((state: RootState) => state.posts)
    const token = useSelector((state: RootState) => state.auth.token)
    const [openPostId, setOpenPostId] = useState<string | null>(null)


  useEffect(() => {
    if (!token) return
    dispatch(fetchPosts({ token }))
  }, [dispatch, token])
    
    console.log(posts)

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {posts.map((post, index) => (
        <Card key={post._id || index} className="w-full"   onClick={() => setOpenPostId(openPostId === post._id ? null : post._id)}
>
          <CardHeader>
            <div className="flex items-center gap-4">
              <img
                src={post.userId?.pic || "/default-avatar.png"}
                alt={post.userId?.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
              
              <div>
                <CardTitle className="text-base font-semibold">
                  {post.userId?.name}
                </CardTitle>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt || "").toLocaleString()}
                </p>
              </div>
            </div>

                  <CardDescription className="mt-3">
                       {openPostId === post._id && (
                                <div className="flex gap-4 mt-4">
                                    {(["like", "love", "laugh", "wow", "sad", "angry"] as const).map((reaction) => (
                                    <button
                                        key={reaction}
                                        className="text-xl hover:scale-110 transition-transform"
                                        onClick={(e) => {
                                        e.stopPropagation()
                                        console.log(`React ${reaction} to ${post._id}`)
                                        }}
                                    >
                                        {{
                                        like: "👍",
                                        love: "❤️",
                                        laugh: "😂",
                                        wow: "😮",
                                        sad: "😢",
                                        angry: "😡",
                                        }[reaction]}
                                    </button>
                                    ))}

                                </div>
                     )}
              {post.text}
                  </CardDescription>
                  
                    

          </CardHeader>
          <CardFooter />
        </Card>
      ))}
    </div>
  )
}
