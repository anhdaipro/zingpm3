import { useEffect, useRef, useState,useMemo } from "react"
import { useSelector,useDispatch } from "react-redux"
import { headers } from "../../actions/auth"
import { setsong } from "../../actions/player"
import { setshowvideo } from "../../actions/mv"
import styled from "styled-components"
import { listmvURL, songURL, videosongURL } from "../../urls"
import axios from "axios"
import PropTypes from 'prop-types';
import { useParams } from "react-router"
export const Item=styled.div`
    position: relative;
    min-height: 1px;
    min-width:200px;
    float: left;
    flex-shrink: 0;
    .item-content{
        padding: 5px 10px;
        display:block;
        .info-artist{
            margin-top:10px;
            margin-left:0
        }
    };
    .info-artist{
        margin-left:10px;
        overflow:hidden;
        flex:1;
    };
    .item-media{
        position:relative;
        overflow:hidden;
        flex:1;
        cursor:pointer;
        .duration{
        display: inline-block;
        font-size: 12px;
        line-height: normal;
        color: #fff;
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 3px 5px;
        border-radius: 4px;
        background-color: rgba(0,0,0,.7);
    };
    .media-cover{
        transition:transform 0.7s ease;
        width:100%;
        background-size:cover;
        background-position: 50%;
        padding-bottom: 56.25%;
    };
    
    .image-hover{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--dark-alpha-50);
        visibility: hidden;
        .btn-play{
            color:#fff
        };
        svg{
            height:32px;
            width:32px
        };
        &.play{
            visibility: visible;
        };
        .zm-brand-playing {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 100%;
            top: 50%;
            z-index: 99;
            transform: translateY(-50%);
            font-size: 14px;
            color: var(--white);
        }
    };
    &:hover .image-hover{
        visibility: visible;
    };
    &:hover .media-cover{
        transform:scale(1.1)
    };
    
}`
export const Listrecomend=styled.div`
background-color: hsla(0,0%,100%,.05);
margin-top:24px;
padding:10px 20px;

.row ${Item}{
    width:33.33%;
    .item-content{
        display:block;
        .zm-brand-playing{
            font-size:16px;
            svg{
                height:40px;
                width:40px
            };
        };
        
        .info-artist{
            margin-left:0;
            margin-top:10px;
            
        }
    };
    @media (max-width: 1024px) {
        width:50%;
    };
}
`

const Video=(props)=>{
    const {song,setsongs}=props
    const dispatch = useDispatch()
    const player=useSelector(state=>state.player)
    const {songs,play}=player
    const openvideo=async()=>{
        const res =await axios.get(`${videosongURL}?id=${song.video}`,headers)
        const datasongs=songs.map(item=>{
            if(item.id===song.id){
                return({...item,mv:res.data})
            }
            return({...item,})
        })
        dispatch(setsong({songs:datasongs,play:false}))
        dispatch(setshowvideo({showvideo:true,song:{...song,mv:res.data}}))
    }
    return(
        <Item className="item">
            <div className="item-content">
                <div className="item-media">
                    <div className="media-cover" style={{backgroundImage: `url(${song.mv.file_preview})`}}/>
                    <div className="duration">{('0'+Math.floor(song.mv.duration/60)).slice(-2)}:{('0'+Math.floor(song.mv.duration)  % 60).slice(-2)}</div>
                    <div onClick={openvideo}
                    className={`image-hover item-center`}>
                        <button className="btn-play">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="info-artist">
                    <div className="info">
                        <h3 className="item-name">{song.name}</h3>
                        <div className="subtitle">{song.artist_name}</div>
                    </div>
                </div>
            </div>
        </Item>
    )
}
Video.propTypes = {
    song:PropTypes.object.isRequired,
}
const Listmv=()=>{
    const [listmv,setListmv]=useState([])
    const {choice}=useParams()
    useEffect(()=>{
        (async()=>{
            const res = await axios.get(listmvURL,headers)
            setListmv(res.data)
        })()
        
    },[choice])
    return(
        <div className="body-wrapper">
            <Listrecomend>
                <div className="title mb-16">MV Của Nguyễn Đình Vũ</div>
                    <div className="row">
                        {listmv.map((item,index)=>
                             <Video
                                song={item}
                                key={item.id}
                            />
                        )}
                    </div>
            </Listrecomend>
        </div>
    )
}
export default Listmv