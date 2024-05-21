import { createSlice } from "@reduxjs/toolkit";

export const footerSlice = createSlice({
  name: "footer",
  initialState: {
    showFooter: false
  },
  reducers: {
    setShowFooter: (state, action) => {
      state.showFooter = action.payload;
    },
  },
});

export const { setShowFooter } =
  footerSlice.actions;

export default footerSlice.reducer;
