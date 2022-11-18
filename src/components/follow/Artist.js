
import { useParams } from "react-router"
import {useState,useEffect, useRef, useCallback} from "react"
import { useSelector,useDispatch } from "react-redux"
import Actionsong from "../home/Actionsong"
import  { Songinfo,PlaySong } from "../Song"
import { listartistURL,songURL,artistInfohURL,listpostURL, artistURL, postURL, listcommentURL } from "../../urls"
import {setsong,updatesongs,showinfoArtist, setshowpost, updateposts } from "../../actions/player"
import { Slide } from "react-slideshow-image"
import axios from "axios"
import { headers } from "../../actions/auth"
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
    const [show,setShow]=useState(false)
    const {song,index}=props
    const songref=useRef()
    const dotref=useRef()
    const player=useSelector(state=>state.player)
    const datasongs=useSelector(state=>state.player.songs)
    const {play,currentIndex}=player
    const dispatch = useDispatch()
    const dropref=useRef()

    useEffect(()=>{
        const handleClick=(event)=>{
            const {target}=event
            if(show && dotref.current && !dotref.current.contains(target) && !dropref.current.contains(target) ){
                setShow(false)
            }
        }
        document.addEventListener('click',handleClick)
        return ()=>{
            document.removeEventListener('click',handleClick)
        }
    },[show])

    
    return(
        <div  ref={songref} key={song.id} class={`playlist-item ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <PlaySong song={song}/>      
            <div className="card-info flex-col">
                <Songinfo
                song={song}
                />
                
            </div>
            <div ref={dotref} onClick={()=>{setShow(!show)}} className="icon-button">           
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>        
                {show &&(
            <div ref={dropref} className="detail-song" style={{position:'absolute',top:`40px`,right:`40px`,width:'280px',transform:`translateY(-${index>1?50:10}%)`}}>
            <Actionsong
                show={show}
                dotref={dotref}
                song={song}
                setshow={(data)=>setShow(data)}
            /></div>)}
            </div>
            
        </div>
    )
}
const Artist=()=>{
    const {slug}=useParams()
    const [songs,setSongs]=useState([])
    const [artist,setArtist]=useState()
    const [sliderIndex,setsliderIndex]=useState(0)
    const timer=useRef()
    const dispatch = useDispatch()
    useEffect(() => {
        timer.current=setInterval(()=>{
            const value=sliderIndex==listimage.length-1?0:sliderIndex+1
            setsliderIndex(value)
        },3000)
        return () => {
            clearInterval(timer.current)
        }
    }, [sliderIndex])
    useEffect(() => {
        ( async () =>{
            const res = await axios.get(`${artistURL}/${slug}`,headers)
            const datasongs=res.data.songs.map(item=>{
                return({...item,image_cover:'http://localhost:8000'+item.image_cover})
            })
            setSongs(datasongs)
            setArtist({...res.data,image:'http://localhost:8000'+res.data.image})
        })()
        
    }, [])
    return (
        <div className="body-wrapper">
            <div className="zm-section channel-section song-animate-section">
                <h3 class="zm-section-title title is-2">Bài hát nổi bật</h3>
                <div className="content">
                    <div className="flex-center">
                        <div className="songs-animate-container"> 
                            <div className="option-all__song-slider">
                                {songs.slice(0,10).map((item,index)=>
                                    <img key={item.id} src={item.image_cover} alt="anh slider" class={`option-all__song-slider-img ${index == sliderIndex?'option-all__song-slider-img-first':index == sliderIndex+1||(sliderIndex==listimage.length-1 && index==0)?'option-all__song-slider-img-second':'option-all__song-slider-img-third'}`}/>
                                )}
                            </div>
                        </div>
                        <div className="list flex-1">
                            <div className="option-all__songs pl-20">
                                <ul className="option-all__songs-list songs-list">
                                    {songs.map((song,index)=>
                                        <Song
                                            song={song}
                                            index={index}
                                        />
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}
export default Artist