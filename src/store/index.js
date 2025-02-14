import auth from "./auth";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";

const store = configureStore({
  reducer: {
    auth,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),

});

export default store;
