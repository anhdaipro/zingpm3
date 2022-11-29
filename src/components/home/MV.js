import { useEffect, useRef, useState,useMemo } from "react"
import { useSelector,useDispatch } from "react-redux"
import { headers } from "../../actions/auth"
import { setshowvideo} from "../../actions/mv"
import { setsong } from "../../actions/player"
import styled from "styled-components"
import { listmvURL, songURL, videosongURL } from "../../urls"
import axios from "axios"
import PropTypes from 'prop-types';
import { useParams } from "react-router"
import VideoPlayer from "./Media"

export const Item=styled.div`
    position: relative;
    min-height: 1px;
    min-width:200px;
    float: left;
    flex-shrink: 0;
.item-content{
    display:flex;
    align-items:center;
    padding: 5px 10px;
    @media (max-width: 1048px) {
        display:block;
        .info-artist{
            margin-top:10px;
            margin-left:0
        }
    };
}
.info-artist{
    margin-left:10px;
    overflow:hidden;
    flex:1;
};
.item-media{
    position:relative;
    overflow:hidden;
    flex:1;
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
        svg{
            height:32px;
            width:32px
        };
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
min-height: 100vh;
padding-top: 85px;
background-color: rgba(0,0,0,.5);
.mv-player-button{
font-size:28px;
display:flex;
align-items:center;
cursor:pointer;
justify-content:center;
color:#fff;
}
&.video-fullcreem{
    padding:0;
    .queue-player{
        display:none
    };
    .video-play{
        width:100%
    };
} ;
.fullcreem{
    width:100%;
    height:100%
};
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

.video-play{
    width: calc(100% - 350px);
    display: block;
    flex-shrink: 1;
    padding: 0 15px;
    .loading-video{
        height: 60px;
        width: 60px;
        margin-left: -0.75em;
        margin-top: -0.75em;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        bottom: auto;
        right: auto;
        padding: 0;
        opacity: 1;
        border-radius: 50%;
        border: 0;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        pointer-events: none;
    };
    .playpause-fadeout {
        height: 40px;
        width: 40px;
        animation: zp-bezel-fadeout 0.5s linear 1 normal forwards;
        margin-left: -0.75em;
        margin-top: -0.75em;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        bottom: auto;
        right: auto;
        padding: 0;
        opacity: 1;
        border-radius: 50%;
        border: 0;
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        pointer-events: none;
    };
    @media (max-width: 1048px) {
        width:100%;
      }
};

.z--player.player-full-screem{
    height:100vh;
    width:100%;
    position: relative;
    padding-bottom: 0;
};
.queue-player{
    width:350px;
    .video-queue{
        position: relative;
        display:flex;
        overflow:hidden;
        flex-direction:column;
    };
    .zm-carousel{
        overflow: hidden scroll;
        
    };
    .list-playing-header{
        padding:20px
    }
};


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
padding:0 12px;
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
export const Listrecomend=styled.div`
background-color: hsla(0,0%,100%,.05);
margin-top:24px;
padding:10px 20px;

