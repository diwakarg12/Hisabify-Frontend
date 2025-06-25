import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
};

export const register = createAsyncThunk('create', async (user, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include'
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
})

export const login = createAsyncThunk('login', async (user, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/login',
            {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(user),
                credentials: 'include'
            },
        );
        const result = await response.json();
        return result;

        

    } catch (error) {
        return rejectWithValue(error);
    }
})

export const logout = createAsyncThunk('logout', async (_,{ rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include'
        });
        const result = await response.json();
        return result
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const checkAuth = createAsyncThunk('checkAuth', async (_, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:3000/auth/check', {
            method: 'GET',
            credentials: 'include'  // important to send cookies
        });
        const result = await response.json();
        
        if (!response.ok) {
            return rejectWithValue(result);
        }

        return result;
    } catch (error) {
        return rejectWithValue(error.message || "Network error");
    }
});


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
                state.isAuthenticated = true;
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
                state.isAuthenticated = true;
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
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //check auth 
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = action.payload.authenticated;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
    }
});

export default authSlice.reducer;