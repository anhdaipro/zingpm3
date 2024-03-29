import {useState,useEffect,useMemo, useRef, useId} from "react"
import {Slide} from "react-slideshow-image"
import 'react-slideshow-image/dist/styles.css'
import { listartistURL,zingchartURL,newsongURL,songURL,artistInfohURL } from "../../urls"
import axios from "axios"
import { headers } from "../../actions/auth"
import dayjs from "dayjs"
import {useDispatch,useSelector} from "react-redux"
import Listnewsong from "./Newsong"
import GradientChart from "../home/GradientChart"
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
    const hournow=now.get('hour')-1>0?now.get('hour'):0
    const hourday= Array(hournow).fill().map((_,i)=>{
        return dayjs().set('hour',i+1)
    })
    
    const yesterday=dayjs().subtract(24, 'hour')
    const houryesterday= [...Array(24 - hournow + 1).keys()].map(x => {
        return yesterday.set('hour',x + hournow)
    });
const hours=[...houryesterday,...hourday]

const Song=(props)=>{
    const {song,index}=props
    const dispatch = useDispatch()
    const player=useSelector(state => state.player)
    const {currentIndex,song_id}=player
    const datasongs = useSelector(state => state.player.songs)
    const songid=useId()
    return(
        <div key={index} id={songid} className={`playlist-item mb-8 ${datasongs.length>0 && datasongs[currentIndex].id === song.id ? "active" : ""}`}>
            <div className={`playlist-position top-${index+1}`}>{index+1}</div>
            <div className="playlist-line">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
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
            
            const res1 = await axios.get(zingchartURL,headers())
            setTopSongs(res1.data.topsongs)
            
            setLabels(hours.map(item=>{
                return `${item.format("HH")}:00`
            }))
            const datatop1 = res1.data.dashboard[0].views
            const top1=hours.map((item,i)=>{
                if(datatop1.find(itemchoice=>item.isSame(itemchoice.day,'hour'))){
                    return datatop1.find(itemchoice=>item.isSame(itemchoice.day,'hour')).count
                }
                return 0
            })
            const datatop2=res1.data.dashboard.length>1?res1.data.dashboard[1].views:[]
            const top2=hours.map((item,i)=>{
                if(datatop2.find(itemchoice=>item.isSame(itemchoice.day,'hour'))){
                    return datatop2.find(itemchoice=>item.isSame(itemchoice.day,'hour')).count
                }
                return 0
            })
            const datatop3=res1.data.dashboard.length>2?res1.data.dashboard[2].views:[]
            const top3=hours.map((item,i)=>{
                if(datatop3.find(itemchoice=>item.isSame(itemchoice.day,'hour'))){
                    return datatop3.find(itemchoice=>item.isSame(itemchoice.day,'hour')).count
                }
                return 0
            })
           
          
            setTop1(top1)
            setTop2(top2)
            setTop3(top3)
            const res2 = await axios.get(listartistURL,headers())
            const data2=res2.data
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
    
    return(
        
            <div className="body-wrapper">
                <div style={{position:'relative',overflow:'hidden'}} className="container-discover-slider">
                    <div className="container-discover">
                        {listimages.map((item,index)=>{
                            const className=sliderIndex==index?'container-discover__slider-item-first':(index==sliderIndex+1)||(index==0&&sliderIndex==listimages.length-1)?'container-discover__slider-item-second':(index == sliderIndex + 2)||(index==1&&sliderIndex==listimages.length-1)||(index==0&&sliderIndex==listimages.length-2)?'container-discover__slider-item-third':index==sliderIndex+3||(index==0&&sliderIndex==listimages.length-3) ||(index==1&&sliderIndex==listimages.length-2)||(index==2&&sliderIndex==listimages.length-1)?'container-discover__slider-item-four':"container-discover__slider-item-five"
                            return(
                            <div  key={item.image} className={`container-discover__slider-item ${className}`}>
                                <img src={item.image} alt="anh" className="container-discover__slider-item-img"/>
                            </div>
                            )}
                        )}
                    </div>
                    <div onClick={()=>setsliderIndex(sliderIndex==0?listimages.length-1:sliderIndex-1)} className="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--prev">
                    <svg enableBackground="new 0 0 13 20" viewBox="0 0 13 20" role="img" className="stardust-icon stardust-icon-arrow-left-bold"><path stroke="none" d="m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z"></path></svg>
                    </div>
                    
                    <div onClick={()=>setsliderIndex(sliderIndex==listimages.length-1?0:sliderIndex+1)} className="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--next">
                        <svg enableBackground="new 0 0 13 21" viewBox="0 0 13 21" role="img" className="stardust-icon stardust-icon-arrow-right-bold"><path stroke="none" d="m11.1 9.9l-9-9-2.2 2.2 8 7.9-8 7.9 2.2 2.1 9-9 1-1z"></path></svg>
                    </div>
                </div>
                <div className="option-all__margin_top zm-new-release-section">
                    <div className="zm-section-title title">Mới Phát Hành</div>
                    <div className="item-space">
                        <div className="genre-select">
                            {listitems.map(item=>
                            <button key={item.value} onClick={()=>setChoice(item.value)} className={`zm-btn ${choice===item.value &&'active'} button`} >{item.name}</button>
                            )}
                            
                        </div>
                        <Link className="discovery-btn" to={`/new-release/song?filter=${choice}`}>Tất cả 
                            <i className="icon ic-go-right"></i>
                        </Link>
                    </div>
                   
                    <Listnewsong
                        choice={choice}
                    />
                </div>
                <div className="container rt-chart-home">
                <div className="bg-blur"></div>
                <div className="bg-alpha"></div>
                    <div className="section-header">
                        <Link to="/zingchart">
                            #zingchart
                        </Link>
                        <div className="zing-chart-play-icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mr-16">
                            {topsongs.filter((item,index)=>index<3).map((song,index)=>
                                <Song
                                song={song}
                                index={index}
                                key={song.id}
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
                                <div className="container-discover__slider-item-img" style={{backgroundImage:`url(${item.image})`,backgroundSize:'cover',width:'100%',paddingTop:'100%'}}></div>
                            </div>
                            )}
                        </Slide>)}
                        <div onClick={()=>slideRef1.current.goBack()} className="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--prev">
                            <svg enableBackground="new 0 0 13 20" viewBox="0 0 13 20" role="img" className="stardust-icon stardust-icon-arrow-left-bold"><path stroke="none" d="m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z"></path></svg>
                        </div>
                        
                        <div onClick={()=>slideRef1.current.goNext()} className="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--next">
                            <svg enableBackground="new 0 0 13 21" viewBox="0 0 13 21" role="img" className="stardust-icon stardust-icon-arrow-right-bold"><path stroke="none" d="m11.1 9.9l-9-9-2.2 2.2 8 7.9-8 7.9 2.2 2.1 9-9 1-1z"></path></svg>
                        </div>
                    </div>
                </div>
                <div className='option-all__margin_top'>
                    <h3 className="zm-section-title title is-2">Top 100<a className="discovery-btn" href="/top100">Tất cả <i className="icon ic-go-right"></i></a></h3>
                    <TopSong/>
                </div>
            </div>
            
    )
}
export default Discover
