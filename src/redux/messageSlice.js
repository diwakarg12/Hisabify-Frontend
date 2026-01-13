import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify'

const initialState = {
    messages: [],
    loading: false,
    error: null
};

export const sendMessage = createAsyncThunk("sendMessage", async (data, { rejectWithValue }) => {
    try {

        const response = await fetch("http://localhost:3000/message/send", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message)
            return rejectWithValue(result);
        }
        toast.success("Message sent !")

        return result;

    } catch (error) {
        toast.error(error?.message)
        return rejectWithValue(error.messages)
    }
});


export const deleteMessage = createAsyncThunk("deleteMessage", async (id, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/message/delete/${id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result);
        }

        return result;

    } catch (error) {
        return rejectWithValue(error.messages);
    }
});

export const getAllMessage = createAsyncThunk("getAllMessages", async ({ rejectWithValue }) => {
    try {

        const response = await fetch("http://localhost:3000/message/getAll", {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            },
            credentials: "include"
        });

        const result = await response.json();

        if (!response.ok) {
            return rejectWithValue(result)
        }

        return result;

    } catch (error) {
        return rejectWithValue(error.messages);
    }
});

const messageSlice = createSlice({
    name: "Message",
    initialState,
    extraReducers: (builder) => {
        builder
            // getAllMessages
            .addCase(getAllMessage.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages = action.payload.messages
                state.error = null
            })
            .addCase(getAllMessage.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })

            // sendMessage
            .addCase(sendMessage.pending, (state) => {
                state.loading = true
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages = [...state.messages, action.payload.message]
                state.error = null
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = true
                state.error = action.payload
            })

            // deleteMessage
            .addCase(deleteMessage.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages = state.messages.filter(message => message?._id !== action?.payload?.message?._id)
                state.error = null
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },

});

export default messageSlice.reducer;