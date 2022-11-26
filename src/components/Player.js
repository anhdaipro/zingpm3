import {useSelector,useDispatch} from "react-redux"
import {useState,useEffect,useRef,useMemo} from 'react'
import styled from "styled-components"
import axios from "axios"
import { songURL,artistInfohURL, streamingURL ,lyricsongURL, originURL, videosongURL} from "../urls"
import {actionuser, setsong,showmodal,showplaylist,updatesongs,showinfoArtist, setshowvideo} from "../actions/player"
import Actionsong from "./home/Actionsong"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css';    
import { headers, setrequestlogin,valid } from "../actions/auth"
import {Songinfo} from "./Song"
import {debounce} from "lodash"
import Slider from "./home/Slider"
import { dataURLtoFile } from "../constants"
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
const now=new Date()
const listitems=[
{name:'Playlists',value:'playlists'},
{name:'Karaoke',value:'karaoke'},
{name:'Lyric',value:'lyric'},
]
const Player=()=>{
    const player= useSelector(state => state.player)
    const {songs,play,view,time_stop_player,currentIndex,time,change,showoption}=player
    const [muted,setMuted]=useState(false)
    const showsongs=useSelector(state => state.player.showplaylist)
    const [state,setState]=useState({ramdom:false,repeat:false,onerepeat:false})
    const [volume,setVolume]=useState(1)
    const {repeat,ramdom,onerepeat}=state
    const [dragvolume,setDragvolume]=useState(false)
    const [duration,setDuration]=useState(0)
    
    const [drag,setDrag]=useState({time:false,volume:false})
    const dispatch=useDispatch()
    
    const percent=useMemo(()=>{
        const currentTime=time.seconds+time.minutes*60
        return duration?currentTime/duration:0
    },[time.seconds,time.minutes])
    const url=songs[currentIndex].url?songs[currentIndex].url:localStorage.getItem('url')
    const song=change?songs[currentIndex]:songs[parseInt(localStorage.getItem('index'))]
    useEffect(()=>{
        ( async ()=>{ 
            const res = await axios.get(`${streamingURL}/${song.id}`)
            const datasongs=songs.map(item=>{
                if(item.id===songs[currentIndex].id){
                    return({...res.data,...item,url:'http://localhost:8000'+res.data.url})
                }
                return({...item})
            })
            dispatch(setsong({change:true,songs:datasongs,time:{seconds:0,minutes:0}})) 
    })()
    },[song.id,dispatch])

    useEffect(() => {
        if(time_stop_player && now==time_stop_player){
            dispatch(setsong({change:true,play:false}))
            dispatch(showmodal(true))
            dispatch(actionuser({data:{title:'Thời gian phát nhạc đã kết thúc, bạn có muốn tiếp tục phát bài hát này?'},action:'continueplayer'}))
        }
    }, [time_stop_player,dispatch])

    useEffect(() => {
        if(localStorage.getItem('index')){
            dispatch(setsong({currentIndex:parseInt(localStorage.getItem('index'))}))
        }
    }, [])
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
    },[currentIndex,time.seconds,time.minutes])
    
    
    const forward=(e)=>{
        
        if(ramdom){
            const indexchoice=randomIntFromInterval(currentIndex+1,songs.length-1)
            dispatch(setsong({change:true,play:true,currentIndex:currentIndex>=songs.length-1?0:indexchoice}))
        }
        else{
            const indexchoice=currentIndex+1>songs.length-1?0:currentIndex+1
            dispatch(setsong({change:true,play:true,currentIndex:indexchoice}))

        }
    }
    
    useEffect(()=>{
        if(duration){
            if(audioref.current){
                audioref.current.volume=volume
            }
        }
    },[duration,audioref,volume])
    
    useEffect(()=>{
        if(duration){
            if(audioref.current){
                if(play){
                    audioref.current.play()
                }
                else{
                    audioref.current.pause()
                }
            }
        }
    },[duration,audioref,play])
   
    useEffect(()=>{
        ( async ()=>{
            try{
                if(view){
                   const res = await axios.post(`${songURL}/${songs[currentIndex].id}`,JSON.stringify({action:'view'}),headers)
                }
            }
            catch(e){
                console.log(e)
            }
        })()
        
    },[view,currentIndex,songs])

    useEffect(()=>{
        if(duration){
            if(audioref.current){
                let totalPlayed = 0;
                const played = audioref.current.played;
                for (let i = 0; i < played.length; i++) {
                    totalPlayed += played.end(i) - played.start(i);
                }
                
                if(totalPlayed>=duration/2){
                    dispatch(setsong({change:true,view:true}))
                }
            }
        }
    },[duration,time,dispatch])
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
        console.log(minutes)
        console.log(seconds)
        audioref.current.removeEventListener('timeupdate',updatetime)
        dispatch(setsong({change:true,time:{seconds:seconds,minutes:minutes}}))
        console.log(audioref.current.currentTime); 
        audioref.current.currentTime=times
        console.log(times)
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
    },[drag.time,timeref,drag.volume,volumeref,duration])

    
    
    useEffect(()=>{
        const setdrag=(e)=>{
            setDrag(prev=>{return{...prev,time:false,volume:false}})
            if(dragvolume){
                audioref.current.currentTime=time.seconds+time.minutes*60
                setDragvolume(false)
                console.log(audioref.current.currentTime)
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
   
    const setliked= async (name,value)=>{
        try{
            if(valid){
            const res=await axios.post(`${songURL}/${songs[currentIndex].id}`,JSON.stringify({action:'like'}),headers)
            const data=songs.map((item,index)=>{
                if(currentIndex==index){
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
    
    
    useEffect(() => {
        audioref.current.addEventListener('timeupdate',updatetime)
        return () => {
            audioref.current.removeEventListener('timeupdate',updatetime)
        }
    }, [drag,duration,dispatch])
    const updatetime=()=>{                 
        if(!drag.time && duration){
            dispatch(setsong({change:true,time:{seconds:audioref.current.currentTime % 60,minutes:Math.floor((audioref.current.currentTime) / 60) % 60}}))
        }  
    }
   
    const timecurent=useMemo(()=>{
        return(time.minutes*60+time.seconds)*1000
    },[time])
    console.log(timecurent)
    const scrollRef=useRef()
    const setshowlyric= async ()=>{
        if(!song.sentences){
        const res = await axios.get(`${lyricsongURL}?id=${song.id}`,headers)
        const data=songs.map(item=>{
            if(item.id===song.id){
                return({...item,...res.data})
            }
            return({...item,})
        })
        dispatch(setsong({songs:data,showoption:'lyric',showplaylist:false}))
    }
    else{
        dispatch(setsong({showoption:'lyric',showplaylist:false}))
    }
    }
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
    const [fullscreem,setFullscreem]=useState(false)
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
    const openvideo=async ()=>{
        if(song.mv){
            dispatch(setshowvideo({showvideo:true,song:song}))
        }
        else{
            const res =await axios.get(`${videosongURL}?id=${song.video}`,headers)
            const datasongs=songs.map(item=>{
                if(item.id===song.id){
                    return({...item,mv:res.data})
                }
                return({...item,})
            })
            dispatch(setsong({songs:datasongs}))
            dispatch(setshowvideo({showvideo:true,song:{...song,mv:res.data}}))
        }
    }
    return(
        songs.length>0 &&(
            <div className="zm-section now-playing-bar is-idle">
                
                <div className={`fs-nowplaying ${showoption && song.hasLyric?'show':''} zm-video-animation-enter-done`}>
                    <div class="fs-background">
                        <div class="video-blur-image">
                            <canvas class="react-blur-canvas" width="907" height="657" style={{width: '907px', height: '657px'}}></canvas>
                        </div>
                        <div class="overlay"></div>
                    </div>
                    {showoption && song.hasLyric &&(
                    <div className="fs-content">
                        <div className="fs-header item-space">
                            <div className="lyric-left"></div>
                            <div class="lyric-tab flex-center">
                                {listitems.map(item=>
                                <button disabled={item.value=='karaoke' && !song.sentences?true:false} key={item.value} onClick={()=>{
                                    dispatch(setsong({showoption:item.value}))
                                    }}  
                                    className={`tab-item ${item.value===showoption?'is-active':''}`}>{item.name}</button>
                                )}
                                
                            </div>
                            <div class="lyric-button-group flex-center">
                                <div onClick={()=>{
                                    if(fullscreem){
                                        setFullscreem(false)
                                        closeFullscreen()
                                    }
                                    else{
                                        setFullscreem(true)
                                        openFullscreen()
                                    }
                                }} class="icon-button" aria-label="Toàn màn hình">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M22 3.41L16.71 8.7 20 12h-8V4l3.29 3.29L20.59 2 22 3.41zM3.41 22l5.29-5.29L12 20v-8H4l3.29 3.29L2 20.59 3.41 22z"></path></svg>
                                </div>
                                <div class="icon-button" aria-label="Setting">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a443.74 443.74 0 0 0-79.7-137.9l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.4a351.86 351.86 0 0 0-99 57.4l-81.9-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a446.02 446.02 0 0 0-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0 0 25.8 25.7l2.7.5a449.4 449.4 0 0 0 159 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-85a350 350 0 0 0 99.7-57.6l81.3 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 0 1-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 0 1-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 0 1 624 502c0 29.9-11.7 58-32.8 79.2z"></path></svg>
                                </div>
                                <div onClick={()=>dispatch(setsong({showoption:''}))} class="icon-button" aria-label="Close">
                                    <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className="fs-body">
                            {showoption=='karaoke'?
                            <div class="fs-karaoke">
                                <div class="fs-karaoke-content">
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
                
                <div class={`player-control ${showoption && song.hasLyric?'opac':''}`}>
                    <div class="play-control-wrapper">
                        <div className="player-control-left">
                            <div className='flex-center'>
                                <div className="song-image" style={{backgroundImage:`url(${songs[currentIndex].image_cover})`}}></div>
                                <div className="card-info">
                                    <Songinfo
                                        song={songs[currentIndex]}
                                    />
                                </div>
                                <div className='song-action item-center'>
                                    <div onClick={()=>setliked('liked',!songs[currentIndex].liked)} class="song-info-like icon-button" aria-label="Yêu thích">
                                        <svg className={songs[currentIndex].liked?'fill-heart':''} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            {songs[currentIndex].liked?<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
                                            :<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>}
                                        </svg>
                                    </div>    
                                    <Actionsong 
                                        song={songs[currentIndex]}
                                        className={`song-dot icon-button`}
                                        top={-10}
                                        left={0}
                                        transformY={100}
                                    />    
                                </div>
                            </div>
                        </div>
                        <div className="song-player">
                            <div class="song-player-control item-center">
                                    <div onClick={(e)=>{
                                        e.stopPropagation()
                                        setState({...state,ramdom:!state.ramdom})}} className={`shuffle song-player-button small ${ramdom?'active':''}`} style={{fontSize: '24px'}}>
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="M17 17h-1.559l-9.7-10.673A1 1 0 0 0 5.001 6H2v2h2.559l4.09 4.5-4.09 4.501H2v2h3.001a1 1 0 0 0 .74-.327L10 13.987l4.259 4.686a1 1 0 0 0 .74.327H17v3l5-4-5-4v3z"></path><path d="M15.441 8H17v3l5-3.938L17 3v3h-2.001a1 1 0 0 0-.74.327l-3.368 3.707 1.48 1.346L15.441 8z"></path></svg>
                                    </div>
                                    <div onClick={backward} className="song-player-button">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
                                    </div>
                                    <div className="song-player-button">
                                        <svg onClick={()=>{
                                            dispatch(setsong({change:true,play:!play}))
                                            console.log(audioref.current.currentTime)
                                           
                                            }} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                            {play?<path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"></path>:<path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path>}
                                        </svg>
                                    </div>
                                    <div onClick={forward} className="song-player-button">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
                                    </div>
                                    <div onClick={setrepeat} className={`shuffle song-player-button small ${repeat || onerepeat?'active':''}`} style={{fontSize: '24px'}}>
                                        {onerepeat?
                                        <svg stroke="currentColor" fill="currentColor" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve">
                                            <g>
                                                <path d="M76.8,256v-76.8c0.1-28.3,22.9-51.1,51.2-51.2h332.8c14.1,0,25.6-11.5,25.6-25.6c0-14.1-11.5-25.6-25.6-25.6l-332.8,0   c-56.6,0-102.4,45.8-102.4,102.4V256c0,14.1,11.5,25.6,25.6,25.6C65.3,281.6,76.8,270.1,76.8,256L76.8,256z M365.9,43.7l58.7,58.7   l-58.7,58.7c-10,10-10,26.2,0,36.2c10,10,26.2,10,36.2,0l76.8-76.8c4.8-4.8,7.5-11.4,7.5-18.1c0-6.7-2.7-13.3-7.5-18.1L402.1,7.5   c-10-10-26.2-10-36.2,0C355.9,17.5,355.9,33.7,365.9,43.7L365.9,43.7z"/>
                                                <path d="M435.2,256v76.8c-0.1,28.3-22.9,51.1-51.2,51.2H51.2c-14.1,0-25.6,11.5-25.6,25.6c0,14.1,11.5,25.6,25.6,25.6l332.8,0   c56.6,0,102.4-45.8,102.4-102.4V256c0-14.1-11.5-25.6-25.6-25.6S435.2,241.9,435.2,256L435.2,256z M146.1,468.3l-58.7-58.7   l58.7-58.7c10-10,10-26.2,0-36.2s-26.2-10-36.2,0l-76.8,76.8c-4.8,4.8-7.5,11.4-7.5,18.1c0,6.7,2.7,13.3,7.5,18.1l76.8,76.8   c10,10,26.2,10,36.2,0C156.1,494.5,156.1,478.3,146.1,468.3L146.1,468.3z"/>
                                                <path d="M248.5,248.5l25.6-25.6L256,204.8h-25.6v102.4c0,14.1,11.5,25.6,25.6,25.6c14.1,0,25.6-11.5,25.6-25.6V204.8   c0-10.4-6.2-19.7-15.8-23.7c-9.6-4-20.6-1.8-27.9,5.5l-25.6,25.6c-10,10-10,26.2,0,36.2C222.3,258.5,238.5,258.5,248.5,248.5   L248.5,248.5z"/>
                                            </g>
                                        </svg>:
                                        <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18.3701 7.99993L13.8701 10.598V8.99993H6.88989V12.9999H4.88989V6.99993H13.8701V5.40186L18.3701 7.99993Z" fill="currentColor"></path><path d="M10.1299 16.9999H19.1101V10.9999H17.1101V14.9999H10.1299V13.4019L5.62988 15.9999L10.1299 18.598V16.9999Z" fill="currentColor"></path></svg>
                                        }
                                    </div>
                                
                            </div>
                            <div class="song-player-slider item-center">
                                <div className="song-player-slider-current-time">{('0'+time.minutes).slice(-2)}:{('0'+Math.round(time.seconds)).slice(-2)}</div>
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
                        <div class="music-control__right item-center">
                            <button onClick={openvideo} disabled={song.video?false:true} className="icon-button">
                                <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
                                    <g><path d="M508.4,347.9c-1,0-1.9,0.2-2.9,0.3c-0.1,0-0.2,0-0.3,0c-1,0.1-1.9,0.2-2.8,0.5c-7.3,1.3-14,5.5-18.1,12.3L373.2,572L262.1,360.5c-6-10.1-17.9-14.6-28.9-12.1c-0.2,0-0.3,0.1-0.5,0.1c-1.1,0.3-2.1,0.6-3.1,1c-1,0.4-2,0.8-3,1.3c-0.2,0.1-0.4,0.2-0.6,0.3c-0.1,0-0.1,0.1-0.2,0.2c-3,1.7-5.6,3.9-7.7,6.6c0,0,0,0,0,0.1c-2,2.5-3.4,5.4-4.3,8.6c-0.1,0.2-0.1,0.3-0.2,0.5c-0.5,2-0.9,4.1-0.9,6.3v253.4c0,14,11.4,25.3,25.3,25.3c14,0,25.3-11.4,25.3-25.3V476.1l85.8,163.4c6.3,10.7,19.3,15.2,30.9,11.7c7-1.5,13.3-5.7,17.2-12.1l85.8-162.8v150.6c0,14,11.4,25.3,25.3,25.3c14,0,25.3-11.4,25.3-25.3V373.3C533.8,359.3,522.4,347.9,508.4,347.9z"/><path d="M789.5,350.2c-12.6-5.8-27.4,0-33,13l-79,195.1l-79-195.1c-5.6-13-20.4-18.8-33-13c-12.6,5.8-18.2,21.1-12.6,34.1L653,631.7c1.6,7.7,6.3,14.6,13.8,18.1c3.5,1.6,7.1,2.2,10.7,2.2c3.6,0.1,7.2-0.6,10.7-2.2c7.5-3.5,12.1-10.4,13.8-18.1L802,384.3C807.7,371.3,802.1,356,789.5,350.2z"/><path d="M787.2,60.7H212.8C100.8,60.7,10,151.5,10,263.4v473.1c0,112,90.8,202.8,202.8,202.8h574.5c112,0,202.8-90.8,202.8-202.8V263.5C990,151.5,899.2,60.7,787.2,60.7z M939.3,736.6c0,84-68.1,152.1-152.1,152.1H212.8c-84,0-152.1-68.1-152.1-152.1V263.5c0-84,68.1-152.1,152.1-152.1h574.5c84,0,152.1,68.1,152.1,152.1V736.6z"/></g>
                                </svg>
                            </button>
                            <button disabled={song.hasLyric?false:true} onClick={()=>setshowlyric()} className="icon-button">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M388.938 29.47c-23.008 0-46.153 9.4-62.688 25.405 5.74 46.14 21.326 75.594 43.75 94.28 22.25 18.543 52.078 26.88 87.75 28.345 13.432-16.07 21.188-37.085 21.188-58 0-23.467-9.75-47.063-26.344-63.656C436 39.25 412.404 29.47 388.938 29.47zm-76.282 42.374c-8.808 14.244-13.75 30.986-13.75 47.656 0 23.467 9.782 47.063 26.375 63.656 16.595 16.594 40.19 26.375 63.658 26.375 18.678 0 37.44-6.196 52.687-17.093-31.55-3.2-59.626-12.46-81.875-31-23.277-19.397-39.553-48.64-47.094-89.593zm-27.78 67.72l-64.47 83.78c2.898 19.6 10.458 35.1 22.094 46.187 11.692 11.142 27.714 18.118 48.594 19.626l79.312-65.28c-21.2-3.826-41.14-14.11-56.437-29.407-14.927-14.927-25.057-34.286-29.095-54.907zM300 201.468a8 8 0 0 1 .03 0 8 8 0 0 1 .533 0 8 8 0 0 1 5.875 13.374l-34.313 38.78a8.004 8.004 0 1 1-12-10.593l34.313-38.78a8 8 0 0 1 5.562-2.78zM207.594 240L103 375.906c3.487 13.327 7.326 20.944 12.5 26.03 5.03 4.948 12.386 8.46 23.563 12.408l135.312-111.438c-17.067-3.61-31.595-11.003-42.906-21.78-11.346-10.81-19.323-24.827-23.876-41.126zM95.97 402.375c-9.12 5.382-17.37 14.08-23.126 24.406-9.656 17.317-11.52 37.236-2.25 50.47 6.665 4.337 10.566 4.81 13.844 4.344 1.794-.256 3.618-.954 5.624-1.875-3.18-9.575-6.3-20.93-2.5-33.314 3.03-9.87 10.323-19.044 23.47-27.5-2.406-1.65-4.644-3.49-6.75-5.562-3.217-3.163-5.94-6.78-8.313-10.97z"></path></svg>
                            </button>
                            
                            <button className="icon-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM6 5H18C18.5523 5 19 5.44772 19 6V12.2676C18.7058 12.0974 18.3643 12 18 12H14C12.8954 12 12 12.8954 12 14V18C12 18.3643 12.0974 18.7058 12.2676 19H6C5.44772 19 5 18.5523 5 18V6C5 5.44772 5.44772 5 6 5Z" fill="#fff"/>
                                </svg>
                            </button>
                            
                            <div class="rhap_volume-controls">
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
                                            <SeekBar className="seekbar" style={{width:`${volume*100}%`}}></SeekBar>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div onClick={()=>dispatch(showplaylist(!showsongs))} className={`btn-list-play ${showsongs?'active':''}`}>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"></path><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <audio data-html5-video preload="auto" muted={muted}
                    onPlay={()=>{
                        dispatch(setsong({change:true,play:true}))
                    }} 
                    onPause={()=>dispatch(setsong({change:true,play:false}))} 
                    onEnded={()=>{
                        const value=currentIndex==songs.length-1?0:currentIndex+1
                        dispatch(setsong({change:true,view:false,currentIndex:value,play:true}))
                        
                    }}
                                 
                    onLoadStart={()=>setDuration(0)}
                    onLoadedData={(e)=>{
                        if (audioref.current.readyState >= 3) {
                            setDuration(audioref.current.duration) 
                          }
                          else{
                            setDuration(0)
                          }                         
                    }} 
                    ref={audioref} loop={onerepeat||repeat?true:false}  src={url}/>
                    
                </div>
            </div>
        )
    )
}
export default Player