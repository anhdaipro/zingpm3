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
import { Song } from "../Individual/Individual"
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
                return({...item,checked:false})
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
                                checkitem={true}
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