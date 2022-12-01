import {useState,useEffect,useRef, useId} from "react"
import axios from "axios"
import {listsongURL,songURL} from "../urls"
import { actionuser, setsong, showmodal, updatesongs } from "../actions/player"
import { headers, setrequestlogin,valid} from "../actions/auth"
import {useSelector,useDispatch} from "react-redux"
import Actionsong from "./home/Actionsong"
import {Likedsong, Songinfo} from "./Song"
import { toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Song=(props)=>{
    const player=useSelector(state => state.player)
    const {songs,currentIndex,play,song_id,duration,showaction}=player
    
    const dispatch = useDispatch()
    const {song,index}=props
    const songref=useRef()
    const songid=useId()
   
    const setplay= async (e)=>{
        e.stopPropagation()
        if(currentIndex!==index){
            dispatch(setsong({change:true,currentIndex:index,view:false,play:true,showoption:''})) 
        }
        else{
            dispatch(setsong({change:true,play:!play}))
        }
    }
    
    return(
        <div  ref={songref} className={`song ${showaction && song_id==songid?'show':''} ${currentIndex === index ? "active" : ""}`}>
            <div onClick={(e)=>setplay(e)}  className="thumb" style={{position:'relative'}}>
                <div style={{backgroundImage: `url(${song.image_cover})`,width:'100%',height:'100%',backgroundSize:'cover'}}></div>
                <div style={{display:'flex',justifyContent:'center'}} className="item-center song-item-image-overlay">
                    {index === currentIndex?
                        duration>0?play?
                        <img src="https://mp3-react-vinhbuihd.vercel.app/images/icon-playing.gif" alt="" style={{width: '20px', height: '20px'}}/>:
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>:
                        <svg xmlns="http://www.w3.org/2000/svg"  xmlnsXlink="http://www.w3.org/1999/xlink"  width="40px" height="40px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">                     
                        <g transform="rotate(0 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(30 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(60 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(90 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(120 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(150 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(180 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(210 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(240 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(270 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(300 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
                        </rect>
                        </g><g transform="rotate(330 50 50)">
                        <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#fff">
                            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                        </rect>
                        </g>
                        </svg>
                        :<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                    }
                </div>
            </div>
            <div className="card-info">
                <Songinfo
                    song={song}
                /> 
            </div>
               
            <Likedsong
                song={song}
                className="song-info-like icon-button"
                
            />
            
            <Actionsong
                song={song}
                className="icon-button"
                songid={songid}
            />
            
        </div>
    )
}
const Songs=()=>{
    const player=useSelector(state => state.player)
    const {songs,showplaylist,time_stop_player}=player
    const dispatch = useDispatch()
    
    useEffect(() => {
        ( async ()=>{
            if(songs.length==0){
                
                if(localStorage.getItem('songs')){
                    dispatch(updatesongs(JSON.parse(localStorage.getItem('songs'))))
                }
                else{
                const res = await axios.get(listsongURL,headers())
                
                dispatch(setsong({songs:res.data}))
            }
            }
        })()
    }, [songs.length,dispatch])

    
    const setstopplay=()=>{
        dispatch(showmodal(true))
        const data={data:{title:time_stop_player?"Xóa hẹn giờ":'Hẹn Giờ Dừng Phát Nhạc'},action:time_stop_player?'deletetimer':'timeplayer'}
        
        dispatch(actionuser(data))
    }

    
    const Actionplaylist=()=>{
        const [show,setShow]=useState(false)
        const parentref=useRef()
        useEffect(()=>{
            const handleClick=(event)=>{
                const {target}=event
                if(!parentref.current.contains(target) ){
                    setShow(false)
                }
            }
            document.addEventListener('click',handleClick)
            return ()=>{
                document.removeEventListener('click',handleClick)
            }
        },[])
        
        
        return(
            <div ref={parentref} className="btn-more-action">
                <div onClick={()=>setShow(!show)} className="side-playList-seemore">  
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                </div>
                {show &&(    
                    <div className='dropdown'>
                        <div className="list-item">
                            <div onClick={()=>dispatch(updatesongs([]))} className="item-space menu-item">
                                <div className="flex-center">
                                    <div className="icon">
                                        <svg stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2,4 C1.72385763,4 1.5,3.77614237 1.5,3.5 C1.5,3.22385763 1.72385763,3 2,3 L6,2.999 L6,2 C6,1.44771525 6.44771525,1 7,1 L10,1 C10.5522847,1 11,1.44771525 11,2 L11,2.999 L15,3 C15.2761424,3 15.5,3.22385763 15.5,3.5 C15.5,3.77614237 15.2761424,4 15,4 L14,4 L14,14 C14,14.5522847 13.5522847,15 13,15 L4,15 C3.44771525,15 3,14.5522847 3,14 L3,4 L2,4 Z M13,4 L4,4 L4,14 L13,14 L13,4 Z M6.5,7 C6.77614237,7 7,7.22385763 7,7.5 L7,11.5 C7,11.7761424 6.77614237,12 6.5,12 C6.22385763,12 6,11.7761424 6,11.5 L6,7.5 C6,7.22385763 6.22385763,7 6.5,7 Z M8.5,6 C8.77614237,6 9,6.22385763 9,6.5 L9,11.5 C9,11.7761424 8.77614237,12 8.5,12 C8.22385763,12 8,11.7761424 8,11.5 L8,6.5 C8,6.22385763 8.22385763,6 8.5,6 Z M10.5,7 C10.7761424,7 11,7.22385763 11,7.5 L11,11.5 C11,11.7761424 10.7761424,12 10.5,12 C10.2238576,12 10,11.7761424 10,11.5 L10,7.5 C10,7.22385763 10.2238576,7 10.5,7 Z M10,2 L7,2 L7,2.999 L10,2.999 L10,2 Z"></path></svg>
                                    </div>
                                    <div>Xóa danh sách phát</div>
                                </div>
                                <div></div>
                            </div>
                            <div className="item-space menu-item">
                                <div className="flex-center">
                                    <div className="icon">
                                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    
                                    <div>Tải danh sách phát</div>
                                </div>
                                <div></div>
                            </div>
                            <div className="item-space menu-item">
                                <div className="flex-center">
                                    <div className="icon-add">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8.48176704,1.5 C8.75790942,1.5 8.98176704,1.72385763 8.98176704,2 L8.981,7.997 L15,7.99797574 C15.2761424,7.99797574 15.5,8.22183336 15.5,8.49797574 C15.5,8.77411811 15.2761424,8.99797574 15,8.99797574 L8.981,8.997 L8.98176704,15 C8.98176704,15.2761424 8.75790942,15.5 8.48176704,15.5 C8.20562467,15.5 7.98176704,15.2761424 7.98176704,15 L7.981,8.997 L2,8.99797574 C1.72385763,8.99797574 1.5,8.77411811 1.5,8.49797574 C1.5,8.22183336 1.72385763,7.99797574 2,7.99797574 L7.981,7.997 L7.98176704,2 C7.98176704,1.72385763 8.20562467,1.5 8.48176704,1.5 Z"></path></svg>
                                    </div>
                                    <div>Thêm vào playlist</div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    )} 
                </div>
        )
    }
    return(
        <div div className={`side-playlist ${showplaylist?'':'hide'}`}>
            <div className="side-playList-top">
                <div className="change-playlist">
                    <button className="btn btn-small active">Danh sách phát</button>
                    <button className="btn btn-small">Nghe gần đây</button>
                </div>
                <div className="sibar-action">
                    <div onClick={setstopplay} className="side-playList-seemore">
                        <svg stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="alarm_clock" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 164 209" enableBackground="new 0 0 164 209" xmlSpace="preserve">
                            <g>
                                <path d="M87.385,57.346c-2.336,0-4.227,1.894-4.227,4.226v52.854l-32.041,22.615c-1.911,1.346-2.356,3.979-1.015,5.877   c0.83,1.18,2.129,1.799,3.458,1.799c0.846,0,1.692-0.247,2.435-0.783l33.833-23.879c1.114-0.801,1.783-2.08,1.783-3.45V61.571   C91.611,59.231,89.721,57.346,87.385,57.346"/>
                                <path d="M158.385,112.906c0-41.504-33.767-75.271-75.268-75.271c-41.509,0-75.275,33.767-75.275,75.271   c0,23.723,11.057,44.877,28.257,58.686L20.962,197.46c-1.177,2.014-0.5,4.605,1.514,5.794c0.665,0.388,1.403,0.569,2.129,0.569   c1.453,0,2.864-0.751,3.648-2.088l14.774-25.232c11.622,7.354,25.348,11.679,40.098,11.679c14.741,0,28.459-4.316,40.081-11.67   l14.766,25.231c0.784,1.337,2.204,2.089,3.648,2.089c0.727,0,1.461-0.182,2.138-0.57c2.015-1.188,2.69-3.764,1.511-5.794   l-15.138-25.859C147.316,157.791,158.385,136.629,158.385,112.906 M83.109,179.722c-36.841,0-66.824-29.97-66.824-66.815   c0-36.841,29.974-66.819,66.824-66.819c36.854,0,66.815,29.97,66.815,66.819C149.925,149.76,119.963,179.722,83.109,179.722"/>
                                <path d="M13.294,53.169c0.718,0,1.444-0.177,2.113-0.565l47.22-27.267c0.966-0.557,1.676-1.478,1.965-2.559   c0.285-1.085,0.14-2.241-0.425-3.207C55.479,4.529,36.19-0.634,21.155,8.045c-7.284,4.21-12.492,10.994-14.671,19.12   C4.31,35.295,5.428,43.78,9.625,51.056C10.413,52.418,11.833,53.169,13.294,53.169 M14.647,29.353   c1.589-5.943,5.41-10.912,10.734-13.99c3.615-2.084,7.572-3.083,11.477-3.083c6.62,0,13.091,2.848,17.54,8.048L15.163,42.976   C13.624,38.634,13.43,33.917,14.647,29.353"/>
                                <path d="M103.785,25.345l47.221,27.267c0.652,0.371,1.379,0.565,2.113,0.565c0.363,0,0.734-0.049,1.098-0.144   c1.081-0.289,2.006-0.999,2.559-1.969c4.209-7.288,5.324-15.773,3.152-23.895c-2.179-8.122-7.387-14.919-14.666-19.116   c-15.047-8.683-34.345-3.516-43.02,11.527c-0.554,0.974-0.719,2.121-0.43,3.202C102.102,23.855,102.803,24.78,103.785,25.345    M141.027,15.362c9.739,5.629,13.833,17.362,10.21,27.613l-39.239-22.653C119.071,12.073,131.279,9.733,141.027,15.362"/>
                            </g>
                        </svg>
                    </div>
                    <Actionplaylist/>
                </div>
            </div>
            {songs.length>0 &&(
                <div className="side-playList-group">
                    {songs.map((song,index)=>
                        <Song
                        song={song}
                        index={index}
                        key={song.id}
                        />
                    )}
                </div>
            )}  
        </div>
        
    )
}
export default Songs