
import { useSelector,useDispatch } from "react-redux"
import { showmodal } from "../../actions/player"
import { useState,useEffect,useRef,useMemo } from "react"
import { songURL,newplaylistURL } from "../../urls"
import axios from "axios"
import styled from "styled-components"
import {ToastContainer, toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
const StyleSwitch=styled.div`
position:relative;
border-radius:12px;
width:28px;
margin-left:4px;
background-color:${props=>props.open?'#9b4de0':'#b7b7b7'};
height:16px;
`
const Swidth=styled.div`
left:${props=>props.open?13:1}px;
background-color: #fff;
border-radius: 8px;
position:absolute;
width: 14px;
height: 14px;
margin-top: 1px;
`
const token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY4NDc2MDEwLCJqdGkiOiJmMDRjZjczYzE4ODY0NmRhOWEzN2UyM2U4YWM0YTVmYSIsInVzZXJfaWQiOjF9.XC53T6Y_OCqfGJ3t8vdvdstEm3WHANC2an_LXjGnCsE"
const headers={'headers': token?{ Authorization:`JWT ${token}`,'Content-Type': 'application/json' }:{'Content-Type': 'application/json'}}
const Addplaylist=()=>{
    const [ramdomplay,setRamdomplay]=useState(true)
    const [publics,setPublic]=useState(true)
    const [keyword,setKeyword]=useState('')
    const dispatch = useDispatch()
    const addplaylist= async () =>{
        try{
        const rss= await axios.post(newplaylistURL,JSON.stringify({name:keyword,public:publics,ramdom_play:ramdomplay}),headers)
        dispatch(showmodal(false))
        toast.success(<span>Tạo playlist  "{keyword}" thành công</span>,{ 
            position: toast.POSITION.BOTTOM_LEFT,
            className:'toast-message'
        });
    }
    catch(e){
        console.log(e)
        const message=e.response.data[0]
        toast.error(<span>{message}</span>,{ 
            position: toast.POSITION.BOTTOM_LEFT,
            className:'toast-message'
        });
    }
    }
    const valid=keyword.trim()
    return(
            <div>
                <div className="content-input">
                    <input maxLength="30" type="text" onChange={e=>setKeyword(e.target.value)} placeholder="Nhập tên playlist" value={keyword}/>
                </div>
                <div className="mb-16">
                    <div className="item-space mb-16">
                        <div className="item">
                            <p className="item-name">Công khai</p>
                            <p className="item-info"></p>
                        </div>
                        <div>
                            <StyleSwitch onClick={()=>setPublic(!publics)} open={publics}>
                                <Swidth open={publics}/>
                            </StyleSwitch>
                        </div>
                    </div>
                    <div className="item-space">
                        <div className="item">
                            <p className="item-name">Phát ngẫu nhiên</p>
                            <p className="item-info"></p>
                        </div>
                        <div>
                            <StyleSwitch onClick={()=>setRamdomplay(!ramdomplay)} open={ramdomplay}>
                                <Swidth open={ramdomplay}/>
                            </StyleSwitch>
                        </div>
                    </div>
                </div>
                <div>
                    <button disabled={valid?false:true} onClick={addplaylist} style={{width:'100%'}} className={`btn ${valid?'':'disabled'} btn-second`}><span>Tạo mới</span></button>
                </div>
                
        </div>
    )
}
export default Addplaylist