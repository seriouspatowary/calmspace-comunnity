import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userId: string | null;
  role: string | null;
  profileStatus: boolean;
  isComplete: boolean;
  loading: boolean;
  error: string | null;
  authStatus: "idle" | "loading" | "success" | "error";
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  userId: null,
  role: null,
  profileStatus: false,
  isComplete: false,
  loading: false,
  error: null,
  authStatus: "idle",
};

const loginUrl = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk<
  {
    authToken: string;
    user: string;
    role: string;
    profileStatus: boolean;
    isComplete: boolean;
  },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, thunkAPI) => {
  try {
    const response = await axios.post(`${loginUrl}/api/auth/login`, {
      email,
      password,
    });

    const data = response.data;

    localStorage.setItem("authToken", data.authToken);

    return {
      authToken: data.authToken,
      user: data.user,
      role: data.role,
      profileStatus: data.profileStatus,
      isComplete: data.isComplete,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("authToken");
      state.isLoggedIn = false;
      state.token = null;
      state.userId = null;
      state.role = null;
      state.profileStatus = false;
      state.isComplete = false;
      state.loading = false;
      state.error = null;
      state.authStatus = "idle";
    },
    loadTokenFromStorage: (state) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        state.token = token;
        state.isLoggedIn = true;
        state.authStatus = "success";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authStatus = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.authToken;
        state.userId = action.payload.user;
        state.role = action.payload.role;
        state.profileStatus = action.payload.profileStatus;
        state.isComplete = action.payload.isComplete;
        state.isLoggedIn = true;
        state.authStatus = "success";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.authStatus = "error";
      });
  },
});

export const { logout, loadTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;
