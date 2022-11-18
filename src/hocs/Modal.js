import { useSelector,useDispatch } from "react-redux"
import { showmodal } from "../actions/player"
import { useState,useEffect,useRef,useMemo } from "react"
import { songURL,newplaylistURL } from "../urls"
import { headers } from "../actions/auth"
import axios from "axios"
import Timepicker from "../components/modal/Timepicker"
import DeleteTimer from "../components/modal/Deletetimer"
import Continuteplayer from "../components/modal/Continuteplayer"
import Addplaylist from "../components/modal/Addplaylist"
const Modal=()=>{
    const show = useSelector(state => state.player.show)
    const action=useSelector(state => state.player.action)
    const data=useSelector(state=>state.player.data)
    const [ramdomplay,setRamdomplay]=useState(true)
    const [time,setTime]=useState()
    const [publics,setPublic]=useState(true)
    const dispatch = useDispatch()
    const [edit,setEdit]=useState(false)
    const [lyrics,setLyrics]=useState('')
    useEffect(() => {
        if(show && action=="editlyrics" && data){
            setLyrics(data.data.lyrics)
        }
        
    }, [show,data,action])
    
    console.log(action)
    const editlyric= async ()=>{
        if(lyrics){
           const res= await axios.post(`${songURL}/${data.data.id}`,JSON.stringify({action:'update',lyrics:lyrics}),headers)
            dispatch(showmodal(false))
        }
    }
    
    return(
        show &&(<div className='modal'>
            <div className='modal-content'>
                <div className="modal-header">
                    <div className="modal-header-title">{data.title}</div>
                </div>
                <div className='modal-body'>
                    {action=='editlyrics'?
                    <div className="lyric-content">
                        {!edit?<>
                        {data.data.lyrics?
                        <p class="lyric-song">{data.data.lyrics}</p>:
                        <div className='emty-lyric'>Lyric đang được cập nhật</div>}</>:
                        <textarea placeholder="Nhập lời bài hát vào đây" spellCheck={false} onChange={e=>setLyrics(e.target.value)} value={lyrics} style={{width:'100%',height:'100%'}}></textarea>}
                    </div>:action=='addplaylist'?
                    <Addplaylist/>:action=='timeplayer'?
                    <Timepicker/>:action=='continueplayer'?<Continuteplayer/>:<DeleteTimer/>}
                </div>
                {action=='editlyrics' &&(
                <div className="modal-footer">
                    <div className={`item-space ${edit?'item-end':''}`}>
                        {!edit &&(
                        <div onClick={()=>setEdit(true)} className="edit-lyric">Đóng góp lời bài hát</div>
                        )}
                        <button onClick={()=>dispatch(showmodal(false))} className="btn btn-primary"><span>Đóng</span></button>
                        {edit &&(<button disabled={lyrics?false:true} onClick={editlyric} className="btn btn-second ml-8"><span>Lưu</span></button>)}
                    </div>
                </div>)}
            </div>
        </div>)
    )
}
export default Modal