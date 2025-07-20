// You will have to make changes to the application's existing reducer. 
// Create a separate reducer for the new functionality by using the Redux Toolkit's createSlice function.

// The application does not have to use the Notification component intelligently 
// at this point in the exercises. 
// It is enough for the application to display the initial value set for the
//  message in the notificationReducer.


import { createSlice } from '@reduxjs/toolkit'

const initialState = ""

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        notificationChange: (state, action) => {
            return action.payload
        },
        removeNotification: () => {
            return ""
        }
    }
})
export const setNotification = (anecdote, time) => {
    return (dispatch) => {
        dispatch(notificationChange(`new anecdote '${anecdote}`))
        setTimeout(() => {
            dispatch(removeNotification())
        }, time * 1000)
    }
}

export const { notificationChange, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer