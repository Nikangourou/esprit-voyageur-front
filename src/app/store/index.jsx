// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import playersReducer from "./reducers/playersReducer";
import gameReducer from "./reducers/gameReducer";

const store = configureStore({
  reducer: { players: playersReducer, game: gameReducer },
});

export default store;
