
import GradientChart from "./GradientChart"
import {songURL, zingchartURL,artistInfohURL} from "../../urls"
import {useState,useEffect, useCallback,useRef} from "react"
import axios from "axios"
import { setsong,actionuser,updatesongs,showinfoArtist } from "../../actions/player"
import { headers } from "../../actions/auth"
import dayjs from "dayjs"
import Actionsong from "./Actionsong"
import {useDispatch,useSelector} from "react-redux"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import  { PlaySong,Songinfo } from "../Song"
import Song from "./Song"
const now=dayjs()
    const hournow=now.get('hour')-1>0?now.get('hour'):0
    console.log(hournow)
    const hourday= Array(hournow).fill().map((_,i)=>{
        return dayjs().set('hour',i+1).format("DD-MM-YYYY HH")
    })
    
    const yesterday=dayjs().subtract(24, 'hour')
    const houryesterday= [...Array(24 - hournow + 1).keys()].map(x => {
        return yesterday.set('hour',x + hournow).format("DD-MM-YYYY HH")
    });
const hours=[...houryesterday,...hourday]

const Homepage=()=>{
    const datasongs=useSelector(state => state.player.songs)
    const [songs,setSongs]=useState([])
    const [labels,setLabels]=useState([])
    const [values,setListvalues]=useState([])
    const [top1,setTop1]=useState([])
    const [top2,setTop2]=useState([])
    const [top3,setTop3]=useState([])
    const dispatch = useDispatch()
  
    const player=useSelector(state => state.player)
    const {showplaylist,currentIndex,play, time_stop_player,showinfo,infoRef,keepinfo}=player
    useEffect(() => {
        ( async ()=>{
            const res = await axios.get(zingchartURL,headers)
            console.log(res.data)
            setSongs(res.data.topsongs)
            const data= res.data.dashboard.map(item=>{
              return ({...item,day:dayjs(item.day).format("DD-MM-YYYY HH")})
            })
            setLabels(hours.map(item=>{
                return `${item.slice(-2)}:00`
            }))
            setListvalues(res.data.songvalue)
            
            const datatop1 = data.filter(item=>item.song==res.data.topsongs[0].id)
            const top1=hours.map((item,i)=>{
                if(datatop1.find(itemchoice=>itemchoice.day==item)){
                    return datatop1.find(itemchoice=>itemchoice.day==item).count
                }
                return 0
            })
            const datatop2=data.filter(item=>item.song==res.data.topsongs[1].id)
            const top2=hours.map((item,i)=>{
                if(datatop2.find(itemchoice=>itemchoice.day==item)){
                    return datatop2.find(itemchoice=>itemchoice.day==item).count
                }
                return 0
            })
            const datatop3=data.filter(item=>item.song==res.data.topsongs[2].id)
            const top3=hours.map((item,i)=>{
                if(datatop3.find(itemchoice=>itemchoice.day==item)){
                    return datatop3.find(itemchoice=>itemchoice.day==item).count
                }
                return 0
            })
           
            setTop1(top1)
            setTop2(top2)
            setTop3(top3)
        })()
    }, [])
    
    const setsongs=useCallback((data)=>{
        setSongs(data)
    },[songs])

   
    return(
        
            <div className="body-wrapper">
                <div class="flex-center">
                    <h3 class="zing-chart-heading">
                        #zingchart
                    </h3>
                    <div class="zing-chart-play-icon">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
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
                    {songs.map((song,index)=>
                        <Song
                            song={song}
                            songs={songs}
                            index={index}
                            setsongs={data=>setsongs(data)}
                        />
                    )}
                </div>
            </div>
            
        
    )
}
export default Homepage