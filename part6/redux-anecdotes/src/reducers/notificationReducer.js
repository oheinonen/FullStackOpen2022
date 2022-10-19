import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    createNotification(state, action) {
      return action.payload
    }
  }
})

export const { createNotification } = notificationSlice.actions

let timeoutId;

export const setNotification = (message, time) => {

  return async dispatch => {
    dispatch(createNotification(message)) 
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => dispatch(createNotification(null)), 1000 * time)
  }
}


export default notificationSlice.reducer
