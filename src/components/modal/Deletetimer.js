import { useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import { useSelector,useDispatch } from "react-redux"
import { playerstop, showmodal } from "../../actions/player"
import styled from 'styled-components'
const DeleteTimer=()=>{
    const dispatch = useDispatch()
    return(
        <div className="">
            <div className="time-stop">Bạn có chắc xóa hẹn giờ?</div> 
            <div className="item-end">
                <button onClick={()=>dispatch(showmodal(false))} className="btn"><span>Không</span></button>
                <button onClick={()=>{
                    dispatch(playerstop(null))
                    dispatch(showmodal(false))
                    }} className="btn btn-second ml-8"><span>Có</span></button>
            </div>
        </div>
    )
}
export default DeleteTimer