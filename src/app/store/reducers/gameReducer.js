import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    shaderPosition: 0,
    distanceCircle: [0.65, 0.65],
    offset: 0,
    footerLink: "",
    setAdvancementStep: 0,
    setAdvancementRouand: 0,
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
    },
    setAdvancementStep: (state, action) => {
      state.setAdvancementStep = action.payload;
    },
    setAdvancementRouand: (state, action) => {
      state.setAdvancementRouand = action.payload;
    },
  },
});

export const { setShaderPosition, setDistanceCircle, setOffset } =
  gameSlice.actions;

export default gameSlice.reducer;
