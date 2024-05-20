import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    shaderPosition: 1,
    distanceCircle: [0.65, 0.65],
    offset: 0,
    footerLink : ""
  },
  reducers: {
    setShaderPosition: (state, action) => {
      state.shaderPosition = action.payload;
    },
    setDistanceCircle: (state, action) => {
      state.distanceCircle = action.payload;
    },
    setOffset: (state, action) => {
      console.log(action.payload);
      state.offset = action.payload;
    },
    setFooterLink: (state, action) => {
      state.footerLink = action.payload;
    }
  },
});

export const { setShaderPosition, setDistanceCircle, setOffset } =
  gameSlice.actions;

export default gameSlice.reducer;
