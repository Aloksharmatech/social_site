import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Thunk to create a Pick Request
export const createPickRequest = createAsyncThunk(
    "pickRequest/create",
    async (pickData, { rejectWithValue }) => {
        try {
            const response = await API.post("/pickrequest/", pickData);
            return response.data.pickRequest;
        } catch (err) {
            console.error("Pick request failed:", err.response?.data || err.message);
            return rejectWithValue(
                err.response?.data?.message || "Failed to create pick request"
            );
        }
    }
);

// Pick Request Slice
const pickRequestSlice = createSlice({
    name: "pickRequest",
    initialState: {
        pickRequest: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearPickRequestState: (state) => {
            state.pickRequest = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPickRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPickRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.pickRequest = action.payload;
                state.success = true;
            })
            .addCase(createPickRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearPickRequestState } = pickRequestSlice.actions;
export default pickRequestSlice.reducer;
