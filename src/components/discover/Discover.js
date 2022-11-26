import {useState,useEffect,useMemo, useRef} from "react"
import {Slide} from "react-slideshow-image"
import 'react-slideshow-image/dist/styles.css'
import { listartistURL,zingchartURL,newsongURL,songURL,artistInfohURL } from "../../urls"
import { partition } from "../../constants"
import axios from "axios"
import { headers } from "../../actions/auth"
import dayjs from "dayjs"
import {useDispatch,useSelector} from "react-redux"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Listnewsong from "./Newsong"
import GradientChart from "../home/GradientChart"
import {setsong,updatesongs,showinfoArtist } from "../../actions/player"
import { Link } from "react-router-dom"
import  {Songinfo, PlaySong } from "../Song"
import TopSong from "./TopSong"
const listimages=[
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider-discover/1.jpg',url:''},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider-discover/2.jpg',url:''},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider-discover/3.jpg',url:''},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/mv/2.webp',url:''},
    {image:'https://sona7ns.github.io/zingmp3.vn/assets/img/slider-discover/4.jpg',url:''},
]
const listitems=[
    {name:"Tất cả",value:'all'},
    {name:"Việt Nam",value:'vpop'},
    {name:"Quốc tế",value:'usuk'},
]
const now=dayjs()
    const hournow=now.get('hour')%2==0?now.get('hour'):now.get('hour')-1
    const hourday= Array(hournow).fill().map((_,i)=>{
        return dayjs().set('hour',i+1).format("DD-MM-YYYY HH")
    })
    console.log(hourday)
    const yesterday=dayjs().subtract(24, 'hour')
    const houryesterday= [...Array(24 - hournow + 1).keys()].map(x => {
        return yesterday.set('hour',x + hournow).format("DD-MM-YYYY HH")
    });
const hours=[...houryesterday,...hourday]

