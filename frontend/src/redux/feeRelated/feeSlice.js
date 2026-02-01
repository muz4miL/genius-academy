import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    feesList: [],
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
};

const feeSlice = createSlice({
    name: 'fee',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.loading = false;
            state.feesList = action.payload;
            state.response = null;
            state.error = null;
        },
        getFailed: (state, action) => {
            state.loading = false;
            state.response = action.payload;
            state.error = "Failed to fetch";
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "added";
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    stuffDone,
} = feeSlice.actions;

export const feeReducer = feeSlice.reducer;
