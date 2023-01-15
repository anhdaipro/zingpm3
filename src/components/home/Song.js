
import {songURL} from "../../urls"
import {useState,useEffect, useCallback,useRef, useId} from "react"
import axios from "axios"
import { setsong,updatesongs} from "../../actions/player"
import { headers, setrequestlogin,valid } from "../../actions/auth"
import Actionsong from "./Actionsong"
import {useDispatch,useSelector} from "react-redux"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import  { Likedsong, PlaySong,Showlyric,Showmv,Songinfo } from "../Song"

const Song=(props)=>{
    const datasongs=useSelector(state => state.player.songs)
    const dispatch = useDispatch()
    const player=useSelector(state => state.player)
    const {currentIndex, showaction,song_id}=player
    const [show,setShow]=useState(false)
    const {song,index,setsongs,songs}=props
    const songref=useRef()
    const songid=useId()
    
    return(
        <div onMouseLeave={()=>setShow(false)} onMouseEnter={()=>setShow(true)} ref={songref} className={`playlist-item ${showaction && song_id==songid?'show':''}  ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <div className={`playlist-position top-${index+1}`}>{index+1}</div>
            <div className="playlist-line">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
            </div>
            <PlaySong song={song}/>        
            <div className="card-info">
                <Songinfo
                    song={song}
                />
            </div>
            
            
            <div className={`${show?'':'hiden'} flex-center`}>
                {song.video &&(
                    <Showmv
                        song={song}
                    />
                )}
                {song.hasLyric&&(
                    <Showlyric
                    song={song}
                    />
                )}
                
                <Likedsong
                song={song}
                className="song-info-like icon-button"
                songs={songs}
                setsongs={data=>setsongs(data)}
                />
                <Actionsong
                    className={`icon-button btn-more-action`}
                    song={song}  
                    songid={songid}
                    songs={songs}
                    setsongs={data=>setsongs(data)}
                /> 
            </div>
            
            <div className={`duration ${show?'hiden':''} mr-16`}>
                <p className="author">{('0'+Math.floor((song.duration) / 60) % 60).slice(-2)}:{('0'+Math.floor(song.duration)  % 60).slice(-2)}</p>
            </div>
            
        </div>
                
        
    )
}
export default Song