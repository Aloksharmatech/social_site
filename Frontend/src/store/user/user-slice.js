// store/user/user-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Thunk to fetch another user's profile
export const getProfile = createAsyncThunk(
    "user/getProfile",
    async (userId, thunkAPI) => {
        try {
            const res = await API.get(`/user/profile/${userId}`);
            return res.data.user;
        } catch (err) {
            console.error("Error fetching profile:", err);
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch user profile"
            );
        }
    }
);

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: {
        profileUser: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profileUser = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userProfileSlice.reducer;
