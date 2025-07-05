import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";


export const fetchFollowings = createAsyncThunk(
    "user/fetchFollowing",
    async (userId, thunkAPI) => {
        try {
            const res = await API.get(`/user/following/${userId}`);
            return res.data.following;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch followers"
            );
        }
    }
);



const userFollowingSlice = createSlice({
    name: "userFollowing",
    initialState: {
        followings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowings.fulfilled, (state, action) => {
                state.loading = false;
                state.followings = action.payload;
            })
            .addCase(fetchFollowings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userFollowingSlice.reducer;