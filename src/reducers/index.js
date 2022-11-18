import {combineReducers} from "redux"
import authReducer from "./auth"
import playerReducer from "./player"

const rootReducer=combineReducers({auth:authReducer,player:playerReducer})
export default rootReducer
console.log(rootReducer)