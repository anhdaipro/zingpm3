import {useSelector,useDispatch} from "react-redux"
import {useState,useEffect,useRef,useMemo,useId} from 'react'
import styled from "styled-components"
import axios from "axios"
import { songURL,artistInfohURL, streamingURL ,lyricsongURL, originURL, videosongURL} from "../urls"
import {actionuser, setsong,showmodal,showplaylist,updatesongs,showinfoArtist} from "../actions/player"
import {setshowvideo} from "../actions/mv"
import Actionsong from "./home/Actionsong"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css';    
import { expiry, headers, setrequestlogin,valid } from "../actions/auth"
import {Likedsong, Showlyric, Showmv, Songinfo} from "./Song"
import {debounce} from "lodash"
import Slider from "./home/Slider"
import { dataURLtoFile } from "../constants"
import { useNavigate } from "react-router"
import VideoPlayer from "./home/Media"
import dayjs from "dayjs"
const Dot=styled.div`
heigth:100%;
width:1px;
margin:0 12px;
background-color:#fff
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
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transform-origin: left center;
`
const Contentprogess=styled.div`
position:relative;
flex:1;
margin:0 8px;
height:16px;
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
const Center=styled.div`
display:flex;
padding:4px 8px;
justify-content:center;
align-items:center
`
const  randomIntFromInterval=(min, max)=> { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

const listitems=[
{name:'Playlists',value:'playlists'},
{name:'Karaoke',value:'karaoke'},
{name:'Lyric',value:'lyric'},
]

const Player=()=>{
    const player= useSelector(state => state.player)
    const {songs,play,view,time_stop_player,currentIndex,time,change,showoption,show,duration}=player
    const [muted,setMuted]=useState(false)
    const showsongs=useSelector(state => state.player.showplaylist)
    const [state,setState]=useState({ramdom:false,repeat:false,onerepeat:false})
    const [volume,setVolume]=useState(1)
    const {repeat,ramdom,onerepeat}=state
    const [dragvolume,setDragvolume]=useState(false)
    const navigate=useNavigate()
    const [drag,setDrag]=useState({time:false,volume:false})
    const dispatch=useDispatch()
    const percent=useMemo(()=>{
        const currentTime=time.seconds+time.minutes*60
        return duration?currentTime/duration:0
    },[time.seconds,time.minutes,duration])
    const url=songs[currentIndex].file?songs[currentIndex].file:localStorage.getItem('url')
    const index=change?currentIndex:localStorage.getItem('index')?parseInt(localStorage.getItem('index')):0
    const song=songs[index]
    
    useEffect(()=>{
        ( async ()=>{ 
            if(!song.file){
            dispatch((setsong({loading:false})))
            const res = await axios.get(`${streamingURL}/${song.id}`)
            const datasongs=songs.map(item=>{
                if(item.id===song.id){
                    return({...res.data,...item})
                }
                return({...item})
            })
            dispatch(setsong({duration:0,songs:datasongs,time:{seconds:0,minutes:0}})) 
        }
        else{
            dispatch(setsong({duration:0,time:{seconds:0,minutes:0}}))
        }
    })()
    },[song,dispatch,songs])
   
    useEffect(() => {
        const now=() =>dayjs()
        if(time_stop_player && now().isAfter(time_stop_player) &&!show && play){
            console.log('oj')
            dispatch(setsong({change:true,play:false}))
            dispatch(showmodal(true))
            dispatch(actionuser({data:{data:song,title:'Thời gian phát nhạc đã kết thúc, bạn có muốn tiếp tục phát bài hát này?'},action:'continueplayer'}))
        }
    }, [time_stop_player,dispatch,song,show,play,time])
    
    useEffect(() => {
        if(localStorage.getItem('index')){
            dispatch(setsong({currentIndex:parseInt(localStorage.getItem('index'))}))
        }
    }, [dispatch])
    const audioref=useRef()
    useEffect(()=>{
        const listener=(event)=>{
            localStorage.setItem('index',currentIndex)
            localStorage.setItem('url',url)
            localStorage.setItem('songs',JSON.stringify(songs))
            localStorage.setItem('time',time.seconds+time.minutes*60)
        }
        window.addEventListener('beforeunload', listener)
        return () => window.removeEventListener('beforeunload', listener)
    },[currentIndex,time.seconds,time.minutes,url,songs])
    
    const forward=(e)=>{
        if(ramdom){
            const indexchoice=randomIntFromInterval(currentIndex+1,songs.length-1)
            dispatch(setsong({change:true,play:true,currentIndex:currentIndex>=songs.length-1?0:indexchoice}))
        }
        else if(repeat){
            dispatch(setsong({change:true,play:true,currentIndex:currentIndex}))
        }
        else{
            const indexchoice=currentIndex+1>songs.length-1?0:currentIndex+1
            dispatch(setsong({change:true,play:true,currentIndex:indexchoice}))

        }
    }
    
    const timeref=useRef()
    
    const settimeaudio=(e)=>{
        e.stopPropagation()
        setDrag({...drag,time:true})
        const rects = timeref.current.getBoundingClientRect();
        const {left,width}=rects
        const clientX=e.clientX
        const percent=(clientX-left)/width
        const times=percent*duration
        const minutes=Math.floor(times/60)
        const seconds=Math.floor(times-minutes*60)
       
        dispatch(setsong({change:true,time:{seconds:seconds,minutes:minutes}}))
       
        audioref.current.currentTime=times
       
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
                const {top,bottom,height}=rects
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
            e.preventDefault();
            if(drag.time){
                const rects = timeref.current.getBoundingClientRect();
                const clientX=e.clientX
                const left =rects.left
                const width=rects.width
                const min=left
                const max=left+width
                const percent=clientX<min?0:clientX>max?1:(clientX-left)/width
                const times=percent*duration
                dispatch(setsong({change:true,time:{seconds:times % 60,minutes:Math.floor((times) / 60) % 60}}))
               
                if(times!=audioref.current.currentTime){
                    setDragvolume(true)
                }
            }
        }
        document.addEventListener('mousemove',setprogess)
        
        return ()=>{
            document.removeEventListener('mousemove',setprogess)
        }
    },[drag.time,timeref,drag.volume,volumeref,duration,dispatch])

    useEffect(()=>{
        const setdrag=(e)=>{
            setDrag(prev=>{return{...prev,time:false,volume:false}})
            if(dragvolume){
                audioref.current.currentTime=time.seconds+time.minutes*60
                setDragvolume(false)
                
            }

        }
        document.addEventListener('mouseup',setdrag)
        return ()=>{
            document.removeEventListener('mouseup',setdrag)
        }
    },[time.seconds,time.minutes,audioref,dragvolume,drag.time,currentIndex])
    
   
    const backward=(e)=>{
        e.stopPropagation()
        if(ramdom){
            const indexchoice=randomIntFromInterval(0,currentIndex-1)
            dispatch(setsong({change:true,play:true,currentIndex:currentIndex==0?songs.length-1:indexchoice}))
        }
        else{
            const indexchoice=currentIndex==0?songs.length-1:currentIndex-1
            dispatch(setsong({change:true,currentIndex:indexchoice,play:true}))
        }
    }
    const setrepeat=()=>{
        if(repeat){
            setState({...state,repeat:false,onerepeat:true})
        }
        else if (onerepeat){
            setState({...state,repeat:false,onerepeat:false})
        }
        else{
            setState({...state,repeat:true,onerepeat:false})
        }
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
   
    const timecurent=useMemo(()=>{
        return(time.minutes*60+time.seconds)*1000
    },[time])
    
    const scrollRef=useRef()
    
    const [scroll,setScroll]=useState(false)
    const handleEndScroll = useMemo(() =>debounce(() => setScroll(false), 1000)
    ,[]);

    const handleScroll = e => {
        setScroll(true)
        handleEndScroll();
    };
    
    const sentencesshow=useMemo(() =>{
        const itemcurrent=song.sentences?song.sentences.findLast(item=>item.words[0].startTime<=timecurent):null
        return itemcurrent
        
    },[timecurent,song.sentences])
    
    const listdisplay=()=>{
        const indexcurrent=sentencesshow?song.sentences.findIndex(item=>item.words[0].startTime==sentencesshow.words[0].startTime):0
        const itemcurrent=sentencesshow?sentencesshow:song.sentences[0] 
        const itemnext=song.sentences[indexcurrent+1]
        const lyricshow=indexcurrent==song.sentences.length-1?[itemcurrent]:indexcurrent%2==0?[itemcurrent,itemnext]:[itemnext,itemcurrent]
        return lyricshow.map((item,i)=>
            <li key={i} style={{fontSize:'48px'}} className="item animated-item">
                {item.words.map((word,j)=>
                    <span key={j} style={{color:`${word.startTime<=timecurent?'#ffed00':'#fff'}`}} className="">{word.data} </span>
                )}
            </li>
        )
    }

    var elem=document.documentElement
    function isVideoInFullscreen() {
        if (document.fullscreenElement) {
          return true;
        }
        return false;
    }
    
    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
    
    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
    
    const songid=useId()
    return(
        songs.length>0 &&(
            <div className="zm-section now-playing-bar is-idle">
                
                <div className={`fs-nowplaying ${showoption && song.hasLyric?'show':''} zm-video-animation-enter-done`}>
                    <div className="fs-background">
                        <div className="video-blur-image">
                            <canvas className="react-blur-canvas" width="907" height="657" style={{width: '907px', height: '657px'}}></canvas>
                        </div>
                        <div className="overlay"></div>
                    </div>
                    {showoption && song.hasLyric &&(
                    <div className="fs-content">
                        <div className="fs-header item-space">
                            <div className="lyric-left"></div>
                            <div className="lyric-tab flex-center">
                                {listitems.map(item=>
                                <button disabled={item.value=='karaoke' && !song.sentences?true:false} key={item.value} onClick={()=>{
                                    dispatch(setsong({showoption:item.value}))
                                    }}  
                                    className={`tab-item ${item.value===showoption?'is-active':''}`}>{item.name}</button>
                                )}
                                
                            </div>
                            <div className="lyric-button-group flex-center">
                                <div onClick={()=>{
                                    if(isVideoInFullscreen()){
                                        
                                        closeFullscreen()
                                    }
                                    else{
                                       
                                        openFullscreen()
                                    }
                                }} className="icon-button" aria-label="Toàn màn hình">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M22 3.41L16.71 8.7 20 12h-8V4l3.29 3.29L20.59 2 22 3.41zM3.41 22l5.29-5.29L12 20v-8H4l3.29 3.29L2 20.59 3.41 22z"></path></svg>
                                </div>
                                <div className="icon-button" aria-label="Setting">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a443.74 443.74 0 0 0-79.7-137.9l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.4a351.86 351.86 0 0 0-99 57.4l-81.9-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a446.02 446.02 0 0 0-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0 0 25.8 25.7l2.7.5a449.4 449.4 0 0 0 159 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-85a350 350 0 0 0 99.7-57.6l81.3 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 0 1-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 0 1-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 0 1 624 502c0 29.9-11.7 58-32.8 79.2z"></path></svg>
                                </div>
                                <div onClick={()=>dispatch(setsong({showoption:''}))} className="icon-button" aria-label="Close">
                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className="fs-body">
                            {showoption=='karaoke'?
                            <div className="fs-karaoke">
                                <div className="fs-karaoke-content">
                                    <div className="center flex-1">
                                    {song.sentences[0].words[0].startTime>timecurent+5000?<>
                                    <div className="karaoke-item-name">{song.name}</div>
                                    <div className="karaoke-item-artist">{song.artist_name}</div></>
                                    :<ul className="scroll-content">{listdisplay()}</ul>}
                                    </div>
                                </div>
                            </div>:showoption=='playlists'?
                            <div className="fs-media-list">
                                <Slider
                                items={songs}
                                song={song}
                                />
                                
                            </div>:
                            <div className="fs-lyric flex">
                                <div className="column is-fullhd-5 item-center is-tablet-0">
                                <div className="lyric-song-item">
                                    <img src={song.image_cover}/>
                                    <div></div>
                                    </div> 
                                </div>
                                <div className="is-size-M column is-fullhd-7 is-tablet-12">
                                    <ul onScroll={e => handleScroll(e)} ref={scrollRef} className="scroll-content">
                                        <li className="item is-over">{`Bài hát: ${song.name}`}</li>
                                        {song.lyrics?<li className={`item ${song.lyrics[0].startTimeMs>timecurent?'is-active':''}`}>Ca sĩ: {song.artist_name}</li>:
                                        <li className={`item ${song.sentences[0].words[0].startTime>timecurent?'is-active':''}`}>Ca sĩ: {song.artist_name}</li>}
                                        {song.lyrics?<>
                                        {song.lyrics.map((item,index)=>{
                                            const min= item.startTimeMs
                                            const max=index<song.lyrics.length-1?song.lyrics[index+1].startTimeMs:duration*1000
                                            if(timecurent>=min && timecurent<max) {
                                                const item=document.getElementById(`line-${index}`)
                                                if(item &&!scroll){
                                                    item.scrollIntoView({behavior: "smooth", block: "center"})
                                                    item.style.transition="all .1s ease"
                                                }
                                            }
                                            return(
                                                <li key={index} id={`line-${index}`}  className={`item ${timecurent>max?'is-over':''} ${timecurent>=min && timecurent<max?'is-active':""}`}>
                                                    {item.words}
                                                </li>
                                            )
                                        })}
                                        </>:<>{song.sentences.map((item,index)=>{
                                            const min= item.words[0].startTime
                                            const max=index<song.sentences.length-1?song.sentences[index+1].words[0].startTime:duration*1000
                                            if(timecurent>=min && timecurent<max) {
                                                const item=document.getElementById(`line-${index}`)
                                                if(item &&!scroll){
                                                    item.scrollIntoView({behavior: "smooth", block: "center"})
                                                    item.style.transition="all .1s ease"
                                                }
                                            }
                                            return(
                                            <li key={index} id={`line-${index}`}  className={`item ${timecurent>max?'is-over':''} ${timecurent>=min && timecurent<max?'is-active':""}`}>
                                                {item.words.map(word=>`${word.data} `)}
                                            </li>
                                            )
                                        }
                                            
                                        )}</>}
                                    </ul>
                                </div>
                            </div>}
                        </div>
                        <div className="fs-bottom"></div>
                    </div>
                    )}
                </div>
                
                <div className={`player-control ${showoption && song.hasLyric?'opac':''}`}>
                    <div className="play-control-wrapper">
                        <div className="player-control-left">
                            <div className='flex-center'>
                                <div className="song-image" style={{backgroundImage:`url(${songs[currentIndex].image_cover})`}}></div>
                                <div className="card-info">
                                    <Songinfo
                                        song={songs[currentIndex]}
                                    />
                                </div>
                                <div className='song-action item-center'>
                                    <Likedsong
                                        song={songs[currentIndex]}
                                        className="song-info-like icon-button"
                                    />
                                       
                                    <Actionsong 
                                        song={songs[currentIndex]}
                                        className={`song-dot icon-button`}
                                       songid={songid}
                                    />    
                                </div>
                            </div>
                        </div>
                        <div className="song-player">
                            <div className="song-player-control item-center">
                                    <div onClick={(e)=>{
                                        e.stopPropagation()
                                        setState({...state,ramdom:!state.ramdom})}} className={`shuffle song-player-button small ${ramdom?'active':''}`} style={{fontSize: '24px'}}>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M17 17h-1.559l-9.7-10.673A1 1 0 0 0 5.001 6H2v2h2.559l4.09 4.5-4.09 4.501H2v2h3.001a1 1 0 0 0 .74-.327L10 13.987l4.259 4.686a1 1 0 0 0 .74.327H17v3l5-4-5-4v3z"></path><path d="M15.441 8H17v3l5-3.938L17 3v3h-2.001a1 1 0 0 0-.74.327l-3.368 3.707 1.48 1.346L15.441 8z"></path></svg>
                                    </div>
                                    <div onClick={backward} className="song-player-button">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
                                    </div>
                                    <div onClick={()=>{
                                            dispatch(setsong({change:true,play:!play}))
                                        }} className="song-player-button play-icon">
                                        {duration>0?<svg  stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                            {
                                            change && play?<path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"></path>:<path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path>}
                                        </svg>:
                                        <svg xmlns="http://www.w3.org/2000/svg"  xmlnsXlink="http://www.w3.org/1999/xlink"  width="36px" height="36px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
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
                                        </svg>}
                                        
                                    </div>
                                    <div onClick={forward} className="song-player-button">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
                                    </div>
                                    <div onClick={setrepeat} className={`shuffle song-player-button small ${repeat || onerepeat?'active':''}`}>
                                        {onerepeat?
                                        <svg stroke="currentColor" fill="currentColor" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve">
                                            <g>
                                                <path d="M76.8,256v-76.8c0.1-28.3,22.9-51.1,51.2-51.2h332.8c14.1,0,25.6-11.5,25.6-25.6c0-14.1-11.5-25.6-25.6-25.6l-332.8,0   c-56.6,0-102.4,45.8-102.4,102.4V256c0,14.1,11.5,25.6,25.6,25.6C65.3,281.6,76.8,270.1,76.8,256L76.8,256z M365.9,43.7l58.7,58.7   l-58.7,58.7c-10,10-10,26.2,0,36.2c10,10,26.2,10,36.2,0l76.8-76.8c4.8-4.8,7.5-11.4,7.5-18.1c0-6.7-2.7-13.3-7.5-18.1L402.1,7.5   c-10-10-26.2-10-36.2,0C355.9,17.5,355.9,33.7,365.9,43.7L365.9,43.7z"/>
                                                <path d="M435.2,256v76.8c-0.1,28.3-22.9,51.1-51.2,51.2H51.2c-14.1,0-25.6,11.5-25.6,25.6c0,14.1,11.5,25.6,25.6,25.6l332.8,0   c56.6,0,102.4-45.8,102.4-102.4V256c0-14.1-11.5-25.6-25.6-25.6S435.2,241.9,435.2,256L435.2,256z M146.1,468.3l-58.7-58.7   l58.7-58.7c10-10,10-26.2,0-36.2s-26.2-10-36.2,0l-76.8,76.8c-4.8,4.8-7.5,11.4-7.5,18.1c0,6.7,2.7,13.3,7.5,18.1l76.8,76.8   c10,10,26.2,10,36.2,0C156.1,494.5,156.1,478.3,146.1,468.3L146.1,468.3z"/>
                                                <path d="M248.5,248.5l25.6-25.6L256,204.8h-25.6v102.4c0,14.1,11.5,25.6,25.6,25.6c14.1,0,25.6-11.5,25.6-25.6V204.8   c0-10.4-6.2-19.7-15.8-23.7c-9.6-4-20.6-1.8-27.9,5.5l-25.6,25.6c-10,10-10,26.2,0,36.2C222.3,258.5,238.5,258.5,248.5,248.5   L248.5,248.5z"/>
                                            </g>
                                        </svg>:
                                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18.3701 7.99993L13.8701 10.598V8.99993H6.88989V12.9999H4.88989V6.99993H13.8701V5.40186L18.3701 7.99993Z" fill="currentColor"></path><path d="M10.1299 16.9999H19.1101V10.9999H17.1101V14.9999H10.1299V13.4019L5.62988 15.9999L10.1299 18.598V16.9999Z" fill="currentColor"></path></svg>
                                        }
                                    </div>
                                
                            </div>
                            <div className="song-player-slider item-center">
                                <div className="song-player-slider-current-time">{('0'+time.minutes).slice(-2)}:{('0'+Math.floor(time.seconds) % 60).slice(-2)}</div>
                                <Contentprogess 
                                    onMouseDown={(e)=>{
                                    settimeaudio(e)
                                    }} ref={timeref}>
                                    <SeekBarProgress className="progress"></SeekBarProgress>
                                    <SeekBarCircle className="seekbarcircle" style={{left:`${percent*100}%`}}></SeekBarCircle>
                                    <SeekBar className="seekbar" style={{width:`${percent*100}%`}}></SeekBar>
                                </Contentprogess>
                                <div className="song-player-slider-duration">{('0'+Math.floor((duration) / 60) % 60).slice(-2)}:{('0'+Math.floor(duration)  % 60).slice(-2)}</div> 
                            </div>
                            
                        </div>
                    
                    <div className="player-control-right">
                        <div className="music-control__right item-center">
                            <Showmv
                            song={song}
                            />
                            <Showlyric
                            song={song}
                            />
                            
                            <button className="icon-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM6 5H18C18.5523 5 19 5.44772 19 6V12.2676C18.7058 12.0974 18.3643 12 18 12H14C12.8954 12 12 12.8954 12 14V18C12 18.3643 12.0974 18.7058 12.2676 19H6C5.44772 19 5 18.5523 5 18V6C5 5.44772 5.44772 5 6 5Z" fill="#fff"/>
                                </svg>
                            </button>
                            
                            <div className="rhap_volume-controls">
                                <div className="rhap_volume-container ">
                                    <button onClick={()=>{
                                        setMuted(!muted)
                                        if(muted){
                                            setVolume(0.5)
                                        }
                                        else{
                                            setVolume(0)
                                        }
                                        }} aria-label="Mute" type="button" className="rhap_button-clear icon-button icon-buttom">
                                        <svg height="32px" version="1.1" viewBox="0 0 36 36" width="32px">
                                            {volume>0 && volume<0.5?<path className="ytp-svg-fill ytp-svg-volume-animation-speaker" clipPath="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z" fill="#fff" id="ytp-id-15"></path>
                                                :volume>=0.5?<path className="ytp-svg-fill ytp-svg-volume-animation-speaker" clipPath="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z" fill="#fff" id="ytp-id-15"></path>
                                            :<path className="ytp-svg-fill" d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z" fill="#fff" id="ytp-id-57"></path>}
                                        </svg>
                                    </button>
                                    <div ref={volumeref} onMouseDown={(e)=>{
                                        setDrag({...drag,volume:true})
                                        setVolumevideo(e)
                                    }}
                                    className="rhap_volume-bar-area">
                                        <div className="rhap_volume-bar">
                                            <SeekBarProgress className="progress"></SeekBarProgress>
                                            <div className="rhap_volume-indicator" style={{left: `${volume*100}%`, transitionDuration: `0s`,backgroundColor:'#fff'}}></div>
                                            <SeekBar className="seekbar" style={{width:`${volume*100}%`}}></SeekBar>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div onClick={()=>dispatch(showplaylist(!showsongs))} className={`btn-list-play ${showsongs?'active':''}`}>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"></path><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <VideoPlayer mediaElement={audioref} setsong={setsong} player={player} url={songURL}  volume={volume}>
                <audio data-html5-video preload="auto" muted={muted}
                    onPlay={()=>{
                        dispatch(setsong({change:true,play:true}))
                    }} 
                    onPause={()=>dispatch(setsong({change:true,play:false}))} 
                    onEnded={()=>{
                        const value=currentIndex==songs.length-1?0:currentIndex+1
                        dispatch(setsong({change:true,view:false,currentIndex:value,play:true}))
                        
                    }}
                    onTimeUpdate={()=>{
                        
                        if(!drag.time && duration){
                            dispatch(setsong({change:true,time:{seconds:audioref.current.currentTime % 60,minutes:Math.floor((audioref.current.currentTime) / 60) % 60}}))
                        }  
                    }}             
                    onLoadStart={()=>dispatch(setsong({duration:0}))}
                    onLoadedData={(e)=>{
                            dispatch(setsong({duration:audioref.current.duration}))
                           
                                                
                    } }
                    ref={audioref} loop={onerepeat||repeat?true:false}  src={url}/>
                </VideoPlayer>
                </div>
            </div>
        )
    )
}
export default Player