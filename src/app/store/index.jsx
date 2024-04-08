// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './reducers/playersReducer'; // Importez votre rootReducer ici

const store = configureStore({reducer:{players:playersReducer}});

export default store;
