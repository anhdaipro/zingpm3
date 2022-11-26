import { useEffect, useRef, useState,useMemo } from "react"
import { useSelector,useDispatch } from "react-redux"
import { headers } from "../../actions/auth"
import { setshowvideo, setsong } from "../../actions/player"
import styled from "styled-components"
import { listmvURL, originURL, songURL, videosongURL } from "../../urls"
import axios from "axios"
import ReactPlayer from 'react-player'
import PropTypes from 'prop-types';

const Item=styled.div`
    position: relative;
    min-height: 1px;
    padding-left: 14px;
    padding-right: 14px;
    float: left;
    flex-shrink: 0;
.info-artist{
    padding:10px 0
};
.item-media{
    position:relative;
    overflow:hidden;
    cursor:pointer;
    .duration{
        display: inline-block;
        font-size: 12px;
        line-height: normal;
        color: #fff;
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 3px 5px;
        border-radius: 4px;
        background-color: rgba(0,0,0,.7);
    };
    .media-cover{
        transition:transform 0.7s ease;
        width:100%;
        background-size:cover;
        background-position: 50%;
        padding-bottom: 56.25%;
    };
    
    .image-hover{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--dark-alpha-50);
        visibility: hidden;
        &.play{
            visibility: visible;
        };
        .zm-brand-playing {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 100%;
            top: 50%;
            z-index: 99;
            transform: translateY(-50%);
            font-size: 14px;
            color: var(--white);
        }
    };
    &:hover .image-hover{
        visibility: visible;
    };
    &:hover .media-cover{
        transform:scale(1.1)
    };
    
}`
const Videocontent=styled.div`
position:relative;
&.video-fullcreem{
    padding:0;
    .queue-player{
        display:none
    }
} 
.zm-carousel__container ${Item}{
    width:25%;
    @media (max-width: 678px) {
        width:50%;
    };
    @media (max-width: 378px) {
        width:100%;
    }
};
.avatar{
    border-radius:50%;
    overflow:hidden
};
.home-popup__close-button{
    width: 16px;
    height: 16px;
}
.video-play{
    width: calc(100% - 350px);
    display: block;
    flex-shrink: 1;
    padding: 0 15px;
    @media (max-width: 1048px) {
        width:100%;
      }
};
.z--player.player-full-screem{
    height:100%;
    position: relative;
    padding-bottom: 0;
    position:fixed;
    top:0;
    left:0;
    bottom:0
};
.queue-player{
    width:350px
};
.video-queue is-horizontal{
    position: relative;
    color: #fff;
    margin: 30px auto 0;
    border-radius: 4px;
    overflow: hidden;
    width: 95vw;
}

`
const SeekBarProgress=styled.div`
    height: 2px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    
`
const ControlVideo=styled.div`
.rhap_volume-container {
    flex:0 1 120px;
    .rhap_volume-bar-area{
        width:80px
    }
};
.control-time{
    line-height: 4em;
    padding: 0;
    display: flex;
    align-items: center;
    margin-left: 0.7em;
    margin-right: 0.7em;
    font-size: 1.1em;
    >span{
        font-weight: 500;
        line-height: 2em;
        color: #f7f7f7;
        display: inline-block;
        font-size: 1.2em;
    };
    >span:first-child {
        padding-right: 0.5em;
    };
    >span:last-child {
        padding-left: 0.5em;
    }

};
`
const SeekBarCircle=styled.div`
    width: 12px;
    height: 12px;
    display:none;
    background-color: rgb(255, 255, 255);
    border-radius: 12px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 1;
`

