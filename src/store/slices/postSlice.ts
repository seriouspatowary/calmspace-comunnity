// src/redux/slices/postSlice.ts

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
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

const apiUrl = "http://localhost:4000";

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

// 📥 Fetch All Posts
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

// 🧩 Slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // You can add clearPosts, updatePost etc. here
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
      });
  },
});

export default postSlice.reducer;
