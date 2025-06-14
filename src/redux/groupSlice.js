import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groups: [],
    isAddGroupFormOpen: false,
}

const groupSlice = createSlice({
    name: 'Group',
    initialState,
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload
        },
        addGroup: (state, action) => {
            state.groups = [...state.groups, action.payload];
        },
        removeGroup: (state, action) => {
            state.groups = state.groups.filter(group => group._id !== action.payload)
        },
        updateGroup: (state, action) => {
            state.groups = state.groups.map(group => (
                group._id.toString() === action.payload._id.toString() ? (
                    { ...group, groupName: action.payload.groupName }
                ) : group
            ))
        },
        toggleAddGroupForm: (state) => {
            state.isAddGroupFormOpen = !state.isAddGroupFormOpen
        }
    }

});

export const { addGroup, removeGroup, updateGroup, toggleAddGroupForm } = groupSlice.actions;
export default groupSlice.reducer;