import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    expenses: []
};

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        addExpense: (state, action) => {
            state.expenses = [...state.expenses, action.payload]
        },
        removeExpense: (state, action) => {
            state.expenses = state.expenses.filter(expense => expense._id !== action.payload)
        },
        updateExpense: (state, action) => {
            state.expenses = state.expenses.map(expense => (
                expense._id.toString() === action.payload._id.toString() ? (
                    {
                        ...expense,
                        amount: action.payload.amount,
                        description: action.payload.description,
                        category: action.payload.category,
                        createdFor: action.payload.createdFor,
                        receiptImage: action.payload.receiptImage,
                        date: action.payload.date
                    }
                ) : expense
            ))
        },
        setExpenses: (state, action) => {
            state.expenses = action.payload;
        }
    },
});

export const { addExpense, removeExpense, updateExpense, setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;