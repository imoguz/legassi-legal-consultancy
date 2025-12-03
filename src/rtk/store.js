import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/rtk/features/authSlice';
import aiDocumentSearchReducer from '@/rtk/features/aiDocumentSearchSlice';
import sidebarReducer from '@/rtk/features/sidebarSlice';
import storage from 'redux-persist/lib/storage';
import { authApi } from '@/rtk/api/authApi';
import { userApi } from '@/rtk/api/userApi';
import { documentApi } from '@/rtk/api/documentApi';
import { legalAssistantApi } from '@/rtk/api/legalAssistantApi';
import { aiDocumentSearchApi } from '@/rtk/api/aiDocumentSearchApi';
import { matterApi } from '@/rtk/api/matterApi';
import { contactApi } from '@/rtk/api/contactApi';
import { employeeApi } from '@/rtk/api/employeeApi';
import { taskApi } from '@/rtk/api/taskApi';
import { reportsApi } from '@/rtk/api/reportsApi';
import { calendarEventApi } from '@/rtk/api/calendarEventApi';
import { notificationApi } from '@/rtk/api/notificationApi';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { invoiceApi } from '@/rtk/api/invoiceApi';
import { paymentApi } from '@/rtk/api/paymentApi';
import { filtersApi } from '@/rtk/api/filtersApi';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const rootReducer = combineReducers({
  auth: authReducer,
  aiDocumentSearch: aiDocumentSearchReducer,
  sidebar: sidebarReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [documentApi.reducerPath]: documentApi.reducer,
  [legalAssistantApi.reducerPath]: legalAssistantApi.reducer,
  [aiDocumentSearchApi.reducerPath]: aiDocumentSearchApi.reducer,
  [matterApi.reducerPath]: matterApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [reportsApi.reducerPath]: reportsApi.reducer,
  [calendarEventApi.reducerPath]: calendarEventApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
  [filtersApi.reducerPath]: filtersApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'sidebar'],
  blacklist: [
    authApi.reducerPath,
    userApi.reducerPath,
    documentApi.reducerPath,
    legalAssistantApi.reducerPath,
    aiDocumentSearchApi.reducerPath,
    matterApi.reducerPath,
    contactApi.reducerPath,
    employeeApi.reducerPath,
    taskApi.reducerPath,
    reportsApi.reducerPath,
    calendarEventApi.reducerPath,
    notificationApi.reducerPath,
    invoiceApi.reducerPath,
    paymentApi.reducerPath,
    filtersApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      documentApi.middleware,
      legalAssistantApi.middleware,
      aiDocumentSearchApi.middleware,
      matterApi.middleware,
      contactApi.middleware,
      employeeApi.middleware,
      taskApi.middleware,
      reportsApi.middleware,
      calendarEventApi.middleware,
      notificationApi.middleware,
      invoiceApi.middleware,
      paymentApi.middleware,
      filtersApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
