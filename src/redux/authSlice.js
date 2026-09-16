import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import { API_BASE_URL, getAuthHeaders } from "../config/Api";

const initialState = {
    user: null,
    authLoading: true,
    error: null,
    isAuthenticated: false
};

export const register = createAsyncThunk('create', async (user, { rejectWithValue }) => {

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(user),
            credentials: 'include'
        });
        const result = await response.json();

        if (!response.ok) {
            const errorMsg = result?.message || result?.error || "Registration failed";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }
        if (result?.token) {
            localStorage.setItem('token', result.token);
        }
        toast.success("Signup Successful!");
        return result;

    } catch (error) {
        const errorMsg = error?.message || "Server error";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
    }
})

export const login = createAsyncThunk('login', async (user, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(user),
                credentials: 'include'
            },
        );
        const result = await response.json();

        if (!response.ok) {
            const errorMsg = result?.message || result?.error || "Login failed";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }
        if (result?.token) {
            localStorage.setItem('token', result.token);
        }

        toast.success("Login Successful!");
        return result;

    } catch (error) {
        const errorMsg = error?.message || "Server error";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
    }
})

export const sendResetOtp = createAsyncThunk(
    'sendResetOtp',
    async (email, { rejectWithValue }) => {
        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/send-reset-otp`,
                {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ email })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result?.message || result?.error || "Failed to send OTP";
                toast.error(errorMsg);
                return rejectWithValue(errorMsg);
            }

            toast.success("Reset OTP sent to your email!");
            return result;

        } catch (error) {
            const errorMsg = error?.message || "Server error";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const verifyResetOtp = createAsyncThunk(
    'verifyResetOtp',
    async (data, { rejectWithValue }) => {
        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/verify-reset-otp`,
                {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result?.message || result?.error || "OTP verification failed";
                toast.error(errorMsg);
                return rejectWithValue(errorMsg);
            }

            toast.success("Password reset successful!");
            return result;

        } catch (error) {
            const errorMsg = error?.message || "Server error";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const logout = createAsyncThunk('logout', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include'
        });
        const result = await response.json();

        if (!response.ok) {
            const errorMsg = result?.message || result?.error || "Logout failed";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }

        localStorage.removeItem('token');
        dispatch(resetAuth());
        toast.success("Logged out successfully!");
        return result;
    } catch (error) {
        localStorage.removeItem('token');
        const errorMsg = error?.message || "Server error";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
    }
})

export const checkAuth = createAsyncThunk('checkAuth', async (_, { getState, rejectWithValue }) => {

    const state = getState();
    if (state?.auth?.isAuthenticated && state?.auth?.user) {
        return { alreadyChecked: true };
    }
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include'
        });
        const result = await response.json();

        if (!response.ok) {
            localStorage.removeItem('token');
            return rejectWithValue(result?.message || "Unauthorized");
        }

        return result;
    } catch (error) {
        return rejectWithValue(error.message || "Network error");
    }
});

export const updateProfile = createAsyncThunk('updateProfile', async (data, { rejectWithValue }) => {
    try {

        const response = await fetch(`${API_BASE_URL}/profile/update`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) {
            const errorMsg = result?.message || result?.error || "Failed to update profile";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }

        toast.success("Profile updated successfully!");
        return result;

    } catch (error) {
        const errorMsg = error.message || 'Server unreachable or CORS blocked';
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
    }
});

export const updatePhone = createAsyncThunk('updatePhone', async (phone, { rejectWithValue }) => {
    try {

        const response = await fetch(`${API_BASE_URL}/profile/update-phone`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify({ phone })
        });
        const result = await response.json();

        if (!response.ok) {
            const errorMsg = result?.message || result?.error || "Failed to update phone number";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }

        toast.success("Phone number updated successfully!");
        return result;

    } catch (error) {
        const errorMsg = error?.message || "Failed to update phone number";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
    }
});

export const updateEmail = createAsyncThunk('updateEmail', async (email, { rejectWithValue }) => {
    try {

        const response = await fetch(`${API_BASE_URL}/profile/update-email`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        const result = await response.json();

        if (!response.ok) {
            const errorMsg = result?.message || result?.error || "Failed to update email address";
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }

        toast.success("Email address updated successfully!");
        return result;

    } catch (error) {
        const errorMsg = error?.message || "Failed to update email address";
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
    }
});

export const deleteProfile = createAsyncThunk('deleteProfile', async (_, { rejectWithValue }) => {
    try {

        const response = await fetch(`${API_BASE_URL}/profile/delete`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
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
            localStorage.removeItem('token');
            state.user = null;
            state.isAuthenticated = false;
            state.authLoading = false;
            state.error = false;
        },
    },
    extraReducers: (builder) => {
        builder
            //Register
            .addCase(register.pending, (state) => {
                state.authLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload.user;
                state.error = null;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
            })

            //Login
            .addCase(login.pending, (state) => {
                state.authLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload.user;
                state.error = null;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
            })

            //Logout
            .addCase(logout.pending, (state) => {
                state.authLoading = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.authLoading = false;
                state.user = null;
                state.error = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
            })

            //checkAuth 
            .addCase(checkAuth.pending, (state) => {
                if (!state?.isAuthenticated) {
                    state.authLoading = true;
                }
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.authLoading = false;
                if (action?.payload?.alreadyChecked) return
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.authLoading = false;
                state.user = null;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            //update-profile
            .addCase(updateProfile.pending, (state) => {
                state.authLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.authLoading = true;
                state.error = action.payload;
            })

            //update-email
            .addCase(updateEmail.pending, (state) => {
                state.authLoading = true;
            })
            .addCase(updateEmail.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(updateEmail.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
            })

            //update-phone
            .addCase(updatePhone.pending, (state) => {
                state.authLoading = true;
            })
            .addCase(updatePhone.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(updatePhone.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
            })

            //delete-profile
            .addCase(deleteProfile.pending, (state) => {
                state.authLoading = true;
            })
            .addCase(deleteProfile.fulfilled, (state, action) => {
                state.authLoading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
            })
    }
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;