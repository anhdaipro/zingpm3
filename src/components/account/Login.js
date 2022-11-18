import { useState,useRef,useEffect } from "react"
import { useDispatch } from "react-redux"
import { login, setrequestlogin } from "../../actions/auth"
import { LOGIN_FAIL, LOGIN_SUCCESS } from "../../actions/types"
import { validatEemail } from "../../constants"
import { loginURL } from "../../urls"
import axios from 'axios'
import styled from 'styled-components'
import LoginGoogle from "./LoginGoogle"
import LoginFacebook from "./LoginFacebook"
import LoginInstagram from "./LoginInstagram"

const Btnpass=styled.button`
display:flex;
width:20px;
position:absolute;
right:6px;
top: 50%;
transform: translateY(-50%);
color:#fff
`
const Dotcontent=styled.div`
padding-bottom:8px;
position:relative
`
const Dot=styled.div`
height:1px;
height: 1px;
width: 100%;
background-color: #dbdbdb;
flex: 1;
`
const Dottitle=styled.span`
color: #ccc;
padding: 0 16px;
text-transform: uppercase;
font-size: .75rem;
`
const Login=()=>{
    const [formData,setformDatata]=useState({username:'',password:'',email:''})
    const setform=(name,value)=>{
        setformDatata({...formData,[name]:value})
    }
    
    const dispatch = useDispatch()
    const [showpass,setShowpass]=useState(false)
    const {username,password}=formData

    const submit= async (e)=>{
        try {
            e.preventDefault()
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
            const res = await axios.post(loginURL, form, config);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data 
            });
            localStorage.setItem("expirationDate", res.data.access_expires);
            const token = res.data.access;
            localStorage.setItem('token',token);
            dispatch(setrequestlogin(false))
            window.location.href="/"
        } 
        catch (err) {
            dispatch({
                type: LOGIN_FAIL
            })
        }  
    }
    const setshowpass=(e)=>{
        e.preventDefault()
        setShowpass(!showpass)
    }
    return(
        
        <div style={{color:'#fff'}} className="full_bglightbox">
            <div className="content-lb-user-login">
                <div className="login-header mb-16 item-space">
                    <h3 className="login-header-title">Đăng nhập</h3>
                    <div onClick={()=>dispatch(setrequestlogin(false))} className="icon-close">
                        <button className="icon-close">
                        <svg viewBox="0 0 16 16" width="16px" height="16px" stroke="#EE4D2D" class="close-button">
                            <path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path>
                            <path stroke-linecap="round" d="M15,1L0.9,15.1"></path>
                        </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <div  className='form-login'>
                        <form>
                            <div className="flex-baseline mb-16">
                                <div className="form-control">
                                    <div className="form-select">
                                        <input value={username} placeholder="Tên đăng nhập hoặc email" onChange={(e)=>setform('username',e.target.value)} type="text" required/>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="flex-baseline mb-16">
                                <div className="form-control">
                                    <div className="form-select">
                                        <input placeholder="Nhập vào" value={password} onChange={(e)=>setform('password',e.target.value)} type={showpass?'text':'password'} required/>
                                        <Btnpass onClick={setshowpass}>
                                            {showpass?
                                            <svg fill="none" viewBox="0 0 20 12" class="tF-uq+"><path stroke="none" fill="#fff" fill-opacity=".54" fill-rule="evenodd" d="M19.975 5.823V5.81 5.8l-.002-.008v-.011a.078.078 0 01-.002-.011v-.002a.791.791 0 00-.208-.43 13.829 13.829 0 00-1.595-1.64c-1.013-.918-2.123-1.736-3.312-2.368-.89-.474-1.832-.867-2.811-1.093l-.057-.014a2.405 2.405 0 01-.086-.02L11.884.2l-.018-.003A9.049 9.049 0 0010.089 0H9.89a9.094 9.094 0 00-1.78.197L8.094.2l-.016.003-.021.005a1.844 1.844 0 01-.075.017l-.054.012c-.976.226-1.92.619-2.806 1.09-1.189.635-2.3 1.45-3.31 2.371a13.828 13.828 0 00-1.595 1.64.792.792 0 00-.208.43v.002c-.002.007-.002.015-.002.022l-.002.01V5.824l-.002.014a.109.109 0 000 .013L0 5.871a.206.206 0 00.001.055c0 .01 0 .018.002.027 0 .005 0 .009.003.013l.001.011v.007l.002.01.001.013v.002a.8.8 0 00.208.429c.054.067.11.132.165.197a13.9 13.9 0 001.31 1.331c1.043.966 2.194 1.822 3.428 2.48.974.52 2.013.942 3.09 1.154a.947.947 0 01.08.016h.003a8.864 8.864 0 001.596.16h.2a8.836 8.836 0 001.585-.158l.006-.001a.015.015 0 01.005-.001h.005l.076-.016c1.079-.212 2.118-.632 3.095-1.153 1.235-.66 2.386-1.515 3.43-2.48a14.133 14.133 0 001.474-1.531.792.792 0 00.208-.43v-.002c.003-.006.003-.015.003-.022v-.01l.002-.008c0-.004 0-.009.002-.013l.001-.012.001-.015.001-.019.002-.019a.07.07 0 01-.01-.036c0-.009 0-.018-.002-.027zm-6.362.888a3.823 3.823 0 01-1.436 2.12l-.01-.006a3.683 3.683 0 01-2.178.721 3.67 3.67 0 01-2.177-.721l-.009.006a3.823 3.823 0 01-1.437-2.12l.014-.01a3.881 3.881 0 01-.127-.974c0-2.105 1.673-3.814 3.738-3.816 2.065.002 3.739 1.711 3.739 3.816 0 .338-.047.662-.128.975l.011.009zM8.145 5.678a1.84 1.84 0 113.679 0 1.84 1.84 0 01-3.679 0z" clip-rule="evenodd"></path></svg>
                                            :<svg fill="none" viewBox="0 0 20 10" class="_340FWs"><path stroke="none" fill="#fff" fill-opacity=".54" d="M19.834 1.15a.768.768 0 00-.142-1c-.322-.25-.75-.178-1 .143-.035.036-3.997 4.712-8.709 4.712-4.569 0-8.71-4.712-8.745-4.748a.724.724 0 00-1-.071.724.724 0 00-.07 1c.07.106.927 1.07 2.283 2.141L.631 5.219a.69.69 0 00.036 1c.071.142.25.213.428.213a.705.705 0 00.5-.214l1.963-2.034A13.91 13.91 0 006.806 5.86l-.75 2.535a.714.714 0 00.5.892h.214a.688.688 0 00.679-.535l.75-2.535a9.758 9.758 0 001.784.179c.607 0 1.213-.072 1.785-.179l.75 2.499c.07.321.392.535.677.535.072 0 .143 0 .179-.035a.714.714 0 00.5-.893l-.75-2.498a13.914 13.914 0 003.248-1.678L18.3 6.147a.705.705 0 00.5.214.705.705 0 00.499-.214.723.723 0 00.036-1l-1.82-1.891c1.463-1.071 2.32-2.106 2.32-2.106z"></path></svg>}
                                        </Btnpass>
                                    </div>
                                </div>
                                
                            </div>
                            
                            
                            <button  className="btn mb-16 btn-large flex-1 btn-second" onClick={e=>submit(e)}>Đăng nhập</button>
                            
                            <div className="item-end mb-16">
                                <button className="btn-link">Quên mật khẩu</button>
                            </div>
                        </form>
                    </div>
                    <Dotcontent className="flex-center">
                        <Dot/>
                        <Dottitle>hoặc</Dottitle>
                        <Dot/>
                    </Dotcontent>
                    <div className="flex-center mb-16">
                        <LoginGoogle/>
                        <LoginFacebook/>
                        <LoginInstagram/>
                    </div>
                    <div className="item-center">
                        <div>Bạn chưa có tài khoản?</div>
                        
                        <button className="btn-link ml-8">Đăng kí ngay</button>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login