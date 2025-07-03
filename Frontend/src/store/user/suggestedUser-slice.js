import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Async thunk
export const fetchSuggestedUsers = createAsyncThunk(
    "users/fetchSuggested",
    async (_, thunkAPI) => {
        try {
            const res = await API.get("/user/suggested-user");
            return res.data.users;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to fetch suggestions");
        }
    }
);

const suggestedUsersSlice = createSlice({
    name: "suggestedUsers",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestedUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchSuggestedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default suggestedUsersSlice.reducer;
