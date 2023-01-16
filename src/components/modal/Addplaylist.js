
import { useSelector,useDispatch } from "react-redux"
import { showmodal, updateplaylists } from "../../actions/player"
import { useState} from "react"
import { songURL,newplaylistURL } from "../../urls"
import { slugify } from "../../constants"
import axios from "axios"
import styled from "styled-components"
import { toast } from'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { expirationDate, expiry, headers, setrequestlogin,token,valid } from "../../actions/auth"
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

const Addplaylist=()=>{
    const [ramdomplay,setRamdomplay]=useState(true)
    const [publics,setPublic]=useState(true)
    const [keyword,setKeyword]=useState('')
    const player=useSelector(state=>state.player)
    const user=useSelector(state=>state.auth.user)
    const {playlists}=player
    const dispatch = useDispatch()
    const addplaylist= async () =>{
        try{
            if(token() && expiry()>0){
            const res= await axios.post(newplaylistURL,JSON.stringify({name:keyword,public:publics,ramdom_play:ramdomplay,slug:slugify(keyword)}),headers())
            dispatch(showmodal(false))
            const playlistupdate=[...playlists,{...res.data,name:keyword,user:user.id,user_name:user.name,images:[]}]
            dispatch(updateplaylists(playlistupdate))
            toast.success(<span>Tạo playlist  "{keyword}" thành công</span>,{ 
                position: toast.POSITION.BOTTOM_LEFT,
                className:'toast-message'
            });
        }
        else{
            dispatch(setrequestlogin(true))
        }
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
    const validkey=keyword.trim()
    return(
            <div>
                <button onClick={()=>dispatch(showmodal(false))} className="close-btn type-1">
                    <svg viewBox="0 0 16 16" stroke="#EE4D2D" className="home-popup__close-button">
                    <path strokeLinecap="round" d="M1.1,1.1L15.2,15.2"></path>
                    <path strokeLinecap="round" d="M15,1L0.9,15.1"></path>
                    </svg>
                </button>
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
                    <button disabled={validkey?false:true} onClick={addplaylist} style={{width:'100%'}} className={`btn ${validkey?'':'disabled'} btn-second`}><span>Tạo mới</span></button>
                </div>
                
        </div>
    )
}
export default Addplaylist