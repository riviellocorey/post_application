import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = "http://localhost:3001/api/v1";

const initialState = {
    data: [],
    status: 'idle',
    error: null
};

export const getPosts = createAsyncThunk("posts/getPosts", async () => {
    try {
        const posts = await axios.get(`${BASE_URL}/posts`);
        const response = posts.data;
        return response.data;
    } catch (asyncError) {
        console.error(asyncError);
    }
});

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        updatePostBy: (state, action) => {
            const { query, data: { title, body } } = action.payload;
            const index = state.data.findIndex((val) => val.title === query);
            const updateData = {
                title: title || state.data[index].title,
                body: body || state.data[index].body
            };
            console.log(updateData);
            const currData = state.data[index];
            state.data[index] = {...currData, ...updateData};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = "succeeded";
            })
    }
});

export const { updatePostBy } = postSlice.actions;

export default postSlice.reducer;