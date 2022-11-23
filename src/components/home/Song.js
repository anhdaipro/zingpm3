
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
import  { PlaySong,Showlyric,Songinfo } from "../Song"

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
                {song.hasLyric&&(
                    <Showlyric
                    song={song}
                    />
                )}
                <button onClick={()=>setliked('liked',!song.liked)} class="song-info-like icon-button" aria-label="Yêu thích">
                    <svg className={song.liked?'fill-heart':''} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        {song.liked?<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
                        :<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>}
                    </svg>
                </button>
                
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