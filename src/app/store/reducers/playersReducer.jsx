
import { createSlice } from '@reduxjs/toolkit'

export const playersSlice = createSlice({
    name: 'counter',
    initialState: {
        players: [],
        currentPlayer: ""
    },
    reducers: {
        setPlayers: (state,action) => {
            state.value += 1
            const playersTmp = action.players.map((player) => {
                const obj = {};
                obj.name = player;
                obj.score = 0;
                obj.alreadyPlay = false;
                return obj;
            })
            state.players = playersTmp;
        },
        setCurrentPlayer: state => {
            let currentTmp = "";
            if(state.players.length > 0){
                const playersTmp = state.players.filter((player) => {
                    return !player.alreadyPlay;
                })
                currentTmp = Math.floor(Math.random() * playersTmp.length);
            }
            state.currentPlayer =  currentTmp ;
        }
    }
})


export const { setPlayers, setCurrentPlayer } = playersSlice.actions
export default playersSlice.reducer