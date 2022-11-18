import { useSelector,useDispatch } from "react-redux"
import {showmodal,playerstop} from "../../actions/player"
const Continuteplayer=()=>{
    const data=useSelector(state=>state.player.data)
    const dispatch = useDispatch()
    return(
        
            <div>
                <div>
                    <div className="image-big" style={{backgroundImage:`url(${data.data.image})`}}></div>
                    <div>
                        <div>{data.data.name}</div>
                        <div>{data.data.artist_name}</div>
                    </div>
                </div>
                <div>
                    <button onClick={()=>{
                        dispatch(playerstop())
                        dispatch(showmodal(false))
                        }} className="btn btn-second mb-8 btn-large"><span>Tiếp tục phát</span></button>
                    <button onClick={()=>dispatch(showmodal(false))} className="btn btn-large"><span>Bỏ qua</span></button>
                </div>
            </div>
        
    )

}
export default Continuteplayer