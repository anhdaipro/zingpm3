import axios from "axios"
import { useState,useRef,useEffect, useMemo, useCallback } from "react"
import { useSelector,useDispatch } from "react-redux"
import { headers } from "../../actions/auth"
import { searchURL,searchitemURL, originURL, artistURL } from "../../urls"
import styled from "styled-components"
import {useNavigate,useParams,useSearchParams} from 'react-router-dom'
import { partition } from "../../constants"
import Song from "./Song"
import PropType  from "prop-types"
import { Playlist } from "../Individual/Individual"

const items=[
    {name:'Tất cả',value:'all',url:'tat-ca'},
    {name:'Bài hát',value:'song',url:'bai-hat'},
    {name:'Playlist/Album',value:'playlist',url:'playlist'},
    {name:'Nghệ sĩ/AO',value:'artist',url:'artist'},
    {name:'MV',value:'mv',url:'mv'},
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
const Artist=(props)=>{
    const {item,artists,setartists}=props
    const setfollow=async (name,value)=>{
        const res =await axios.post(`${artistURL}/${item.id}`,JSON.stringify({action:'follow'}),headers)
        const dataupdate=artists.map(artist=>{
            if(artist.id===item.id){
                return({...item,[name]:value})
            }
            return({...item,})
        })
        setartists(dataupdate)
    }
    return(
        <div style={{width:'25%'}}>
            <div>
                <img src={originURL+item.image}/>
                <div></div>
            </div>
            <div>
                <div>
                    <h3>{item.name}</h3>
                    <div>{item.count_follow}</div>
                </div>
                <div>
                    <button onClick={()=>setfollow('followed',!item.followed)}>{item.followed?"Xem thêm":"Quan tâm"}</button>
                </div>
            </div>
        </div>
    )
}

Artist.prototype={
    item:PropType.object.isRequired,
    artists:PropType.array.isRequired,
    setartists:PropType.func.isRequired
}
const Search=()=>{
    const [songs,setSongs]=useState([])
    const navigate=useNavigate()
    const {choice}=useParams()
    const dispatch = useDispatch()
    const player=useSelector(state=>state.player)
    const [playlists,setPlaylists]=useState([])
    const [artists,setArtists]=useState([])
    const [params, setSearchParams] = useSearchParams();
    useEffect(() => {
        ( async () =>{
            const res= await axios.get(`${searchitemURL}?choice=${items.find(item=>item.url==choice).value}&keyword=${params.get('keyword')}`,headers)
            const  data=res.data
            setSongs(data.songs)
            setArtists(data.artists)
            setPlaylists(data.playlists)
        })()
        
    }, [params,choice])
    const groups=useMemo(()=>{
        return partition(songs,3)
    },[songs])
    const setsongs=useCallback((data)=>{
        setSongs(data)
    },[songs])
    const setartists=useCallback((data)=>{
        setArtists(data)
    },[artists])
    return(
        <div className="body-wrapper">
            <div>
                <div>Kết quả tìm kiếm</div>
                <Listitem className="flex listitem">
                    {items.map(item=>
                        <Tab key={item.value} active={choice==item.url?true:false} onClick={()=>navigate(`/tim-kiem/${item.url}?${params}`)} className="tab">
                            <div className="tab-name">{item.name}</div>
                            {choice==item.url &&(<Bottomtab/>)}
                        </Tab>
                    )}
                </Listitem>
            </div>
            <div className="search-wrapper">
                <div>
                    <div className="title">Nổi bật</div>
                    <div className="list-search">
                        {songs.length>0&&(
                            <div>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div>
                                    <div>Bài hát</div>
                                    <h3>{songs[0].name}</h3>
                                    <h4>{songs[0].artist_name}</h4>
                                </div>
                            </div>
                        )}
                        {artists.length>0&&(
                            <div>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div>
                                    <div>Nghệ sĩ</div>
                                    <h3>{artists[0].name}</h3>
                                    <h4>{artists[0].count_follow}</h4>
                                </div>
                            </div>
                        )}
                        {playlists.length>0&&(
                            <div>
                                <div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <div>
                                    <div>Nghệ sĩ</div>
                                    <h3>{playlists[0].name}</h3>
                                    <h4>{artists[0].artists}</h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {songs.length>0 &&(
                <div className="list-seach">
                    <div> Bài hát</div>
                    <div>
                        {groups.map((item,index)=>
                            <div key={index} className="column mar-b-0 is-fullhd-4 is-widescreen-4 is-desktop-4 is-touch-6 is-tablet-6">
                                <div className="list">
                                {item.map(song=>
                                    <Song
                                    index={index}
                                    songs={songs}
                                    setsongs={data=>setsongs(data)}
                                    song={song}
                                    />
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>)}
                <div>
                    <div>Playlist</div>
                    <div>
                        {playlists.map(item=>
                            <Playlist
                            item={item}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <div>Nghệ sĩ</div>
                    <div className="flex">
                        {artists.map(item=>
                            <Artist
                            item={item}
                            artists={artists}
                            setartists={data=>setartists(data)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Search