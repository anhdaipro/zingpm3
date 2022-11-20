import {useState,useEffect,useMemo,useRef} from "react"
import styled from "styled-components"
import {debounce} from "lodash"
import axios from "axios"
import {listsongURL,songURL,streamingURL} from "../urls"
import { actionuser, setsong, showmodal, updatesong, updatesongs,showinfoArtist } from "../actions/player"
import { headers, setrequestlogin,valid} from "../actions/auth"
import {useSelector,useDispatch} from "react-redux"
import Actionsong from "./home/Actionsong"
import {Songinfo} from "./Song"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
const SeekBarProgress=styled.div`
    height: 2px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
`
const SeekBarCircle=styled.div`
    width: 12px;
    height: 12px;
    display:none;
    background-color: rgb(255, 255, 255);
    border-radius: 12px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 1;
`

const SeekBar=styled.div`
    height: 2px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transform-origin: left center;
`
const Contentprogess=styled.div`
position:relative;
flex:1;
margin:0 8px;
height:16px;
&:hover .progress{
    height: 4px;
    
};
&:hover .seekbar{
    height: 4px;
};
&:hover .seekbarcircle{
    display:block
}
`
const Song=(props)=>{
   
    const player=useSelector(state => state.player)
    const {songs,currentIndex,play}=player
    const dispatch = useDispatch()
    const {song,index}=props
    const songref=useRef()
    const dotref=useRef()
    const setliked= async (name,value)=>{
        if(valid){
            const res=await axios.post(`${songURL}/${song.id}`,JSON.stringify({action:'like'}),headers)
            const data=songs.map((item,index)=>{
                if(song.id==item.id){
                    return({...item,[name]:value})
                }
                return({...item})
            })
        
            toast(<span>{value?'Đã thêm bài hát vào thư viện':'Đã xóa bài hát khỏi thư viện'}</span>,{  
                position:toast.POSITION.BOTTOM_LEFT,
                className:'toast-message',
            });
            dispatch(updatesongs(data))
        }
        else{
            dispatch(setrequestlogin(true))
        }
    }
    
    const setplay= async (e)=>{
        e.stopPropagation()
        if(currentIndex!==index){
            dispatch(setsong({change:true,currentIndex:index,view:false,play:true})) 
        }
        else{
            dispatch(setsong({change:true,play:!play}))
        }
    }

    return(
        <div  ref={songref} key={index} class={`song ${currentIndex === index ? "active" : ""}`}>
            <div onClick={(e)=>setplay(e)}  className="thumb" style={{position:'relative'}}>
                <div style={{backgroundImage: `url('${song.image_cover}')`,width:'100%',height:'100%',backgroundSize:'cover'}}></div>
                <div style={{display:'flex',justifyContent:'center'}} class="item-center song-item-image-overlay">
                    {index === currentIndex && play?
                        <img src="https://mp3-react-vinhbuihd.vercel.app/images/icon-playing.gif" style={{width: '20px', height: '20px'}}/>:
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                    }
                </div>
            </div>
            <div className="card-info">
                <Songinfo
                    song={song}
                /> 
            </div>
               
            <div onClick={()=>setliked('liked',!song.liked)} class="song-info-like icon-button" aria-label="Yêu thích">
                <svg className={song.liked?'fill-heart':''} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    {song.liked?<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z"></path>
                    :<path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>}
                </svg>
            </div>
            
            <Actionsong
                song={song}
                className="icon-button"
                top={40}
                right={40}
                transformY={index>1?50:10}
            />
            
        </div>
    )
}
const Songs=()=>{
    const player=useSelector(state => state.player)
    const {songs,showplaylist,currentIndex,play, time_stop_player,showinfo,infoRef,keepinfo}=player
    const dispatch = useDispatch()
    
    useEffect(() => {
        ( async ()=>{
            if(songs.length==0){
                console.log(localStorage.getItem('songs'))
                if(localStorage.getItem('songs')){
                    dispatch(updatesongs(JSON.parse(localStorage.getItem('songs'))))
                }
                else{
                const res = await axios.get(listsongURL,headers)
                const data=res.data.map(item=>{
                    return({...item,image_cover:'http://localhost:8000'+item.image_cover})
                })
                dispatch(setsong({songs:data,change:true}))
            }
            }
        })()
    }, [songs,dispatch])

    
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
            <div ref={parentref} class="btn-more-action">
                <div onClick={()=>setShow(!show)} class="side-playList-seemore">  
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                </div>
                {show &&(    
                    <div className='dropdown'>
                        <div className="list-item">
                            <div onClick={()=>dispatch(updatesongs([]))} className="item-space menu-item">
                                <div className="flex-center">
                                    <div className="icon">
                                        <svg stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2,4 C1.72385763,4 1.5,3.77614237 1.5,3.5 C1.5,3.22385763 1.72385763,3 2,3 L6,2.999 L6,2 C6,1.44771525 6.44771525,1 7,1 L10,1 C10.5522847,1 11,1.44771525 11,2 L11,2.999 L15,3 C15.2761424,3 15.5,3.22385763 15.5,3.5 C15.5,3.77614237 15.2761424,4 15,4 L14,4 L14,14 C14,14.5522847 13.5522847,15 13,15 L4,15 C3.44771525,15 3,14.5522847 3,14 L3,4 L2,4 Z M13,4 L4,4 L4,14 L13,14 L13,4 Z M6.5,7 C6.77614237,7 7,7.22385763 7,7.5 L7,11.5 C7,11.7761424 6.77614237,12 6.5,12 C6.22385763,12 6,11.7761424 6,11.5 L6,7.5 C6,7.22385763 6.22385763,7 6.5,7 Z M8.5,6 C8.77614237,6 9,6.22385763 9,6.5 L9,11.5 C9,11.7761424 8.77614237,12 8.5,12 C8.22385763,12 8,11.7761424 8,11.5 L8,6.5 C8,6.22385763 8.22385763,6 8.5,6 Z M10.5,7 C10.7761424,7 11,7.22385763 11,7.5 L11,11.5 C11,11.7761424 10.7761424,12 10.5,12 C10.2238576,12 10,11.7761424 10,11.5 L10,7.5 C10,7.22385763 10.2238576,7 10.5,7 Z M10,2 L7,2 L7,2.999 L10,2.999 L10,2 Z"></path></svg>
                                    </div>
                                    <div>Xóa danh sách phát</div>
                                </div>
                                <div></div>
                            </div>
                            <div className="item-space menu-item">
                                <div className="flex-center">
                                    <div className="icon">
                                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    
                                    <div>Tải danh sách phát</div>
                                </div>
                                <div></div>
                            </div>
                            <div className="item-space menu-item">
                                <div className="flex-center">
                                    <div className="icon-add">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.48176704,1.5 C8.75790942,1.5 8.98176704,1.72385763 8.98176704,2 L8.981,7.997 L15,7.99797574 C15.2761424,7.99797574 15.5,8.22183336 15.5,8.49797574 C15.5,8.77411811 15.2761424,8.99797574 15,8.99797574 L8.981,8.997 L8.98176704,15 C8.98176704,15.2761424 8.75790942,15.5 8.48176704,15.5 C8.20562467,15.5 7.98176704,15.2761424 7.98176704,15 L7.981,8.997 L2,8.99797574 C1.72385763,8.99797574 1.5,8.77411811 1.5,8.49797574 C1.5,8.22183336 1.72385763,7.99797574 2,7.99797574 L7.981,7.997 L7.98176704,2 C7.98176704,1.72385763 8.20562467,1.5 8.48176704,1.5 Z"></path></svg>
                                    </div>
                                    <div>Thêm vào playlist</div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    )} 
                </div>
        )
    }
    return(
        <div div className={`side-playlist ${showplaylist?'':'hide'}`}>
            <div class="side-playList-top">
                <div class="change-playlist">
                    <button class="btn btn-small active">Danh sách phát</button>
                    <button class="btn btn-small">Nghe gần đây</button>
                </div>
                <div className="sibar-action">
                <div onClick={setstopplay} class="side-playList-seemore">
                    <svg stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="alarm_clock" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 164 209" enable-background="new 0 0 164 209" xmlSpace="preserve">
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
                    key={index}
                    />
                )}
                </div>
            )}  
        </div>
        
    )
}
export default Songs