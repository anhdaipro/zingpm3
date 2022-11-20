import { useDispatch,useSelector } from "react-redux"
import styled from "styled-components"
import axios from "axios"
import {useState,useEffect, useRef,useMemo, useCallback} from "react"
import {listsongURL,songURL,genreURL,artistInfohURL} from "../../urls"
import { actionuser, setsong, showmodal, showinfoArtist, updatesongs } from "../../actions/player"
import { headers, setrequestlogin,valid } from "../../actions/auth"
import Actionsong from "../home/Actionsong"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import  { PlaySong,Songinfo, } from "../Song"
import { useParams } from "react-router"
import dayjs from "dayjs"
const listitem=[
    {name:'Bài hát',value:'song'},
    {name:'Posdcast',value:'podcast'},
    {name:'Album',value:'album'},
    {name:'Mv',value:'mv'},
]
const listchoice=[
    {name:'Đã thích',value:'liked'},
    {name:'Đã tải lên',value:'uploaded'}
]
const Tab=styled.div`
width:100px;
display:flex;
position:relative;
text-transform: uppercase;
font-weight:600;
color:${props=>props.active?'#fff':'#ffffff80'};
justify-content:center;
cursor:pointer;
padding:16px 0;
&:hover{
    color:#ffff
}
`
const Item=styled.div`
border:1px solid ${props=>props.active?'#9b4de0':'#fff'};
border-radius:12px;
padding:4px 6px;
cursor:pointer;
margin-right:16px;
background:${props=>props.active?'#9b4de0':'transparent'};
&:hover{
    color:${props=>!props.active?'#9b4de0':'#fff'};
    border:1px solid #9b4de0;
}
`
const Listitem=styled.div`
margin-bottom: 32px;
border-bottom: 1px solid #ffffff1a;
width: 100%;
position: relative;
`
const Bottomtab=styled.div`
bottom:0;
left:0;
width:100%;
position:absolute;
height:2px;
background-color:#9b4de0
`
const Song=(props)=>{
    
    const dispatch = useDispatch()
    const {song,index,setsongs,songs,count}=props
    const datasongs=useSelector(state => state.player.songs)
    const player=useSelector(state => state.player)
    const checked=songs.find(item=>item.checked)
    const {currentIndex}=player
    const [showaction,setShowaction]=useState(false)
    const songref=useRef()
    const dotref=useRef()
    const setliked= async (name,value)=>{
        if(valid){
        const res=await axios.post(`${songURL}/${song.id}`,JSON.stringify({action:'like'}),headers)
        const data=datasongs.map((item,index)=>{
            if(song.id==item.id){
                return({...item,[name]:value})
            }
            return({...item})
        })
        const songupdate=songs.map((item,index)=>{
            if(item.id==song.id){
                return({...item,[name]:value})
            }
            return({...item})
        })
        setsongs(songupdate)

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
    const dropref=useRef()
    
    console.log(count)
    
    

    
    const setitem=(itemchoice,name,value)=>{
        const data=songs.map(item=>{
            if(item.id==itemchoice.id){
                return({...item,[name]:value})
            }
            return({...item,})
        })
        setsongs(data)
    }
    
    return (
        <div onMouseLeave={()=>setShowaction(false)} onMouseEnter={()=>setShowaction(true)} ref={songref} key={index} class={`playlist-item ${datasongs.length>0 && datasongs[currentIndex].id === song.id ||song.checked ? "active" : ""}`}>
            <div className="item-info flex-center">
                <div className="item-left flex-center">
                    <div>
                        {!showaction && !checked ?
                        <div className="icon-music mr-8">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"></path><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"></path></svg>
                        </div>
                        :
                        <label class="checkbox">
                            <input onChange={(e)=>setitem(song,'checked',!song.checked)} checked={song.checked} type="checkbox" class="checkbox__input" /> 
                            <span class="checkbox__indicator">
                                <i class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.03033009,7.46966991 C3.73743687,7.1767767 3.26256313,7.1767767 2.96966991,7.46966991 C2.6767767,7.76256313 2.6767767,8.23743687 2.96966991,8.53033009 L6.32804531,11.8887055 C6.62093853,12.1815987 7.09581226,12.1815987 7.38870548,11.8887055 L13.2506629,6.02674809 C13.5435561,5.73385487 13.5435561,5.25898114 13.2506629,4.96608792 C12.9577697,4.6731947 12.4828959,4.6731947 12.1900027,4.96608792 L6.8583754,10.2977152 L4.03033009,7.46966991 Z"></path></svg>
                                </i> 
                            </span> 
                        </label>
                        }     
                    </div>
                    <PlaySong song={song}/>        
                    <div className="card-info">
                        <Songinfo
                        song={song}
                    />
                    </div>
                </div>
            </div>
            <div>{song.album?.name}</div>
            <div className="item-end">
                {song.lyrics && showaction?
                <div className="icon-button">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M388.938 29.47c-23.008 0-46.153 9.4-62.688 25.405 5.74 46.14 21.326 75.594 43.75 94.28 22.25 18.543 52.078 26.88 87.75 28.345 13.432-16.07 21.188-37.085 21.188-58 0-23.467-9.75-47.063-26.344-63.656C436 39.25 412.404 29.47 388.938 29.47zm-76.282 42.374c-8.808 14.244-13.75 30.986-13.75 47.656 0 23.467 9.782 47.063 26.375 63.656 16.595 16.594 40.19 26.375 63.658 26.375 18.678 0 37.44-6.196 52.687-17.093-31.55-3.2-59.626-12.46-81.875-31-23.277-19.397-39.553-48.64-47.094-89.593zm-27.78 67.72l-64.47 83.78c2.898 19.6 10.458 35.1 22.094 46.187 11.692 11.142 27.714 18.118 48.594 19.626l79.312-65.28c-21.2-3.826-41.14-14.11-56.437-29.407-14.927-14.927-25.057-34.286-29.095-54.907zM300 201.468a8 8 0 0 1 .03 0 8 8 0 0 1 .533 0 8 8 0 0 1 5.875 13.374l-34.313 38.78a8.004 8.004 0 1 1-12-10.593l34.313-38.78a8 8 0 0 1 5.562-2.78zM207.594 240L103 375.906c3.487 13.327 7.326 20.944 12.5 26.03 5.03 4.948 12.386 8.46 23.563 12.408l135.312-111.438c-17.067-3.61-31.595-11.003-42.906-21.78-11.346-10.81-19.323-24.827-23.876-41.126zM95.97 402.375c-9.12 5.382-17.37 14.08-23.126 24.406-9.656 17.317-11.52 37.236-2.25 50.47 6.665 4.337 10.566 4.81 13.844 4.344 1.794-.256 3.618-.954 5.624-1.875-3.18-9.575-6.3-20.93-2.5-33.314 3.03-9.87 10.323-19.044 23.47-27.5-2.406-1.65-4.644-3.49-6.75-5.562-3.217-3.163-5.94-6.78-8.313-10.97z"></path></svg>
                </div>:''}
                <div onClick={()=>setliked('liked',!song.liked)} class="song-info-like icon-button" aria-label="Yêu thích">
                    <svg className={song.liked?'fill-heart':''} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        {song.liked?<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
                        :<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>}
                    </svg>
                </div>
                <div className={`duration ${showaction?'hiden':''} mr-8`}>
                    <p className="author">{('0'+Math.floor((song.duration) / 60) % 60).slice(-2)}:{('0'+Math.floor(song.duration)  % 60).slice(-2)}</p>
                </div>
                
                <Actionsong             
                    song={song}
                    className={`icon-button ${showaction?'':'hiden'} mr-8`}
                    top={40}
                    right={40}
                    transformY={50}
                    songs={songs}
                    setsongs={data=>setsongs(data)}
                />
                   
            </div>                        
        </div>
    )
}

const Detailgenre=()=>{
    const dispatch = useDispatch()
    console.log(headers)
    const [genre,setGenre]=useState()
    const [option,setOption]=useState()
    const [songs,setSongs]=useState([])
    const {slug}=useParams()
    const datasongs=useSelector(state => state.player.songs)
    const player=useSelector(state => state.player)
    const {playlists,currentIndex,play, time_stop_player,showinfo,infoRef,keepinfo}=player
    useEffect(() => {
        ( async ()=>{
            const res = await axios.get(`${genreURL}/${slug}`,headers)
            const data=res.data  
            setGenre(data)
            const genre_songs=data.songs.map(item=>{
                return({...item,checked:false,image_cover:'http://localhost:8000'+item.image_cover})
            })
            setSongs(genre_songs) 
            dispatch(setsong({change:true,play:false}))
        })()
    }, [slug,dispatch])

    const count=useMemo(()=>{
        return songs.length
    },[songs.length])

   
    const checked=songs.find(item=>item.checked)
    const allchecked=songs.every(item=>item.checked)
    const songchecked=songs.filter(item=>item.checked)
    const setcheckall=()=>{
        setSongs(current=>current.map(item=>{
            return({...item,checked:allchecked?false:true})
        }))
    }
    const addtoplaylist=()=>{
        const addsong=songchecked.filter(song=>datasongs.every(item=>item.id!==song.id))
        dispatch(updatesongs([...addsong,...datasongs]))
        if(addsong.length>0){
        dispatch(setsong({change:true,currentIndex:currentIndex+addsong.length}))
        }
    }
   
    const setsongs=useCallback((data)=>{
        setSongs(data)
    },[songs])
    const setplay=()=>{
        if(!play){
            dispatch(setsong({change:true,songs:songs,play:true,currentIndex:0}))
        }
        else{
            dispatch(setsong({change:true,play:false}))
        }
    }
    return(
        <div className="body-wrapper">
            <div className="flex">
                {songs.length>0 &&(
                <div className="playlist-header mr-16">
                    <div className="playlist-image-wrapper">
                        <div class="container-discover__slider-item-img" style={{backgroundImage:`url(${songs[0].image_cover})`,backgroundSize:'cover',width:'100%',paddingTop:'100%'}}></div>
                        <div class="card-list-image-hover">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="card-list-icon big" height="32px" width="32px" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>
                        </div>
                    </div>
                    <div className="center mt-16">
                        <div className='genre-name'>{genre.name}</div>
                        <div className="mb-16 center">
                            <div className="subtitle">cập nhật lúc: {dayjs(genre.updated_at).format("DD/MM/YYYY")}</div>
                            <div className="subtitle">name</div>
                            <div className="subtitle">{genre.number_likers} người yêu thích</div>
                        </div>
                        
                        <div className="mb-16" >
                            <button onClick={()=>setplay()} className="btn btn-l btn-second">
                                {!play?<>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                                <span>Phát ngẫu nhiên</span></>:<>
                                <svg fill="#fff" width="32" height="32" version="1.1" viewBox="0 0 36 36"><path class="ytp-svg-fill" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" id="ytp-id-305"></path></svg>
                                <span>Tạm dừng</span></>}
                            </button>
                        </div>
                        
                        <div class="item-center">
                            <div class=" mr-16 action icon-button" aria-label="Favourite">
                                <svg class="fill-heart" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path></svg>
                            </div>
                            <div class="icon-button action">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                            </div>
                        </div>
                    </div>
                   
                </div>)}
                <div className="flex-1">
                    <div className="table">
                        <div className="flex-center table-header">
                            <div className="header-name">
                                {checked?
                                <div className='flex-center ml-8'>
                                    <label class="checkbox">
                                        <input onChange={setcheckall} checked={allchecked} type="checkbox" class="checkbox__input" /> 
                                        <span class="checkbox__indicator">
                                            <i class="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.03033009,7.46966991 C3.73743687,7.1767767 3.26256313,7.1767767 2.96966991,7.46966991 C2.6767767,7.76256313 2.6767767,8.23743687 2.96966991,8.53033009 L6.32804531,11.8887055 C6.62093853,12.1815987 7.09581226,12.1815987 7.38870548,11.8887055 L13.2506629,6.02674809 C13.5435561,5.73385487 13.5435561,5.25898114 13.2506629,4.96608792 C12.9577697,4.6731947 12.4828959,4.6731947 12.1900027,4.96608792 L6.8583754,10.2977152 L4.03033009,7.46966991 Z"></path></svg>
                                            </i> 
                                        </span> 
                                    </label>
                                    <div onClick={addtoplaylist} className="box-item mr-8">Thêm vào danh sách phát</div>
                                    <div className="icon-1">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                                    </div>
                                </div>:
                                <div className="header-name-title">Bài hát</div>}
                            </div>
                            <div>Album</div>
                            <div className="item-end">
                                <div className="mr-8">Thời gian</div>
                            </div>
                        </div>
                        <div className="table-body">
                            {songs.map((song,index)=>
                                <Song
                                song={song}
                                songs={songs}
                                index={index}
                                count={count}
                                setsongs={data=>setsongs(data)}
                                />
                            )}
                            
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    )
}
export default Detailgenre