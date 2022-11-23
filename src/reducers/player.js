import {
    ACTION_USER,SHOW_ACTION,
    PLAYER, SHOW_MODAL, UPDATE_SONGS,SHOW_PLAYLIST, TIME_STOP_PLAYER, UPDATE_PLAYLISTS, SHOW_INFO_ARTIST, SHOW_POST, UPDATE_POSTS

} from '../actions/types';
import { dataURLtoFile } from '../constants';

let initialState = {
    currentIndex:0,
    view:false,
    play:false,
    show:false,
    data:null,
    playlists:[],
    showoption:'',
    action:'',
    showaction:false,
    showpost:false,
    time:{seconds:0,minutes:0},
    time_stop_player:null,
    showplaylist:false,
    showinfo:false,
    comments:[],
    posts:[],
    songs:[]
};

const playerReducer=(state = initialState, action)=>{
    const { type, payload } = action;
    switch(type) {
        case PLAYER:{
            const {view,currentIndex,play}=payload
            return{
                ...state,
                ...payload
            }
        }
        case UPDATE_POSTS:
            return{
                ...state,posts:payload
            }
        case SHOW_POST:
            return{
                ...state,showpost:payload.showpost,data:payload.data,count:payload.count,comments:payload.comments
            }
        case SHOW_INFO_ARTIST:
            return{
                ...state,...payload
            }
        case UPDATE_PLAYLISTS:
            return{
                ...state,playlists:payload
            }
        case SHOW_ACTION:
            return{
                ...state,...payload
            }
        case SHOW_PLAYLIST:
            return{
                ...state,showplaylist:payload
            }
        case UPDATE_SONGS:{
            return{
                ...state,songs:payload
            }
        }
        case TIME_STOP_PLAYER:
            return{
                ...state,time_stop_player:payload
            }

        case SHOW_MODAL:{
            return{...state,show:payload}
        }
        case ACTION_USER:{
            return{
                ...state,action:payload.action,data:payload.data
            }
        }
        default:
            return state
    }
};
export default playerReducer
