import axios from "axios"
import { useRef,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Slide } from "react-slideshow-image"
import { headers } from "../../actions/auth"
import { artistInfohURL } from "../../urls"
import {showinfoArtist} from "../../actions/player"
import {Songinfo} from "../Song"
const listimages=[
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/d/8/5/2/d852eba51a52ebbbe73359ae387f4345.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/a/2/0/5/a20523837ad3c5aac73b31d7dac36007.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/c/5/f/c/c5fc615c43215c6b72676f42767855ee.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/d/8/5/2/d852eba51a52ebbbe73359ae387f4345.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/a/2/0/5/a20523837ad3c5aac73b31d7dac36007.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/c/5/f/c/c5fc615c43215c6b72676f42767855ee.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/d/8/5/2/d852eba51a52ebbbe73359ae387f4345.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/a/2/0/5/a20523837ad3c5aac73b31d7dac36007.jpg'},
{artirts:'châu khải phong',name:'Top 100 nhạc trẻ hay nhất',src:'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/c/5/f/c/c5fc615c43215c6b72676f42767855ee.jpg'},

]
const TopSong=()=>{
    const dispatch= useDispatch()
    const slideRef=useRef()
    const [Indexslider,setIndexslider]=useState(0)
    const player=useSelector(state=>state.player)
    const {showinfo,infoRef,keepinfo}=player
    console.log(slideRef)
    const Item=(props)=>{
        
        const {item}=props
        
        return(
            <div key={item.src} className="slider-item">
                <div className="playlist-image-wrapper">
                    <div class="container-discover__slider-item-img" style={{backgroundImage:`url(${item.src})`,backgroundSize:'cover',width:'100%',paddingTop:'100%'}}></div>
                    <div class="card-list-image-hover">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" class="card-list-icon small" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path></svg>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="card-list-icon big" height="32px" width="32px" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="card-list-icon small" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                    </div>
                </div>
                <div className="mt-8 cart-info flex-col">
                    <Songinfo
                        song={item}
                    />
                </div>
            </div>
        )
    }
    return(
       <div>
           <div className="container-discover-slider" style={{position:'relative'}}>
               <Slide onChange={(from,to) =>setIndexslider(to)} ref={slideRef} autoplay transitionDuration={500} easing='ease' slidesToScroll={1} slidesToShow={4} arrows={false}>
                   {listimages.map(item=>
                   <Item
                    item={item}
                    slideRef={slideRef}
                   />
                    )}
               </Slide>
               
           </div>
       </div>
    )
}
export default TopSong