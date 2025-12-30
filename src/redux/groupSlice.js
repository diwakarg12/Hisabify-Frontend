import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    groups: [],
    isAddGroupFormOpen: false,
    loading: false,
    error: null
}


export const createGroup = createAsyncThunk('createGroup', async (data, { rejectWithValue }) => {
    try {

        const response = await fetch('http://localhost:3000/group/create', {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateGroup = createAsyncThunk('updateGroup', async ({ data, groupId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/group/update/${groupId}`, {
            method: 'PORT',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
});

export const removeUser = createAsyncThunk('removeUser', async ({ groupId, userId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/group/remove-user/${groupId}/${userId}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
        });

        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
});

export const deleteGroup = createAsyncThunk('deleteGroup', async (groupId, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/group/delete/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error)
    }
});

export const getAllGroup = createAsyncThunk('getAllGroup', async (_, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/group/view`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
            },
            credentials: 'include',
        });

        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
})

const groupSlice = createSlice({
    name: 'Group',
    initialState,
    reducers: {
        toggleAddGroupForm: (state) => {
            state.isAddGroupFormOpen = !state.isAddGroupFormOpen
        }
    },
    extraReducers: (builder) => {
        builder
            //getAllGroup
            .addCase(getAllGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
                state.error = null;
            })
            .addCase(getAllGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //createGroup
            .addCase(createGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = true;
                state.groups.push(action.payload);
                state.error = null;
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //updateGroup
            .addCase(updateGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = state.groups.map(group => group._id.toString() === action.payload._id.toString() ? action.payload : group);
                state.error = null;
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //removeUserFromGroup
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.pending = false;
                state.groups = state.groups.map(group => {
                    if (group.members.some(user => user._id === action.payload)) {
                        return {
                            ...group,
                            members: group.members.filter(user => user._id !== action.payload)
                        };
                    };
                });
                state.error = null;
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //removeGroup
            .addCase(deleteGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = state.groups.filter(group => group._id.toString() !== action.payload.toString());
                state.error = null;
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { toggleAddGroupForm } = groupSlice.actions;
export default groupSlice.reducer;