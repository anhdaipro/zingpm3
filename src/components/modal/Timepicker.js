import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import { useSelector,useDispatch } from "react-redux"
import { playerstop, showmodal } from "../../actions/player"
import styled from 'styled-components'
const Dot=styled.div`
height:2px;
width:100%;
background-color:#cccccc;
&.dot-active{
background-color:#9b4de0;
}
`
const Listitem=styled.div`
overflow-y:auto;
height:120px;
`
const Item=styled.div`
padding:8px 0;
display:flex;
justify-content:center;
cursor:pointer;
color:#fff;
&:hover{
background-color:#493961
}
`
const now=dayjs()
const Timepicker=()=>{
    const time_stop_player=useSelector(state=>state.player.time_stop_player)
    const [time,setTime]=useState()
    const [hour,setHour]=useState(0)
    const [minute,setMinute]=useState(0)
    const dispatch = useDispatch()
    
    useEffect(()=>{
        if(time_stop_player){
            setTime(time_stop_player)
            const seconds=(time_stop_player-now)/1000
            setHour(Math.floor((seconds) / 3600) % 60)
            setMinute(Math.floor((seconds) / 60) % 60)
        }
    },[time_stop_player])
    const [showhours,setShowhours]=useState(false)
    const [showminutes,setShowminutes]=useState(false)
    useEffect(() => {
        const handleClick=(event)=>{
            const {target}=event
            if(hourref.current && !hourref.current.contains(target)){
                setShowhours(false)
            }
            if(minuteref.current && !minuteref.current.contains(target)){
                setShowminutes(false)
            }
        }
        document.addEventListener('click',handleClick)
        return () => {
            document.removeEventListener('click',handleClick)
        }
    }, [])
    const hourref=useRef()
    const minuteref=useRef()
    
    return(
        <div className='time-stop-player'>
            <div className="time-picker">
                <div ref={hourref} onClick={()=>setShowhours(!showhours)} className="time-select time-hours">
                    <div className="time-chocie">
                        <span className="time-choice-value">{('0'+hour).slice(-2)}</span>
                        <span className="time-choice-unit"> Giờ</span>
                        </div>
                    <Dot/>
                    {showhours&&(
                    <div className="drop-down">
                        <Listitem>
                            {Array(13).fill().map((_,i)=><Item key={i} className="item" onClick={()=>setHour(i)}>{('0'+i).slice(-2)}</Item>)}
                        </Listitem>
                    </div>
                    )}
                </div>
                <div className="dot-time">:</div>
                <div ref={minuteref} onClick={()=>setShowminutes(!showminutes)} className="time-select  time-hours">
                    <div className="time-chocie">
                        <span className="time-choice-value">{('0'+minute).slice(-2)}</span>
                        <span className="time-choice-unit"> Phút</span>
                        </div>
                    <Dot/>
                    {showminutes&&(
                    <div className="drop-down">
                        <Listitem>
                            {Array(10).fill().map((_,i)=><Item className='item' key={i} onClick={()=>setMinute(i*5)}>{('0'+i*5).slice(-2)}</Item>)}
                        </Listitem>
                    </div>)}
                </div>
            </div>
            <div className="time-stop">{hour>0 || minute>0?<><span>Dự tính thời gian dừng phát nhạc</span> <span className="time-stop-value">{now.add(hour, 'hour').add(minute,'minute').format('DD-MM-YYYY HH:mm')}</span></>:'Chọn thời gian để dừng phát nhạc '}</div>
            <div className="">
                <button disabled={hour>0 || minute>0?false:true} onClick={()=>{
                    dispatch(playerstop(now.add(hour, 'hour').add(minute,'minute')))
                    dispatch(showmodal(false))
                    }} className="btn btn-second mb-8 btn-large"><span>Lưu lại</span></button>
                <button onClick={()=>dispatch(showmodal(false))} className="btn btn-large"><span>Hủy</span></button>
                
            </div>
        </div>
    )
}
export default Timepicker