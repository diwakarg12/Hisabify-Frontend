import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import groupSlice from './groupSlice';
import expenseSlice from './expenseSlice';
import splitSlice from './splitSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        group: groupSlice,
        expense: expenseSlice,
        split: splitSlice,
    },

});
