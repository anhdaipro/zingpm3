import { useDispatch,useSelector } from "react-redux"
import { setrequestlogin,logout } from "../../actions/auth"
import axios from "axios"
import {useState,useRef,useEffect} from 'react'
const AccountLogin=()=>{
    const parentRef=useRef()
    const dispatch= useDispatch()
    const [show,setShow]=useState(false)
    const user=useSelector(state=>state.auth.user)
    
    console.log(user)
    useEffect(()=>{
        const handleClick=(event)=>{
            const {target}=event
            if(show && !parentRef.current.contains(target)){
                setShow(false)
            }  
        }
        document.addEventListener('click',handleClick)
        return ()=>{
            document.removeEventListener('click',handleClick)
        }
    },[show])
    const setshowlogin=(e)=>{
        e.preventDefault();
        
        if(user){
            setShow(!show)
        }
        else{
         dispatch(setrequestlogin(true))
        }
        
    }
    return(
        <div ref={parentRef}  style={{position:'relative'}} aria-label="Tài khoản">
            <div onClick={setshowlogin} className="item-center">
                <button className='item-center'>
                <img className="avatar" src={user?`http://localhost:8000${user.avatar}`:'https://avatar.talk.zdn.vn/default'} alt="avartar"/>
                </button>
                
            </div>
            {show &&(
            <div class="menu menu-settings setting-header header-dropdown">
                <ul class="menu-list">
                    <li class="header-player-setting">
                        <a target="_blank" href="https://zingmp3.vn/vip?utm_source=desktop&amp;utm_campaign=VIP&amp;utm_medium=%s">
                            <button class="zm-btn button" tabindex="0">
                                
                                <span>Nâng cấp VIP</span>
                            </button>
                        </a>
                    </li>
                    <li class="header-player-setting">
                        <a target="_blank" href="https://zingmp3.vn/vip/buyCode?utm_source=desktop&amp;utm_campaign=VIP&amp;utm_medium=avatar-buycode">
                            <button class="zm-btn button" tabindex="0">
                                <span>Mua code VIP</span>
                            </button>
                        </a>
                    </li>
                    <li class="header-player-setting logout-header">
                        <a>
                            <button onClick={()=>{
                                dispatch(logout())
                                window.location.href='/'
                                }} class="zm-btn button" tabindex="0">
                                <span>Đăng xuất</span>
                            </button>
                        </a>
                    </li>
                </ul>
            </div>)}
        </div>    
    )
}
export default AccountLogin