import { Song } from "../Individual/Individual"
import { useDispatch,useSelector } from "react-redux"
import styled from "styled-components"
import axios from "axios"
import {useState,useEffect, useRef,useMemo, useCallback} from "react"
import {listsongURL,songURL,newsongURL,artistInfohURL} from "../../urls"
import { actionuser, setsong, showmodal, updatesongs } from "../../actions/player"
import { headers, setrequestlogin,valid } from "../../actions/auth"
import { useParams } from "react-router"
import {useSearchParams,useNavigate} from "react-router-dom"
import dayjs from "dayjs"
const listitems=[
    {name:"Tất cả",value:'all'},
    {name:"Việt Nam",value:'vpop'},
    {name:"Âu mĩ",value:'usuk'},
    {name:"Hàn quốc",value:'kpop'},
    {name:"Khác",value:'orther'},
]
const items=[
    {name:'Bài hát',value:'song',url:'song'},
    {name:'Album',value:'album',url:'album'},
]
const Tab=styled.div`
display:flex;
position:relative;
text-transform: uppercase;
font-weight:600;
color:${props=>props.active?'#fff':'#ffffff80'};
justify-content:center;
cursor:pointer;
padding:16px 8px;
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
const Newrelease=()=>{
    const dispatch = useDispatch()
    const {choice}=useParams()
    const [option,setOption]=useState()
    const [songs,setSongs]=useState([])
    const datasongs=useSelector(state => state.player.songs)
    const player=useSelector(state => state.player)
    const [params, setSearchParams] = useSearchParams();
    const navigate=useNavigate()
    const {playlists,currentIndex,play}=player
    useEffect(()=>{
        ( async ()=>{
            const res=await axios.get(`${newsongURL}?choice=${choice}&filter=${params.get('filter')}`,headers)
        setSongs(res.data)
        })()
        
    },[params,choice])

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
    
    return(
        <div className="body-wrapper">
            <div class="flex-center">
                <h3 class="zing-chart-heading">
                    Mới phát hành
                </h3>
                <div class="zing-chart-play-icon">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                </div>
            </div>
            <div>
                <Listitem className="flex listitem">
                    {items.map(item=>
                        <Tab key={item.value} active={choice==item.url?true:false} onClick={()=>navigate(`/new-release/${item.url}?${params}`)} className="tab">
                            <div className="tab-name">{item.name}</div>
                            {choice==item.url &&(<Bottomtab/>)}
                        </Tab>
                    )}
                </Listitem>
                <div className="zm-new-release-section">
                    <div class="genre-select">
                        {listitems.map(item=>
                            <button key={item.value} onClick={()=>setSearchParams({filter:item.value})} className={`zm-btn ${params.get('filter')===item.value &&'active'} button`} >{item.name}</button>
                        )}      
                    </div>
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
                                checkitem
                                setsongs={data=>setsongs(data)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Newrelease