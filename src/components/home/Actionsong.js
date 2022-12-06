
import axios from 'axios';
import React, {useState,useEffect,useCallback,useRef,memo, useMemo,useId} from 'react'
import PropTypes from 'prop-types';
import {showmodal,actionuser,updatesongs,setsong} from "../../actions/player"
import {useDispatch, useSelector} from "react-redux"
import { valid,headers, expirationDate, setrequestlogin,token,expiry } from '../../actions/auth';
import { listcommentURL, listplaylistURL,playlistURL,songURL } from '../../urls';
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Listaction=(props)=>{
    const dropref=useRef()
    const [showplaylist,setShowplaylist]=useState(false)
    const player=useSelector(state=>state.player)
    const {playlists,song,left,right,top,bottom,dotref,showaction}=player
    const user=useSelector(state=>state.auth.user)
    const dispatch = useDispatch()
    const songid=useId()
    console.log(songid)
    useEffect(()=>{
        const handleClick=(event)=>{
            const {target}=event
            if(showaction && dotref.current && !dotref.current.contains(target) && !dropref.current.contains(target) ){
                
                dispatch(setsong({showaction:false}))
            }
        }
        document.addEventListener('click',handleClick)
        return ()=>{
            document.removeEventListener('click',handleClick)
        }
    },[showaction,dispatch,dotref])

    const download=(e)=>{
        e.preventDefault()
        const url=song.url
        axios({url,responseType: 'blob',})
        .then((response) => {
            const urlObject = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = urlObject;
            link.setAttribute('download', 'recording.mp3');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    const setshowaction=()=>{
        dispatch(showmodal(true))
        dispatch(actionuser({data:{data:song,title:'Lời bài hát'},action:'editlyrics'}))
        dispatch(setsong({showaction:false}))
    }
    const showcomment= async ()=>{
        const res= await axios.get(`${listcommentURL}?song_id=${song.id}`,headers())
        dispatch(showmodal(true))
        dispatch(actionuser({data:{data:{...res.data,...song},title:'Bình luận'},action:'showcomment'}))
    }
    const addplaylist=()=>{
        const now =new Date()
        if(user){
        dispatch(setsong({showaction:false}))
        dispatch(showmodal(true))
        dispatch(actionuser({data:{data:song,title:'Tạo playlist mới'},action:'addplaylist'}))
        }
    }
    const addsongtoplaylist= async (itemchoice)=>{
        const data={songs:[song.id],action:'addsong'}
        if(token() && expiry()>0){
            const res=  await axios.post(`${playlistURL}/${itemchoice.id}`,JSON.stringify(data),headers())
            toast(<span>Đã thêm bài hát '{song.name}' vào playlist thành công</span>,{  
                position:toast.POSITION.BOTTOM_LEFT,
                className:'toast-message',
            });
            dispatch(setsong({showaction:false}))
        }
        else{
            dispatch(setrequestlogin(true))
        }
    }
    return(
        <div ref={dropref} className="detail-song" style={{position:'absolute',left:`${left}px`,top:`${top}px`,right:`${right}px`,bottom:`${bottom}px`,width:'280px'}}>
        <div style={{position:'relative'}}>
            <div>
                <div className="song-info">
                    <div className='song-image' style={{backgroundImage:`url(${song.image_cover})`,width:'40px',height:'40px'}}></div>
                    <div className="flex-col flex-1" style={{width:0}}>
                        <div className='song-name' style={{fontSize:'14px'}}>{song.name}</div>
                        <div className="flex-center">
                            <div className="flex-center more-song-info">
                                <span className='song-icon-like'>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path></svg>
                                </span>
                                
                                <span className="song-count-like">{song.number_like}</span>
                            </div>
                            <div className="flex-center more-song-info">
                                <span className='song-icon-views'>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9zM7 15v4H5v-4h2zm12 4h-2v-4h2v4z"></path></svg>
                                </span>
                                <span className="song-count-views">{song.views}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <div onClick={(e)=>download(e)} className="action-item">
                        <div className="icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path></svg>
                        </div>
                        <div className="name">
                            Download
                        </div>
                    </div>
                    <div  onClick={()=>{
                            setshowaction()
                        
                        }} className={`action-item ${song.hasLyric?'':'disabled'}`}>
                        <div className="icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M388.938 29.47c-23.008 0-46.153 9.4-62.688 25.405 5.74 46.14 21.326 75.594 43.75 94.28 22.25 18.543 52.078 26.88 87.75 28.345 13.432-16.07 21.188-37.085 21.188-58 0-23.467-9.75-47.063-26.344-63.656C436 39.25 412.404 29.47 388.938 29.47zm-76.282 42.374c-8.808 14.244-13.75 30.986-13.75 47.656 0 23.467 9.782 47.063 26.375 63.656 16.595 16.594 40.19 26.375 63.658 26.375 18.678 0 37.44-6.196 52.687-17.093-31.55-3.2-59.626-12.46-81.875-31-23.277-19.397-39.553-48.64-47.094-89.593zm-27.78 67.72l-64.47 83.78c2.898 19.6 10.458 35.1 22.094 46.187 11.692 11.142 27.714 18.118 48.594 19.626l79.312-65.28c-21.2-3.826-41.14-14.11-56.437-29.407-14.927-14.927-25.057-34.286-29.095-54.907zM300 201.468a8 8 0 0 1 .03 0 8 8 0 0 1 .533 0 8 8 0 0 1 5.875 13.374l-34.313 38.78a8.004 8.004 0 1 1-12-10.593l34.313-38.78a8 8 0 0 1 5.562-2.78zM207.594 240L103 375.906c3.487 13.327 7.326 20.944 12.5 26.03 5.03 4.948 12.386 8.46 23.563 12.408l135.312-111.438c-17.067-3.61-31.595-11.003-42.906-21.78-11.346-10.81-19.323-24.827-23.876-41.126zM95.97 402.375c-9.12 5.382-17.37 14.08-23.126 24.406-9.656 17.317-11.52 37.236-2.25 50.47 6.665 4.337 10.566 4.81 13.844 4.344 1.794-.256 3.618-.954 5.624-1.875-3.18-9.575-6.3-20.93-2.5-33.314 3.03-9.87 10.323-19.044 23.47-27.5-2.406-1.65-4.644-3.49-6.75-5.562-3.217-3.163-5.94-6.78-8.313-10.97z"></path></svg>
                        </div>
                        <div className="name">
                            Lyrics
                        </div>
                    </div>
                    <div className="action-item">
                        <div className="icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"></path></svg>
                        </div>
                        <div className="name">Block</div>
                    </div>
                </div>
                <div className="menus">
                    <div className="menu-item">
                        <div className='item-center'>
                        <div className="menu-icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fillRule="evenodd" d="M12 3v10h-1V3h1z"></path><path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"></path><path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"></path></svg>
                        </div>
                        <div className="menu-name">Set ringtone</div>
                        </div>
                    </div>
                    <div onMouseLeave={()=>setShowplaylist(false)} onMouseEnter={()=>setShowplaylist(true)} className="menu-item">
                        <div className='item-center'>
                            <div className="menu-icon">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                            </div>
                            <div className="menu-name">Add to playlist</div>
                        </div>
                        <div className="icon-next">
                            <svg viewBox="0 0 12 12" fill="none" width="12" height="12" color="#fff" ><path fillRule="evenodd" clipRule="evenodd" d="M9.293 6L4.146.854l.708-.708L10 5.293a1 1 0 010 1.414l-5.146 5.147-.708-.707L9.293 6z" fill="currentColor"></path></svg>
                        </div>
                    </div>
                    <div className="menu-item">
                    <div className='item-center'>
                        <div className="menu-icon">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
                        </div>
                        <div className="menu-name">Play Radio Songs</div>
                        </div>
                    </div>
                    <div className="menu-item">
                    <div className='item-center'>
                        <div className="menu-icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M388.938 29.47c-23.008 0-46.153 9.4-62.688 25.405 5.74 46.14 21.326 75.594 43.75 94.28 22.25 18.543 52.078 26.88 87.75 28.345 13.432-16.07 21.188-37.085 21.188-58 0-23.467-9.75-47.063-26.344-63.656C436 39.25 412.404 29.47 388.938 29.47zm-76.282 42.374c-8.808 14.244-13.75 30.986-13.75 47.656 0 23.467 9.782 47.063 26.375 63.656 16.595 16.594 40.19 26.375 63.658 26.375 18.678 0 37.44-6.196 52.687-17.093-31.55-3.2-59.626-12.46-81.875-31-23.277-19.397-39.553-48.64-47.094-89.593zm-27.78 67.72l-64.47 83.78c2.898 19.6 10.458 35.1 22.094 46.187 11.692 11.142 27.714 18.118 48.594 19.626l79.312-65.28c-21.2-3.826-41.14-14.11-56.437-29.407-14.927-14.927-25.057-34.286-29.095-54.907zM300 201.468a8 8 0 0 1 .03 0 8 8 0 0 1 .533 0 8 8 0 0 1 5.875 13.374l-34.313 38.78a8.004 8.004 0 1 1-12-10.593l34.313-38.78a8 8 0 0 1 5.562-2.78zM207.594 240L103 375.906c3.487 13.327 7.326 20.944 12.5 26.03 5.03 4.948 12.386 8.46 23.563 12.408l135.312-111.438c-17.067-3.61-31.595-11.003-42.906-21.78-11.346-10.81-19.323-24.827-23.876-41.126zM95.97 402.375c-9.12 5.382-17.37 14.08-23.126 24.406-9.656 17.317-11.52 37.236-2.25 50.47 6.665 4.337 10.566 4.81 13.844 4.344 1.794-.256 3.618-.954 5.624-1.875-3.18-9.575-6.3-20.93-2.5-33.314 3.03-9.87 10.323-19.044 23.47-27.5-2.406-1.65-4.644-3.49-6.75-5.562-3.217-3.163-5.94-6.78-8.313-10.97z"></path></svg>
                        </div>
                        <div className="menu-name">Play along with the lyrics</div>
                        </div>
                    </div>
                    <div onClick={showcomment} className="menu-item">
                        <div className='item-center'>
                            <div className="menu-icon">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>
                            </div>
                            <div className="menu-name">Comment</div>
                        </div>
                    </div>
                    <div className="menu-item">
                    <div className='item-center'>
                        <div className="menu-icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"></path><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"></path></svg>
                        </div>
                        <div className="menu-name">Copy link</div>
                        </div>
                    </div>
                    <div className="menu-item">
                    <div className='item-center'>
                        <div className="menu-icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M13 14h-2a8.999 8.999 0 0 0-7.968 4.81A10.136 10.136 0 0 1 3 18C3 12.477 7.477 8 13 8V3l10 8-10 8v-5z"></path></g></svg>
                        </div>
                        <div className="menu-name">Share</div>
                        </div>
                    </div>
                </div>
            </div>
            {showplaylist &&(
            <div onMouseLeave={()=>setShowplaylist(false)}  onMouseEnter={()=>setShowplaylist(true)} className="right-content" style={{position:'absolute',right:'90%',top:'40px'}}>
                <div style={{minWidth:'200px'}} className="content-input">
                    <input maxlength="30" type="text" placeholder="Nhập tên playlist" />
                </div>
                <div onClick={addplaylist} className="sibar-add-playlist">
                    <div className="icon-add">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8.48176704,1.5 C8.75790942,1.5 8.98176704,1.72385763 8.98176704,2 L8.981,7.997 L15,7.99797574 C15.2761424,7.99797574 15.5,8.22183336 15.5,8.49797574 C15.5,8.77411811 15.2761424,8.99797574 15,8.99797574 L8.981,8.997 L8.98176704,15 C8.98176704,15.2761424 8.75790942,15.5 8.48176704,15.5 C8.20562467,15.5 7.98176704,15.2761424 7.98176704,15 L7.981,8.997 L2,8.99797574 C1.72385763,8.99797574 1.5,8.77411811 1.5,8.49797574 C1.5,8.22183336 1.72385763,7.99797574 2,7.99797574 L7.981,7.997 L7.98176704,2 C7.98176704,1.72385763 8.20562467,1.5 8.48176704,1.5 Z"></path></svg>
                    </div>
                    <div>Tạo playlist mới</div>
                </div>
                <div style={{height:'160px',overflow:'auto'}}>
                    {playlists.length==0?
                    <div>Không có playlist nào</div>
                    :
                    <div>
                        {playlists.map(item=>
                            <div onClick={()=>addsongtoplaylist(item)} className="flex-center playlist-item" key={item.id}>
                                
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"></path><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"></path></svg>
                                
                                <div className="item-name ml-8">{item.name}</div>
                            </div>
                        )}
                    </div>
                    }
                </div>
            </div>)}
        </div>
    </div> 
    )
}
const Actionsong=(props)=>{
    const {song,className,setsongs,songs,songid}=props
    const dotref=useRef()
    const player=useSelector(state=>state.player)
    const {song_id,showaction}=player
    const datasongs=useSelector(state=>state.player.songs)
    const dispatch = useDispatch()
    const [state,setState]=useState({width:document.documentElement.clientWidth})
    
    useEffect(()=>{
        const setwidth=()=>{
            setState({...state,width:document.documentElement.clientWidth})
        }
        window.addEventListener('resize',setwidth)
        return ()=>window.removeEventListener('resize',setwidth)
    })
    return(
        <div ref={dotref} onClick={(event)=>{
            event.stopPropagation()
            const rects=dotref.current.getBoundingClientRect();
            const {left,right,top,bottom,height,width}=rects
            const position={left:left<400?left+width:left-280,top:top<400?top:null,bottom:top>400?0:null}
            dispatch(setsong({dotref:dotref,showaction:song_id==songid?!showaction:true,song_id:songid,song:song,...position}))
            if(!showaction && !song.user_id){
                axios.get(`${songURL}/${song.id}`,headers())
                .then(res=>{
                    const data=datasongs.map(item=>{
                    if(item.id===song.id){
                        return({...res.data,...item,hasLyric:res.data.hasLyric})
                        }
                        return({...item})
                    })
                    dispatch(updatesongs(data))
                    if(songs){
                        setsongs(songs.map(item=>{
                            if(item.id===song.id){
                            return({...res.data,...item})
                            }
                            return({...item})
                        }))
                    }      
                })
            }
            }} className={className}>           
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>        
        </div>
    )
}
Actionsong.prototype={
    className:PropTypes.string,
    songid:PropTypes.string,
    songs:PropTypes.array,
    song:PropTypes.object,
    setshow:PropTypes.func,
}
export default Actionsong