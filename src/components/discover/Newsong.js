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
   
    const {song,index}=props
    const songref=useRef()
    const dotref=useRef()
    const dropref=useRef()
    
    const player=useSelector(state => state.player)
    const {currentIndex,play,showinfo,infoRef,keepinfo}=player
    
    const datasongs=useSelector(state => state.player.songs)
    const dispatch = useDispatch()
    
    
    return(
        <div className="list-item hide-right media-item hide-right full-left">
        <div  ref={songref} key={song.id} class={`playlist-item ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <PlaySong song={song}/>        
            <div className="card-info flex-col">
                <Songinfo
                song={song}
                />
                <p className="song-date">{timeago(song.created_at)} ago</p>
            </div>
            <Actionsong
                song={song}
                className={`icon-button`}
                top={40}
                right={40}
                transformY={index>1?50:10}
            />
            
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
            return({...item,image_cover:'http://localhost:8000'+item.image_cover})
        }))
        })()
        
    },[])

    return(
        <div className="columns is-multiline">
            {newsongs.map((item,index)=>
                <div key={index} className="column mar-b-0 is-fullhd-4 is-widescreen-4 is-desktop-4 is-touch-6 is-tablet-6">
                    <div className="list">
                    {item.map(song=>

                        <Song
                        index={index}
                        song={song}
                        />
                    )}
                    </div>
                </div>
            )}
        </div>
    )
}
export default Listnewsong