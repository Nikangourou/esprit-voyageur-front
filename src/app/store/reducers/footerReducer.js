import { createSlice } from "@reduxjs/toolkit";

export const footerSlice = createSlice({
  name: "footer",
  initialState: {
    footerLeft: "",
    footerRight: "",
  },
  reducers: {
    setFooterLeft: (state, action) => {
      state.footerLeft = action.payload;
    },
    setFooterRight: (state, action) => {
      state.footerRight = action.payload;
    },
  },
});

export const { setFooterLeft, setFooterRight } =
  footerSlice.actions;

export default footerSlice.reducer;
