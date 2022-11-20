
import GradientChart from "./GradientChart"
import {songURL, zingchartURL,artistInfohURL} from "../../urls"
import {useState,useEffect, useCallback,useRef} from "react"
import axios from "axios"
import { setsong,actionuser,updatesongs,showinfoArtist } from "../../actions/player"
import { headers, setrequestlogin,valid } from "../../actions/auth"
import dayjs from "dayjs"
import Actionsong from "./Actionsong"
import {useDispatch,useSelector} from "react-redux"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import  { PlaySong,Songinfo } from "../Song"

const Song=(props)=>{
   
    const datasongs=useSelector(state => state.player.songs)
    const dispatch = useDispatch()
    const player=useSelector(state => state.player)
    const {showplaylist,currentIndex,play, time_stop_player,showinfo,infoRef,keepinfo}=player
    const [showaction,setShowaction]=useState(false)
    const {song,index,setsongs,songs}=props
    const songref=useRef()
    const dotref=useRef()
    const setliked= async (name,value)=>{
        if(valid){
        const res=await axios.post(`${songURL}/${song.id}`,JSON.stringify({action:'like'}),headers)
        const data=datasongs.map((item,index)=>{
            if(song.id==item.id){
                return({...item,[name]:value})
            }
            return({...item})
        })
        const songupdate=songs.map((item,index)=>{
            if(item.id==song.id){
                return({...item,[name]:value})
            }
            return({...item})
        })
        setsongs(songupdate)
        toast(<span>{value?'Đã thêm bài hát vào thư viện':'Đã xóa bài hát khỏi thư viện'}</span>,{  
            position:toast.POSITION.BOTTOM_LEFT,
            className:'toast-message',
        });
        dispatch(updatesongs(data))
    }
    else{
        dispatch(setrequestlogin(true))
    }
    }
    

    
    return(
        <div style={{position:'relateive'}}>
        <div onMouseLeave={()=>setShowaction(false)} onMouseEnter={()=>setShowaction(true)} ref={songref} key={index} class={`playlist-item ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <div className={`playlist-position top-${index+1}`}>{index+1}</div>
            <div class="playlist-line">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
            </div>
            <PlaySong song={song}/>        
            <div className="card-info">
                <Songinfo
                song={song}
                />
            </div>
            
            
            <div className={`${showaction?'':'hiden'} flex-center`}>
                <div class="icon-button">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M388.938 29.47c-23.008 0-46.153 9.4-62.688 25.405 5.74 46.14 21.326 75.594 43.75 94.28 22.25 18.543 52.078 26.88 87.75 28.345 13.432-16.07 21.188-37.085 21.188-58 0-23.467-9.75-47.063-26.344-63.656C436 39.25 412.404 29.47 388.938 29.47zm-76.282 42.374c-8.808 14.244-13.75 30.986-13.75 47.656 0 23.467 9.782 47.063 26.375 63.656 16.595 16.594 40.19 26.375 63.658 26.375 18.678 0 37.44-6.196 52.687-17.093-31.55-3.2-59.626-12.46-81.875-31-23.277-19.397-39.553-48.64-47.094-89.593zm-27.78 67.72l-64.47 83.78c2.898 19.6 10.458 35.1 22.094 46.187 11.692 11.142 27.714 18.118 48.594 19.626l79.312-65.28c-21.2-3.826-41.14-14.11-56.437-29.407-14.927-14.927-25.057-34.286-29.095-54.907zM300 201.468a8 8 0 0 1 .03 0 8 8 0 0 1 .533 0 8 8 0 0 1 5.875 13.374l-34.313 38.78a8.004 8.004 0 1 1-12-10.593l34.313-38.78a8 8 0 0 1 5.562-2.78zM207.594 240L103 375.906c3.487 13.327 7.326 20.944 12.5 26.03 5.03 4.948 12.386 8.46 23.563 12.408l135.312-111.438c-17.067-3.61-31.595-11.003-42.906-21.78-11.346-10.81-19.323-24.827-23.876-41.126zM95.97 402.375c-9.12 5.382-17.37 14.08-23.126 24.406-9.656 17.317-11.52 37.236-2.25 50.47 6.665 4.337 10.566 4.81 13.844 4.344 1.794-.256 3.618-.954 5.624-1.875-3.18-9.575-6.3-20.93-2.5-33.314 3.03-9.87 10.323-19.044 23.47-27.5-2.406-1.65-4.644-3.49-6.75-5.562-3.217-3.163-5.94-6.78-8.313-10.97z"></path></svg>
                </div>
                <div onClick={()=>setliked('liked',!song.liked)} class="song-info-like icon-button" aria-label="Yêu thích">
                    <svg className={song.liked?'fill-heart':''} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        {song.liked?<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
                        :<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>}
                    </svg>
                </div>
                
                <Actionsong
                    className={`icon-button btn-more-action`}
                    top={40}
                    right={40}
                    transformY={100}
                    song={song}  
                    songs={songs}
                    setsongs={data=>setsongs(data)}
                /> 
            </div>
            
            <div className={`duration ${showaction?'hiden':''} mr-16`}>
                <p className="author">{('0'+Math.floor((song.duration) / 60) % 60).slice(-2)}:{('0'+Math.floor(song.duration)  % 60).slice(-2)}</p>
            </div>
            
        </div>
                
        </div>
    )
}
export default Song