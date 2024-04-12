import { createSlice } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "counter",
  initialState: {
    players: [],
    currentPlayer: "",
    colors: {
      red: { img: "", used: false },
      blue: { img: "", used: false },
      purple: { img: "", used: false },
      yellow: { img: "", used: false },
      green: { img: "", used: false },
      "#1ecbe1": { img: "", used: false },
      black: { img: "", used: false },
    },
  },
  reducers: {
    setColor: (state, action) => {
      const color = state.colors[action.color];
      if (color) {
        state.colors[action.color].used = true;
        console.log(`La couleur ${action.color} est à présent utilisée`);
      } else {
        console.log(`La couleur ${action.color} est déjà assigné`);
      }
    },
    addPlayer: (state, action) => {
      const obj = {};
      obj.score = 0;
      obj.color = action.payload.color;
      obj.alreadyPlay = false;
      const playersTmp = [...state.players, obj];
      console.log(playersTmp);
      state.players = playersTmp;
    },
    setCurrentPlayer: (state) => {
      let currentTmp = "";
      if (state.players.length > 0) {
        const playersTmp = state.players.filter((player) => {
          return !player.alreadyPlay;
        });
        currentTmp = Math.floor(Math.random() * playersTmp.length);
      }
      state.currentPlayer = currentTmp;
    },
  },
});

export const { addPlayer, setColor } = playersSlice.actions;
export default playersSlice.reducer;
