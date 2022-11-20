import { actionuser, showmodal,updateplaylists } from "../actions/player"
import { headers,setrequestlogin,valid } from "../actions/auth"
import {useDispatch,useSelector} from "react-redux"
import {NavLink} from "react-router-dom"
import {useState,useEffect} from "react"
import  axios from 'axios'
import {listplaylistURL} from "../urls"

const Sibar=()=>{
    const dispatch = useDispatch()
    const user=useSelector(state=>state.auth.user)
    const addplaylist=()=>{
        if(valid){
        dispatch(showmodal(true))
        dispatch(actionuser({data:{title:'Thêm playlist'},action:'addplaylist'}))
        }
    }
    useEffect(()=>{
        ( async ()=>{
            if(valid){
            const res= await axios.get(listplaylistURL,headers)
            dispatch(updateplaylists(res.data))
            }
            
        })()
    },[dispatch,valid])
    const checkuser=(e)=>{
        if(!valid){
            e.preventDefault()
            dispatch(setrequestlogin(true))
        }
       
    }
    return(
        <div class="sideNav tablet">
            <div className="sibar-content">
            <NavLink  to="/"><div class="logo"></div></NavLink>
            <div class="navigation">
                <NavLink onClick={e=>checkuser(e)} title="Cá nhân" class="navigation-item" to="/mymusic">
                {({ isActive }) => (
                    <div className={`navigation-item ${isActive?'active':''}`}>
                        <div class="navigation-item-icon">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03A3.003 3.003 0 0111 18c-1.66 0-3-1.34-3-3z"></path></svg>
                        </div>
                        <div class="navigation-item-title">Cá nhân</div>
                    </div>
                )}
                </NavLink>
                <NavLink title="Khám phá" class="navigation-item" to="/">
                {({ isActive }) => (
                    <div className={`navigation-item ${isActive?'active':''}`}>
                    <div class="navigation-item-icon">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M20.788 3.832c-.101-.105-.197-.213-.301-.317-.103-.103-.211-.202-.32-.302A11.903 11.903 0 0 0 12 0a11.926 11.926 0 0 0-8.486 3.514C-1.062 8.09-1.16 15.47 3.213 20.168c.099.108.197.214.3.32.104.103.21.2.317.3A11.92 11.92 0 0 0 12 24c3.206 0 6.22-1.247 8.487-3.512 4.576-4.576 4.673-11.956.301-16.656zm-16.655.301A11.057 11.057 0 0 1 12 .874c2.825 0 5.49 1.048 7.55 2.958l-1.001 1.002A9.646 9.646 0 0 0 12 2.292a9.644 9.644 0 0 0-6.865 2.844A9.644 9.644 0 0 0 2.292 12c0 2.448.9 4.753 2.542 6.549L3.831 19.55C-.201 15.191-.101 8.367 4.133 4.133zm13.798 1.318v.002l-1.015 1.014A7.346 7.346 0 0 0 12 4.589 7.357 7.357 0 0 0 6.761 6.76 7.362 7.362 0 0 0 4.589 12a7.34 7.34 0 0 0 1.877 4.913l-1.014 1.016A8.77 8.77 0 0 1 3.167 12a8.77 8.77 0 0 1 2.588-6.245A8.771 8.771 0 0 1 12 3.167c2.213 0 4.301.809 5.931 2.284zM18.537 12c0 1.745-.681 3.387-1.916 4.622S13.746 18.538 12 18.538a6.491 6.491 0 0 1-4.296-1.621l-.001-.004c-.11-.094-.22-.188-.324-.291a6.027 6.027 0 0 1-.293-.326A6.47 6.47 0 0 1 5.466 12c0-1.746.679-3.387 1.914-4.621A6.488 6.488 0 0 1 12 5.465c1.599 0 3.105.576 4.295 1.62.111.096.224.19.326.295.104.104.2.214.295.324A6.482 6.482 0 0 1 18.537 12zM7.084 17.534h.001A7.349 7.349 0 0 0 12 19.413a7.35 7.35 0 0 0 5.239-2.174A7.354 7.354 0 0 0 19.412 12a7.364 7.364 0 0 0-1.876-4.916l1.013-1.012A8.777 8.777 0 0 1 20.834 12a8.765 8.765 0 0 1-2.589 6.246A8.764 8.764 0 0 1 12 20.834a8.782 8.782 0 0 1-5.93-2.285l1.014-1.015zm12.783 2.333A11.046 11.046 0 0 1 12 23.125a11.042 11.042 0 0 1-7.551-2.957l1.004-1.001a9.64 9.64 0 0 0 6.549 2.542 9.639 9.639 0 0 0 6.865-2.846A9.642 9.642 0 0 0 21.71 12a9.64 9.64 0 0 0-2.543-6.548l1.001-1.002c4.031 4.359 3.935 11.182-.301 15.417z"></path></svg>
                    </div>
                    <div class="navigation-item-title">Khám phá</div>
                    </div>
                )}
                </NavLink>
                
                <NavLink title="#zing chart" class="navigation-item" to="/zingchart">
                {({ isActive }) => (
                    <div className={`navigation-item ${isActive?'active':''}`}>
                    <div class="navigation-item-icon">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"></path></svg>
                    </div>
                    <div class="navigation-item-title">#zing chart</div>
                    </div>
                )}
                </NavLink>
                <NavLink title="Radio" class="navigation-item" to="/radio">
                {({ isActive }) => (
                    <div className={`navigation-item ${isActive?'active':''}`}>
                    <div class="navigation-item-icon">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M227.346 21.72C166.6 21.42 106.33 48.002 65.633 99.272c-70.398 88.68-55.576 217.634 33.103 288.032 6.407 5.09 13.482 9.924 20.276 14.13C46.694 328.73 38.35 211.73 103.664 129.462c65.31-82.275 181.147-100.695 268.36-46.756-5.63-5.66-11.952-11.454-18.358-16.54-37.412-29.7-81.993-44.23-126.32-44.448zm40.79 68.012c-17.173-.17-34.464 4.025-50.984 13.588l.13.237-3.91 1.95c32.484 65.062 44.2 140.54 37.956 217.565-16.43-21.657-45.042-39.13-74.498-43.38-40.71-5.87-67.6 15.738-60.06 48.265 7.542 32.527 46.656 63.654 87.365 69.525 33.316 4.805 57.36-8.8 60.87-31.726h.005c8.48-53.158 9.01-106.548.57-157.475 59.49-1.135 110.173 84.413 71.965 171.062 80.733-78.593 6.76-226.6-81.28-213.508-1.872-6.79-3.92-13.516-6.144-20.176 76.357-22.337 165.25 73.996 134.405 190.856C461.34 235.536 366.66 90.718 268.137 89.732zm119.83 14.264c74.538 70.422 86.508 187.106 23.778 271.363-62.724 84.26-177.937 106.267-266.78 55.062 5.804 5.48 12.3 11.076 18.862 15.96 90.823 67.61 219.258 48.798 286.867-42.028 67.612-90.823 48.798-219.256-42.025-286.868-6.56-4.887-13.783-9.498-20.703-13.49z"></path></svg>
                    </div>
                    <div class="navigation-item-title">Radio
                    <span className="">Live</span>
                    </div>
                    </div>
                )}
                </NavLink>
                <NavLink title="Theo dõi" class="navigation-item" to="/follow">
                {({ isActive }) => (
                    <div className={`navigation-item ${isActive?'active':''}`}>
                    <div class="navigation-item-icon">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19.875 3H4.125C2.953 3 2 3.897 2 5v14c0 1.103.953 2 2.125 2h15.75C21.047 21 22 20.103 22 19V5c0-1.103-.953-2-2.125-2zm0 16H4.125c-.057 0-.096-.016-.113-.016-.007 0-.011.002-.012.008L3.988 5.046c.007-.01.052-.046.137-.046h15.75c.079.001.122.028.125.008l.012 13.946c-.007.01-.052.046-.137.046z"></path><path d="M6 7h6v6H6zm7 8H6v2h12v-2h-4zm1-4h4v2h-4zm0-4h4v2h-4z"></path></svg>
                    </div>
                    <div class="navigation-item-title">Theo dõi</div>
                    </div>
                )}
                </NavLink>
            </div>
            <div class="side-line"></div>
            <div className="sidebar__library">
                <div class="sidebar__library-top">

                    <NavLink title="Nhạc mới" class="navigation-item active" to="/moi-phat-hanh" aria-current="page">
                    {({ isActive }) => (
                        <div className={`navigation-item ${isActive?'active':''}`}>
                        <div class="navigation-item-icon">
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                        </div>
                        <div class="navigation-item-title">Nhạc mới</div>
                        </div>
                    )}
                    </NavLink>
                    <NavLink title="Thể loại" class="navigation-item" to="/hub">
                    {({ isActive }) => (
                        <div className={`navigation-item ${isActive?'active':''}`}>
                        <div class="navigation-item-icon">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11 4h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4v4zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path></svg>
                        </div>
                        <div class="navigation-item-title">Thể loại</div>
                        </div>
                    )}
                    </NavLink>
                    <NavLink title="Top 100" class="navigation-item" to="/top100">
                    {({ isActive }) => (
                        <div className={`navigation-item ${isActive?'active':''}`}>
                            <div class="navigation-item-icon">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path></svg>
                            </div>
                            <div class="navigation-item-title">Top 100</div>
                            </div>
                    )}
                    </NavLink>
                    <NavLink title="MV" class="navigation-item" to="/mv">
                    {({ isActive }) => (
                        <div className={`navigation-item ${isActive?'active':''}`}>
                            <div class="navigation-item-icon">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 002 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5a2 2 0 00-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z"></path></svg>
                            </div>
                            <div class="navigation-item-title">MV</div>
                            </div>
                    )}
                    </NavLink>
                </div>
                <div className="sidebar__library-center">
                    <div className="vip-heading">Nghe nhạc không quảng cáo cùng kho nhạc VIP</div>
                    <div className="vip-pro">Nâng cấp vip</div>
                </div>
                <div>
                    <div className="sidebar__list">
                        <div>dđ</div>
                        <div>dđ</div>
                        <div>dđ</div>
                        <div>dđ</div>
                    </div>
                </div>
            </div>
            <div onClick={addplaylist} className="sibar-add-playlist">
                <div className="icon-add">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.48176704,1.5 C8.75790942,1.5 8.98176704,1.72385763 8.98176704,2 L8.981,7.997 L15,7.99797574 C15.2761424,7.99797574 15.5,8.22183336 15.5,8.49797574 C15.5,8.77411811 15.2761424,8.99797574 15,8.99797574 L8.981,8.997 L8.98176704,15 C8.98176704,15.2761424 8.75790942,15.5 8.48176704,15.5 C8.20562467,15.5 7.98176704,15.2761424 7.98176704,15 L7.981,8.997 L2,8.99797574 C1.72385763,8.99797574 1.5,8.77411811 1.5,8.49797574 C1.5,8.22183336 1.72385763,7.99797574 2,7.99797574 L7.981,7.997 L7.98176704,2 C7.98176704,1.72385763 8.20562467,1.5 8.48176704,1.5 Z"></path></svg>
                </div>
                <div>Tạo playlist mới</div>
            </div>
            </div>
        </div>
    )
}
export default Sibar