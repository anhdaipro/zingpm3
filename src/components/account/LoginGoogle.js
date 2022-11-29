import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import { connect,useDispatch,useSelector } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { LoginsocialURL, loginURL } from "../../urls"
import axios from 'axios';
import { gapi } from "gapi-script";
import { LOGIN_FAIL, LOGIN_SUCCESS } from '../../actions/types';
import { generateString } from '../../constants';
const LoginGoogle=(props)=>{
    const {googleLogin,login}=props
    const dispatch = useDispatch()
    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: "874868987927-hudvamdogth0ei4hctcp5gja538tggkf.apps.googleusercontent.com",
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);
    const responseGoogle = async (res) => {
        try{
            console.log(res)
            const {profileObj,googleId}=res
            const response=await axios.post(LoginsocialURL, {
                name:profileObj.name,
                email:profileObj.email,
                username:generateString(12),
                password:googleId,
                avatar:profileObj.imageUrl,
                provider: "google",
                social_id:googleId,
                access_token:res.accessToken
            })
            
            dispatch({
                type:LOGIN_SUCCESS,
                payload:response.data
            })    
            const token = response.data.access;
            localStorage.setItem('token',token);
            const search = window.location.search;
            const params = new URLSearchParams(search);
            if(params.get('next')!=null){
                window.location.href=params.get('next')
            }
            else{
                window.location.href='/'
            }
        }
        catch(e){
            dispatch({
                type:LOGIN_FAIL
            })
        }
    }
    return(
        <GoogleLogin
            clientId="874868987927-hudvamdogth0ei4hctcp5gja538tggkf.apps.googleusercontent.com"
            buttonText="Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} class="flex-1 social-box flex-center">
                    <div className="social-image-wrapper item-center">
                        <div class="social-image social-white-background social-white-google-png"></div>
                    </div>
                    <div class="">Google</div>
                </button>
            )}
        />
    )
}

export default LoginGoogle