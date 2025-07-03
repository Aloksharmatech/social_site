// store/user/follow-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Thunk to follow or unfollow a user
export const followOrUnfollow = createAsyncThunk(
    "user/followOrUnfollow",
    async (targetUserId, thunkAPI) => {
        try {
            const res = await API.post(`/user/follow/${targetUserId}`);
            return res.data.message; 
        } catch (err) {
            console.error("Error in follow/unfollow:", err);
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to follow/unfollow user"
            );
        }
    }
);

const followSlice = createSlice({
    name: "follow",
    initialState: {
        message: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearFollowMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(followOrUnfollow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(followOrUnfollow.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(followOrUnfollow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearFollowMessage } = followSlice.actions;
export default followSlice.reducer;
