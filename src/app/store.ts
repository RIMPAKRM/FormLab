import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import responsesReducer from '../features/responses/responsesSlice'
import surveysReducer from '../features/surveys/surveysSlice'

const persistedReducer = persistReducer(
  { key: 'root', storage },
  combineReducers({
    auth: authReducer,
    surveys: surveysReducer,
    responses: responsesReducer,
  }),
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
