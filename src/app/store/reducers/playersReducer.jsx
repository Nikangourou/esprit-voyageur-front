import { createSlice } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "counter",
  initialState: {
    playersInGame: [],
    currentPlayer: "",
    players: {
      rouge: { color: "red", score: 0, alreadyPlay: false },
      bleu: { color: "blue", score: 0, alreadyPlay: false },
      violet: { color: "purple", score: 0, alreadyPlay: false },
      jaune: { color: "yellow", score: 0, alreadyPlay: false },
      vert: { color: "green", score: 0, alreadyPlay: false },
      cyan: { color: "#1ecbe1", score: 0, alreadyPlay: false },
      noir: { color: "black", score: 0, alreadyPlay: false },
    },
  },
  reducers: {
    addPlayer: (state, action) => {
      console.log(action.payload.color);
      let playerAlreadyAdded = state.players[action.payload.color].used;
      if (!playerAlreadyAdded) {
        state.playersInGame = [...state.playersInGame, action.payload.color];
        state.players[action.payload.color].used = true;
      }
    },
    selectBlufferPlayer: (state) => {
      let currentPlayer = "";
      const playersAvailable = state.playersInGame.filter((player) => {
        return !state.players[player].alreadyPlay;
      });
      if (playersAvailable.length > 0) {
        const idx = Math.floor(Math.random() * playersAvailable.length);
        currentPlayer = playersAvailable[idx];
        state.players[currentPlayer].alreadyPlay = true;
      }
      state.currentPlayer = currentPlayer;
    },
    // Increment le score de tout les joueurs selon le parametre de la fonction.
    // format paramettre : {imageTrue: [...listeCouleurs] }
    incrementScorePlayers: (state, action) => {
      action.payload.imageTrue.forEach((color) => {
        state.players[color].score += 1;
      });
      state.players[state.currentPlayer].score +=
        action.payload.imageTrue.length;
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
      state.currentPlayer = "";
    },
  },
});

export const {
  addPlayer,
  selectBlufferPlayer,
  incrementScorePlayers,
  resetGame,
} = playersSlice.actions;
export default playersSlice.reducer;
