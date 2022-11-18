import {useSelector,useDispatch} from "react-redux"
import {useState,useEffect,useRef,useMemo,useCallback} from 'react'
import styled from "styled-components"
import axios from "axios"
import { songURL,artistInfohURL,newsongURL } from "../urls"
import {actionuser, setsong,showmodal,showplaylist,updatesongs,showinfoArtist} from "../actions/player"
import Actionsong from "./home/Actionsong" 
import { headers } from "../actions/auth"

import { Songinfo, PlaySong } from "./Song"
import Song from "./home/Song"


const Newsongs=()=>{
    const [listnewsong,setListnewsong]=useState([])

    useEffect(()=>{
        ( async ()=>{
            const res=await axios.get(`${newsongURL}`,headers)
        setListnewsong(res.data.map(item=>{
            return({...item,image_cover:'http://localhost:8000'+item.image_cover,url:'http://localhost:8000'+item.url})
        }))
        })()
        
    },[])
    const setsongs=useCallback(
        (data) => {
            setListnewsong(data)
        },
        [listnewsong],
    )
    return(
        <div className="body-wrapper">
            {listnewsong.map((song,index)=>
                <Song
                    song={song}
                    songs={listnewsong}
                    index={index}
                    setsongs={data=>setsongs(data)}
                />
            )}
        </div>
    )
}
export default Newsongs