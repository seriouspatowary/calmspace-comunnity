import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPosts, replyPost, fetchReplies, toggleReaction } from "@/store/slices/postSlice"
import type { AppDispatch, RootState } from "@/store"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function PostList() {
  const dispatch = useDispatch<AppDispatch>()
  const { posts, replies, repliesLoading } = useSelector((state: RootState) => state.posts)
  const token = useSelector((state: RootState) => state.auth.token)

  const [replyText, setReplyText] = useState<string>("")
  const [showReplyBox, setShowReplyBox] = useState<string | null | undefined>(null)
  const [showReplies, setShowReplies] = useState<{ [postId: string]: boolean }>({})



  useEffect(() => {
    if (!token) return
    dispatch(fetchPosts({ token }))
  }, [dispatch, token])

  const handleReply = async (postId: string) => {
    if (!replyText.trim() || !token) return
    
    try {
      await dispatch(replyPost({ 
        text: replyText, 
        token, 
        postId 
      })).unwrap()
      
      // Reset reply state on success
      setReplyText("")
      setShowReplyBox(null)
      
      // If replies are currently shown, refresh them
      if (showReplies[postId]) {
        dispatch(fetchReplies({ postId, token }))
      }
    } catch (error) {
      console.error("Error posting reply:", error)
    }
  }

  const handleViewReplies = (postId: string) => {
    if (!token) return
    
    const isCurrentlyShowing = showReplies[postId]
    
    if (!isCurrentlyShowing) {
      // Show replies and fetch them if not already loaded
      setShowReplies(prev => ({ ...prev, [postId]: true }))
      if (!replies[postId]) {
        dispatch(fetchReplies({ postId, token }))
      }
    } else {
      // Hide replies
      setShowReplies(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleToggleLike = (postId: string) => {
    if (!token) return;
    dispatch(toggleReaction({ postId, token }));
  };
  

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {posts.map((post, index) => (
        <Card key={post._id || index} className="w-full">
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
              {post.text}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col gap-3">
            {/* Action Buttons */}
            <div className="flex items-center gap-4 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox(showReplyBox === post._id ? null : post._id)}
              >
                💬 Reply
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewReplies(post._id!)}
                disabled={repliesLoading[post._id!]}
              >
                {repliesLoading[post._id!] ? (
                  "Loading..."
                ) : showReplies[post._id!] ? (
                  "Hide Replies"
                ) : (
                  `👁️ View Replies ${replies[post._id!]?.length ? `(${replies[post._id!].length})` : ""}`
                )}
              </Button>
            </div>

            {/* Reply Box */}
            {showReplyBox === post._id && (
              <div className="w-full space-y-3 p-3 bg-gray-50 rounded-lg">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowReplyBox(null)
                      setReplyText("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReply(post._id!)}
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}

            {/* Replies Section */}
            {showReplies[post._id!] && (
              <div className="w-full space-y-3 mt-4">
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Replies</h4>
                  
                  {replies[post._id!]?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No replies yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {replies[post._id!]?.map((reply, replyIndex) => (
                        <div key={reply._id || replyIndex} className="bg-gray-50 p-3 rounded-lg border-l-2 border-blue-200">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={reply.userId?.pic || "/default-avatar.png"}
                              alt={reply.userId?.name}
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                            <div>
                              <p className="text-sm font-medium">{reply.userId?.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(reply.createdAt || "").toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
<Button
      variant="ghost"
      size="sm"
      onClick={() => handleToggleLike(post._id!)}
    >
      {post.reactions?.some((r) =>  r.reactionType === "like")
        ? "❤️ Liked"
        : "🤍 Like"}{" "}
      {post.reactions?.filter((r) => r.reactionType === "like").length
        ? `(${post.reactions.filter((r) => r.reactionType === "like").length})`
        : ""}
    </Button>


          </CardFooter>
        </Card>
      ))}
    </div>
  )
}