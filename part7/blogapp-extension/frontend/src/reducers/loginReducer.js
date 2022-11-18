import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import userService from '../services/user';
import { setNotification } from './notificationReducer';

const loginSlice = createSlice({
    name: 'login',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
    },
});

export const { setUser } = loginSlice.actions;

export const initializeUser = () => {
    return async (dispatch) => {
        const userFromStorage = userService.getUser();
        if (userFromStorage) {
            dispatch(setUser(userFromStorage));
        }
    };
};

export const login = (username, password) => {
    return async (dispatch) => {
        try {
            const loggedUser = await loginService.login({ username, password });
            userService.setUser(loggedUser);
            dispatch(setUser(loggedUser));
            dispatch(setNotification(`${username} logged in!`, 5));
        } catch (error) {
            dispatch(setNotification(error.response.data.error, 5));
        }
    };
};

export const logout = () => {
    return async (dispatch) => {
        userService.clearUser();
        dispatch(setUser(null));
    };
};

export default loginSlice.reducer;