const SeekBar=styled.div`
    height: 2px;
    width: 100%;
    background-color: #721799;;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transform-origin: left center;
    &.volume{
        background-color: #fff;
    }
`
const Contentprogess=styled.div`
position:relative;
flex:1;
margin:0 8px;
height:16px;
.--z--bar-fill-load{
    background-color: rgb(184, 184, 184);
    position: absolute;
    left:0;
    cursor:pointer;
    top:50%;
    transform: translateY(-50%);
    height: 2px;
};
&:hover .--z--bar-fill-load{
    height:4px
};
.seek-time{
    position:absolute;
    color: #f7f7f7;
    background-color: rgba(0,0,0,0.6);
    border-radius: 0.2em;
    color: #f7f7f7;
    padding: 0.2em 0.5em;
    font-size: 1.1em;
    white-space: nowrap;
    top: -1.9em;
};
&:hover .progress{
    height: 4px;
    
};
&:hover .seekbar{
    height: 4px;
};
&:hover .seekbarcircle{
    display:block
}

`
const Flexcenter=styled.div`
display:flex;
background-color: #120c1c;
color:#fff;
padding:8px 8px;
align-items:center

`

const  randomIntFromInterval=(min, max)=> { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
const Video=(props)=>{
    const {item,play,currentIndex,listmv,setplay,setcurrentIndex,index}=props
    const setplaymv=(e)=>{
        e.stopPropagation()
        if(currentIndex!==index){
            setplay(true)
            setcurrentIndex(index)
        }
        else{
            setplay(!play)
        } 
    }
    return(
        <Item key={item.id} className="item">
            <div className="item-media">
                <div className="media-cover" style={{backgroundImage: `url(${originURL+item.mv.file_preview})`}}/>
                <div className="duration">{('0'+Math.floor(item.mv.duration/60)).slice(-2)}:{('0'+Math.floor(item.mv.duration)  % 60).slice(-2)}</div>
                <div onClick={setplaymv}
                 className={`image-hover ${index === currentIndex &&play?'play':''} item-center`}>
                    {index === currentIndex && play?
                    <div className="zm-brand-playing">Đang phát</div>:
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>}
                   
                </div>
            </div>
            <div className="info-artist">
                <div className="info">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="subtitle">{item.artist_name}</div>
                </div>
            </div>
        </Item>
    )
}
Video.propTypes = {
    item:PropTypes.object.isRequired,
    currentIndex:PropTypes.number.isRequired,
    play:PropTypes.bool.isRequired,
    
    setplay:PropTypes.func.isRequired,
    index:PropTypes.number.isRequired,
    setcurrentIndex:PropTypes.func.isRequired,
}
const MV=()=>{
    const player=useSelector(state=>state.player)
    const {song}=player
    const dispatch = useDispatch()
    const [muted,setMuted]=useState(false)
    const [time,setTime]=useState({seconds:0,minutes:0})
    const [play,setPlay]=useState(true)
    const [repeat,setRepeat]=useState(false)
    const [currentIndex,setcurrentIndex]=useState(0)
    const [listmv,setListmv]=useState([])
    const [volume,setVolume]=useState(0.5)
    const [duration,setDuration]=useState(0)
    const [percentload,setPercentload]=useState(0)
    const timeref=useRef()
    const [state,setState]=useState({width:document.documentElement.clientWidth})
    const timer=useRef()
    const [ramdom,setRamdom]=useState(false)
    const [drag,setDrag]=useState({time:false,volume:false})
    const percent=useMemo(()=>{
        const currentTime=time.seconds+time.minutes*60
        return duration?currentTime/duration:0
    },[time.seconds,time.minutes])
    
    useEffect(()=>{
        (async()=>{
            const res = await axios.get(listmvURL,headers)
            setListmv(res.data)
            const mvupdate=res.data.filter(item=>item.id!=song.id)
            setListmv([song,...mvupdate])
        })()
        
    },[song.id])
    const mv=listmv.length>0?listmv[currentIndex]:song
    const videoRef=useRef()
    const forward=(e)=>{
        if(ramdom){
            const indexchoice=randomIntFromInterval(currentIndex+1,listmv.length-1)
            setPlay(true)
            setcurrentIndex(currentIndex>=listmv.length-1?0:indexchoice)
        }
        else{
            const indexchoice=currentIndex+1>listmv.length-1?0:currentIndex+1
            setPlay(true)
            setcurrentIndex(indexchoice)
        }
    }
    
    useEffect(()=>{
        if(duration){
            if(videoRef.current && !drag.time){
                videoRef.current.volume=volume
            }
        }
    },[duration,videoRef,volume,drag.time])
    
    useEffect(()=>{
        if(duration){
            if(videoRef.current){
                if(play){
                    videoRef.current.play()
                }
                else{
                    videoRef.current.pause()
                }
            }
        }
    },[duration,videoRef,play])
    const [timeshow,setTimeshow]=useState(0)
    const [showtime,setShowtime]=useState(false)
    const settimeshow=(e)=>{
        
        setShowtime(true)
        const rects = timeref.current.getBoundingClientRect();
        const {left,width}=rects
        const clientX=e.clientX
        const percent=(clientX-left)/width
        const times=percent*duration
        setTimeshow(times)
    }
    const settimeaudio=(event)=>{
        event.preventDefault()
        setDrag({...drag,time:true})
        const rects = timeref.current.getBoundingClientRect();
        const {left,width}=rects
        const clientX=event.clientX
        const percent=(clientX-left)/width
        const times=percent*duration
        const minutes=Math.floor(times/60)
        const seconds=Math.floor(times-minutes*60)
        console.log(minutes)
        console.log(seconds)
        videoRef.current.currentTime=times
        console.log(videoRef.current)
        setTime(prev=>{return{...prev,seconds:seconds,minutes:minutes}})
        
    }
    const volumeref=useRef()
    
    useEffect(()=>{
        const setprogess=(e)=>{
            settime(e)
            setvolume(e)
        }
        const setvolume=(e)=>{
            if(drag.volume){
                const rects = volumeref.current.getBoundingClientRect();
                const left =rects.left
                const clientX=e.clientX
                const width=rects.width
                const min=left
                const max=left+width
                const percent=clientX<min?0:clientX>max?1:(clientX-left)/width
                if(percent>0){
                    setMuted(false)
                }
                else{
                    setMuted(true)
                }
                setVolume(percent)
            }
        }
        
        const settime=(e)=>{
            
            if(drag.time){
                const rects = timeref.current.getBoundingClientRect();
                const clientX=e.clientX
                const left =rects.left
                const width=rects.width
                const min=left
                const max=left+width
                const percent=clientX<min?0:clientX>max?1:(clientX-left)/width
                const times=percent*duration
                setTime(prev=>{return{...prev,seconds:times % 60,minutes:Math.floor((times) / 60) % 60}})
                videoRef.current.currentTime=times
                videoRef.current.volume=0
                
            }
        }
        document.addEventListener('mousemove',setprogess)
        
        return ()=>{
            document.removeEventListener('mousemove',setprogess)
        }
    },[drag.time,timeref,drag.volume,volumeref,duration])

    
    
    useEffect(()=>{
        const setdrag=(e)=>{
            setDrag(prev=>{return{...prev,time:false,volume:false}})
           
        }
        document.addEventListener('mouseup',setdrag)
        return ()=>{
            document.removeEventListener('mouseup',setdrag)
        }
    },[drag,time,duration])
    
   
    const backward=(e)=>{
        e.stopPropagation()
        if(ramdom){
            const indexchoice=randomIntFromInterval(0,currentIndex-1)
            setcurrentIndex(currentIndex==0?listmv.length-1:indexchoice)
            setPlay(true)
        }
        else{
            const indexchoice=currentIndex==0?listmv.length-1:currentIndex-1
            setcurrentIndex(indexchoice)
            setPlay(true)
        }
    }
    const setrepeat=()=>{
        
        setRepeat(!repeat)
        
    }
    
    const setVolumevideo=(e)=>{
        e.stopPropagation()
        const rects = volumeref.current.getBoundingClientRect();
        const clientX=e.clientX
        const left =rects.left
        const width=rects.width
        const percent=(clientX-left)/width
        if(percent>0){
            setMuted(false)
        }
        else{
            setMuted(true)
        }
        setVolume(percent)
    }
   
    useEffect(()=>{
        const setwidth=()=>{
            setState({...state,width:document.documentElement.clientWidth})
        }
        window.addEventListener('resize',setwidth)
        return ()=>window.removeEventListener('resize',setwidth)
    })

    const videocontent=useRef()
    const [fullscreem,setFullscreem]=useState(false)
    function openFullscreen() {
        var elem=videocontent.current
        setFullscreem(true)
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
    function isVideoInFullscreen() {
        if (document.fullscreenElement) {
          return true;

        }
        return false;
    }
    function closeFullscreen() {
        var elem=videocontent.current
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
    const setlikemv= async (value)=>{
        const res= await axios.post(videosongURL,JSON.stringify({action:'like',id:mv.mv.id}),headers)
        setListmv(current=>current.map(item=>{
            if(item.id==mv.id){
                return({...item,mv:{...item.mv,liked:value}})
            }
            return({...item,})
        }))
    }
    return(
            <div className="zm-video-modal zm-video-animation-enter-done">
                <div id="video-scroll" >
                    <div className={`video-wrapper ${isVideoInFullscreen()?'video-fullcreem':''}`}>
                        <div className="video-blur-bg ">
                            <div className="video-blur-image">
                                <canvas className="react-blur-canvas" width="735" height="657" ></canvas>
                            </div>
                        </div>
                        <Videocontent ref={videocontent} className={`video-container ${isVideoInFullscreen()?'video-fullcreem':''}`}>
                            <div className="video-header">
                                <div className="item-space">
                                    <div class="level-left">
                                        <div class="level-item item-space">
                                            <div class="media">
                                                <div class="avatar mr-8">
                                                   <img src={`${originURL}${mv.user?mv.user.avatar:''}`} alt=""/>
                                                </div>
                                                <div class="media-content">
                                                    <div class="title">{mv.name}</div>
                                                    <div class="subtitle is-one-line">
                                                        <a class="is-ghost" href="/nguyendinhvu">Nguyễn Đình Vũ</a>, 
                                                        <a class="is-ghost" href="/nghe-si/ACV-Music">ACV</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="media-right ml-16 item-center">
                                                <button onClick={()=>setlikemv(!mv.mv.liked)} class="zm-btn zm-tooltip-btn mr-8 animation-like active is-hover-circle button" tabindex="0">
                                                    <svg className={mv.liked?'fill-heart':''} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                                                        {mv.mv.liked?<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
                                                        :<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>}
                                                    </svg>
                                                </button>
                                                <button onClick={()=>{
                                                    dispatch(setshowvideo({showvideo:false}))
                                                    dispatch(setsong({play:true,view:false,change:true}))}} class="zm-btn zm-tooltip-btn mr-8 is-hover-circle button" tabindex="0">
                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"></path><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"></path></svg>
                                                </button>
                                                <div class="header-more-menu">
                                                    <button class="zm-btn zm-tooltip-btn is-hover-circle button" tabindex="0">
                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="level-right">
                                        <button onClick={()=>dispatch(setshowvideo({showvideo:false}))} class="zm-tooltip-btn"><svg viewBox="0 0 16 16" stroke="#EE4D2D" class="home-popup__close-button"><path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path><path stroke-linecap="round" d="M15,1L0.9,15.1"></path></svg></button>
                                    </div>
                                </div>
                            </div>
                            <div className="video-body">    
                            <div className="columns is-multiline">     
                                <div  className="video-play">
                                <div  className={`z--player ${isVideoInFullscreen()?'player-full-screem':''}`} data-player="" tabindex="1">
                                    <video playsinline 
                                    onPlay={()=>{
                                        setPlay(true)
                                    }} 
                                    onPause={()=>setPlay(false)} 
                                    onEnded={()=>{
                                        const value=currentIndex==listmv.length-1?0:currentIndex+1
                                        setcurrentIndex(value)
                                        console.log(value)
                                        setPlay(true)
                                        
                                    }}
                                    onTimeUpdate={()=>{
                                        
                                            
                                                if(!drag.time && duration){
                                                setTime(prev=>{return{...prev,seconds:videoRef.current.currentTime % 60,minutes:Math.floor((videoRef.current.currentTime) / 60) % 60}})
                                                }
                                           
                                            
                                        
                                    }}
                                    onProgress={(e)=>{
                                        if(duration){
                                            var v = videoRef.current
                                            var r = v.buffered;
                                            var total = v.duration;
                                            var start = r.start(0);
                                            var end = r.end(0);
                                            
                                            setPercentload((end/total)*100)
                                    }
                                    }}             
                                    
                                    onLoadedData={(e)=>{
                                        
                                            setDuration(videoRef.current.duration) 
                                          
                                                                 
                                    }} 
                                    
                                     ref={videoRef} preload="auto" src={originURL+mv.mv.file} muted={muted}></video>
                                    <div className="zpl-settings-menu">
                                        <div className="zpl-panel">
                                            <div className="panel-scroll-wrapper">
                                                <div className="zpl-panel-inner">
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controls-wrapper">
                                        <div class="song-player-slider item-center">
                                            
                                                <Contentprogess onMouseMove={(e)=>settimeshow(e)} onMouseLeave={()=>setShowtime(false)}
                                                    onMouseDown={(e)=>{
                                                    settimeaudio(e)
                                                    }} ref={timeref}>
                                                    <SeekBarProgress className="progress"></SeekBarProgress>
                                                    <SeekBarCircle className="seekbarcircle" style={{left:`${percent*100}%`}}></SeekBarCircle>
                                                    <span className="bar --z--bar-fill-load" style={{backgroundColor: `rgb(184, 184, 184)`, width: `${percentload}%`}}></span>
                                                    <SeekBar className="seekbar" style={{width:`${percent*100}%`}}></SeekBar>
                                                    <span className={`seek-time ${showtime?'':'hiden'}`} style={{left: `${timeshow*100/duration}%`, marginLeft: `-19.5px`}}>{('0'+Math.floor((timeshow) / 60) % 60).slice(-2)}:{('0'+Math.floor(timeshow)  % 60).slice(-2)}</span>
                                                </Contentprogess>
                                                
                                        </div>
                                        <ControlVideo className="control-video flex">
                                            <div className="control-left">
                                                <div class="song-player-control item-center">
                                                    <div onClick={backward} className="song-player-button">
                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
                                                    </div>
                                                    <div className="song-player-button">
                                                        <svg onClick={()=>{
                                                            setPlay(!play)
                                                        
                                                            }} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="40px" width="36px" xmlns="http://www.w3.org/2000/svg">
                                                                
                                                                {play?<path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"></path>:<path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path>}
                                                        </svg>
                                                    </div>
                                                    <div onClick={forward} className="song-player-button">
                                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
                                                    </div>
                                                    <div onClick={setrepeat} className={`shuffle song-player-button small ${repeat?'active':''}`} style={{fontSize: '24px'}}>
                                                        <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18.3701 7.99993L13.8701 10.598V8.99993H6.88989V12.9999H4.88989V6.99993H13.8701V5.40186L18.3701 7.99993Z" fill="currentColor"></path><path d="M10.1299 16.9999H19.1101V10.9999H17.1101V14.9999H10.1299V13.4019L5.62988 15.9999L10.1299 18.598V16.9999Z" fill="currentColor"></path></svg>
                                                    </div> 
                                                </div>
                                                <div className="flex-center">
                                                    <div className="control-time flex-center">
                                                        <span className="song-player-slider-current-time">{('0'+time.minutes).slice(-2)}:{('0'+Math.round(time.seconds)).slice(-2)}</span>
                                                        <span className='dot'>|</span>
                                                        <span className="song-player-slider-duration">{('0'+Math.floor((duration) / 60) % 60).slice(-2)}:{('0'+Math.floor(duration)  % 60).slice(-2)}</span> 
                                                    </div>
                                                    <span class="flex-center">
                                                        <div class="rhap_volume-container ">
                                                            <button onClick={()=>{
                                                                setMuted(!muted)
                                                                if(muted){
                                                                    setVolume(0.5)
                                                                }
                                                                else{
                                                                    setVolume(0)
                                                                }
                                                                }} aria-label="Mute" type="button" class="rhap_button-clear icon-button icon-buttom">
                                                                <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" focusable="false" width="20px" height="20px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style={{transform: `rotate(360deg)`}}>
                                                                    {muted?<path d="M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12z" fill="currentColor"></path>
                                                                    :<path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77c0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"></path>}
                                                                </svg>
                                                            </button>
                                                            <div ref={volumeref} onMouseDown={(e)=>{
                                                                setDrag({...drag,volume:true})
                                                                setVolumevideo(e)
                                                            }}
                                                            class="rhap_volume-bar-area">
                                                                <div class="rhap_volume-bar">
                                                                    <SeekBarProgress className="progress"></SeekBarProgress>
                                                                    <div class="rhap_volume-indicator" style={{left: `${volume*100}%`, transitionDuration: `0s`,backgroundColor:'#fff'}}></div>
                                                                    <SeekBar className="seekbar volume" style={{width:`${volume*100}%`}}></SeekBar>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="control-right">
                                                <button class="ytp-button" title="Autoplay is on">
                                                    <div class="ytp-autonav-toggle-button-container">
                                                        <div class="ytp-autonav-toggle-button" aria-checked="true"></div>
                                                    </div>
                                                </button>
                                                <div className="song-player-button small control-repeat-btn" title="Lặp lại">
                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M17 17h-1.559l-9.7-10.673A1 1 0 0 0 5.001 6H2v2h2.559l4.09 4.5-4.09 4.501H2v2h3.001a1 1 0 0 0 .74-.327L10 13.987l4.259 4.686a1 1 0 0 0 .74.327H17v3l5-4-5-4v3z"></path><path d="M15.441 8H17v3l5-3.938L17 3v3h-2.001a1 1 0 0 0-.74.327l-3.368 3.707 1.48 1.346L15.441 8z"></path></svg>
                                                </div>
                                                <button class="ytp-button song-player-button small ytp-settings-button" title="Settings" data-tooltip-target-id="ytp-settings-button" aria-label="Settings">
                                                    <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff" id="ytp-id-19"></path></svg>
                                                </button>
                                                <button class="ytp-miniplayer-button song-player-button small ytp-button"  aria-label="Miniplayer (i)">
                                                    <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z" fill="#fff" id="ytp-id-21"></path></svg>
                                                </button>
                                                <button class="ytp-size-button song-player-button small ytp-button" title="Theater mode (t)">
                                                    <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-22"></path></svg></button>
                                                <button onClick={()=>{
                                                    if(isVideoInFullscreen()){
                                                        closeFullscreen()
                                                    }
                                                    else{
                                                        openFullscreen()
                                                    }
                                                    
                                                }} class="ytp-fullscreen-button song-player-button small ytp-button" aria-keyshortcuts="f" data-title-no-tooltip="Full screen" aria-label="Full screen keyboard shortcut f" title="Full screen (f)">
                                                    <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><g class="ytp-fullscreen-button-corner-0"><path class="ytp-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" id="ytp-id-7"></path></g><g class="ytp-fullscreen-button-corner-1"><path class="ytp-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" id="ytp-id-8"></path></g><g class="ytp-fullscreen-button-corner-2"><path class="ytp-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" id="ytp-id-9"></path></g><g class="ytp-fullscreen-button-corner-3"><path class="ytp-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" id="ytp-id-10"></path></g></svg></button>
                                            </div>
                                        </ControlVideo>
                                                        
                                    </div>
                                    </div>
                                </div>
                                <div className="queue-player column">
                                    <div className="video-queue is-horizontal">
                                        <div>
                                            <div>Danh sách phát</div>
                                            <div>
                                                Tự động phát
                                                <div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="zm-carousel">
                                        <div className={`${state.width<1048?'zm-carousel__container':'flex-col'}`}>
                                            {listmv.map((item,index)=>
                                                <Video
                                                    item={item}
                                                    index={index}
                                                    currentIndex={currentIndex}
                                                    listmv={listmv}
                                                    play={play}
                                                    setcurrentIndex={data=>setcurrentIndex(data)}
                                                    setplay={data=>setPlay(data)}
                                                />
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                </div> 
                            </div>
                        </Videocontent>
                        
                    </div>
                </div>
            </div>
         
    )
}
export default MV