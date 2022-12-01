import { useDispatch,useSelector } from "react-redux"
import styled from "styled-components"
import axios from "axios"
import {useState,useEffect, useRef,useMemo, useCallback,useId} from "react"
import {listsongURL,songURL,listsonguserURL,lyricsongURL, playlistURL} from "../../urls"
import { actionuser, setsong, showmodal, updateplaylists, updatesongs } from "../../actions/player"
import { expirationDate, headers, setrequestlogin,valid } from "../../actions/auth"
import Actionsong from "../home/Actionsong"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import {Songinfo,PlaySong, Showlyric, Likedsong, Showmv} from '../Song'
import { Link } from "react-router-dom"
import PropType from "prop-types"
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
export const Song=(props)=>{
    const dispatch = useDispatch()
    const {song,setsongs,songs,checkitem}=props
    const datasongs=useSelector(state => state.player.songs)
    const player=useSelector(state => state.player)
    const checked=songs.find(item=>item.checked)
    const {song_id,currentIndex,play,view}=player
    const [showaction,setShowaction]=useState(false)
    const songref=useRef()
    const songid=useId()
   
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
        <div onMouseLeave={()=>setShowaction(false)} id={songid} onMouseEnter={()=>setShowaction(true)} ref={songref} key={song.id} className={`playlist-item ${showaction && song_id==songid?'show':''}  ${(datasongs.length>0 && datasongs[currentIndex].id === song.id) ||song.checked ? "active" : ""}`}>
            <div className="item-info flex-center">
                <div className="item-left flex-center">
                    {checkitem &&(<div>
                        {!showaction && !checked ?
                            <div className="icon-music mr-8">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"></path><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"></path></svg>
                            </div>
                            :
                            <label className="checkbox">
                                <input onChange={(e)=>setitem(song,'checked',!song.checked)} checked={song.checked} type="checkbox" className="checkbox__input" /> 
                                <span className="checkbox__indicator">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.03033009,7.46966991 C3.73743687,7.1767767 3.26256313,7.1767767 2.96966991,7.46966991 C2.6767767,7.76256313 2.6767767,8.23743687 2.96966991,8.53033009 L6.32804531,11.8887055 C6.62093853,12.1815987 7.09581226,12.1815987 7.38870548,11.8887055 L13.2506629,6.02674809 C13.5435561,5.73385487 13.5435561,5.25898114 13.2506629,4.96608792 C12.9577697,4.6731947 12.4828959,4.6731947 12.1900027,4.96608792 L6.8583754,10.2977152 L4.03033009,7.46966991 Z"></path></svg>
                                    </i> 
                                </span> 
                            </label>
                        }     
                    </div>)}
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
                {song.video &&(
                    <Showmv
                        song={song}
                    />
                )}
                {song.hasLyric && showaction?
                <Showlyric
                    song={song}
                />
                :''}
                <Likedsong
                    song={song}
                    className="song-info-like icon-button"
                    songs={songs}
                    setsongs={data=>setsong(data)}
                />
                <div className={`duration ${showaction?'hiden':''} mr-8`}>
                    <p className="author">{('0'+Math.floor((song.duration) / 60) % 60).slice(-2)}:{('0'+Math.floor(song.duration)  % 60).slice(-2)}</p>
                </div>
                <Actionsong 
                    song={song}
                    className={`icon-button ${showaction?'':'hiden'} mr-8`}
                    songs={songs}
                    songid={songid}
                    setsongs={data=>setsongs(data)}
                />
                     
            </div>                        
        </div>
    )
}

