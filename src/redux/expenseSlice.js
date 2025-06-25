import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    groupExpenses: [],
    personalExpenses: [],
    toggleExpenseForm: false,
    loading: false,
    error: null
};

export const getGroupExpense = createAsyncThunk('getGroupExpense', async (groupId, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/getAllExpense/${groupId}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            },
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getPersonalExpense = createAsyncThunk('getPersonalExpense', async ({ rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/getAllExpense`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            },
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
})

export const addPersonalExpense = createAsyncThunk('addPersonalExpense', async (data, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/add`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
});

export const addGroupExpense = createAsyncThunk('addGroupExpense', async ({ data, groupId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/add/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
});

export const editExpense = createAsyncThunk('editExpense', async ({ data, expenseId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/edit/${expenseId}`, {
            method: 'PATCH',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
});

export const deleteExpense = createAsyncThunk('deleteExpense', async (expenseId, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/expense/delete/${expenseId}`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json",
            },
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
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
            //getGroupExpense
            .addCase(getGroupExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGroupExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.groupExpenses = action.payload;
                state.error = null;
            })
            .addCase(getGroupExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            //getPersonalExpense
            .addCase(getPersonalExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPersonalExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.personalExpenses = action.payload;
                state.error = null;
            })
            .addCase(getPersonalExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //addGroupExpense
            .addCase(addGroupExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(addGroupExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.groupExpenses.push(action.payload);
                state.error = null;
            })
            .addCase(addGroupExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //addPersonalExpense
            .addCase(addPersonalExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(addPersonalExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.personalExpenses.push(action.payload);
                state.error = null;
            })
            .addCase(addPersonalExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //editExpense
            .addCase(editExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(editExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.groupExpenses = state.groupExpenses.map(expense => (
                    expense._id === action.payload._id ? action.payload : expense
                ))
                state.personalExpenses = state.personalExpenses.map(expense => (
                    expense._id === action.payload._id ? action.payload : expense
                ))
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
                state.groupExpenses = state.groupExpenses.filter(expense => expense._id !== action.payload._id)
                state.personalExpenses = state.personalExpenses.filter(expense => expense._id !== action.payload._id)
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