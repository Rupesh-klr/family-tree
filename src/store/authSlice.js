import { createSlice } from '@reduxjs/toolkit';
import { ROLES, DEFAULT_USER } from '../utils/roles';
import { v4 as uuidv4 } from 'uuid';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    // 👇 ADD THIS: Biometric Settings
    biometricPrefs: {
      interval: 'always', 
      lastAuthTime: 0
    }
  },
  reducers: {
    loginSimulate: (state) => {
      state.isAuthenticated = true;
      state.token = DEFAULT_USER.token;
      state.user = {
        id: uuidv4(),
        email: DEFAULT_USER.email,
        pic: DEFAULT_USER.pic,
        role: ROLES.SUPER_ADMIN
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.biometricPrefs.lastAuthTime = 0; // Reset auth on logout
    },
    // 👇 ADD THIS: The Missing Reducer
    recordBiometricAuth: (state) => {
      state.biometricPrefs.lastAuthTime = Date.now();
    }
  }
});

export const { loginSimulate, logout, recordBiometricAuth } = authSlice.actions;
export default authSlice.reducer;