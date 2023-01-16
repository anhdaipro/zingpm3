
import { useParams } from "react-router"
import {useState,useEffect, useRef, useCallback} from "react"
import { useSelector,useDispatch } from "react-redux"
import {  playlistURL } from "../../urls"
import {setsong, } from "../../actions/player"
import axios from "axios"
import { headers,valid } from "../../actions/auth"
import { Link } from "react-router-dom"
import { Song } from "./Individual"
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

const PlaylistDetail=()=>{
    
    const {id}=useParams()
    const [songs,setSongs]=useState([])
    const [playlist,setPlaylist]=useState()
    const player=useSelector(state=>state.player)
    const {play}=player
    const dispatch = useDispatch()
    useEffect(() => {
        ( async () =>{
            const res = await axios.get(`${playlistURL}/${id}`,headers())
            const datasongs=res.data.songs
            setSongs(datasongs)
            setPlaylist({...res.data})
        })()
        
    }, [id])
    const setsongs=useCallback((data)=>{
        setSongs(data)
    },[])
    return (
        playlist &&(<div className="body-wrapper">
            <div className="zm-section channel-section song-animate-section">
                <h3 className="zm-section-title title is-2">Bài hát nổi bật</h3>
                <div className="content">
                    <div className="flex">
                        <div className="songs-animate-container"> 
                            <div className="song-slider">
                                <div onClick={()=>dispatch(setsong({play:!play}))} className="zm-card-image">
                                    <div className={`box1 ${play?'animated infinite rotate-full boder-50':'scale-image'}`}>
                                        {songs.lenght>0&&(<img className="" src={songs[0].image_cover} alt="" />)}
                                    </div>
                                    <div className="zm-actions-container">
                                        <div className="zm-box zm-actions playlist-actions">
                                            <button className="zm-btn zm-tooltip-btn animation-like is-hidden active is-hover-circle button" tabIndex="0">
                                                <i className="icon ic-like"></i>
                                                <i className="icon ic-like-full"></i>
                                            </button>
                                            <button className="zm-btn action-play  button" tabIndex="0">
                                                <i className={`icon action-play ${play?'ic-gif-playing-white':'ic-svg-play-circle'} `}></i>
                                            </button>
                                            <button className="zm-btn zm-tooltip-btn is-hidden is-hover-circle button" tabIndex="0">
                                                <i className="icon ic-more"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>
                        <div className="list flex-1">
                            <div className="option-all__songs pl-20">
                                {songs.length>0?
                                <ul className="option-all__songs-list songs-list table-body">
                                    {songs.map((song,index)=>
                                        <Song
                                            song={song}
                                            songs={songs}
                                            key={song.id}
                                            setsongs={data=>setsongs(data)}
                                            
                                        />
                                        )}
                                </ul>:
                                <div className="container no-content mar-0">
                                    <div className="no-content-box">
                                        <i className="icon main-icon ic-svg-music-icon">
                                        
                                        </i>
                                        <span className="no-content-text">Không có bài hát trong playlist của bạn</span>
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