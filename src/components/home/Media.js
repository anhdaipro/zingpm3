import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { headers, setrequestlogin,valid } from "../../actions/auth"
const VideoPlayer = (props) => {
    const {player,mediaElement,url,volume,setsong}=props
    const dispatch=useDispatch()
    const {duration,change,play,currentIndex,songs,view,time}=player
   
    useEffect(()=>{
        if(duration){
            mediaElement.current.volume=volume
        }
    },[duration,volume])
    
    useEffect(()=>{
        if(duration && change){
            if(play){
                mediaElement.current.play()
            }
            else{
                mediaElement.current.pause()
            }
        }
    },[duration,play,change])

    useEffect(()=>{
        ( async ()=>{
            try{
                if(view){
                    const res = await axios.post(`${url}/${songs[currentIndex].id}`,JSON.stringify({action:'view'}),headers())
                }
            }
            catch(e){
                console.log(e)
            }
        })()
        
    },[view,currentIndex])

    useEffect(()=>{
        if(duration){
            if(mediaElement.current){
                let totalPlayed = 0;
                const played = mediaElement.current.played;
                for (let i = 0; i < played.length; i++) {
                    totalPlayed += played.end(i) - played.start(i);
                }
                
                if(totalPlayed>=duration/2){
                    dispatch(setsong({change:true,view:true}))
                }
            }
        }
    },[duration,time,dispatch])

    return (
    <>
        {props.children}
    </>)
  };
  
  export default VideoPlayer;