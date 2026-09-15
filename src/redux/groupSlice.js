import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/Api";

const initialState = {
    groups: [],
    isAddGroupFormOpen: false,
    groupLoading: false,
    error: null
}

export const searchUser = createAsyncThunk(
    'searchuser',
    async (query, { rejectWithValue }) => {
        if (!query || !query.trim()) {
            return rejectWithValue("Search query is required");
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/group/searchUser/${encodeURIComponent(query.trim())}`,
                {
                    method: 'GET',
                    headers: { "Content-type": "application/json" },
                    credentials: 'include',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message || "Search failed");
                return rejectWithValue(result?.message);
            }

            return result;

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);


export const createGroup = createAsyncThunk('createGroup', async (data, { rejectWithValue }) => {
    try {

        const response = await fetch(`${API_BASE_URL}/group/create`, {
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

        const response = await fetch(`${API_BASE_URL}/group/update/${groupId}`, {
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

        const response = await fetch(`${API_BASE_URL}/group/remove-user/${groupId}/${userId}`, {
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

export const removeDummyUser = createAsyncThunk(
    'removeDummyUser',
    async ({ groupId, dummyId }, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/group/remove-dummy/${groupId}/${dummyId}`,
                {
                    method: 'DELETE',
                    headers: { "Content-type": "application/json" },
                    credentials: 'include',
                }
            );

            const result = await response.json();
            if (!response.ok) {
                toast.error(result?.message || "Failed to remove dummy user");
                return rejectWithValue(result?.message);
            }
            toast.success("Dummy user removed");
            return { groupId, dummyId, dummyMembers: result.dummyMembers };
        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'deleteGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/group/delete/${groupId}`,
                {
                    method: 'DELETE',
                    headers: { "Content-type": "application/json" },
                    credentials: 'include',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message || "Failed to delete group");
                return rejectWithValue(result?.message);
            }

            toast.success(result?.message || "Group deleted successfully");

            return { groupId };

        } catch (error) {
            toast.error(error?.message);
            return rejectWithValue(error?.message);
        }
    }
);


export const getAllGroup = createAsyncThunk(
    'getAllGroup',
    async (_, { rejectWithValue }) => {
        // const state = getState();

        // if (state.group.groups.length > 0) {
        //     return rejectWithValue("Groups already fetched");
        // }

        try {
            const response = await fetch(`${API_BASE_URL}/group/view`, {
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
            state.groupLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //getAllGroup
            .addCase(getAllGroup.pending, (state) => {
                state.groupLoading = true;
            })
            .addCase(getAllGroup.fulfilled, (state, action) => {
                state.groupLoading = false;
                state.groups = action.payload.groups;
                state.error = null;
            })
            .addCase(getAllGroup.rejected, (state, action) => {
                state.groupLoading = false;
                if (action.payload === "Groups already fetched") return;
                state.error = action.payload;
            })

            //createGroup
            .addCase(createGroup.pending, (state) => {
                state.groupLoading = true;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.groupLoading = false;
                state.groups.push(action.payload.group);
                state.error = null;
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.groupLoading = false;
                state.error = action.payload;
            })

            //updateGroup
            .addCase(updateGroup.pending, (state) => {
                state.groupLoading = true;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.groupLoading = false;
                state.groups = state.groups.map(group => group._id.toString() === action.payload.group._id.toString() ? action.payload.group : group);
                state.error = null;
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.groupLoading = false;
                state.error = action.payload;
            })

            //removeUserFromGroup
            .addCase(removeUser.pending, (state) => {
                state.groupLoading = true;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.groupLoading = false;
                const { groupId, userId } = action.payload;

                state.groups = state.groups.map(group =>
                    group._id === groupId
                        ? {
                            ...group,
                            members: group.members.filter(user => (user._id || user) !== userId),
                        }
                        : group
                );

                state.error = null;
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.groupLoading = false;
                state.error = action.payload;
            })

            //removeDummyUser
            .addCase(removeDummyUser.pending, (state) => {
                state.groupLoading = true;
            })
            .addCase(removeDummyUser.fulfilled, (state, action) => {
                state.groupLoading = false;
                const { groupId, dummyMembers } = action.payload;
                state.groups = state.groups.map(group =>
                    group._id === groupId
                        ? { ...group, dummyMembers }
                        : group
                );
                state.error = null;
            })
            .addCase(removeDummyUser.rejected, (state, action) => {
                state.groupLoading = false;
                state.error = action.payload;
            })

            //DeleteGroup
            .addCase(deleteGroup.pending, (state) => {
                state.groupLoading = true;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.groupLoading = false;
                state.groups = state.groups.filter(
                    group => String(group._id) !== String(action.payload?.groupId)
                );
                state.error = null;
            })

            .addCase(deleteGroup.rejected, (state, action) => {
                state.groupLoading = false;
                state.error = action.payload;
            })
    }
});

export const { toggleAddGroupForm, resetSearchUsers } = groupSlice.actions;
export default groupSlice.reducer;