.row ${Item}{
    width:25%;
    .item-content{
        display:block;
        .zm-brand-playing{
            font-size:16px;
            svg{
                height:40px;
                width:40px
            };
        };
        
        .info-artist{
            margin-left:0;
            margin-top:10px;
            
        }
    };
    @media (max-width: 1048px) {
        width:33.333%;
    };
    @media (max-width: 848px) {
        width:50%;
    };
    @media (max-width:358px) {
        width:100%;
    }
}
`
const  randomIntFromInterval=(min, max)=> { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
const Video=(props)=>{
    const {item,index}=props
    const mvplayer=useSelector(state=>state.mvplayer)
    const {song,currentIndex,time,duration,play}=mvplayer
    const dispatch = useDispatch()
    const setplaymv=(e)=>{
        e.stopPropagation()
        if(currentIndex!==index){
            dispatch(setshowvideo({play:true,currentIndex:index}))
        }
        else{
            dispatch(setshowvideo({play:!play}))
        } 
    }
    return(
        <Item key={item.id} className="item">
            <div className="item-content">
                <div className="item-media">
                    <div className="media-cover" style={{backgroundImage: `url(${item.mv.file_preview})`}}/>
                    <div className="duration">{('0'+Math.floor(item.mv.duration/60)).slice(-2)}:{('0'+Math.floor(item.mv.duration)  % 60).slice(-2)}</div>
                    <div onClick={setplaymv}
                    className={`image-hover ${index === currentIndex &&play?'play':''} item-center`}>
                        {index === currentIndex && play?
                        <div className="zm-brand-playing">Đang phát</div>:
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>}
                    
                    </div>
                </div>
                <div className="info-artist">
                    <div className="info">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="subtitle">{item.artist_name}</div>
                    </div>
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
    const mvplayer=useSelector(state=>state.mvplayer)
    const {song,currentIndex,time,duration,play}=mvplayer
    const {slug}=useParams()
    const dispatch = useDispatch()
    const [muted,setMuted]=useState(false)
    const [repeat,setRepeat]=useState(false)
    const [listmv,setListmv]=useState([])
    const [volume,setVolume]=useState(0.5)
    const [percentload,setPercentload]=useState(0)
    const timeref=useRef()
    const [state,setState]=useState({width:document.documentElement.clientWidth})
    const timer=useRef()
    const [ramdom,setRamdom]=useState(false)
    const [drag,setDrag]=useState({time:false,volume:false})
    const percent=useMemo(()=>{
        const currentTime=time.seconds+time.minutes*60
        return duration?currentTime*100/duration:0
    },[time.seconds,time.minutes])
    
    useEffect(()=>{
        (async()=>{
            const res = await axios.get(listmvURL,headers)
            setListmv(res.data)
            
            const mvcurrent=res.data.find(item=>item.id==song.id)
            const mvupdate=res.data.filter(item=>item.id!=song.id)
            setListmv([mvcurrent,...mvupdate])
        })()  
    },[slug])
    const mv=listmv.length>0?listmv[currentIndex]:song
   
    const videoRef=useRef()
    const forward=(e)=>{
        e.stopPropagation()
        if(ramdom){
            const indexchoice=randomIntFromInterval(currentIndex+1,listmv.length-1)
            dispatch(setshowvideo({play:true,currentIndex:currentIndex>=listmv.length-1?0:indexchoice}))
        }
        else{
            const indexchoice=currentIndex+1>listmv.length-1?0:currentIndex+1
            dispatch(setshowvideo({play:true,currentIndex:indexchoice}))
        }
    }
    
    
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
    const settimeaudio=(e)=>{
        e.stopPropagation()
        
        const rects = timeref.current.getBoundingClientRect();
        const {left,width}=rects
        const clientX=e.clientX
        const percent=(clientX-left)/width
        const times=percent*duration
        const minutes=Math.floor(times/60)
        const seconds=Math.floor(times-minutes*60)
        videoRef.current.currentTime=times
        dispatch(setshowvideo({time:{seconds:seconds,minutes:minutes}}))
        
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
                dispatch(setshowvideo({time:{seconds:times % 60,minutes:Math.floor((times) / 60) % 60}}))
                videoRef.current.currentTime=times
                videoRef.current.pause()
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
            dispatch(setshowvideo({play:true,currentIndex:currentIndex==0?listmv.length-1:indexchoice}))

        }
        else{
            const indexchoice=currentIndex==0?listmv.length-1:currentIndex-1
            dispatch(setshowvideo({play:true,currentIndex:indexchoice}))
        }
    }
    const setrepeat=(e)=>{
        e.stopPropagation()
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
    function openFullscreen(e) {
        e.stopPropagation()
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
    function closeFullscreen(e) {
        e.stopPropagation()
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
    const [animation,setAmimation]=useState(false)
    console.log(percent)
    console.log(percentload)
    const [miniplayer,setMiniplayer]=useState(false)
    return(
        <div className={`zm-video-modal ${miniplayer?'video-minimize':'zm-video-animation-enter-done'}`}>
            <div ref={videocontent} id="video-scroll" >
                <div  className={`video-wrapper ${isVideoInFullscreen()?'video-fullcreem':''}`}>
                    <div className="video-blur-bg ">
                        <div className="video-blur-image">
                            <canvas className="react-blur-canvas" width="735" height="657" ></canvas>
                        </div>
                    </div>
                    <Videocontent  className={`video-container ${isVideoInFullscreen()?'video-fullcreem':''}`}>
                        <div className={`${isVideoInFullscreen()?'fullcreem':''}`}>
                            <div className="video-header">
                                <div className="item-space">
                                    <div class="level-left">
                                        <div class="level-item item-space">
                                            <div class="media">
                                                <div class="avatar mr-8">
                                                    <img src={`${mv.user?mv.user.avatar:''}`} alt=""/>
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
                                                    <svg className={`${mv.mv.liked?'fill-heart':''}`} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
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
                                        <div class="player-button-minimize">
                                            <button onClick={(event)=>{
                                                event.stopPropagation()
                                                setMiniplayer(false)}} class="zm-btn zm-tooltip-btn  is-hover-circle button" tabindex="0">
                                                <svg height="16px" version="1.1" viewBox="0 0 24 24" width="16px"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) "><path d="M19,19 L5,19 L5,5 L12,5 L12,3 L5,3 C3.89,3 3,3.9 3,5 L3,19 C3,20.1 3.89,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,12 L19,12 L19,19 Z M14,3 L14,5 L17.59,5 L7.76,14.83 L9.17,16.24 L19,6.41 L19,10 L21,10 L21,3 L14,3 Z" fill="#fff" fill-rule="nonzero"></path></g></g></svg>
                                            </button>
                                            <button onClick={(e)=>dispatch(setshowvideo({showvideo:false}))} class="zm-btn zm-tooltip-btn is-hover-circle button" tabindex="0">
                                                <svg height="16px" viewBox="0 0 24 24" width="16px"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#fff"></path></svg>
                                            </button>
                                        </div>
                                        <div 
                                        onDoubleClick={(e)=>{
                                            e.preventDefault()
                                            if(isVideoInFullscreen()){
                                                closeFullscreen(e)
                                            }
                                            else{
                                                openFullscreen(e)
                                                }
                                                
                                            
                                        }}
                                        onClick={()=>{
                                            dispatch(setshowvideo({play:!play}))
                                            setAmimation(true)
                                            if(timer){
                                                clearTimeout(timer.current)
                                            }
                                            timer.current=setTimeout(() => {
                                                setAmimation(false)
                                            }, 700);
                                            
                                            }} className={`z--player ${isVideoInFullscreen()?'player-full-screem':''}`} data-player="" tabindex="1">
                                            <VideoPlayer setsong={setshowvideo} url={videosongURL} player={mvplayer} mediaElement={videoRef} volume={volume}>
                                            <video playsinline 
                                                onPlay={()=>{
                                                    dispatch(setshowvideo({play:true}))
                                                }} 
                                                onAbort={()=>console.log('loading')}
                                                onPause={()=>dispatch(setshowvideo({play:false}))} 
                                                onEnded={()=>{
                                                    const value=currentIndex==listmv.length-1?0:currentIndex+1
                                                    
                                                    dispatch(setshowvideo({play:true,currentIndex:value}))
                                                }}
                                                onCanPlay={()=>console.log('can')}
                                                onTimeUpdate={()=>{
                                                    if(!drag.time && duration){
                                                        dispatch(setshowvideo({time:{seconds:videoRef.current.currentTime % 60,minutes:Math.floor((videoRef.current.currentTime) / 60) % 60}}))
                            
                                                    }  
                                                }}
                                                onProgress={(e)=>{
                                                    if(duration){
                                                        const video=videoRef.current
                                                        let loadend=[]
                                                        var bf = video.buffered;
                                                        for (let i = 0; i < bf.length; i++) {
                                                            loadend.push(bf.end(i) )
                                                        }           
                                                        const loadPercentage = bf.end(loadend.length-1) / duration;
                                                        setPercentload(loadPercentage*100)
                                                    }
                                                }}             
                                            onLoadedData={(e)=>{
                                                dispatch(setshowvideo({duration:videoRef.current.duration}))                       
                                            }} 
                                            ref={videoRef} preload="auto" src={mv.mv.file} muted={muted}></video>
                                            </VideoPlayer>
                                            <button class={percent>=percentload?'loading-video':'playpause-fadeout'} type="button" style={{display: `${percent>=percentload||animation?'flex':'none'}`}}>
                                                {percent>=percentload?
                                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="40px" height="40px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                                                    <circle cx="50" cy="50" fill="none" stroke="#fff" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
                                                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
                                                    </circle>
                                                </svg>:
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"> 
                                                    {!play?<path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"></path>:<path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path>}
                                                </svg>}
                                            </button>
                                            <div className="controls-wrapper">
                                                <div class="song-player-slider mb-8 item-center">
                                                    <Contentprogess 
                                                        onMouseMove={(e)=>settimeshow(e)} 
                                                        onMouseLeave={()=>setShowtime(false)}
                                                        onMouseDown={(e)=>{
                                                            setDrag({...drag,time:true})
                                                            
                                                        }} 
                                                        onClick={(e)=>{
                                                            
                                                            settimeaudio(e)
                                                        }}
                                                        ref={timeref}>
                                                        <SeekBarProgress className="progress"></SeekBarProgress>
                                                        <SeekBarCircle className="seekbarcircle" style={{left:`${percent}%`}}></SeekBarCircle>
                                                        <span className="bar --z--bar-fill-load" style={{backgroundColor: `rgb(184, 184, 184)`, width: `${percentload}%`}}></span>
                                                        <SeekBar className="seekbar" style={{width:`${percent}%`}}></SeekBar>
                                                        <span className={`seek-time ${showtime?'':'hiden'}`} style={{left: `${timeshow*100/duration}%`, marginLeft: `-19.5px`}}>{('0'+Math.floor((timeshow) / 60) % 60).slice(-2)}:{('0'+Math.floor(timeshow)  % 60).slice(-2)}</span>
                                                    </Contentprogess> 
                                                </div>
                                                <ControlVideo className="control-video flex">
                                                    <div className="control-left">
                                                        <div class="mv-player-control item-center">
                                                            <div onClick={backward} className="mv-player-button">
                                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
                                                            </div>
                                                            <button  onClick={()=>{
                                                                    dispatch(setshowvideo({play:!play}))
                                                                    }} className="mv-player-button">
                                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="40px" width="36px" xmlns="http://www.w3.org/2000/svg"> 
                                                                    {play?<path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"></path>:<path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path>}
                                                                </svg>
                                                            </button>
                                                            <div onClick={forward} className="mv-player-button">
                                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
                                                            </div>
                                                            <div onClick={setrepeat} className={`shuffle mv-player-button ${repeat?'active':''}`}>
                                                                <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18.3701 7.99993L13.8701 10.598V8.99993H6.88989V12.9999H4.88989V6.99993H13.8701V5.40186L18.3701 7.99993Z" fill="currentColor"></path><path d="M10.1299 16.9999H19.1101V10.9999H17.1101V14.9999H10.1299V13.4019L5.62988 15.9999L10.1299 18.598V16.9999Z" fill="currentColor"></path></svg>
                                                            </div> 
                                                        </div>
                                                        <div className="flex-center">
                                                            <div className="control-time flex-center">
                                                                <span className="song-player-slider-current-time">{('0'+time.minutes).slice(-2)}:{('0'+Math.floor(time.seconds)).slice(-2)}</span>
                                                                <span className='dot'>|</span>
                                                                <span className="song-player-slider-duration">{('0'+Math.floor((mv.mv.duration) / 60) % 60).slice(-2)}:{('0'+Math.floor(mv.mv.duration)  % 60).slice(-2)}</span> 
                                                            </div>
                                                            <span class="flex-center">
                                                                <div class="rhap_volume-container ">
                                                                    <button onClick={(e)=>{
                                                                        e.stopPropagation()
                                                                        setMuted(!muted)
                                                                        if(muted){
                                                                            setVolume(0.5)
                                                                        }
                                                                        else{
                                                                            setVolume(0)
                                                                        }
                                                                        }} aria-label="Mute" type="button" class="rhap_button-clear mv-player-button">
                                                                        <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px">
                                                                            {volume>0 && volume<0.5?<path class="ytp-svg-fill ytp-svg-volume-animation-speaker" clip-path="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z" fill="#fff" id="ytp-id-15"></path>
                                                                            :volume>=0.5?<path class="ytp-svg-fill ytp-svg-volume-animation-speaker" clip-path="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z" fill="#fff" id="ytp-id-15"></path>
                                                                            :<path class="ytp-svg-fill" d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z" fill="#fff" id="ytp-id-57"></path>}
                                                                        </svg>
                                                                        
                                                                    </button>
                                                                    <div ref={volumeref} onMouseDown={(e)=>{
                                                                        
                                                                            setDrag({...drag,volume:true})
                                                                        }}
                                                                        onClick={(e)=>{
                                                            
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
                                                        <div className="mv-player-button control-repeat-btn" title="Lặp lại">
                                                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M17 17h-1.559l-9.7-10.673A1 1 0 0 0 5.001 6H2v2h2.559l4.09 4.5-4.09 4.501H2v2h3.001a1 1 0 0 0 .74-.327L10 13.987l4.259 4.686a1 1 0 0 0 .74.327H17v3l5-4-5-4v3z"></path><path d="M15.441 8H17v3l5-3.938L17 3v3h-2.001a1 1 0 0 0-.74.327l-3.368 3.707 1.48 1.346L15.441 8z"></path></svg>
                                                        </div>
                                                        <button class="ytp-button mv-player-button ytp-settings-button" title="Settings" data-tooltip-target-id="ytp-settings-button" aria-label="Settings">
                                                            <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff" id="ytp-id-19"></path></svg>
                                                        </button>
                                                        <button onClick={(event)=>{
                                                            event.stopPropagation()
                                                            setMiniplayer(true)}} class="ytp-miniplayer-button mv-player-button ytp-button"  aria-label="Miniplayer (i)">
                                                            <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z" fill="#fff" id="ytp-id-21"></path></svg>
                                                        </button>
                                                        <button class="ytp-size-button mv-player-button ytp-button" title="Theater mode (t)">
                                                            <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-22"></path></svg>
                                                        </button>
                                                        <button onClick={(e)=>{
                                                            if(isVideoInFullscreen()){
                                                                closeFullscreen(e)
                                                            }
                                                            else{
                                                                openFullscreen(e)
                                                                }
                                                                
                                                            }} class="ytp-fullscreen-button mv-player-button ytp-button" aria-keyshortcuts="f" data-title-no-tooltip="Full screen" aria-label="Full screen keyboard shortcut f" title="Full screen (f)">
                                                            <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px"><g class="ytp-fullscreen-button-corner-0"><path class="ytp-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" id="ytp-id-7"></path></g><g class="ytp-fullscreen-button-corner-1"><path class="ytp-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" id="ytp-id-8"></path></g><g class="ytp-fullscreen-button-corner-2"><path class="ytp-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" id="ytp-id-9"></path></g><g class="ytp-fullscreen-button-corner-3"><path class="ytp-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" id="ytp-id-10"></path></g></svg>
                                                        </button>
                                                    </div>
                                                </ControlVideo>
                                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="queue-player column">
                                        <div className="video-queue is-horizontal">
                                            <div className="item-space list-playing-header">
                                                <div className="title">Danh sách phát</div>
                                                <div></div>
                                            </div>
                                            <div className="zm-carousel">
                                                <div className={`${state.width<1048?'zm-carousel__container':'full-width flex-col'}`}>
                                                    {listmv.map((item,index)=>
                                                        <Video
                                                            item={item}
                                                            index={index}
                                                            listmv={listmv}
                                                            
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <Listrecomend className="video-recommend">
                            <div className="title mb-16">MV Của Nguyễn Đình Vũ</div>
                            <div className="row">
                                {listmv.map((item,index)=>
                                 <Video
                                        item={item}
                                        index={index}
                                      
                                        listmv={listmv}
                                       
                                       
                                    />
                                )}
                            </div>
                        </Listrecomend>
                    </Videocontent>
                        
                </div>
            </div>
        </div>
         
    )
}
export default MV