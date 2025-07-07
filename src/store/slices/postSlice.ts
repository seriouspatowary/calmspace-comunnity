import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface Reaction {
  userId: string;
  reactionType: "like" | "love" | "laugh" | "wow" | "sad" | "angry";
}

export interface Post {
  _id?: string;
  userId: {
        _id: string,
        name: string,
        pic:string

    };
  text: string;
  reactions?: Reaction[];
  createdAt?: string;
  updatedAt?: string;
}

interface PostState {
  posts: Post[];
  replies: { [postId: string]: Post[] }; // Store replies for each post
  loading: boolean;
  error: string | null;
  repliesLoading: { [postId: string]: boolean }; // Track loading state for each post's replies
}

const initialState: PostState = {
  posts: [],
  replies: {},
  loading: false,
  error: null,
  repliesLoading: {},
};



const apiUrl =  import.meta.env.VITE_MODE === "development" ? "http://localhost:4000": import.meta.env.VITE_API_URL

export const sendPost = createAsyncThunk<
  Post,
  { text: string; token: string },
  { rejectValue: string }
>("posts/sendPost", async ({ text, token }, thunkAPI) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/comunity/sendpost`,
      { text },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to send post");
  }
});

export const fetchPosts = createAsyncThunk<Post[], {token:string}, { rejectValue: string }>(
  "posts/fetchPosts",
  async ({token}, thunkAPI) => {
    try {
        const response = await axios.get(`${apiUrl}/api/comunity/post`,
          {
        headers: {
          Authorization: `${token}`,
        },
      }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch posts");
    }
  }
);

export const replyPost = createAsyncThunk<
  Post,
  { text: string; token: string; postId: string},
  { rejectValue: string }
>("posts/replyPost", async ({ text, token, postId }, thunkAPI) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/comunity/replypost`,
      { text , postId},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to reply post");
  }
});

// New async thunk to fetch replies for a specific post
export const fetchReplies = createAsyncThunk<
  { postId: string; replies: Post[] },
  { postId: string; token: string },
  { rejectValue: string }
>("posts/fetchReplies", async ({ postId, token }, thunkAPI) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/comunity/replies/${postId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return { postId, replies: response.data.data }; // <-- fix here
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch replies");
  }
});


const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // You can add clearPosts, updatePost etc. here
    clearReplies: (state, action) => {
      const postId = action.payload;
      delete state.replies[postId];
    },
  },
  extraReducers: (builder) => {
    builder
      // sendPost
      .addCase(sendPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // add new post to top
      })
      .addCase(sendPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send post";
      })

      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      })
    
     // replyPosts
      .addCase(replyPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replyPost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(replyPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to Reply posts";
      })

      // fetchReplies
      .addCase(fetchReplies.pending, (state, action) => {
        const postId = action.meta.arg.postId;
        state.repliesLoading[postId] = true;
        state.error = null;
      })
      .addCase(fetchReplies.fulfilled, (state, action) => {
        const { postId, replies } = action.payload;
        state.repliesLoading[postId] = false;
        state.replies[postId] = replies;
      })
      .addCase(fetchReplies.rejected, (state, action) => {
        const postId = action.meta.arg.postId;
        state.repliesLoading[postId] = false;
        state.error = action.payload || "Failed to fetch replies";
      });
  },
});

export const { clearReplies } = postSlice.actions;
export default postSlice.reducer;