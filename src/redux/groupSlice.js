import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    groups: [],
    isAddGroupFormOpen: false,
    loading: false,
    error: null
}

export const searchUser = createAsyncThunk(
    'searchuser',
    async (email, { rejectWithValue }) => {
        if (!email) {
            return rejectWithValue("Email is required");
        }

        try {
            const response = await fetch(
                `http://localhost:3000/group/searchUser/${email}`,
                {
                    method: 'GET',
                    headers: { "Content-type": "application/json" },
                    credentials: 'include',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message);
                return rejectWithValue(result?.message);
            }

            toast.success("User Found");
            return result;

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);


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

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message);
        }
        toast.success("Group Created !");
        return result;

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error);
    }
});

export const updateGroup = createAsyncThunk('updateGroup', async ({ data, groupId }, { rejectWithValue }) => {
    try {

        const response = await fetch(`http://localhost:3000/group/update/${groupId}`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message)
        }
        toast.success("Group Updated !");
        return result;

    } catch (error) {
        toast.error(error?.message);
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
        if (!response.ok) {
            toast.error(result?.message);
            return rejectWithValue(result?.message);
        }
        toast.success("User removed");
        return result;

    } catch (error) {
        toast.error(error?.message);
        return rejectWithValue(error)
    }
});

export const deleteGroup = createAsyncThunk(
    'deleteGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `http://localhost:3000/group/delete/${groupId}`,
                {
                    method: 'DELETE',
                    headers: { "Content-type": "application/json" },
                    credentials: 'include',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message);
                return rejectWithValue(result?.message);
            }

            toast.success(result?.message);

            return { groupId };

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);


export const getAllGroup = createAsyncThunk(
    'getAllGroup',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();

        if (state.group.groups.length > 0) {
            return rejectWithValue("Groups already fetched");
        }

        try {
            const response = await fetch(`http://localhost:3000/group/view`, {
                method: 'GET',
                headers: { "Content-type": "application/json" },
                credentials: 'include',
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
    }
);


const groupSlice = createSlice({
    name: 'Group',
    initialState,
    reducers: {
        toggleAddGroupForm: (state) => {
            state.isAddGroupFormOpen = !state.isAddGroupFormOpen
        },
        resetSearchUsers: (state) => {
            state.users = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //getAllGroup
            .addCase(getAllGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload.groups;
                state.error = null;
            })
            .addCase(getAllGroup.rejected, (state, action) => {
                state.loading = false;
                if (action.payload === "Groups already fetched") return;
                state.error = action.payload;
            })

            //createGroup
            .addCase(createGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups.push(action.payload.group);
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
                state.groups = state.groups.map(group => group._id.toString() === action.payload.group._id.toString() ? action.payload.group : group);
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
                state.loading = false;
                const { groupId, userId } = action.payload;

                state.groups = state.groups.map(group =>
                    group._id === groupId
                        ? {
                            ...group,
                            members: group.members.filter(user => user._id !== userId),
                        }
                        : group
                );

                state.error = null;
            })


            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //DeleteGroup
            .addCase(deleteGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = state.groups.filter(
                    group => group._id !== action.payload.groupId
                );
                state.error = null;
            })

            .addCase(deleteGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    }
});

export const { toggleAddGroupForm, resetSearchUsers } = groupSlice.actions;
export default groupSlice.reducer;