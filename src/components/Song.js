
import {useState,useRef} from 'react'
import axios from "axios"
import { artistInfohURL,lyricsongURL,originURL,songURL,videosongURL } from "../urls"
import {setsong,showinfoArtist,updatesongs} from "../actions/player"
import {useSelector,useDispatch} from "react-redux"
import { expirationDate, expiry, headers,setrequestlogin,token,valid } from "../actions/auth"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { setshowvideo } from '../actions/mv'

let widthscreem = window.screen.width
const Showmv=({song})=>{
  const dispatch = useDispatch()
  const player=useSelector(state => state.player)
  const {songs}=player
  const openvideo=async ()=>{
    if(song.mv){
        dispatch(setshowvideo({showvideo:true,song:song,change:true,play:true,currentIndex:0}))
        dispatch(setsong({play:false}))
    }
    else{
        const res =await axios.get(`${videosongURL}?id=${song.video}`)
        const datasongs=songs.map(item=>{
            if(item.id===song.id){
                return({...item,mv:res.data})
            }
            return({...item,})
        })
        dispatch(setsong({songs:datasongs,play:false}))
        dispatch(setshowvideo({change:true,currentIndex:0,play:true,showvideo:true,song:{...song,mv:res.data}}))
    }
  }
  return(
    <button onClick={openvideo} disabled={song.video?false:true} className="icon-button">
      <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000" xmlSpace="preserve">
        <g><path d="M508.4,347.9c-1,0-1.9,0.2-2.9,0.3c-0.1,0-0.2,0-0.3,0c-1,0.1-1.9,0.2-2.8,0.5c-7.3,1.3-14,5.5-18.1,12.3L373.2,572L262.1,360.5c-6-10.1-17.9-14.6-28.9-12.1c-0.2,0-0.3,0.1-0.5,0.1c-1.1,0.3-2.1,0.6-3.1,1c-1,0.4-2,0.8-3,1.3c-0.2,0.1-0.4,0.2-0.6,0.3c-0.1,0-0.1,0.1-0.2,0.2c-3,1.7-5.6,3.9-7.7,6.6c0,0,0,0,0,0.1c-2,2.5-3.4,5.4-4.3,8.6c-0.1,0.2-0.1,0.3-0.2,0.5c-0.5,2-0.9,4.1-0.9,6.3v253.4c0,14,11.4,25.3,25.3,25.3c14,0,25.3-11.4,25.3-25.3V476.1l85.8,163.4c6.3,10.7,19.3,15.2,30.9,11.7c7-1.5,13.3-5.7,17.2-12.1l85.8-162.8v150.6c0,14,11.4,25.3,25.3,25.3c14,0,25.3-11.4,25.3-25.3V373.3C533.8,359.3,522.4,347.9,508.4,347.9z"/><path d="M789.5,350.2c-12.6-5.8-27.4,0-33,13l-79,195.1l-79-195.1c-5.6-13-20.4-18.8-33-13c-12.6,5.8-18.2,21.1-12.6,34.1L653,631.7c1.6,7.7,6.3,14.6,13.8,18.1c3.5,1.6,7.1,2.2,10.7,2.2c3.6,0.1,7.2-0.6,10.7-2.2c7.5-3.5,12.1-10.4,13.8-18.1L802,384.3C807.7,371.3,802.1,356,789.5,350.2z"/><path d="M787.2,60.7H212.8C100.8,60.7,10,151.5,10,263.4v473.1c0,112,90.8,202.8,202.8,202.8h574.5c112,0,202.8-90.8,202.8-202.8V263.5C990,151.5,899.2,60.7,787.2,60.7z M939.3,736.6c0,84-68.1,152.1-152.1,152.1H212.8c-84,0-152.1-68.1-152.1-152.1V263.5c0-84,68.1-152.1,152.1-152.1h574.5c84,0,152.1,68.1,152.1,152.1V736.6z"/></g>
      </svg>
    </button>
  )
}
const Showlyric=({song})=>{
  const dispatch = useDispatch()
  const player=useSelector(state => state.player)
  const {songs,currentIndex,view}=player
  const check_exist=songs.every(item=>item.id!=song.id)
  const setshowlyric= async ()=>{
    try{
      if(!song.sentences){
        const res = await axios.get(`${lyricsongURL}?id=${song.id}`)
        const data=check_exist?[{...song,...res.data},...songs]:songs.map(item=>{
          if(item.id===song.id){
            return({...item,...res.data})
          }
          return({...item,})
        })
        const dataupdate={songs:data,showoption:'lyric',play:true,showplaylist:false,change:true,view:check_exist?false:view,currentIndex:check_exist?0:songs[currentIndex].id==song.id?currentIndex:songs.findIndex(item=>item.id==song.id)}
        dispatch(setsong(dataupdate))
      }
      else{
        dispatch(setsong({showoption:'lyric',showplaylist:false,change:true,play:true}))
      }
    }
    catch(e){
      console.log(e)
    }
  } 
  return(
    <button onClick={setshowlyric} disabled={song.hasLyric?false:true} className="icon-button">
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M388.938 29.47c-23.008 0-46.153 9.4-62.688 25.405 5.74 46.14 21.326 75.594 43.75 94.28 22.25 18.543 52.078 26.88 87.75 28.345 13.432-16.07 21.188-37.085 21.188-58 0-23.467-9.75-47.063-26.344-63.656C436 39.25 412.404 29.47 388.938 29.47zm-76.282 42.374c-8.808 14.244-13.75 30.986-13.75 47.656 0 23.467 9.782 47.063 26.375 63.656 16.595 16.594 40.19 26.375 63.658 26.375 18.678 0 37.44-6.196 52.687-17.093-31.55-3.2-59.626-12.46-81.875-31-23.277-19.397-39.553-48.64-47.094-89.593zm-27.78 67.72l-64.47 83.78c2.898 19.6 10.458 35.1 22.094 46.187 11.692 11.142 27.714 18.118 48.594 19.626l79.312-65.28c-21.2-3.826-41.14-14.11-56.437-29.407-14.927-14.927-25.057-34.286-29.095-54.907zM300 201.468a8 8 0 0 1 .03 0 8 8 0 0 1 .533 0 8 8 0 0 1 5.875 13.374l-34.313 38.78a8.004 8.004 0 1 1-12-10.593l34.313-38.78a8 8 0 0 1 5.562-2.78zM207.594 240L103 375.906c3.487 13.327 7.326 20.944 12.5 26.03 5.03 4.948 12.386 8.46 23.563 12.408l135.312-111.438c-17.067-3.61-31.595-11.003-42.906-21.78-11.346-10.81-19.323-24.827-23.876-41.126zM95.97 402.375c-9.12 5.382-17.37 14.08-23.126 24.406-9.656 17.317-11.52 37.236-2.25 50.47 6.665 4.337 10.566 4.81 13.844 4.344 1.794-.256 3.618-.954 5.624-1.875-3.18-9.575-6.3-20.93-2.5-33.314 3.03-9.87 10.323-19.044 23.47-27.5-2.406-1.65-4.644-3.49-6.75-5.562-3.217-3.163-5.94-6.78-8.313-10.97z"></path></svg>
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
        const res = await axios.get(`${artistInfohURL}?name=${name}`,headers())
        const data=res.data
        const rects=artistRef.current.getBoundingClientRect();
        const {left,right,top,width}=rects
        dispatch(showinfoArtist({showinfo:true,artistRef:artistRef,data:data,left:left>700?null:left,top:top,right:left<700?null:widthscreem-left-width}))
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
        ref={artistRef} onMouseEnter={()=>{
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
  const {play,currentIndex,duration}=player

  const setplaysong= async (e)=>{
    e.stopPropagation()
    if(datasongs.every(item=>item.id!=song.id)){
      const addsong=[song,...datasongs]
      dispatch(setsong({change:true,duration:0,songs:addsong,play:true,currentIndex:0,view:false,showoption:''}))  
    }
    else{
      if(datasongs[currentIndex].id==song.id){
        dispatch(setsong({change:true,play:!play,showoption:'',loading:true}))
      }
      else{
        dispatch(setsong({showoption:'',duration:0,play:true,loading:true,change:true,currentIndex:datasongs.findIndex(item=>item.id==song.id)}))
      }
    }
  }
  return(
    <div onClick={(e)=>setplaysong(e)} className="thumb" style={{position:'relative'}}>
      <img style={{width:'100%',height:'100%',backgroundSize:'cover'}} src={`${song.image_cover}`} />
      
        <div style={{display:'flex',justifyContent:'center'}} className="item-center song-item-image-overlay">
            {datasongs.length>0 && song.id === datasongs[currentIndex].id?
              duration>0?play?<img src="https://mp3-react-vinhbuihd.vercel.app/images/icon-playing.gif" style={{width: '20px', height: '20px'}}/>:
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg"  xmlnsXlink="http://www.w3.org/1999/xlink"  width="40px" height="40px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">                     
              <g transform="rotate(0 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(30 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(60 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(90 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(120 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(150 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(180 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(210 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(240 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(270 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(300 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
              </rect>
              </g><g transform="rotate(330 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                  <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
              </rect>
              </g>
              </svg>:
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
            }
        </div>
    </div>
  )
}

const Likedsong=(props)=>{
  const {song,setsongs,songs,className}=props
 
  const dispatch = useDispatch()
  const user=useSelector(state => state.auth.user)
  const datasongs=useSelector(state => state.player.songs)
  const setliked= async (name,value)=>{
    try{
      console.log(expiry())
      if(token() && expiry()>0){
        const res=await axios.post(`${songURL}/${song.id}`,JSON.stringify({action:'like'}),headers())
        if(songs){
          const dataupdate=songs.map(item=>{
              if(song.id==item.id){
                  return({...item,[name]:value})
              }
              return({...item})
          })
          setsongs(dataupdate)
        }
        const data=datasongs.map(item=>{
          if(song.id==item.id){
              return({...item,[name]:value})
          }
          return({...item})
      })
        toast(<span>{value?'Đã thêm bài hát vào thư viện':'Đã xóa bài hát khỏi thư viện'}</span>,{  
                position:toast.POSITION.BOTTOM_LEFT,
                className:'toast-message',
            });
        dispatch(updatesongs(data))
        }
        else{
            dispatch(setrequestlogin(true))
        }
    }
    catch(e){
        console.log(e)
    }
  }
  return(
    <button onClick={()=>setliked('liked',!song.liked)} className={className} aria-label="Yêu thích">
      <svg className={song.liked?'fill-heart':''} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        {song.liked?<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
        :<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>}
      </svg>
    </button>
  )
}
export  {Songinfo,PlaySong,Showlyric,Likedsong,Showmv}
