import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    post: [],
    loading: false,
    error: null
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loading = true;
            state.error = null; 
        },
        setPosts: (state, action) => {
            state.post = action.payload;
            state.loading = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const fetchPostsThunk = () => async (dispatch) =>{
    dispatch(startLoading());

    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await res.json();
        dispatch(setPosts(data));
    } catch (err) {
        dispatch(setError(err.toString()));
    }
}