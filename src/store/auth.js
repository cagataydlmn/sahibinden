import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user") ?? "false"),
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = false;
    },
    updateProfilePhoto: (state, action) => {
      if (state.user) {
        state.user.profilePhoto = action.payload; // Sadece URL'yi kaydediyoruz
        localStorage.setItem("user", JSON.stringify(state.user)); // Güncel bilgiyi kaydet
      }
    },
  },
});

export const { login, logout, updateProfilePhoto } = auth.actions;
export default auth.reducer;
