import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    user: null,
    isLoggedIN: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state , action) => {
            state.user = action.payload;
            state.isLoggedIN = true;
        },
        logout:(state) =>{
            state.user = null;
            state.isLoggedIN = false;
        }
    }
});

export const { login, logout} = authSlice.actions;
export default authSlice.reducer;