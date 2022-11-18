import { useState,useEffect,useRef,useMemo ,useCallback} from "react"
import {debounce} from 'lodash';
import { searchinputURL,searchURL,songURL } from "../../urls";
import axios from "axios"
import { headers } from "../../actions/auth"
import styled from "styled-components"
import { useSelector,useDispatch } from "react-redux";
import { setsong,updatesongs } from "../../actions/player"
import { PlaySong } from "../Song";
const Dot=styled.div`
width:100%;
height:1px;
background-color:var(--border-primary);
margin:12px 0
`
const Song=(props)=>{
    const {song}=props
    const dispatch = useDispatch()
    const player= useSelector(state=>state.player)
    const datasongs=useSelector(state=>state.player.songs)
    const {play,currentIndex,}=player
    
    return(
        <div className="suggest__item flex-center song-item" key={song.id}>
            <PlaySong song={song}/>   
            <div className="song-content">
                <h3 className="song-name">{song.name}</h3>
                <div className="subtitle">{song.artist_name}</div>
            </div>
        </div> 
    )
}
const Searchcontent=()=>{
    const [artists,setArtists]=useState([])
    const [songs,setSongs]=useState([])
    const [keyword,setKeyword]=useState('')
    const [show,setShow]=useState(false)
    const parentRef=useRef()
    const onSearch = (e) => {
        const value=e.target.value
        setKeyword(value)
        fetchkeyword(value) 
    }

    const fetchkeyword=useCallback(debounce((value)=>{
        (async ()=>{
            try{
                if(value.trim()!=''){
                const res = await axios.get(`${searchURL}?keyword=${value}`,headers)
                const data=res.data
                setArtists(data.artists)
                setSongs(data.songs.map(item=>{
                    return({...item,image_cover:'http://localhost:8000'+item.image_cover})
                }))
                }
            }
            catch(e){
                console.log(e)
            }
        })()
    },1000),[])

    useEffect(()=>{
        const handleClick=(event)=>{
            const {target}=event
            if(show && !parentRef.current.contains(target)){
                setShow(false)
            }  
        }
        document.addEventListener('click',handleClick)
        return ()=>{
            document.removeEventListener('click',handleClick)
        }
    },[show])

   
    return (
        <form ref={parentRef} className="search">
            <div onClick={()=>setShow(true)} className={`search__container flex-center ${show?'is-collapse':''}`}>
                <div class="header-search-icon">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg>
                </div>
                <div className="header-content-input">
                    <input onChange={(e)=>onSearch(e)} value={keyword} type="text" placeholder="Tìm kiếm nghệ sĩ hoặc tên bài hát" />
                </div>
            </div>
            {show &&(
            <div className="suggest__list">
                <div className="suggest__list--content">
                    <div className="search__title">Từ khóa liên quan</div> 
                    {artists.map(item=>
                    <div className="suggest__item" key={item.id}>
                        <div class="search-icon">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg>
                        </div>
                        <div className="search-name">
                            {item.name}
                        </div>
                    </div>
                    
                    )}
                    <div className="suggest__item">
                        <div class="search-icon">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path></svg>
                        </div>
                        <div className="search-name">
                            "{keyword}"
                        </div>
                    </div>
                    <Dot/>
                    <div className="search__title">Gợi ý kết quả</div> 
                    {songs.map(song=>
                        <Song
                        song={song}
                        />
                    )}          
                </div>
            </div>)}
        </form>
    )
}
export default Searchcontent