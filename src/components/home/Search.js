import axios from "axios"
import { useState,useRef,useEffect, useMemo, useCallback } from "react"
import { useSelector,useDispatch } from "react-redux"
import { headers } from "../../actions/auth"
import { searchURL,searchitemURL,  artistURL } from "../../urls"
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

const Bottomtab=styled.div`
bottom:0;
left:0;
width:100%;
position:absolute;
height:2px;
background-color:#9b4de0
`
const SearchWrapper=styled.div`
position:relative;
.section{
    margin-top:24px;
};
.title{
    margin-bottom:16px
};
.artists-content .list{
display:flex;
margin:0 -8px
};
.artists-content .list .item{
    width:25%;
    padding:8px;
    .info{
        max-width:100%
    };
    .subtitle{
        text-align:center
    }
    .item-media{
        position:relative;
        border-radius:50%;
        cursor:pointer;
        overflow:hidden;
        .media_cover{
            transition:transform 0.7s ease
        };
        &:hover .media_cover{
            transform:scale(1.1);
            
        };
        &:hover .image-hover{
            display:flex;

            
        };
        .image-hover{
            position:absolute;
            top:0;
            display:none;
            background:#00000080;
            left:0;
            bottom:0;
            rigth:0;
            width:100%
        }
    }
    
}

`
const Listitem=styled.div`
display:flex;
`
const Artist=(props)=>{
    const {item,artists,setartists}=props
    const setfollow=async (name,value)=>{
        
        const res =await axios.post(`${artistURL}/${item.id}`,JSON.stringify({action:'follow'}),headers())
        const dataupdate=artists.map(artist=>{
            if(artist.id===item.id){
                return({...item,[name]:value})
            }
            return({...item,})
        })
        setartists(dataupdate)
    }
    return(
        <div  className="item">
            <div className="item-media">
                <div className="media_cover" style={{backgroundImage: `url(${item.image})`}}/>
                <div className="image-hover item-center">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M17 17h-1.559l-9.7-10.673A1 1 0 0 0 5.001 6H2v2h2.559l4.09 4.5-4.09 4.501H2v2h3.001a1 1 0 0 0 .74-.327L10 13.987l4.259 4.686a1 1 0 0 0 .74.327H17v3l5-4-5-4v3z"></path><path d="M15.441 8H17v3l5-3.938L17 3v3h-2.001a1 1 0 0 0-.74.327l-3.368 3.707 1.48 1.346L15.441 8z"></path></svg>
                </div>
            </div>
            <div className="mt-16 info-artist center">
                <div className="info">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="subtitle">{item.number_followers} quan tâm</div>
                </div>
                <div className="item-center mt-16">
                    <button className="btn btn-second btn-m" onClick={()=>setfollow('followed',!item.followed)}>{item.followed?"Xem thêm":"Quan tâm"}</button>
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
            const res= await axios.get(`${searchitemURL}?choice=${items.find(item=>item.url==choice).value}&keyword=${params.get('keyword')}`,headers())
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
    },[])
    const setartists=useCallback((data)=>{
        setArtists(data)
    },[])
    console.log(songs)
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
            <SearchWrapper>
                <div className="standings-content section">
                    <div className="title">Nổi bật</div>
                    <div className="list">
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
                        {artists.length>0&& (
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
                <div className='songs-content section'>
                    <div className="title"> Bài hát</div>
                    <div className="list">
                        {groups.map((item,index)=>
                            <div key={index} className="column mar-b-0 is-fullhd-4 is-widescreen-4 is-desktop-4 is-touch-6 is-tablet-6">
                                <div className="list">
                                {item.map(song=>
                                    <Song
                                    index={index}
                                    songs={songs}
                                    setsongs={data=>setsongs(data)}
                                    song={song}
                                    key={item.id}
                                    />
                                )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>)}
                {playlists.length>0&&(
                <div className="playlists-content section">
                    <div className="title">Playlist</div>
                    <div className="list">
                        {playlists.map(item=>
                            <Playlist
                                item={item}
                                key={item.id}
                            />
                        )}
                    </div>
                </div>)}
                {artists.length >0 &&( <div className="artists-content section">
                    <div className="title">Nghệ sĩ</div>
                    <div className="list">
                        {artists.map(item=>
                            <Artist
                            item={item}
                            key={item.id}
                            artists={artists}
                            setartists={data=>setartists(data)}
                            />
                        )}
                    </div>
                </div>)}
            </SearchWrapper>
        </div>
    )
}
export default Search