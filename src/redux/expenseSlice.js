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

export const getExpenses = createAsyncThunk(
    'expense/getExpenses',
    async (groupId, { getState, rejectWithValue }) => {
        const state = getState();

        // 🛑 GUARD: prevent duplicate fetch
        if (!groupId && state.expense.personalExpenses.length > 0) {
            return rejectWithValue('Personal expenses already fetched');
        }

        if (groupId && state.expense.groupExpenses[groupId]) {
            return rejectWithValue('Group expenses already fetched');
        }

        try {
            const url = groupId
                ? `http://localhost:3000/expense/getAllExpense/${groupId}`
                : `http://localhost:3000/expense/getAllExpense`;

            const response = await fetch(url, {
                method: 'GET',
                headers: { "Content-type": "application/json" },
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message);
                return rejectWithValue(result?.message);
            }

            return { groupId, data: result.expense };

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message || "Something went wrong");
        }
    }
);

export const addExpense = createAsyncThunk(
    'expense/addExpense',
    async ({ data, groupId }, { rejectWithValue }) => {
        try {
            const url = groupId
                ? `http://localhost:3000/expense/add/${groupId}`
                : `http://localhost:3000/expense/add`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message);
                return rejectWithValue(result?.message);
            }

            toast.success("Expense added!");
            return { expense: result.expense, groupId };

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);


export const editExpense = createAsyncThunk(
    'expense/editExpense',
    async ({ data, expenseId, isPersonal, groupId }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `http://localhost:3000/expense/edit/${expenseId}`,
                {
                    method: 'PATCH',
                    headers: { "Content-type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message);
                return rejectWithValue(result?.message);
            }

            toast.success("Expense updated!");
            return { expense: result.updatedExpense, isPersonal, groupId };

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);


export const deleteExpense = createAsyncThunk(
    'expense/deleteExpense',
    async ({ expenseId, isPersonal, groupId }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `http://localhost:3000/expense/delete/${expenseId}`,
                { method: 'DELETE', credentials: 'include' }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message);
                return rejectWithValue(result?.message);
            }

            toast.success("Expense deleted!");
            return { expenseId, isPersonal, groupId };

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);


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
                if (
                    action.payload === 'Personal expenses already fetched' ||
                    action.payload === 'Group expenses already fetched'
                ) return;
                state.error = action.payload
            })

            //addExpense
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.loading = false;
                const { expense, groupId } = action.payload;

                if (groupId) {
                    state.groupExpenses[groupId]?.push(expense);
                } else {
                    state.personalExpenses.push(expense);
                }

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
                const { expense, isPersonal, groupId } = action.payload;

                if (isPersonal) {
                    state.personalExpenses = state.personalExpenses.map(e =>
                        e._id === expense._id ? expense : e
                    );
                } else if (state.groupExpenses[groupId]) {
                    state.groupExpenses[groupId] = state.groupExpenses[groupId].map(e =>
                        e._id === expense._id ? expense : e
                    );
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
                const { expenseId, isPersonal, groupId } = action.payload;

                if (isPersonal) {
                    state.personalExpenses = state.personalExpenses.filter(e => e._id !== expenseId);
                } else if (state.groupExpenses[groupId]) {
                    state.groupExpenses[groupId] = state.groupExpenses[groupId].filter(
                        e => e._id !== expenseId
                    );
                }

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