import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
    personalExpenses: [],
    groupExpenses: {},
    toggleExpenseForm: false,
    loading: false,
    error: null
};

export const getExpenses = createAsyncThunk('getExpenses', async (groupId, { rejectWithValue }) => {
    try {

        const url = groupId
            ? `http://localhost:3000/expense/getAllExpense/${groupId}`
            : `http://localhost:3000/expense/getAllExpense`;


        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include"
        });
        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result.message || "Failed to add expense");
        }

        return { groupId, data: result.expense };

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error?.message || "Something went wrong. Please try again.")
    }
});

export const addExpense = createAsyncThunk('addGroupExpense', async ({ data, groupId }, { rejectWithValue }) => {
    try {

        const url = groupId
            ? `http://localhost:3000/expense/add/${groupId}`
            : `http://localhost:3000/expense/add`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result.message || "Failed to add expense");
        }

        toast.success("Expense Added !");

        return result;

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error?.message || "Something went wrong. Please try again.")
    }
});

export const editExpense = createAsyncThunk('editExpense', async ({ data, expenseId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/edit/${expenseId}`, {
            method: 'PATCH',
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result.message || "Falied to edit Expense")
        }
        toast.success("Expense updated !");
        return result;

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error?.message || "Something went wrong. Please try again.")
    }
});

export const deleteExpense = createAsyncThunk('deleteExpense', async ({ expenseId, isPersonal, groupId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/delete/${expenseId}`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include"
        });
        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result.message || "Failed to add expense");
        }

        toast.success("Expense Deleted !");

        return { expenseId, isPersonal, groupId };

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error?.message || "Something went wrong. Please try again.")
    }
})

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        toggleExpenseForm: (state) => {
            state.toggleExpenseForm = !state.toggleExpenseForm;
        }
    },
    extraReducers: (builder) => {
        builder
            //getExpense
            .addCase(getExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const { groupId, data } = action.payload;
                if (groupId) {
                    state.groupExpenses[groupId] = data;
                } else {
                    state.personalExpenses = data
                }
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            //addExpense
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses.push(action.payload.expense);
                state.error = null;
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //editExpense
            .addCase(editExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(editExpense.fulfilled, (state, action) => {
                state.loading = false;
                const { expenseId, isPersonal, groupId } = action.payload;
                if (isPersonal) {
                    state.personalExpenses = state.personalExpenses.filter(exp => exp?._id !== expenseId);
                } else {
                    if (state.groupExpenses[groupId]) {
                        state.groupExpenses[groupId] = state.groupExpenses[groupId].filter(exp => exp?._id !== expenseId)
                    }
                }
                state.error = null;
            })
            .addCase(editExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //deleteExpense
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = state.expenses.filter((expense) => expense?._id !== action.payload.expenseId)
                state.error = null;
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { toggleExpenseForm } = expenseSlice.actions;
export default expenseSlice.reducer;