import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { connect,useDispatch } from 'react-redux';
import { loginURL } from "../../urls"
import axios from 'axios';
import { headers } from "../../actions/auth"
import { LOGIN_SUCCESS } from '../../actions/types';
import { generateString } from '../../constants';
const LoginFacebook=()=>{
    const [state,setState] = useState({isLoggedIn: false,userID: "",name: "",
    email: "",picture: ""
    })
    const dispatch = useDispatch()
    const responseFb= async (response) =>{
        try{
            console.log(response)

            const res=await axios.post(loginURL, {
                social_id: response.id,
                password:response.id,
                provider: "facebook",
                name:response.name,
                usename:generateString(12),
                email:response.email,
                avatar:response.picture.url
            })
            setState({
                isLoggedIn: true,
                userID: response.userID,
                name: response.name,
                email: response.email,
                picture: response.picture.data.url
            });
            const res1 = await axios.post(loginURL,JSON.stringify({token:res.data.access_token}), headers)
            const token = res1.data.access;
            localStorage.setItem('token',token);
            dispatch({
                type:LOGIN_SUCCESS,
                type:res1.data
            })
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
            console.log(e)
        }
    }
    return(
        <ReactFacebookLogin
            appId="185202659227880"
            fields="name,email,picture"
            callback={responseFb}
            render={renderProps => (
            <button onClick={renderProps.onClick} class="flex-1 social-box flex-center">
                <div class="social-image-wrapper item-center">
                    <div class="social-image social-white-background social-white-fb-blue-png"></div>
                </div>
                <div class="">Facebook</div>
            </button>
            )}
        />  
    )
}

export default LoginFacebook
