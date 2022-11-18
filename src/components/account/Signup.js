import { useState,useRef,useEffect } from "react"
import { login, setrequestlogin } from "../../actions/auth"
import { LOGIN_FAIL, LOGIN_SUCCESS } from "../../actions/types"
import { validatEemail } from "../../constants"
import { loginURL } from "../../urls"

const Signup=()=>{
    const [formData,setformDatata]=useState({username:'',password:'',email:'',name:'',re_password:''})
    const setform=(name,value)=>{
        setformDatata({...formData,[name]:value})
    }
    const dispatch = useDispatch()
    const [showpass,setShowpass]=useState(false)
    const {username,password,name,email,re_password}=formData

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
    return(
        <div>
            <div className="login-header">
                <h3 className="login-header-title">Đăng nhập</h3>
                <div className="icon-close">
                    <svg viewBox="0 0 16 16" stroke="#EE4D2D" class="close-button">
                        <path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path>
                        <path stroke-linecap="round" d="M15,1L0.9,15.1"></path>
                    </svg>
                </div>
            </div>
            <div>
                <div>
                    <div>Những thông tin có đánh dấu (*) là bắt buộc nhập.</div>
                    <form>
                        <div>
                            <div>Tên đăng nhập <span>*</span></div>
                            <div>
                                <input value={username} onChange={(e)=>setform('username',e.target.value)} type="text" required/>
                            </div>
                        </div>
                        <div>
                            <div>Mật khẩu <span>*</span></div>
                            <div>
                                <input value={password} onChange={(e)=>setform('password',e.target.value)} type="password" required/>
                            </div>
                        </div>
                        <div>
                            <div>Nhập lại Mật khẩu <span>*</span></div>
                            <div>
                                <input value={re_password} onChange={(e)=>setform('password',e.target.value)} type="password" required/>
                            </div>
                        </div>
                        <div>
                            <div>Email <span>*</span></div>
                            <div>
                                <input value={email} onChange={(e)=>setform('email',e.target.value)} type="password" required/>
                            </div>
                        </div>
                        <div>
                            <div>Tên <span>*</span></div>
                            <div>
                                <input value={name} onChange={(e)=>setform('name',e.target.value)} type="password" required/>
                            </div>
                        </div>
                        <div>
                            <div>
                                <input type="checkbox" required/>
                            </div>
                            <div>
                                <button>Quên mật khẩu</button>
                            </div>
                        </div>
                        <div>
                            <button onClick={e=>submit(e)}>Đăng nhập</button>
                        </div>
                    </form>
                </div>
                <div>
                    <div>Bạn chưa có tài khoản?</div>
                    <div>
                        <button>Đăng kí ngay</button>
                    </div>
                    <div>Hoặc</div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
export default Signup