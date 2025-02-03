import auth from "./auth";
import { configureStore } from "@reduxjs/toolkit";
import likeItemsReducer from "./likeItemsReducer";
import { thunk } from "redux-thunk";

const store = configureStore({
  reducer: {
    likeItems: likeItemsReducer,
    auth,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),

});

export default store;
