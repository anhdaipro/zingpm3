import {
    SHOW_VIDEO,
    TIME_STOP_PLAYER

} from '../actions/types';
import { dataURLtoFile } from '../constants';

let initialState = {
    currentIndex:0,
    view:false,
    playvideo:false,
    show:false,
    change:false,
    song:null,
    time:{seconds:0,minutes:0},
    time_stop_player:null,
    duration:0,
    showvideo:false,
};

const mvplayerReducer=(state = initialState, action)=>{
    const { type, payload } = action;
    switch(type) {
        case SHOW_VIDEO:
            return {
                ...state,...payload
            }
        
        case TIME_STOP_PLAYER:
            return{
                ...state,time_stop_player:payload
            }
        default:
            return state
    }
};
export default mvplayerReducer
