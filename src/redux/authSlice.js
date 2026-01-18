import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify'

const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
};

export const register = createAsyncThunk('create', async (user, { rejectWithValue }) => {

    try {
        const response = await fetch('https://hisabify-api.vercel.app/auth/signup', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include'
        });
        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message);
        }
        toast.success("Signup Successful !")
        return result;

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error?.message);
    }
})

export const login = createAsyncThunk('login', async (user, { rejectWithValue }) => {
    try {
        const response = await fetch('https://hisabify-api.vercel.app/auth/login',
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

        if (!response.ok) {
            return rejectWithValue(result?.message);
        }

        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
})

export const logout = createAsyncThunk('logout', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await fetch('https://hisabify-api.vercel.app/auth/logout', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include'
        });
        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result?.message);
        }

        dispatch(resetAuth());

        return result
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const checkAuth = createAsyncThunk('checkAuth', async (_, { getState, rejectWithValue }) => {

    const state = getState();
    if (state?.auth?.isAuthenticated && state?.auth?.user) {
        return { alreadyChecked: true };
    }
    try {
        const response = await fetch('https://hisabify-api.vercel.app/auth/check', {
            method: 'GET',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include'
        });
        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result?.message || "UnAuthorized");
        }

        return result;
    } catch (error) {
        return rejectWithValue(error.message || "Network error");
    }
});

export const updateProfile = createAsyncThunk('updateProfile', async (data, { rejectWithValue }) => {
    try {

        const response = await fetch('https://hisabify-api.vercel.app/profile/update', {
            method: 'PATCH',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result?.message);
        }

        return result;

    } catch (error) {
        return rejectWithValue(error.message || 'Server unreachable or CORS blocked');
    }
});

export const updatePhone = createAsyncThunk('updatePhone', async (phone, { rejectWithValue }) => {
    try {

        const response = await fetch('https://hisabify-api.vercel.app/profile/update-phone', {
            method: 'PATCH',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(phone)
        });
        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result?.message);
        }

        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateEmail = createAsyncThunk('updateEmail', async (email, { rejectWithValue }) => {
    try {

        const response = await fetch('https://hisabify-api.vercel.app/profile/update-email', {
            method: 'PATCH',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result?.message);
        }

        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteProfile = createAsyncThunk('deleteProfile', async (_, { rejectWithValue }) => {
    try {

        const response = await fetch(`https://hisabify-api.vercel.app/profile/delete`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include'
        });
        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result?.message);
        }

        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
})


const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        resetAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = false;
        },
    },
    extraReducers: (builder) => {
        builder
            //Register
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
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
                state.user = action.payload.user;
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
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
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
                if (action?.payload?.alreadyChecked) return
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            //update-profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload;
            })

            //update-email
            .addCase(updateEmail.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(updateEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //update-phone
            .addCase(updatePhone.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePhone.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(updatePhone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //delete-profile
            .addCase(deleteProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;