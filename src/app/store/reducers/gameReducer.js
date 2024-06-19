import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    shaderPosition: 0,
    distanceCircle: [0.65, 0.65],
    offset: 0,
    manche: 0,
    advancementManche: 0,
    countDownPause: false
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
    incrementManche: (state) => {
      state.manche += 1;
    },
    setAdvancementManche: (state, action) => {
      state.advancementManche = action.payload;
    },
    setCountDownPause: (state, action) => {
      state.countDownPause = action.payload;
    },
  },
});

export const { setShaderPosition, setDistanceCircle, setOffset, setCountDownPause, incrementManche, setAdvancementManche} =
  gameSlice.actions;

export default gameSlice.reducer;
