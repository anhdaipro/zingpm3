import React, { useEffect,useRef } from 'react';
import { connect,useSelector,useDispatch } from 'react-redux';
import { checkAuthenticated, token} from '../actions/auth';
import axios from 'axios';
import dayjs from "dayjs"
import Login from '../components/account/Login';
import Actionsong,{Listaction} from '../components/home/Actionsong';
import Navbar from '../components/Navbar';
import Player from '../components/Player';
import Sibar from '../components/Sibar';
import Songs from '../components/Songs';
import Modal from './Modal';
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import InfoArtist from '../components/modal/InfoArtist';
import DetailFeed from '../components/modal/DetailFeed';
import MV from '../components/home/MV';
import Themes from '../components/modal/Themes';
import { refreshTokenURL } from '../urls';

const Layout = ({children}) => {
    const player=useSelector(state=>state.player)
    const dispatch = useDispatch()
    const dotref=useRef()
    const mvplayer=useSelector(state=>state.mvplayer)
    const {showvideo}=mvplayer
    const {showinfo,songs,showpost,showaction,show}=player
    const auth=useSelector(state=>state.auth)
    const {requestlogin,theme,showtheme,user}=auth
    
    const refreshtoken= async ()=>{
        if(user){
            const res= await axios.post(refreshTokenURL,JSON.stringify({id:user.id}),{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = res.data;
            localStorage.setItem('token',data.token);
            const expiri=dayjs().add(59,'minute')
            localStorage.setItem("expirationDate",expiri);    
        }       
    }
    useEffect(() => {
        const timer=setInterval(() => {
            if(user){
                refreshtoken()
            }
        }, 1000*180);
        return ()=>clearInterval(timer)
    })
    useEffect(()=>{
        window.addEventListener('beforeunload', refreshtoken)
        return () => window.removeEventListener('beforeunload', refreshtoken)
    },[user])
    
    
    const CloseButton=({ closeToast })=>(  
        <button >
    <svg width="12px" color="#fff" height="12px" onClick={closeToast} ref={dotref} viewBox="0 0 16 16" stroke="#EE4D2D" className="popup__close-button">
        <path strokeLinecap="round" d="M1.1,1.1L15.2,15.2"></path>
        <path strokeLinecap="round" d="M15,1L0.9,15.1"></path>
    </svg></button> )
    useEffect(() => {
        (async ()=>{
            if(token()){
                dispatch(checkAuthenticated())
            }
        })() 
       
    }, [dispatch]);
    
    
    return (
        <div className="wrapper main" style={{backgroundImage:`url(${theme})`,backgroundSize: `cover`}}>  
            <Sibar/>
            <Navbar/>
            <div className="main-container">
                <div className="container">
                {children}
                </div>
            </div>
            {songs.length>0&&(
            <Player/>)}
            <Songs/>
            {showaction &&(<Listaction/>)}
            {showpost&&(<DetailFeed/>)}
            {showvideo &&(
            <MV/>)}
            <ToastContainer 
                hideProgressBar={true}
                autoClose={3000}
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                icon={false}
                closeButton={CloseButton}
                closeOnClick={false}
                limit={4}
            />
            {requestlogin &&(
            <Login/>)}
            <Modal/> 
            {showtheme&&(<Themes/>)}
            {showinfo && !show && <InfoArtist/>}
            
        </div>
        
    );
};

export default Layout
