
import { useParams } from "react-router"
import {useState,useEffect, useRef, useCallback} from "react"
import { useSelector,useDispatch } from "react-redux"
import {  artistURL } from "../../urls"
import axios from "axios"
import styled from 'styled-components'
import { headers,valid } from "../../actions/auth"
import { Link } from "react-router-dom"
import { Playlist, Song } from "../Individual/Individual"
const listimage=[
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/1.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/2.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/3.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/4.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/5.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/6.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/7.webp'},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider/8.webp'},
]
const items=[
    {name:'Tổng quan',value:'overview',},
    {name:'Bài hát',value:'song',url:'song'},
    {name:'Singer',value:'singer',url:'singer'},
    {name:'Album',value:'album',url:'album'},
    {name:'MV',value:'mv',url:'mv'},
]
const Artistcontent=styled.div`
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
            padding-top:56%;
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

const Video=(props)=>{

    const {item}=props
    return(
        <div className="item">
            <div className="item-media">
                <div className="media_cover" style={{backgroundImage: `url(${item.image_cover})`}}/>
                <div className="image-hover item-center">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M17 17h-1.559l-9.7-10.673A1 1 0 0 0 5.001 6H2v2h2.559l4.09 4.5-4.09 4.501H2v2h3.001a1 1 0 0 0 .74-.327L10 13.987l4.259 4.686a1 1 0 0 0 .74.327H17v3l5-4-5-4v3z"></path><path d="M15.441 8H17v3l5-3.938L17 3v3h-2.001a1 1 0 0 0-.74.327l-3.368 3.707 1.48 1.346L15.441 8z"></path></svg>
                </div>
            </div>
            <div className="mt-16 info-artist center">
                <div className="info">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="subtitle">{item.artist_name} quan tâm</div>
                </div>
            </div>
        </div>
    )
}
const Artist=()=>{
    const {slugartist}=useParams()
    const {choice}=useParams()
    console.log(slugartist)
    console.log(choice)
    const [songs,setSongs]=useState([])
    const [artist,setArtist]=useState()
    const [playlists,setPlaylists]=useState([])
    const [sliderIndex,setsliderIndex]=useState(0)
    const timer=useRef()
    const dispatch = useDispatch()
    useEffect(() => {
        timer.current=setInterval(()=>{
            const value=sliderIndex==listimage.length-1?0:sliderIndex+1
            setsliderIndex(value)
        },3000)
        return () => {
            clearInterval(timer.current)
        }
    }, [sliderIndex])
    const setsongs=useCallback((data)=>{
        setSongs(data)
    },[])
    useEffect(() => {
        ( async () =>{
            const url=choice?`${artistURL}/${slugartist}?choice=${choice}`:`${artistURL}/${slugartist}`
            const res = await axios.get(url,headers)
            const data=res.data
            const datasongs=data.songs
            setSongs(datasongs)
            if(choice==='album'){
                setPlaylists(data.playlists)
            }
            setArtist({...data})
        })()
        
    }, [slugartist,choice])
    return (
        <div className="body-wrapper">
            <nav className="zm-navbar is-oval zm-navbar-wrap">
                <div className="zm-narbar-container">
                    <ul className="zm-navbar-menu">
                        {items.map(item=>
                        <li key={item.value} className={`zm-navbar-item ${choice==item.url?'is-active':''}`}>
                            <div className="navbar-link">
                                <Link className="" to={`${item.url?`${item.url}`:''}`}>{item.name}</Link>
                            </div>
                        </li>)}
                    </ul>
                </div>
            </nav>
            <div className="zm-section channel-section song-animate-section">
                <h3 className="zm-section-title title is-2">Bài hát nổi bật</h3>
                <Artistcontent className="content">
                    <div className="flex">
                        {!choice?
                        <div className="songs-animate-container"> 
                            <div className="option-all__song-slider">
                                {songs.slice(0,10).map((item,index)=>
                                    <img key={item.id} src={item.image_cover} alt="anh slider" className={`option-all__song-slider-img ${index == sliderIndex?'option-all__song-slider-img-first':index == sliderIndex+1||(sliderIndex==listimage.length-1 && index==0)?'option-all__song-slider-img-second':'option-all__song-slider-img-third'}`}/>
                                )}
                            </div>
                        </div>:''}
                        <div className="list flex-1">
                            <div className="option-all__songs pl-20">
                                {!choice || choice=='song'?
                                <ul className="option-all__songs-list songs-list table-body">
                                    {songs.map((song,index)=>
                                        <Song
                                            song={song}
                                            setsongs={data=>setsongs(data)}
                                            songs={songs}
                                            key={song.id}
                                        />
                                        )}
                                </ul>:choice=='album'?
                                <div className="row mv-content">
                                    {playlists.map(item=>
                                    <Playlist
                                        item={item}
                                        key={item.id}
                                    /> 
                                    )}
                                </div>:<div className="columns is-multiline">
                                    {songs.map(item=>
                                    <Video
                                        item={item}
                                        key={item.id}
                                    />
                                    )}
                                </div>}
                            </div>
                        </div>
                    </div>
                </Artistcontent>
                
            </div>
        </div>
    )
}
export default Artist