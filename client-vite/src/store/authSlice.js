import { createSlice } from '@reduxjs/toolkit'



const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null ,isAuthenticated: false},
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }
    ) => {
      state.user = user
      state.token = token
      state.isAuthenticated=true
    },
  },
})

export const { setCredentials } = slice.actions

export default slice.reducer

export const selectCurrentUser=(state)=>state.auth.user

export const selectIsAuth = (state) => state.auth.isAuthenticated