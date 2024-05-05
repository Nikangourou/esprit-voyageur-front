import { createSlice } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "counter",
  initialState: {
    playersInGame: [],
    players: {
      rouge: { color: "red", score: 0, alreadyPlay: false },
      bleu: { color: "blue", score: 0, alreadyPlay: false },
      violet: { color: "purple", score: 0, alreadyPlay: false },
      jaune: { color: "yellow", score: 0, alreadyPlay: false },
      vert: { color: "green", score: 0, alreadyPlay: false },
      cyan: { color: "#1ecbe1", score: 0, alreadyPlay: false },
      noir: { color: "black", score: 0, alreadyPlay: false },
    },
    currentBluffer: "",
    gameId: null,
    trueImageId: null,
    falseImageId: null,
  },
  reducers: {
    addPlayer: (state, action) => {
      console.log(action.payload.color);
      let playerAlreadyAdded = state.players[action.payload.color].used;
      if (!playerAlreadyAdded) {
        state.playersInGame = [...state.playersInGame, action.payload.color];
      }
    },
    resetGame: (state) => {
      state.players = {
        rouge: { color: "red", score: 0, alreadyPlay: false },
        bleu: { color: "blue", score: 0, alreadyPlay: false },
        violet: { color: "purple", score: 0, alreadyPlay: false },
        jaune: { color: "yellow", score: 0, alreadyPlay: false },
        vert: { color: "green", score: 0, alreadyPlay: false },
        cyan: { color: "#1ecbe1", score: 0, alreadyPlay: false },
        noir: { color: "black", score: 0, alreadyPlay: false },
      };
      state.playersInGame = [];
      state.gameId = null;
    },
    setGameId: (state, action) => {
      state.gameId = action.payload.gameId;
      if (action.payload.isReconnected) {
        console.log("reco");
      }
    },
    setTrueImageId: (state, action) => {
      state.trueImageId = action.payload.id;
    },
    setFalseImageId: (state, action) => {
      state.falseImageId = action.payload.id;
    },
    setCurrentBluffer: (state, action) => {
      state.currentBluffer = action.payload.CurrentBluffer;
    },
  },
});

export const {
  addPlayer,
  resetGame,
  setGameId,
  setTrueImageId,
  setFalseImageId,
  setCurrentBluffer,
} = playersSlice.actions;
export default playersSlice.reducer;
