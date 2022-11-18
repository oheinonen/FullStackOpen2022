import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        appendBlog(state, action) {
            state.push(action.payload);
        },
        setBlogs(state, action) {
            return action.payload;
        },
        updateBlog(state, action) {
            const updatedBlog = action.payload;
            const { id } = updatedBlog;
            return state.map((blog) => (blog.id !== id ? blog : updatedBlog));
        },
        deleteBlog(state, action) {
            const id = action.payload;
            return state.filter((blog) => blog.id !== id);
        },
    },
});

export const { appendBlog, setBlogs, updateBlog, deleteBlog } =
    blogSlice.actions;

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export const createBlog = (blogObject) => {
    return async (dispatch) => {
        const newBlog = await blogService.create({ ...blogObject, likes: 0 });
        dispatch(appendBlog(newBlog));
    };
};

export const likeBlog = (blog) => {
    return async (dispatch) => {
        const likedBlog = await blogService.update(blog.id, {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id,
        });
        dispatch(updateBlog(likedBlog));
    };
};

export const removeBlog = (id) => {
    return async (dispatch) => {
        await blogService.remove(id);
        dispatch(deleteBlog(id));
    };
};

export const commentBlog = (id, comment) => {
    return async (dispatch) => {
        const updatedBlog = await blogService.addComment(id, comment);
        dispatch(updateBlog(updatedBlog));
    };
};


export default blogSlice.reducer;
