import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    shaderPosition: 1,
  },
  reducers: {
    setShaderPosition: (state, action) => {
      state.shaderPosition = action.payload;
    },
  },
});

export const { setShaderPosition } = gameSlice.actions;

export default gameSlice.reducer;
