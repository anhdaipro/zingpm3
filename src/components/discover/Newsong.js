
import {useState,useEffect,useMemo, useRef} from "react"
import {useSelector,useDispatch} from "react-redux"
import 'react-slideshow-image/dist/styles.css'
import { listartistURL,songURL,newsongURL } from "../../urls"
import { partition, timeago } from "../../constants"
import axios from "axios"
import { headers } from "../../actions/auth"
import { Song } from "../follow/Follow"

const Listnewsong=(props)=>{
    const player=useSelector(state => state.player)
    const {currentIndex,play,showinfo,infoRef,keepinfo}=player
    const [listnewsong,setListnewsong]=useState([])
    const datasongs=useSelector(state => state.player.songs)
    const dispatch = useDispatch()
    const {choice}=props
    const newsongs=useMemo(()=>{
        return partition(listnewsong,4)
    },[listnewsong])
    useEffect(()=>{
        ( async ()=>{
            const res=await axios.get(`${newsongURL}?limit=true&filter=${choice}`,headers())
            setListnewsong(res.data)
        })()
        
    },[choice])

    return(
        <div className="columns is-multiline">
            {newsongs.map((item,index)=>
                <div key={index} className="column mar-b-0 is-fullhd-4 is-widescreen-4 is-desktop-4 is-touch-6 is-tablet-6">
                    <div className="list">
                    {item.map(song=>

                        <Song
                        index={index}
                        song={song}
                        key={song.id}
                        />
                    )}
                    </div>
                </div>
            )}
        </div>
    )
}
export default Listnewsong