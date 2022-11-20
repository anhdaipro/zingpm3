
import { useParams } from "react-router"
import {useState,useEffect, useRef, useCallback} from "react"
import { useSelector,useDispatch } from "react-redux"
import Actionsong from "../home/Actionsong"
import  { Songinfo,PlaySong } from "../Song"
import { listartistURL,songURL,artistInfohURL,listpostURL, artistURL, postURL, listcommentURL, playlistURL } from "../../urls"
import {setsong,updatesongs,showinfoArtist, setshowpost, updateposts } from "../../actions/player"
import { Slide } from "react-slideshow-image"
import axios from "axios"
import { headers,valid } from "../../actions/auth"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
const listimage=[
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/1.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/2.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/3.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/4.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/5.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/6.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/7.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/8.webp'},
]

const Song=(props)=>{
   
    const {song,index}=props
    const songref=useRef()
    const dotref=useRef()
    const player=useSelector(state=>state.player)
    const datasongs=useSelector(state=>state.player.songs)
    const {play,currentIndex}=player
    const dispatch = useDispatch()
    const dropref=useRef()

    

    
    return(
        <div  ref={songref} key={song.id} class={`playlist-item ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <PlaySong song={song}/>      
            <div className="card-info flex-col">
                <Songinfo
                song={song}
                />
                
            </div>
            <Actionsong
                song={song}
                className={`icon-button`}
                top={40}
                right={40}
                transformY={index>1?50:10}
            />
            
        </div>
    )
}
const PlaylistDetail=()=>{
    
    const {id}=useParams()
    const [songs,setSongs]=useState([])
    const [playlist,setPlaylist]=useState()
    const player=useSelector(state=>state.player)
    const {play}=player
    const dispatch = useDispatch()
    useEffect(() => {
        ( async () =>{
            const res = await axios.get(`${playlistURL}/${id}`,headers)
            const datasongs=res.data.songs.map(item=>{
                return({...item,image_cover:'http://localhost:8000'+item.image_cover})
            })
            setSongs(datasongs)
            setPlaylist({...res.data,image:'http://localhost:8000'+res.data.image})
        })()
        
    }, [])
    return (
        playlist &&(<div className="body-wrapper">
            <div className="zm-section channel-section song-animate-section">
                <h3 class="zm-section-title title is-2">Bài hát nổi bật</h3>
                <div className="content">
                    <div className="flex-center">
                        <div className="songs-animate-container"> 
                            <div className="song-slider">
                                <div onClick={()=>dispatch(setsong({play:!play}))} className="zm-card-image">
                                    <div class={`box1 ${play?'animated infinite rotate-full boder-50':''}`}>
                                        <img class="" src={songs[0].image_cover} alt="" />
                                    </div>
                                    <div class="zm-actions-container">
                                        <div class="zm-box zm-actions playlist-actions">
                                            <button class="zm-btn zm-tooltip-btn animation-like is-hidden active is-hover-circle button" tabindex="0">
                                                <i class="icon ic-like"></i>
                                                <i class="icon ic-like-full"></i>
                                            </button>
                                            <button class="zm-btn action-play  button" tabindex="0">
                                                <i class={`icon action-play ${play?'ic-gif-playing-white':'ic-svg-play-circle'} `}></i>
                                            </button>
                                            <button class="zm-btn zm-tooltip-btn is-hidden is-hover-circle button" tabindex="0">
                                                <i class="icon ic-more"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>
                        <div className="list flex-1">
                            <div className="option-all__songs pl-20">
                                {songs.length>0?
                                <ul className="option-all__songs-list songs-list">
                                    {songs.map((song,index)=>
                                        <Song
                                            song={song}
                                            index={index}
                                        />
                                        )}
                                </ul>:
                                <div class="container no-content mar-0">
                                    <div class="no-content-box">
                                        <i class="icon main-icon ic-svg-music-icon">
                                        
                                        </i>
                                        <span class="no-content-text">Không có bài hát trong playlist của bạn</span>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>)
    )
}
export default PlaylistDetail