import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    shaderPosition: 1,
    loadingImages: false,
  },
  reducers: {
    setShaderPosition: (state, action) => {
      state.shaderPosition = action.payload;
    },
    setLoadingImages : (state, action) => {
        state.loadingImages = action.payload.loadingImages;
      },
  },
});

export const { setShaderPosition, setLoadingImages } = gameSlice.actions;

export default gameSlice.reducer;
