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
    gameId: "",
    trueImageId: "",
    falseImageId: "",
  },
  reducers: {
    addPlayer: (state, action) => {
      console.log(action.payload.color);
      let playerAlreadyAdded = state.players[action.payload.color].used;
      if (!playerAlreadyAdded) {
        state.playersInGame = [...state.playersInGame, action.payload.color];
      }
    },
    newRound: (state) => {
      state.currentBluffer = "";
      state.trueImageId = null;
      state.falseImageId = null;
    },
    newGame: (state) => {
      state.playersInGame = [];
      state.players = {
        rouge: { color: "red", score: 0, alreadyPlay: false },
        bleu: { color: "blue", score: 0, alreadyPlay: false },
        violet: { color: "purple", score: 0, alreadyPlay: false },
        jaune: { color: "yellow", score: 0, alreadyPlay: false },
        vert: { color: "green", score: 0, alreadyPlay: false },
        cyan: { color: "#1ecbe1", score: 0, alreadyPlay: false },
        noir: { color: "black", score: 0, alreadyPlay: false },
      };
      state.currentBluffer = "";
      state.gameId = null;
      state.trueImageId = null;
      state.falseImageId = null;
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
    setScore: (state, action) => {
      state.players = action.payload.Players;
    },
  },
});

export const {
  addPlayer,
  setScore,
  setGameId,
  setTrueImageId,
  setFalseImageId,
  setCurrentBluffer,
  newRound,
  newGame,
} = playersSlice.actions;
export default playersSlice.reducer;