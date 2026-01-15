import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    sentRequest: [],
    receivedRequest: [],
    receivedFetched: false,
    sentFetchedByGroup: {},
    loading: false,
    error: null
};

/* ================= GET RECEIVED REQUESTS ================= */
export const getReceivedRequests = createAsyncThunk('getReceivedRequests', async (_, { getState, rejectWithValue }) => {

    const state = getState();

    if (state.request.receivedFetched) {
        return rejectWithValue("Received requests already fetched");
    }
    try {

        const response = await fetch(`http://localhost:3000/invite/view/received-request`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            },
            credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message);
        }
        return result;

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error?.message);
    }
});

/* ================= GET SENT REQUESTS ================= */
export const getSentRequests = createAsyncThunk('getSentRequests', async (groupId, { getState, rejectWithValue }) => {

    const state = getState();

    if (state.request.sentFetchedByGroup[groupId]) {
        return rejectWithValue("Sent requests already fetched");
    }

    try {

        const response = await fetch(`http://localhost:3000/invite/view/sent-request/${groupId}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            },
            credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message);
        }
        return { groupId, sentInvitations: result.sentInvitations };

    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
})

/* ================= REVIEW RECEIVED REQUEST ================= */
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

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message);
        }

        toast.success(`Invitation ${status}`);
        return result;

    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
});

/* ================= SEND INVITATION ================= */
export const sendInvitation = createAsyncThunk('sendInvitation', async ({ groupId, invitedTo }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/invite/send/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ invitedTo }),
            credentials: 'include'
        });

        const result = await response.json();
        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message);
        }

        toast.success("Invitation sent");
        return result.invitation;
    } catch (error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
    }
})

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        clearRequests: (state) => {
            state.sentRequest = [];
            state.receivedRequest = [];
            state.sentFetchedByGroup = {};
            state.receivedFetched = false;
            state.loading = false;
            state.error = null;
        },
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
                state.receivedFetched = true;
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
                state.receivedRequest = state.receivedRequest.filter(
                    (req) => req._id !== action.payload.requestId
                );
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
                state.sentFetchedByGroup[action.payload.groupId] = true;
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
                state.sentRequest.push(action.payload);
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