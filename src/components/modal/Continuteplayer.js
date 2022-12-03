import { useSelector,useDispatch } from "react-redux"
import {showmodal,playerstop, setsong} from "../../actions/player"
import { Songinfo } from "../Song"
const Continuteplayer=()=>{
    const data=useSelector(state=>state.player.data)
    const dispatch = useDispatch()
    return(
        
            <div>
                <div className="flex mb-16">
                    <div className="song-image mr-8" style={{backgroundImage:`url(${data.data.image_cover})`}}></div>
                    <div className="card-info">
                        <Songinfo
                            song={data.data}
                        />
                    </div>
                </div>
                <div>
                    <button onClick={()=>{
                        dispatch(playerstop())
                        dispatch(showmodal(false))
                        dispatch(setsong({play:true}))
                        }} className="btn btn-second mb-8 btn-large"><span>Tiếp tục phát</span></button>
                    <button onClick={()=>dispatch(showmodal(false))} className="btn btn-large"><span>Bỏ qua</span></button>
                </div>
            </div>
        
    )

}
export default Continuteplayer