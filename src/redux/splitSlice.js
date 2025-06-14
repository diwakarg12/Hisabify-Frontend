import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    splits: []
};

const splitSlice = createSlice({
    name: 'split',
    initialState,
    reducers: {
        addSplit: (state, action) => {
            state.splits = [...state.splits, action.payload]
        },
        removeSplit: (state, action) => {
            state.splits = state.splits.filter(split => split._id.toString() !== action.payload._id.toString());
        },
        getSplits: (state, action) => {
            state.splits = action.payload;
        }
    },
});

export const { addSplit, removeSplit, getSplits } = splitSlice.actions;
export default splitSlice.reducer;