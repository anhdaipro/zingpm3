
import {useState,useRef} from 'react'
import axios from "axios"
import { songURL,artistInfohURL,streamingURL } from "../urls"
import {actionuser, setsong,showmodal,showplaylist,updatesongs,showinfoArtist} from "../actions/player"
import {useSelector,useDispatch} from "react-redux"
import { headers } from "../actions/auth"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
let widthscreem = window.screen.width
const Songinfo=({song})=>{
  const dispatch = useDispatch()
  const player=useSelector(state => state.player)
  const artistRef=useRef()
  const {showinfo,infoRef,keepinfo,data}=player
  const setshowartist=async (name)=>{
    try{
      
      if(!showinfo ||(showinfo && data.id!=song.id)){
        dispatch(showinfoArtist({showinfo:false,}))
        const res = await axios.get(`${artistInfohURL}?name=${name}`,headers)
        const data=res.data
        const rects=artistRef.current.getBoundingClientRect();
        const {left,right,top,width}=rects
        dispatch(showinfoArtist({showinfo:true,data:{...data,image:'http://localhost:8000'+data.image},left:left>700?null:left,top:top,right:left<700?null:widthscreem-left-width}))
      }
    }
    catch(e){
      console.log(e)
      dispatch(showinfoArtist({showinfo:false,}))
    }
  }
  return(
    <>
      <h3 className="song-name">{song.name}</h3>
      <h4 className="song-artist"><span
      ref={artistRef} onMouseLeave={()=>{
        
        dispatch(showinfoArtist({showinfo:false}))
        
      }} onMouseEnter={()=>{
        if(song.artists.length>0){
        setshowartist(song.artist_name)}}} 
      href={`/${song.artist_name}`}>{song.artist_name}</span></h4>
    </>
  )
}
const PlaySong=({song})=>{
  const dispatch = useDispatch()
  const player=useSelector(state => state.player)
  const datasongs=useSelector(state => state.player.songs)
  const artistRef=useRef()
  const {play,currentIndex}=player
  const setplaysong= async (e)=>{
    e.stopPropagation()
    if(datasongs.every(item=>item.id!=song.id)){
      const addsong=[song,...datasongs]
      dispatch(setsong({change:true,songs:addsong,currentIndex:0,view:false,play:true}))  
    }
    else{
      if(datasongs[currentIndex].id==song.id){
        dispatch(setsong({change:true,play:!play}))
      }
      else{
        dispatch(setsong({change:true,play:true,currentIndex:datasongs.findIndex(item=>item.id==song.id)}))
      }
    }
  }
  return(
    <div onClick={(e)=>setplaysong(e)} className="thumb" style={{position:'relative'}}>
      <div style={{backgroundImage: `url('${song.image_cover}')`,width:'100%',height:'100%',backgroundSize:'cover'}}></div>
        <div style={{display:'flex',justifyContent:'center'}} class="item-center song-item-image-overlay">
          {datasongs.length>0 && song.id === datasongs[currentIndex].id && play?
              <img src="https://mp3-react-vinhbuihd.vercel.app/images/icon-playing.gif" style={{width: '20px', height: '20px'}}/>:
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
            }
        </div>
    </div>
  )
}
export  {Songinfo,PlaySong}