Song.PropType={
    song:PropType.object.isRequired,
    setsongs:PropType.func.isRequired,
    songs:PropType.array.isRequired,
    checkitem:PropType.bool
}
export const Playlist=(props)=>{
    const dispatch = useDispatch()
    const player=useSelector(state => state.player)
    const {playlists,currentIndex,play, time_stop_player,showinfo}=player
    const {item}=props
    const user=useSelector(state => state.auth.user)
    const [show,setShow]=useState(false)
    const removeplaylist= async (e)=>{
        e.preventDefault()
        e.stopPropagation()
        const res= await axios.post(`${playlistURL}/${item.id}`,JSON.stringify({action:'delete'}),headers())
        dispatch(updateplaylists(playlists.filter(playlist=>playlist.id!==item.id)))
        toast(<span>Đã xóa playlist khỏi thư viện</span>,{  
            position:toast.POSITION.BOTTOM_LEFT,
            className:'toast-message',
        });
    }
    const showaction= (e)=>{
        e.preventDefault()
        e.stopPropagation()
        setShow(!show)
    }
    const download=(e)=>{
        e.preventDefault()
        fetch(item.url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = item.name;
            link.click();
        })
        .catch(console.error); 
    }
    const dropref=useRef()
    return(
        <div style={{width:'25%'}} className="slider-item">
            <Link to={`/playlist/${item.slug}/${item.id}`}>
                <div className="playlist-image-wrapper">
                    <div className="container-discover__slider-item-img" style={{backgroundImage:`url(${item.images[0]?`${item.images[0]}`:'https://photo-zmp3.zmdcdn.me/album_default.png'})`,backgroundSize:'cover',width:'100%',paddingTop:'100%'}}></div>
                    <div className="card-list-image-hover">
                        <button className="icon-button">
                        {user.id==item.user?
                            <svg width='16px' height="16px" onClick={removeplaylist} viewBox="0 0 16 16" >
                                <path strokeLinecap="round" d="M1.1,1.1L15.2,15.2"></path>
                                <path strokeLinecap="round" d="M15,1L0.9,15.1"></path>
                            </svg>:
                            <svg  stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="card-list-icon small" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path></svg>
                        }
                        </button>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="card-list-icon big" height="32px" width="32px" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>
                        <svg onClick={showaction} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="card-list-icon small" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                        {show &&(<div ref={dropref} style={{position:'fixed',left:'100%'}} className="detail-song">
                            <div className="menus">
                                <div  className="menu-item">
                                    <div className='item-center'>
                                        <div className="menu-icon">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                                        </div>
                                        <div className="menu-name">Thêm vào danh sách phát</div>
                                    </div>
                                    <div className="icon-next">
                                        <svg viewBox="0 0 12 12" fill="none" width="12" height="12" color="#fff" ><path fillRule="evenodd" clipRule="evenodd" d="M9.293 6L4.146.854l.708-.708L10 5.293a1 1 0 010 1.414l-5.146 5.147-.708-.707L9.293 6z" fill="currentColor"></path></svg>
                                    </div>
                                </div>
                                
                                <div className="menu-item">
                                    <div className='item-center'>
                                        <div className="menu-icon">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>
                                        </div>
                                        <div className="menu-name">Comment</div>
                                    </div>
                                </div>
                                <div onClick={(e)=>download(e)} className="menu-item">
                                    <div className='item-center'>
                                        <div className="menu-icon">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path></svg>
                                        </div>
                                        <div className="menu-name">
                                            Download
                                        </div>
                                    </div>
                                </div>
                                <div className="menu-item">
                                    <div className='item-center'>
                                        <div className="menu-icon">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"></path><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"></path></svg>
                                        </div>
                                        <div className="menu-name">Copy link</div>
                                    </div>
                                </div>
                                <div className="menu-item">
                                    <div className='item-center'>
                                        <div className="menu-icon">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M13 14h-2a8.999 8.999 0 0 0-7.968 4.81A10.136 10.136 0 0 1 3 18C3 12.477 7.477 8 13 8V3l10 8-10 8v-5z"></path></g></svg>
                                        </div>
                                        <div className="menu-name">Share</div>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </Link>
            <div className="playlist-name">{item.name}</div>
            <div className="playlist-upload">{item.user_name}</div>
        </div>
    )
}

const Individual=()=>{
    
    const dispatch = useDispatch()
    const [choice,setChoice]=useState('song')
    const [option,setOption]=useState('liked')
    const [songs,setSongs]=useState([])
    const datasongs=useSelector(state => state.player.songs)
    const player=useSelector(state => state.player)
    const user=useSelector(state=>state.auth.user)
    const {playlists,currentIndex}=player
    useEffect(() => {
        ( async ()=>{
            const res = await axios.get(`${listsonguserURL}?choice=${option}`,headers())
                const data=res.data.map(item=>{
                return({...item,checked:false,})
            })
            setSongs(data) 
        })()
    }, [option,dispatch])
    const count=songs.length
    

    const addplaylist=()=>{
        dispatch(showmodal(true))
        dispatch(actionuser({data:{title:'Thêm playlist'},action:'addplaylist'}))
    }
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
    },[])

    return(
        user&&(<div className="body-wrapper">
            <div className="flex-center">
                <h3 className="zing-chart-heading">Thư viện</h3>
                <div className="zing-chart-play-icon">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                </div>
            </div>
            <div>
                <div className="playlists-wrapper">
                    <div className="item-space">
                        <div className="flex-center">
                            <div className="title mr-8">Playlist</div>
                            <div onClick={addplaylist} className="btn-icon-add">
                                <svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8.48176704,1.5 C8.75790942,1.5 8.98176704,1.72385763 8.98176704,2 L8.981,7.997 L15,7.99797574 C15.2761424,7.99797574 15.5,8.22183336 15.5,8.49797574 C15.5,8.77411811 15.2761424,8.99797574 15,8.99797574 L8.981,8.997 L8.98176704,15 C8.98176704,15.2761424 8.75790942,15.5 8.48176704,15.5 C8.20562467,15.5 7.98176704,15.2761424 7.98176704,15 L7.981,8.997 L2,8.99797574 C1.72385763,8.99797574 1.5,8.77411811 1.5,8.49797574 C1.5,8.22183336 1.72385763,7.99797574 2,7.99797574 L7.981,7.997 L7.98176704,2 C7.98176704,1.72385763 8.20562467,1.5 8.48176704,1.5 Z"></path></svg>
                            </div>
                        </div>
                        <div className="item-center">
                            <div onClick={()=>alert('pls')} className="mr-8">Tất cả</div>
                            <div >
                                <svg width="14px" height="14px" enableBackground="new 0 0 11 11" viewBox="0 0 11 11" x="0" y="0"><path d="m2.5 11c .1 0 .2 0 .3-.1l6-5c .1-.1.2-.3.2-.4s-.1-.3-.2-.4l-6-5c-.2-.2-.5-.1-.7.1s-.1.5.1.7l5.5 4.6-5.5 4.6c-.2.2-.2.5-.1.7.1.1.3.2.4.2z"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            {playlists.map(item=>
                               <Playlist
                               item={item}
                               key={item.id}
                               /> 
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <Listitem className="flex listitem">
                        {listitem.map(item=>
                        <Tab key={item.value} active={choice==item.value?true:false} onClick={()=>setChoice(item.value)} className="tab">
                            <div className="tab-name">{item.name}</div>
                            {choice==item.value &&(<Bottomtab/>)}
                        </Tab>
                        )}
                    </Listitem>
                    <div>
                        <div className="flex">
                            {listchoice.map(item=>
                            <Item onClick={()=>setOption(item.value)} active={option==item.value?true:false} key={item.value} className={`item active`}>{item.name}</Item>
                            )}
                            
                        </div>
                    </div>
                    {option=='uploaded'&&(
                    <div className="item-space upload-song">
                        <div>
                            <div>Đã tải lên: {count}/200</div>
                            <div className="progess-number">
                                <div className="percent-count" style={{width:`${count*100/200}%`}}></div>
                            </div>
                        </div>
                        <div className="flex-center">
                            <div>BẠn muốn tải nhiều hơn</div>
                            <div className="vip-pro vip-pro-1 item-center">Nâng cấp vip</div>
                        </div>
                    </div>)}
                    <div className="table">
                        <div className="flex-center table-header">
                            <div className="header-name">
                                {checked?
                                <div className='flex-center ml-8'>
                                    <label className="checkbox">
                                        <input onChange={setcheckall} checked={allchecked} type="checkbox" className="checkbox__input" /> 
                                        <span className="checkbox__indicator">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.03033009,7.46966991 C3.73743687,7.1767767 3.26256313,7.1767767 2.96966991,7.46966991 C2.6767767,7.76256313 2.6767767,8.23743687 2.96966991,8.53033009 L6.32804531,11.8887055 C6.62093853,12.1815987 7.09581226,12.1815987 7.38870548,11.8887055 L13.2506629,6.02674809 C13.5435561,5.73385487 13.5435561,5.25898114 13.2506629,4.96608792 C12.9577697,4.6731947 12.4828959,4.6731947 12.1900027,4.96608792 L6.8583754,10.2977152 L4.03033009,7.46966991 Z"></path></svg>
                                            </i> 
                                        </span> 
                                    </label>
                                           
                                    
                                    <div onClick={addtoplaylist} className="box-item mr-8">Thêm vào danh sách phát</div>
                                    <div className="icon-1">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
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
                            {songs.map((song)=>
                                <Song
                                song={song}
                                songs={songs}
                                checkitem={true}
                                key={song.id}
                                setsongs={data=>setsongs(data)}
                                />
                            )}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    )
}
export default Individual