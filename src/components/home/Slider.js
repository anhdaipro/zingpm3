import { useState,useEffect,useMemo } from "react"
import { useSelector,useDispatch } from "react-redux"
import { headers,setrequestlogin,valid } from "../../actions/auth"
import { setsong,updatesongs } from "../../actions/player"
import { songURL } from "../../urls"
import { Likedsong } from "../Song"

const Slider=(props)=>{
    const {items,song}=props
    const [slideractive,setSlideractive]=useState(0)
    const dispatch = useDispatch()
    const player=useSelector(state=>state.player)
    const {play,currentIndex,songs}=player
    const setplay=(itemchoice,index)=>{
        if(itemchoice.id==songs[currentIndex].id){
            dispatch(setsong({play:!play}))
        }
        else{
            dispatch(setsong({currentIndex:index,play:true,view:false}))
        }
    }
    console.log(slideractive)
    
    return(
        <div className="container-discover-slider">
            <div className="list-wrapper">
                <ul className="flex flex-end" style={{width:`${360*items.length-1+430}px`,transform:`translateX(${-360*slideractive}px)`,transition: `all 0.5s linear 0s`}}>
                    {items.map((item,index)=>
                    <li className="zm-card" key={item.id} style={{width:`${item.id==song.id?430:360}px`}}>
                        <div className="zm-card-content">
                            <img src={item.image_cover} />
                            <div className="action item-space">
                                <Likedsong
                                    song={item}
                                    className="card-list-icon"
                                        
                                />
                                <svg onClick={()=>setplay(item,index)} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="card-list-icon big" height="32px" width="32px" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>
                                <button className="card-list-icon" style={{visibility:'hidden'}}>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className=" small" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                                </button>
                            </div>
                        </div>
                        <div className="meta-info">
                            <h3 className="title">{item.name}</h3>
                            <h3 className="subtitle">{item.artist_name}</h3>
                        </div>
                    </li>
                    )}
                </ul>
            </div>  
            <button disabled={slideractive==-1?true:false} onClick={()=>setSlideractive(slideractive-1)} className="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--prev"><svg enableBackground="new 0 0 13 20" viewBox="0 0 13 20" role="img" className="stardust-icon stardust-icon-arrow-left-bold"><path stroke="none" d="m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z"></path></svg></button>
            <button onClick={()=>setSlideractive(slideractive+1)} className="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--next"><svg enableBackground="new 0 0 13 21" viewBox="0 0 13 21" role="img" className="stardust-icon stardust-icon-arrow-right-bold"><path stroke="none" d="m11.1 9.9l-9-9-2.2 2.2 8 7.9-8 7.9 2.2 2.1 9-9 1-1z"></path></svg></button>
        </div>
    )
}
export default Slider