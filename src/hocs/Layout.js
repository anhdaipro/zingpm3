import React, { useEffect,useRef } from 'react';
import { connect,useSelector,useDispatch } from 'react-redux';
import { checkAuthenticated,login,expiry} from '../actions/auth';
import { actionuser, showmodal,setsong } from '../actions/player';
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

const Layout = ({children}) => {
    const player=useSelector(state=>state.player)
    const dispatch = useDispatch()
    const dotref=useRef()
    const mvplayer=useSelector(state=>state.mvplayer)
    const {showvideo}=mvplayer
    const {showinfo,songs,showpost,showaction}=player
    const requestlogin=useSelector(state=>state.auth.requestlogin)
    
    const CloseButton=({ closeToast })=>(  
        <button >
    <svg width="12px" color="#fff" height="12px" onClick={closeToast} ref={dotref} viewBox="0 0 16 16" stroke="#EE4D2D" className="popup__close-button">
        <path strokeLinecap="round" d="M1.1,1.1L15.2,15.2"></path>
        <path strokeLinecap="round" d="M15,1L0.9,15.1"></path>
    </svg></button> )
    useEffect(() => {
        (async ()=>{
            if(localStorage.token){
                dispatch(checkAuthenticated())
            }
        })() 
       
    }, [localStorage.token]);
    
    
    return (
        <div className="wrapper main">  
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
            {showinfo &&<InfoArtist/>}
            
        </div>
        
    );
};

export default Layout
