import { useState,useEffect,useMemo } from "react"
import { useSelector,useDispatch } from "react-redux"
import { setsong } from "../../actions/player"

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
                            <div class="action item-space">
                            
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" class="card-list-icon small" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path></svg>
                                <svg onClick={()=>setplay(item,index)} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="card-list-icon big" height="32px" width="32px" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="card-list-icon small" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                           
                            </div>
                        </div>
                        <div class="meta-info">
                            <h3 class="title">{item.name}</h3>
                            <h3 class="subtitle">{item.artist_name}</h3>
                        </div>
                    </li>
                    )}
                </ul>
            </div>  
            <button disabled={slideractive==-1?true:false} onClick={()=>setSlideractive(slideractive-1)} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--prev"><svg enable-background="new 0 0 13 20" viewBox="0 0 13 20" role="img" class="stardust-icon stardust-icon-arrow-left-bold"><path stroke="none" d="m4.2 10l7.9-7.9-2.1-2.2-9 9-1.1 1.1 1.1 1 9 9 2.1-2.1z"></path></svg></button>
            <button onClick={()=>setSlideractive(slideractive+1)} class="stardust-carousel__arrow stardust-carousel__arrow--type-1 stardust-carousel__arrow--next"><svg enable-background="new 0 0 13 21" viewBox="0 0 13 21" role="img" class="stardust-icon stardust-icon-arrow-right-bold"><path stroke="none" d="m11.1 9.9l-9-9-2.2 2.2 8 7.9-8 7.9 2.2 2.1 9-9 1-1z"></path></svg></button>
        </div>
    )
}
export default Slider