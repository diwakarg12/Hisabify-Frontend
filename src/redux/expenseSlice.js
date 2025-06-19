import { createSlice } from '@reduxjs/toolkit'
// import { createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    expenses: [],
    loading: false,
    error: null
}; 

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    extraReducers: (builder) => {
        builder

        //
        // addCase()

        // addExpense: (state, action) => {

        //     state.expenses = [...state.expenses, action.payload]
        // },
        //     removeExpense: (state, action) => {
        //         state.expenses = state.expenses.filter(expense => expense._id !== action.payload)
        //     },
        //         updateExpense: (state, action) => {
        //             state.expenses = state.expenses.map(expense => (
        //                 expense._id.toString() === action.payload._id.toString() && action.payload
        //             ))
        //         },
        //             setExpenses: (state, action) => {
        //                 state.expenses = action.payload;
        //             }
    },
});

export const { addExpense, removeExpense, updateExpense, setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;