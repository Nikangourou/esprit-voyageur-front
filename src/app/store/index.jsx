// store/soundBtn.js
import { configureStore } from "@reduxjs/toolkit";
import playersReducer from "./reducers/playersReducer";
import gameReducer from "./reducers/gameReducer";
import footerReducer from "./reducers/footerReducer";

const store = configureStore({
  reducer: { players: playersReducer, game: gameReducer , footer: footerReducer},
});

export default store;
