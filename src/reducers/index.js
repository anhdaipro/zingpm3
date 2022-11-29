import {combineReducers} from "redux"
import authReducer from "./auth"
import mvplayerReducer from "./mv"
import playerReducer from "./player"

const rootReducer=combineReducers({auth:authReducer,player:playerReducer,mvplayer:mvplayerReducer})
export default rootReducer
console.log(rootReducer)