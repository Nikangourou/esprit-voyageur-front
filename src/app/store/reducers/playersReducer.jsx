import { createSlice } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "counter",
  initialState: {
    playersInGame: [],
    currentBluffeur: "",
    nbRound: 0,
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
      let currentBluffeur = "";
      const playersAvailable = state.playersInGame.filter((player) => {
        return !state.players[player].alreadyPlay;
      });
      if (playersAvailable.length > 0) {
        const idx = Math.floor(Math.random() * playersAvailable.length);
        currentBluffeur = playersAvailable[idx];
        state.players[currentBluffeur].alreadyPlay = true;
      }
      state.currentBluffeur = currentBluffeur;
    },
    // Increment le score de tout les joueurs selon le parametre de la fonction.
    // format paramettre : {imageTrue: [...listeCouleurs] }
    incrementScorePlayers: (state, action) => {
      action.payload.imageTrue.forEach((color) => {
        state.players[color].score += 1;
      });
      state.players[state.currentBluffeur].score +=
        state.playersInGame.length - (action.payload.imageTrue.length + 1);
      // NbPlayers - (NbTrue - currentBluffeur) = additionnalScoreBluffeur
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
      state.currentBluffeur = "";
      state.nbRound = 0;
    },
    incrementNbRound: (state) => {
      state.nbRound += 1;
    },
  },
});

export const {
  addPlayer,
  selectBlufferPlayer,
  incrementScorePlayers,
  resetGame,
  incrementNbRound,
} = playersSlice.actions;
export default playersSlice.reducer;
