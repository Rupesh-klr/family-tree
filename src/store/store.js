import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
// ... import your vaultSlice if combining projects, otherwise just auth

const persistConfig = {
  key: 'family-tree-root',
  storage,
  whitelist: ['isAuthenticated', 'user', 'token'] // Persist login
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: { auth: persistedAuthReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);