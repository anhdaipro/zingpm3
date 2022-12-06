import { ACTION_USER, PLAYER, SHOW_ACTION, SHOW_MODAL, SHOW_PLAYLIST, TIME_STOP_PLAYER, UPDATE_SONGS,UPDATE_PLAYLISTS, SHOW_INFO_ARTIST, SHOW_POST, UPDATE_POSTS, SHOW_VIDEO } from './types';

import axios from 'axios';
import { listThreadlURL, loginURL,registerURL} from '../urls';

export const setsong =(data)=>{
    return{
        payload:data,
        type:PLAYER
    }
}

export const updatesongs=(data)=>{
    return{
        payload:data,
        type:UPDATE_SONGS
    }
}

export const showmodal=(show)=>{
    return{
        payload:show,
        type:SHOW_MODAL
    }
}

export const updateplaylists=(data)=>{
    return{
        payload:data,
        type:UPDATE_PLAYLISTS
    }
}

export const showactionplayer=(data)=>{
    return{
        payload:data,
        type:SHOW_ACTION
    }
}

export const showplaylist=(show)=>{
    return{
        payload:show,
        type:SHOW_PLAYLIST
    }
}

export const playerstop=(data)=>{
    return{
        payload:data,
        type:TIME_STOP_PLAYER
    }
}

export const actionuser=(data)=>{
    return{
        payload:data,
        type:ACTION_USER
    }
}

export const updateposts=(data)=>{
    return{
        payload:data,
        type:UPDATE_POSTS
    }
}

export const setshowpost=(data)=>{
    return{
        payload:data,
        type:SHOW_POST
    }
}

export const showinfoArtist=(data)=>{
    return{
        payload:data,
        type:SHOW_INFO_ARTIST
    }
}




