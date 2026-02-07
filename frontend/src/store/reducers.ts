import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./apiSlice";

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux",
  whitelist: [],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export { rootReducer, rootPersistConfig };
