import { createSlice } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "counter",
  initialState: {
    playersInGame: [],
    players: {
      rouge: { color: "#F13C05", score: 0, alreadyPlay: false },
      orange: { color: "#FFB000", score: 0, alreadyPlay: false },
      violet: { color: "#9F54EB", score: 0, alreadyPlay: false },
      cyan: { color: "#25CD9A", score: 0, alreadyPlay: false },
      vert: { color: "#4BB825", score: 0, alreadyPlay: false },
      bleue: { color: "#40B3F3", score: 0, alreadyPlay: false },
      rose: { color: "#E71674", score: 0, alreadyPlay: false },
    },
    currentBluffer: "",
    gameId: "",
    trueImageId: "",
    falseImageId: "",
  },
  reducers: {
    addPlayer: (state, action) => {
      state.playersInGame = [...state.playersInGame, action.payload.color];
    },
    removePlayer: (state, action) => {
      const copyPlayersInGame = [...state.playersInGame];
      const index = copyPlayersInGame.indexOf(action.payload.color);
      const x = copyPlayersInGame.splice(index, 1);

      state.playersInGame = [...copyPlayersInGame];
    },
    newRound: (state) => {
      state.currentBluffer = "";
      state.trueImageId = null;
      state.falseImageId = null;
    },
    newGame: (state) => {
      state.playersInGame = [];
      state.players = {
        rouge: { color: "#F13C05", score: 0, alreadyPlay: false },
        orange: { color: "#FFB000", score: 0, alreadyPlay: false },
        violet: { color: "#9F54EB", score: 0, alreadyPlay: false },
        cyan: { color: "#25CD9A", score: 0, alreadyPlay: false },
        vert: { color: "#4BB825", score: 0, alreadyPlay: false },
        bleue: { color: "#40B3F3", score: 0, alreadyPlay: false },
        rose: { color: "#E71674", score: 0, alreadyPlay: false },
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
  removePlayer,
  setScore,
  setGameId,
  setTrueImageId,
  setFalseImageId,
  setCurrentBluffer,
  newRound,
  newGame,
} = playersSlice.actions;
export default playersSlice.reducer;
