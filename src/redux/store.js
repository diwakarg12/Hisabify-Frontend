import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import groupReducer from './groupSlice';
import expenseReducer from './expenseSlice';
import requestReducer from './requestSlice';
import messageReducer from './messageSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        group: groupReducer,
        expense: expenseReducer,
        request: requestReducer,
        message: messageReducer
    },

});
