import Actionsong from "../home/Actionsong"
import {useState,useEffect,useMemo, useRef} from "react"
import {useSelector,useDispatch} from "react-redux"
import 'react-slideshow-image/dist/styles.css'
import { listartistURL,songURL,newsongURL } from "../../urls"
import { partition, timeago } from "../../constants"
import axios from "axios"
import { headers } from "../../actions/auth"
import {setsong,updatesongs,showinfoArtist } from "../../actions/player"
import dayjs from "dayjs"
import { Songinfo, PlaySong } from "../Song"

const Song=(props)=>{
    const [show,setShow]=useState(false)
    const {song,index}=props
    const songref=useRef()
    const dotref=useRef()
    const dropref=useRef()
    const artistRef=useRef()
    const player=useSelector(state => state.player)
    const {currentIndex,play,showinfo,infoRef,keepinfo}=player
    
    const datasongs=useSelector(state => state.player.songs)
    const dispatch = useDispatch()
    
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
                <p className="song-date">{timeago(song.created_at)} ago</p>
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

const Listnewsong=(props)=>{
    const player=useSelector(state => state.player)
    const {currentIndex,play,showinfo,infoRef,keepinfo}=player
    const [listnewsong,setListnewsong]=useState([])
    const datasongs=useSelector(state => state.player.songs)
    const dispatch = useDispatch()
    const newsongs=useMemo(()=>{
        return partition(listnewsong,4)
    },[listnewsong])
    useEffect(()=>{
        ( async ()=>{
            const res=await axios.get(`${newsongURL}?limit=true`,headers)
        setListnewsong(res.data.map(item=>{
            return({...item,image_cover:'http://localhost:8000'+item.image_cover,url:'http://localhost:8000'+item.url})
        }))
        })()
        
    },[])

    return(
        <div className="row">
            {newsongs.map((item,index)=>
                <div key={index} style={{flex:1}} className="group-item">
                    {item.map(song=>
                        <Song
                        index={index}
                        song={song}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
export default Listnewsong