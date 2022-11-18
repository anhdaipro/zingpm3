import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    FACEBOOK_AUTH_SUCCESS,
    FACEBOOK_AUTH_FAIL,
    LOGOUT,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_NOTIFI_SUCCESS,
    COMMENT_NOTIFY,
    REQUEST_LOGIN,
    SHOW_LOGIN

} from '../actions/types';
import { dataURLtoFile } from '../constants';

let initialState = {
    isAuthenticated: null,
    user: null,
    requestlogin:false,
    notify:null,
    listtag:[]
};

const authReducer=(state = initialState, action)=>{
    const { type, payload } = action;
    switch(type) {
        case UPDATE_NOTIFI_SUCCESS:
            return{
                ...state,
                notify:payload,
            }
        case UPDATE_PROFILE_SUCCESS:
            return{
                ...state,
                user:payload
            }
        case REQUEST_LOGIN:{
            return{
                ...state,requestlogin:payload
            }
        }
        
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user:payload,
                notify:{send_to:payload.id,count_notify_unseen:payload.count_notify_unseen}
            }
        case LOGIN_SUCCESS:
        case GOOGLE_AUTH_SUCCESS:
        case FACEBOOK_AUTH_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
       
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                user:null
            }
        case SIGNUP_FAIL:
            return {
                ...state,
                isAuthenticated:null
            }
        case GOOGLE_AUTH_FAIL:
        case FACEBOOK_AUTH_FAIL:
        case LOGIN_FAIL:
        
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
};
export default authReducer
