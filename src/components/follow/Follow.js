import {useState,useEffect, useRef, useCallback} from "react"
import { useSelector,useDispatch } from "react-redux"
import Actionsong from "../home/Actionsong"
import  { Songinfo,PlaySong } from "../Song"
import { listartistURL,songURL,artistInfohURL,listpostURL, artistURL, postURL, listcommentURL, originURL } from "../../urls"
import {setsong,updatesongs,showinfoArtist, setshowpost, updateposts } from "../../actions/player"
import { Slide } from "react-slideshow-image"
import axios from "axios"
import { headers, setrequestlogin,valid } from "../../actions/auth"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
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

const Song=(props)=>{
    
    const {song,index}=props
    const songref=useRef()
    const dotref=useRef()
    const player=useSelector(state=>state.player)
    const datasongs=useSelector(state=>state.player.songs)
    const {play,currentIndex}=player
    const dispatch = useDispatch()
    const dropref=useRef()

    
    return(
        <div  ref={songref} key={song.id} class={`playlist-item ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <PlaySong song={song}/>      
            <div className="card-info flex-col">
                <Songinfo
                song={song}
                />
            </div>
            <Actionsong
                song={song}
                className={`icon-button`}
                top={40}
                right={40}
                transformY={index>1?50:10}
            />
        </div>
    )
}
const Follow=()=>{
    const [sliderIndex,setsliderIndex]=useState(0)
    const timer=useRef()
    const player=useSelector(state=>state.player)
   
    const [artists,setArtists]=useState([])
    const {posts,songs}=player
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
    useEffect(() => {
        ( async () =>{
            const res = await axios.get(listartistURL,headers)
            const data=res.data.map(item=>{
                return({...item,image:originURL+item.image})
            })
            setArtists(data)
            const res1=await axios.get(listpostURL,headers)
            dispatch(updateposts(res1.data))
            
        })()
        
    }, [])
    console.log(posts)
    const slideRef=useRef()
    const setfollow=useCallback( async (itemchoice,name,value)=>{
        if(valid){
        const res = await axios.post(`${artistURL}${itemchoice.artist.slug}`,JSON.stringify({action:'follow'}),headers)
        const dataposts=posts.map(item=>{
            if(item.artist.id===itemchoice.artist.id){
                return({...item,artist:{...item.artist,[name]:value}})
            }
            return({...item})
        })
        dispatch(updateposts(dataposts))
    }
    else{
        dispatch(setrequestlogin(true))
    }
    },[posts,valid])

    const setposts= useCallback(async (itemchoice,name,value)=>{
        if(valid){
        const res= await axios.post(`${postURL}/${itemchoice.id}`,JSON.stringify({'action':'like'}),headers)
        const dataposts=posts.map(item=>{
            if(item.id===itemchoice.id){
                return({...item,...res.data})
            }
            return({...item})
        })
        dispatch(updateposts(dataposts))
    }
    else{
        dispatch(setrequestlogin(true))
    }
    },[posts])
    const showcomment= async (itemchoice)=>{
        const res= await axios.get(`${listcommentURL}?post_id=${itemchoice.id}`,headers)
        dispatch(setshowpost({data:itemchoice,comments:res.data.comments,count:res.data.count,showpost:true}))
    }
    return (
        <div className="body-wrapper">
            <div class="is-text-center genre-artist-navbar">
                <nav class="zm-navbar is-oval zm-navbar-wrap">
                    <div class="zm-narbar-container">
                        <ul class="zm-navbar-menu">
                            <li class="zm-navbar-item is-active">
                                <div class="navbar-link">
                                    <a class="" href="/the-loai-nghe-si/Viet-Nam/IWZ9Z08I.html">Việt Nam</a>
                                </div>
                            </li>
                            <li class="zm-navbar-item">
                                <div class="navbar-link">
                                    <a class="" href="/the-loai-nghe-si/Au-My/IWZ9Z08O.html">US-UK</a>
                                </div>
                            </li>
                            <li class="zm-navbar-item">
                                <div class="navbar-link">
                                    <a class="" href="/the-loai-nghe-si/Han-Quoc/IWZ9Z08W.html">K-POP</a>
                                </div>
                            </li>
                            <li class="zm-navbar-item">
                                <div class="navbar-link">
                                    <a class="" href="/the-loai-nghe-si/Hoa-Ngu/IWZ9Z08U.html">Hoa Ngữ</a>
                                </div>
                            </li>
                            <li class="zm-navbar-item">
                                <div class="navbar-link">
                                    <a class="" href="/mainfeed">Nổi bật</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div>
                <div className="zma-section">
                    <div className="container-discover-slider" style={{position:'relative'}}>
                        {artists.length>0 &&(
                        <Slide infinite={true} ref={slideRef} autoplay transitionDuration={500} easing='ease' slidesToScroll={1} slidesToShow={4} arrows={false}>
                            {artists.map(item=>
                            <div key={item.id} className="slider-item">
                                <Link to={`${item.slug}`}>
                                <div class="container-discover__slider-item-img" style={{backgroundImage:`url(${item.image})`,backgroundSize:'cover',width:'100%',paddingTop:'100%'}}></div>
                                </Link>
                            </div>
                            )}
                        </Slide>
                        )}
                        <div onClick={()=>slideRef.current.goBack()} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--prev">
                            <svg enable-background="new 0 0 13 20" viewBox="0 0 13 20" role="img" class="stardust-icon stardust-icon-arrow-left-bold"><path stroke="none" d="m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z"></path></svg>
                        </div>
                        
                        <div onClick={()=>slideRef.current.goNext()} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--next">
                            <svg enable-background="new 0 0 13 21" viewBox="0 0 13 21" role="img" class="stardust-icon stardust-icon-arrow-right-bold"><path stroke="none" d="m11.1 9.9l-9-9-2.2 2.2 8 7.9-8 7.9 2.2 2.1 9-9 1-1z"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="new-feed-group">
                        {posts.map(item=>
                        <div key={item.id} className="feed-wrapper p-8" >
                            <div className="zm-card feed-card">
                                <div className="card-header feed-header">
                                    <div className="media mb-8">
                                        <div  className="media-left">
                                            <div style={{backgroundImage:`url(${originURL}${item.artist.image})`}} className="avatar"></div>
                                        </div>
                                        <div className="media-content">
                                            <h3 className="flex">
                                                <div className="media-name">{item.artist.name}</div>
                                                <div class="dot d-flex align-items-center">
                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
                                                </div>
                                                <button onClick={()=>setfollow(item,'followed',!item.artist.followed)} className="subtitle">{item.artist.followed?'Xem thêm':'Quan tâm'}</button>
                                            </h3>
                                            <div className="subtitle">{dayjs(item.updated_at).get('date')} tháng {dayjs(item.updated_at).get('month')+1} lúc {dayjs(item.updated_at).format('HH:mm')}</div>
                                        </div>
                                    </div>
                                    <div className="feed-caption mb-8">{item.caption}</div>
                                </div>
                                <div onClick={()=>showcomment(item)} className="container mar-b-15 feed-content">
                                    {item.files.map(file=>
                                    <div key={`file+${file.id}`} style={{backgroundImage:`url(${originURL}${file.media_preview||file.media})`}} className="feed-image"></div>
                                    )}
                                </div>
                                <div class="feed-footer flex-center">
                                    <div class="flex-center mr-16">
                                        <button onClick={()=>setposts(item,'liked',item.liked)} className="btn-like">
                                            {item.liked?
                                            <svg class="fill-heart feed-footer-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path></svg>:
                                            <svg class="feed-footer-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path></svg>
                                            }
                                            <span class="feed-footer-">{item.count_likers}</span>
                                        </button>
                                    </div>
                                    <div class="flex-center">
                                        <button className="btn-like" onClick={()=>showcomment(item)}>
                                            <svg class="feed-footer-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>
                                            <span >{item.count_comments}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="zm-section channel-section song-animate-section">
                <h3 class="zm-section-title title is-2">Bài hát nổi bật</h3>
                <div className="content">
                    <div className="flex">
                        <div className="songs-animate-container"> 
                            <div className="option-all__song-slider">
                                {songs.slice(0,10).map((item,index)=>
                                    <img key={item.id} src={item.image_cover} alt="anh slider" class={`option-all__song-slider-img ${index == sliderIndex?'option-all__song-slider-img-first':index == sliderIndex+1||(sliderIndex==listimage.length-1 && index==0)?'option-all__song-slider-img-second':'option-all__song-slider-img-third'}`}/>
                                )}
                            </div>
                        </div>
                        <div className="list flex-1">
                            <div className="option-all__songs pl-20">
                                <ul className="option-all__songs-list songs-list">
                                    {songs.map((song,index)=>
                                        <Song
                                            song={song}
                                            index={index}
                                        />
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

    )
}
export default Follow