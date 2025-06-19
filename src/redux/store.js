import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import groupReducer from './groupSlice';
import expenseReducer from './expenseSlice';
import splitReducer from './splitSlice';
import counterReducer from './counterSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        group: groupReducer,
        expense: expenseReducer,
        split: splitReducer,
        count: counterReducer,
    },

});
