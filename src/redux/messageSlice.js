import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify'

const initialState = {
    messages: [],
    loading: false,
    error: null,
    isFetched: false,
};

export const sendMessage = createAsyncThunk("sendMessage", async (data, { rejectWithValue }) => {
    try {

        const response = await fetch("https://hisabify-api.vercel.app/message/send", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const result = await response?.json();

        if (!response.ok) {
            toast.error(result?.message)
            return rejectWithValue(result);
        }
        toast.success("Message sent !")

        return result;

    } catch (error) {
        toast.error(error?.message)
        return rejectWithValue(error?.messages)
    }
});


export const deleteMessage = createAsyncThunk("deleteMessage", async (id, { rejectWithValue }) => {
    try {

        const response = await fetch(`https://hisabify-api.vercel.app/message/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
            credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result);
        }

        toast.success("Message deleted!");
        return { messageId: id };

    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.messages);
    }
});

export const getAllMessage = createAsyncThunk(
    "message/getAllMessages",
    async (_, { getState, rejectWithValue }) => {
        const state = getState();

        // 🛑 Prevent unnecessary fetch
        if (state.message.isFetched) {
            return rejectWithValue("Messages already fetched");
        }

        try {
            const response = await fetch("https://hisabify-api.vercel.app/message/getAll", {
                method: "GET",
                headers: { "Content-type": "application/json" },
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message);
                return rejectWithValue(result?.message);
            }

            return result;

        } catch (error) {
            toast.error(error.message);
            return rejectWithValue(error.message);
        }
    }
);

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
                state.loading = false;
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
                state.loading = false
                state.error = action.payload
            })

            // deleteMessage
            .addCase(deleteMessage.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.loading = false
                state.messages = state.messages.filter(
                    (msg) => msg._id !== action.payload.messageId
                );
                state.error = null
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },

});

export default messageSlice.reducer;