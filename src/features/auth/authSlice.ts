import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser, Credentials } from '../../types'

interface StoredUser extends AuthUser {
  password: string
}

interface AuthState {
  users: StoredUser[]
  user: AuthUser | null
}

const initialState: AuthState = {
  users: [],
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register(state, action: PayloadAction<Credentials>) {
      const user: StoredUser = { id: Date.now(), ...action.payload }
      ;(state.users ??= []).push(user)
      state.user = { id: user.id, email: user.email }
    },
    setCredentials(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    },
  },
})

export const { register, setCredentials, logout } = authSlice.actions
export default authSlice.reducer
