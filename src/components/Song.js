
import {useState,useRef} from 'react'
import axios from "axios"
import { songURL,artistInfohURL,streamingURL,lyricsongURL } from "../urls"
import {actionuser, setsong,showmodal,showplaylist,updatesongs,showinfoArtist} from "../actions/player"
import {useSelector,useDispatch} from "react-redux"
import { headers } from "../actions/auth"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
let widthscreem = window.screen.width
const Showlyric=({song})=>{
  const dispatch = useDispatch()
  const player=useSelector(state => state.player)
  const {songs,currentIndex,view}=player
  const check_exist=songs.every(item=>item.id!=song.id)
  const setshowlyric= async ()=>{
    try{
      if(!song.sentences){
        const res = await axios.get(`${lyricsongURL}?id=${song.id}`,headers)
        const data=check_exist?[{...song,...res.data},...songs]:songs.map(item=>{
          if(item.id===song.id){
            return({...item,...res.data})
          }
          return({...item,})
        })
        const dataupdate={songs:data,showoption:'lyric',showplaylist:false,change:true,play:true,view:check_exist?false:view,currentIndex:check_exist?0:songs[currentIndex].id==song.id?currentIndex:songs.findIndex(item=>item.id==song.id)}
        dispatch(setsong(dataupdate))
      }
      else{
        dispatch(setsong({showoption:'lyric',showplaylist:false,play:true}))
      }
    }
    catch(e){
      console.log(e)
    }
  } 
  return(
    <button onClick={setshowlyric} class="icon-button">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M388.938 29.47c-23.008 0-46.153 9.4-62.688 25.405 5.74 46.14 21.326 75.594 43.75 94.28 22.25 18.543 52.078 26.88 87.75 28.345 13.432-16.07 21.188-37.085 21.188-58 0-23.467-9.75-47.063-26.344-63.656C436 39.25 412.404 29.47 388.938 29.47zm-76.282 42.374c-8.808 14.244-13.75 30.986-13.75 47.656 0 23.467 9.782 47.063 26.375 63.656 16.595 16.594 40.19 26.375 63.658 26.375 18.678 0 37.44-6.196 52.687-17.093-31.55-3.2-59.626-12.46-81.875-31-23.277-19.397-39.553-48.64-47.094-89.593zm-27.78 67.72l-64.47 83.78c2.898 19.6 10.458 35.1 22.094 46.187 11.692 11.142 27.714 18.118 48.594 19.626l79.312-65.28c-21.2-3.826-41.14-14.11-56.437-29.407-14.927-14.927-25.057-34.286-29.095-54.907zM300 201.468a8 8 0 0 1 .03 0 8 8 0 0 1 .533 0 8 8 0 0 1 5.875 13.374l-34.313 38.78a8.004 8.004 0 1 1-12-10.593l34.313-38.78a8 8 0 0 1 5.562-2.78zM207.594 240L103 375.906c3.487 13.327 7.326 20.944 12.5 26.03 5.03 4.948 12.386 8.46 23.563 12.408l135.312-111.438c-17.067-3.61-31.595-11.003-42.906-21.78-11.346-10.81-19.323-24.827-23.876-41.126zM95.97 402.375c-9.12 5.382-17.37 14.08-23.126 24.406-9.656 17.317-11.52 37.236-2.25 50.47 6.665 4.337 10.566 4.81 13.844 4.344 1.794-.256 3.618-.954 5.624-1.875-3.18-9.575-6.3-20.93-2.5-33.314 3.03-9.87 10.323-19.044 23.47-27.5-2.406-1.65-4.644-3.49-6.75-5.562-3.217-3.163-5.94-6.78-8.313-10.97z"></path></svg>
    </button>
  )
}
const Songinfo=({song})=>{
  const dispatch = useDispatch()
  const player=useSelector(state => state.player)
  const artistRef=useRef()
  const {showinfo,data}=player
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
  const {play,currentIndex}=player
  const check_exist=datasongs.every(item=>item.id!=song.id)
  const setplaysong= async (e)=>{
    e.stopPropagation()
    if(datasongs.every(item=>item.id!=song.id)){
      const addsong=[song,...datasongs]
      dispatch(setsong({change:true,songs:addsong,currentIndex:0,view:false,play:true,showoption:''}))  
    }
    else{
      if(datasongs[currentIndex].id==song.id){
        dispatch(setsong({change:true,play:!play,showoption:''}))
      }
      else{
        dispatch(setsong({showoption:'',change:true,play:true,currentIndex:datasongs.findIndex(item=>item.id==song.id)}))
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
export  {Songinfo,PlaySong,Showlyric}
