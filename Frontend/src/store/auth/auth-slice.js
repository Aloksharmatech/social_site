import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Send OTP
export const registerStepOne = createAsyncThunk(
    "auth/registerStepOne",
    async (email, thunkAPI) => {
        try {
            const res = await API.post("/auth/register", { email });
            return res.data.message;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to send OTP");
        }
    }
);

// Verify OTP and register
export const registerStepTwo = createAsyncThunk(
    "auth/registerStepTwo",
    async ({ email, otp, username, password }, thunkAPI) => {
        try {
            const res = await API.post("/auth/verify", { email, otp, username, password });
            return res.data.message;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, thunkAPI) => {
        try {
            const res = await API.post("/auth/login", { email, password });
            return res.data.existingUser;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

// Fetch current user (called on app load)
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, thunkAPI) => {
        try {
            const res = await API.get("/auth/me");
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Not authenticated");
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, thunkAPI) => {
        try {
            const res = await API.post("/auth/forgot-password", { email });
            return res.data.message;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to send OTP");
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ email, otp, newPassword }, thunkAPI) => {
        try {
            const res = await API.post("/auth/reset-password", { email, otp, newPassword });
            return res.data.message;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Reset failed");
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        const res = await API.post("/auth/logout");
        return res.data.message;
    } catch (err) {
        return thunkAPI.rejectWithValue("Logout failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        message: null,
        isBootstrapped: false,
    },
    reducers: {
        clearMessage: (state) => {
            state.message = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerStepOne.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerStepOne.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(registerStepOne.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerStepTwo.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerStepTwo.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(registerStepTwo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.isBootstrapped = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isBootstrapped = true;
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.isBootstrapped = true;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.isBootstrapped = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.message = action.payload;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.message = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.message = "Logged out";
                state.isBootstrapped = true;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isBootstrapped = true;
            });
    },
});

export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
