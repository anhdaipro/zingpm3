
import {useState,useEffect,useRef,useMemo,useCallback} from 'react'
import axios from "axios"
import { songURL,artistInfohURL,newsongURL } from "../urls"
import { headers } from "../actions/auth"
import Song from "./home/Song"

const Newsongs=()=>{
    const [listnewsong,setListnewsong]=useState([])

    useEffect(()=>{
        ( async ()=>{
            const res=await axios.get(`${newsongURL}`,headers())
            setListnewsong(res.data)
        })()
        
    },[])
    const setsongs=useCallback(
        (data) => {
            setListnewsong(data)
        },
        [],
    )
    return(
        <div className="body-wrapper">
            {listnewsong.map((song,index)=>
                <Song
                    song={song}
                    songs={listnewsong}
                    key={song.id}
                    index={index}
                    setsongs={data=>setsongs(data)}
                />
            )}
        </div>
    )
}
export default Newsongs