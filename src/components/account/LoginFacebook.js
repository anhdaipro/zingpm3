import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from "react-router-dom"
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { connect,useDispatch } from 'react-redux';
import { LoginsocialURL, loginURL } from "../../urls"
import axios from 'axios';
import dayjs from "dayjs"
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
            const res=await axios.post(LoginsocialURL, {
                social_id: response.id,
                password:response.id,
                provider: "facebook",
                name:response.name,
                username:generateString(12),
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
            dispatch({
                type:LOGIN_SUCCESS,
                payload:res.data
            })
            const {refresh,access}=res.data
            const expiri=dayjs().add(259,'minute')
            localStorage.setItem("expirationDate",expiri);
            localStorage.setItem('refresh',refresh);
            localStorage.setItem('token',access);
            console.log(res.data)
            const search = window.location.search;
            const params = new URLSearchParams(search);
            
        }
        catch(e){
            console.log(e)
        }
    }
    return(
        <ReactFacebookLogin
            appId="697186108669015"
            fields="name,email,picture"
            callback={responseFb}
            render={renderProps => (
            <button onClick={renderProps.onClick} className="flex-1 social-box flex-center">
                <div className="social-image-wrapper item-center">
                    <div className="social-image social-white-background social-white-fb-blue-png"></div>
                </div>
                <div className="">Facebook</div>
            </button>
            )}
        />  
    )
}

export default LoginFacebook
