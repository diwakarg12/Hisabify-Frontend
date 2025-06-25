import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    sentRequest: [],
    receivedRequest: [],
    loading: false,
    error: null
};

export const getReceivedRequests = createAsyncThunk('getReceivedRequests', async (_, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/invite/view/received-request`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            }
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getSentRequests = createAsyncThunk('getSentRequests', async (groupId, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/invite/view/sent-request/${groupId}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            },
            credentials: 'include'
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
})

export const reviewReceivedRequest = createAsyncThunk('reviewReceivedRequest', async ({ status, requestId, groupId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/invite/review/${status}/${requestId}/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            credentials: 'include'
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
});

export const sendInvitation = createAsyncThunk('sendInvitation', async ({ groupId, invitedTo }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/invite/send/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(invitedTo),
            credentials: 'include'
        });

        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
})

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        clearRequests: (state) => {
            state.sentRequest = [];
            state.receivedRequest = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder

            //receivedRequests
            .addCase(getReceivedRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getReceivedRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.receivedRequest = action.payload.receivedInvitations;
                state.error = null;
            })
            .addCase(getReceivedRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //actionOnReceivedRequest
            .addCase(reviewReceivedRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(reviewReceivedRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.receivedRequest = state.receivedRequest.filter(request => request._id.toString() !== action.meta.arg.requestId.toString());
                state.error = null;
            })
            .addCase(reviewReceivedRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //getSentRequests
            .addCase(getSentRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSentRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.sentRequest = action.payload.sentInvitations;
                state.error = null;
            })
            .addCase(getSentRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //sendInvitation
            .addCase(sendInvitation.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendInvitation.fulfilled, (state, action) => {
                state.loading = false;
                state.sendInvitation = state.sentRequest.push(action.payload.invitation)
                state.error = null;
            })
            .addCase(sendInvitation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearRequests } = requestSlice.actions;

export default requestSlice.reducer;