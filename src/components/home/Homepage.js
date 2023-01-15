
import GradientChart from "./GradientChart"
import {songURL, zingchartURL,artistInfohURL} from "../../urls"
import {useState,useEffect, useCallback,useRef} from "react"
import axios from "axios"
import { headers } from "../../actions/auth"
import dayjs from "dayjs"
import {useDispatch,useSelector} from "react-redux"
import Song from "./Song"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
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
function Box(){
    return (
        <div
            className="playlist-item"
        >
            
            <Skeleton containerClassName="thumb" className="thumb"></Skeleton>
            
            <div class="card-info">
                
                    <Skeleton containerClassName="song-name" className="song-name" width={100}></Skeleton>
               
               
                <Skeleton width={160}></Skeleton>
               
            </div>
            <div class="flex-center">
               
                <Skeleton circle containerClassName="icon-button" count={4} className="icon-button"></Skeleton>
               
            </div>
        </div>
    )
}
const Homepage=()=>{
    const datasongs=useSelector(state => state.player.songs)
    const [songs,setSongs]=useState([])
    const [labels,setLabels]=useState([])
    const [values,setListvalues]=useState([])
    const [top1,setTop1]=useState([])
    const [top2,setTop2]=useState([])
    const [top3,setTop3]=useState([])
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(true)
    const player=useSelector(state => state.player)
    
    useEffect(() => {
        ( async ()=>{
            const res = await axios.get(zingchartURL,headers())
            
            setSongs(res.data.topsongs)
            setLabels(hours.map(item=>{
                return `${item.format("HH")}:00`
            }))
            setListvalues(res.data.songvalue)
            
            const datatop1 = res.data.dashboard[0].views
            const top1=hours.map((item,i)=>{
                if(datatop1.find(itemchoice=>item.isSame(itemchoice.day,'hour'))){
                    return datatop1.find(itemchoice=>item.isSame(itemchoice.day,'hour')).count
                }
                return 0
            })
            const datatop2=res.data.dashboard.length>1?res.data.dashboard[1].views:[]
            const top2=hours.map((item,i)=>{
                if(datatop2.find(itemchoice=>item.isSame(itemchoice.day,'hour'))){
                    return datatop2.find(itemchoice=>item.isSame(itemchoice.day,'hour')).count
                }
                return 0
            })
            const datatop3=res.data.dashboard.length>2?res.data.dashboard[2].views:[]
            const top3=hours.map((item,i)=>{
                if(datatop3.find(itemchoice=>item.isSame(itemchoice.day,'hour'))){
                    return datatop3.find(itemchoice=>item.isSame(itemchoice.day,'hour')).count
                }
                return 0
            })
           setLoading(false)
            setTop1(top1)
            setTop2(top2)
            setTop3(top3)
        })()
    }, [])
    console.log(top1)
    const setsongs=useCallback((data)=>{
        setSongs(data)
    },[])

   
    return(
        
            <div className="body-wrapper">
                <div className="flex-center">
                    <h3 className="zing-chart-heading">
                        #zingchart
                    </h3>
                    <div className="zing-chart-play-icon">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                    </div>
                </div>
                <div style={{position:'relative',width:'100%',marginTop:'52px',height:'270px'}}>
                <GradientChart
                    songs={songs}
                    labels={labels}
                    top1={top1}
                    top2={top2}
                    top3={top3}
                />
                </div>
                <div>
                    {loading?
                    <SkeletonTheme highlightColor="#3a3344" baseColor="rgba(255, 255, 255, 0.2)">
                        <Skeleton wrapper={Box}  height={60} count={5} />
                    </SkeletonTheme>
                   
                    
                    :<>
                    {songs.map((song,index)=>
                        <Song
                            song={song}
                            songs={songs}
                            key={song.id}
                            index={index}
                            setsongs={data=>setsongs(data)}
                        />
                    )}</>}
                </div>
            </div>
            
        
    )
}
export default Homepage