import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";


export const deletePickRequest = createAsyncThunk(
    "pickRequest/deletePickRequest",
    async (pickRequestId, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/pickRequest/${pickRequestId}`);
            return response.data;
        } catch (err) {
            console.error("Error deleting pick request:", err);
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete pick request"
            );
        }
    }
);




const deletePickRequestSlice = createSlice({
    name: "deletePickRequest",
    initialState: {
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearPickRequestState: (state) => {
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deletePickRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePickRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(deletePickRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPickRequestState } = deletePickRequestSlice.actions;
export default deletePickRequestSlice.reducer;
