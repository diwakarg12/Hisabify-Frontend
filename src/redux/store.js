import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import groupReducer from './groupSlice';
import expenseReducer from './expenseSlice';
import splitReducer from './splitSlice';
import requestReducer from './requestSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        group: groupReducer,
        expense: expenseReducer,
        request: requestReducer,
        split: splitReducer,
    },

});
