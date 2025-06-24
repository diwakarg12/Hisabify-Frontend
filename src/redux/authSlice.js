import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    error: null
};

export const register = createAsyncThunk('create', async (user, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                "Content-type": "Application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include'
        });
        const result = await response.json();
        return result;

    } catch (error) {
        rejectWithValue(error);
    }
})

export const login = createAsyncThunk('login', async (user, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/login',
            {
                method: 'POST',
                headers: {
                    "Content-type": "Application/json"
                },
                body: JSON.stringify(user),
                credentials: 'include'
            },
        );
        const result = await response.json();
        return result;

        

    } catch (error) {
        rejectWithValue(error);
    }
})

export const logout = createAsyncThunk('logout', async (_,{ rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
                "Content-type": "Application/json"
            },
            credentials: 'include'
        });
        const result = await response.json();
        return result
    } catch (error) {
        rejectWithValue(error);
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            //Register
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //Login
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //Logout
            .addCase(logout.pending, (state) => {
                state.loading = true
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default authSlice.reducer;