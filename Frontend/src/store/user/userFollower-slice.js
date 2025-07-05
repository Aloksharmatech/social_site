import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";


export const fetchFollowers = createAsyncThunk(
    "user/fetchFollowers",
    async (userId, thunkAPI) => {
        try {
            const res = await API.get(`/user/followers/${userId}`);
            return res.data.followers;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch followers"
            );
        }
    }
);
  


const userFollowerSlice = createSlice({
    name: "userFollower",
    initialState: {
        followers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                state.loading = false;
                state.followers = action.payload;
            })
            .addCase(fetchFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userFollowerSlice.reducer;