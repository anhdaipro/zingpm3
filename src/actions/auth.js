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
    LOGOUT,
    UPDATE_PROFILE_SUCCESS,
    GET_THREAD_SUCCESS,
    CREATE_THREAD_FAIL,
    CREATE_THREAD_SUCCESS,
    GET_THREAD_FAIL,
    UPDATE_NOTIFI_SUCCESS,
    REQUEST_LOGIN,
    UPDATE_THEME,
    
} from './types';
import axios from 'axios';
import { listThreadlURL, loginURL,userinfoURL,userprofileURL} from '../urls';
import { isVietnamesePhoneNumber,validatEemail } from '../constants';

export const loginotp = (user_id) => async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let form=new FormData()
    form.append('user_id',user_id)
    
    try {
        const res = await axios.post('https://anhdai.herokuapp.com/api/v4/login', form, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
            
        });
        localStorage.setItem("expirationDate", res.data.access_expires);
        localStorage.setItem('token',res.data.token);
       
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

export const login = (username, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let form=new FormData()
    if(validatEemail(username)){
    form.append('email',username)
    }
    else{
        form.append('username',username)
    }
    form.append('password',password)
    
    try {
        const res = await axios.post(loginURL, form, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
            
        });
        localStorage.setItem("expirationDate", res.data.access_expires);
        const token = res.data.token;
        localStorage.setItem('token',token);
       
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
    }
};

export const checkAuthenticated = () => async dispatch => {

    try {
        const token=localStorage.getItem('token')
        const res = await axios.get(userinfoURL,{ 'headers': { Authorization:`JWT ${token}` }})
        dispatch({
            payload: {...res.data},
            type: AUTHENTICATED_SUCCESS
        });     
    } 
    catch (err) {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
}

export const signup = (username, email, password,profile) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ username, email, password, profile});
   
    try {
        const res = await axios.post(`https://daiviet.herokuapp.com/api/v3/register`, body, config);

        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        })
    }
};

export const setrequestlogin= (data)=>  {
    return{
        payload:data,
        type:REQUEST_LOGIN
    }
}

export const settheme=(data)=>{
    return{
        payload:data,
        type:UPDATE_THEME
    }
}

export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`https://anhdai.herokuapp.com/api/v4/reset/password/`, body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};

export const reset_password_confirm = (uidb64, token, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uidb64, token,password});

    try {
        const res =await axios.post(`https://anhdai.herokuapp.com/api/v4/password-reset/${uidb64}/${token}/`, body, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
    }
};

export const expirationDate = localStorage.getItem("expirationDate")

export const token=()=>{
    return localStorage.getItem('token')
}
console.log(token())
export const expiry=()=>{
  return  new Date(expirationDate).getTime() - new Date().getTime()
}

export const valid=token() && expirationDate

export const headers=()=>{
  return {'headers':token() && expirationDate && expiry()>0?{ Authorization:`JWT ${token()}`,'Content-Type': 'application/json' }:{'Content-Type': 'application/json'}}
}

export const logout = () => dispatch => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    dispatch({
        type: LOGOUT
    });
};

export const updateprofile =(data) =>{
    return{
        type: UPDATE_PROFILE_SUCCESS,
        payload:data
    };
}

 export const create_thread =(user_id,profile_id)=> async dispatch=>{
    try {
        let form=new FormData()
        form.append('participants',user_id)
        form.append('participants',profile_id)
        const res =await axios.post(`${listThreadlURL}`, form,headers());

        dispatch({
            type: CREATE_THREAD_SUCCESS,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type: CREATE_THREAD_FAIL
        });
    }
}

export const  get_thread=(getlist,seen,thread_id)=> async dispatch=>{
    try{
        let url=new URL(listThreadlURL)
        let search_params=url.searchParams
        search_params.append('list_thread',getlist)
        search_params.append('seen',seen)
        search_params.append('thread_id',thread_id)
        url.search = search_params.toString();
        let new_url = url.toString();
        const res =await axios.get(new_url,headers())
        dispatch({
            type: GET_THREAD_SUCCESS,
            payload:res.data
        });
    }
    catch(err){
        dispatch({
            type: GET_THREAD_FAIL
        });
    }
}

export const updatenotify=(data)=>async dispatch=>{
    dispatch({
        type: UPDATE_NOTIFI_SUCCESS,
        payload:data
    });
}

export const getStreams = (category) => async dispatch => {
    if (!category) category = ''
    const response = await axios.get(`streams?category=${category}`)
    dispatch({
        type: 'GET_STREAMS',
        payload: response.data
    })
}

export const getStream = (userName) => async dispatch => {
    try {
        var response = await axios.get(`streams?user=${userName}`)
    } catch(e) {
        
    } finally {
        if (!response) {
            dispatch({
                type: 'GET_STREAM',
                payload: [{error: 'This channel does not exist'}]
            })
        } else {
            if (response.status === 200 && !response.data[0]) {
                dispatch({
                    type: 'GET_STREAM',
                    payload: [{error: 'This Channel is not streaming right now', errorName: userName}]
                })
            } else {
                dispatch({
                    type: 'GET_STREAM',
                    payload: response.data
                })
            }
        }
        
    }
    
}

export const getCategories = () => async dispatch => {
    const response = await axios.get('categories/')
    dispatch({
        type: 'GET_CATEGORIES',
        payload: response.data
    })
} 