const Song=(props)=>{
    const {song,index}=props
    const dispatch = useDispatch()
    const player=useSelector(state => state.player)
    const {showplaylist,currentIndex,play, time_stop_player,showinfo,infoRef,keepinfo}=player
    const datasongs = useSelector(state => state.player.songs)
    return(
        <div key={index} class={`playlist-item mb-8 ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <div className={`playlist-position top-${index+1}`}>{index+1}</div>
            <div class="playlist-line">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
            </div>
            <PlaySong song={song}/>        
            <div className="card-info">
                <Songinfo
                song={song}
                />
            </div>
            <div className={`flex-center`}>
                42%
            </div> 
        </div>
    )
}

const Discover=()=>{
    const [artists,setArtists]=useState([])
    const [topsongs,setTopSongs]=useState([])
    const  slideRef1=useRef()
    const [labels,setLabels]=useState([])
    const [top1,setTop1]=useState([])
    const [top2,setTop2]=useState([])
    const [top3,setTop3]=useState([])
    const [choice,setChoice]=useState('all')
    const player=useSelector(state => state.player)
   
   
    useEffect(() => {
        ( async ()=>{
            
            const res1 = await axios.get(zingchartURL,headers)
            setTopSongs(res1.data.topsongs.map(item=>{
                return({...item,image_cover:'http://localhost:8000'+item.image_cover})
            }))
            
            const data= res1.data.dashboard.map(item=>{
              return ({...item,day:dayjs(item.day).format("DD-MM-YYYY HH")})
            })
            setLabels(hours.map(item=>{
                return `${item.slice(-2)}:00`
            }))
            console.log(hours)
            const datatop1 = data.filter(item=>item.song==res1.data.topsongs[0].id)
            const top1=hours.map((item,i)=>{
                if(datatop1.find(itemchoice=>itemchoice.day==item)){
                    return datatop1.find(itemchoice=>itemchoice.day==item).count
                }
                return 0
            })
            const datatop2=data.filter(item=>item.song==res1.data.topsongs[1].id)
            const top2=hours.map((item,i)=>{
                if(datatop2.find(itemchoice=>itemchoice.day==item)){
                    return datatop2.find(itemchoice=>itemchoice.day==item).count
                }
                return 0
            })
            const datatop3=data.filter(item=>item.song==res1.data.topsongs[2].id)
            const top3=hours.map((item,i)=>{
                if(datatop3.find(itemchoice=>itemchoice.day==item)){
                    return datatop3.find(itemchoice=>itemchoice.day==item).count
                }
                return 0
            })
            console.log(datatop1)
            setTop1(top1)
            setTop2(top2)
            setTop3(top3)
            const res2 = await axios.get(listartistURL,headers)
            const data2=res2.data.map(item=>{
                return({...item,image:'http://localhost:8000'+item.image})
            })
            setArtists(data2)
        })()
    }, [])
        
    const [sliderIndex,setsliderIndex]=useState(0)
    const timer=useRef()
    useEffect(() => {
        timer.current=setInterval(()=>{
            const value=sliderIndex==listimages.length-1?0:sliderIndex+1
            setsliderIndex(value)
        },5000)
        return () => {
            clearInterval(timer.current)
        }
    }, [sliderIndex])
    const sliders=useMemo(()=>{
        const images=[...listimages]
        const value=images.slice(sliderIndex,sliderIndex+4)
        console.log(images.length-sliderIndex)
        const valuebefore=sliderIndex>images.length-4?images.slice(0,4-images.length-sliderIndex):[]
        console.log(valuebefore)
        return sliderIndex<images.length-4?value:[...value,...valuebefore]
    },[sliderIndex])
    console.log(sliders)
    return(
        
            <div className="body-wrapper">
                <div style={{position:'relative',overflow:'hidden'}} className="container-discover-slider">
                    <div className="container-discover">
                        {listimages.map((item,index)=>{
                            const className=sliderIndex==index?'container-discover__slider-item-first':(index==sliderIndex+1)||(index==0&&sliderIndex==listimages.length-1)?'container-discover__slider-item-second':(index == sliderIndex + 2)||(index==1&&sliderIndex==listimages.length-1)||(index==0&&sliderIndex==listimages.length-2)?'container-discover__slider-item-third':index==sliderIndex+3||(index==0&&sliderIndex==listimages.length-3) ||(index==1&&sliderIndex==listimages.length-2)||(index==2&&sliderIndex==listimages.length-1)?'container-discover__slider-item-four':"container-discover__slider-item-five"
                            return(
                            <div  key={item.image} class={`container-discover__slider-item ${className}`}>
                                <img src={item.image} alt="anh" class="container-discover__slider-item-img"/>
                            </div>
                            )}
                        )}
                    </div>
                    <div onClick={()=>setsliderIndex(sliderIndex==0?listimages.length-1:sliderIndex-1)} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--prev">
                    <svg enable-background="new 0 0 13 20" viewBox="0 0 13 20" role="img" class="stardust-icon stardust-icon-arrow-left-bold"><path stroke="none" d="m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z"></path></svg>
                    </div>
                    
                    <div onClick={()=>setsliderIndex(sliderIndex==listimages.length-1?0:sliderIndex+1)} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--next">
                        <svg enable-background="new 0 0 13 21" viewBox="0 0 13 21" role="img" class="stardust-icon stardust-icon-arrow-right-bold"><path stroke="none" d="m11.1 9.9l-9-9-2.2 2.2 8 7.9-8 7.9 2.2 2.1 9-9 1-1z"></path></svg>
                    </div>
                </div>
                <div className="option-all__margin_top zm-new-release-section">
                    <div className="zm-section-title title">Mới Phát Hành</div>
                    <div className="item-space">
                        <div class="genre-select">
                            {listitems.map(item=>
                            <button key={item.value} onClick={()=>setChoice(item.value)} className={`zm-btn ${choice===item.value &&'active'} button`} >{item.name}</button>
                            )}
                            
                        </div>
                        <Link class="discovery-btn" to={`/new-release/song?filter=${choice}`}>Tất cả 
                            <i class="icon ic-go-right"></i>
                        </Link>
                    </div>
                   
                    <Listnewsong
                        choice={choice}
                    />
                </div>
                <div className="container rt-chart-home">
                <div class="bg-blur"></div>
                <div class="bg-alpha"></div>
                    <div class="section-header">
                        <Link to="/zingchart">
                            #zingchart
                        </Link>
                        <div class="zing-chart-play-icon">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mr-16">
                            {topsongs.filter((item,index)=>index<3).map((song,index)=>
                                <Song
                                song={song}
                                index={index}
                                />
                            )}
                        </div>
                        <div style={{position:'relative',flex:1}}>
                            <GradientChart
                            songs={topsongs}
                            time={new Date()}
                            labels={labels}
                            top1={top1}
                            top2={top2}
                            top3={top3}
                            />
                        </div>
                    </div>
                    
                </div>
                <div className="option-all__margin_top">
                    <div className="zm-section-title title is-2">Mới Phát Hành</div>
                    <div className="container-discover-slider" style={{position:'relative'}}>
                        {artists.length>0 &&(
                        <Slide infinite={true} ref={slideRef1} autoplay transitionDuration={500} easing='ease' slidesToScroll={1} slidesToShow={4} arrows={false}>
                            {artists.map(item=>
                            <div key={item.id} className="slider-item">
                                <div class="container-discover__slider-item-img" style={{backgroundImage:`url(${item.image})`,backgroundSize:'cover',width:'100%',paddingTop:'100%'}}></div>
                            </div>
                            )}
                        </Slide>)}
                        <div onClick={()=>slideRef1.current.goBack()} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--prev">
                            <svg enable-background="new 0 0 13 20" viewBox="0 0 13 20" role="img" class="stardust-icon stardust-icon-arrow-left-bold"><path stroke="none" d="m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z"></path></svg>
                        </div>
                        
                        <div onClick={()=>slideRef1.current.goNext()} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--next">
                            <svg enable-background="new 0 0 13 21" viewBox="0 0 13 21" role="img" class="stardust-icon stardust-icon-arrow-right-bold"><path stroke="none" d="m11.1 9.9l-9-9-2.2 2.2 8 7.9-8 7.9 2.2 2.1 9-9 1-1z"></path></svg>
                        </div>
                    </div>
                </div>
                <div className='option-all__margin_top'>
                    <h3 class="zm-section-title title is-2">Top 100<a class="discovery-btn" href="/top100">Tất cả <i class="icon ic-go-right"></i></a></h3>
                    <TopSong/>
                </div>
            </div>
            
    )
}
export default Discover
