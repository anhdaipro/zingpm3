import { useRef,useState,useMemo, useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import styled from 'styled-components'
import { expiry, headers, setrequestlogin, token, valid } from "../../actions/auth"
import {artistURL, originURL} from "../../urls"
import axios from "axios"
import { showinfoArtist } from "../../actions/player"
const ModalContent=styled.div`
z-index: 1000;
padding:12px;
background: #34224f;
border-radius:8px;
width:340px
`
const Song=(props)=>{
    const {song}=props
    return(
        <div  style={{width:'25%',overflow:'hidden'}} className="flex-col p-4" key={song.id}>
            <img className="song-image" src={`${song.image_cover}`}/>
            <div className="mt-8">
                <h3 className="song-name">{song.name}</h3>
                <div className="subtitle">{new Date(song.created_at).getFullYear()}</div>
            </div>
        </div>
    )
}
const InfoArtist=()=>{
    const player=useSelector(state=>state.player)
    const {left,right,top,data,showinfo,artistRef}=player
    const infoRef=useRef()
    const dispatch = useDispatch()
    useEffect(()=>{
        if(showinfo){
            dispatch(showinfoArtist({infoRef:infoRef}))
        }
    },[dispatch,showinfo])
   
    const setfollow=async()=>{
        if(token() && expiry()>0){
        const res = await  axios.post(`${artistURL}/${data.slug}`,JSON.stringify({action:'follow'}),headers())
        dispatch(showinfoArtist({data:{...data,followed:!data.followed}}))
        }
        else{
            dispatch(setrequestlogin(true))
        }
    }
    useEffect(() => {
        const setshow=(event)=>{
            const {target}=event
            if(showinfo && !artistRef.current.contains(target) && !infoRef.current.contains(target)){
                dispatch(showinfoArtist({showinfo:false}))
            }
        }
        document.addEventListener('mousemove',setshow)
        return ()=>document.removeEventListener('mousemove',setshow)
    }, [showinfo])
    return(
        <div ref={infoRef} onMouseEnter={()=>dispatch(showinfoArtist({showinfo:true}))} style={{zIndex:100,top:top,left:left,right:right,position:'fixed',transform:'translateY(-100%)'}}>
            <ModalContent>
                <div className="item-space" style={{width:'100%',position:'relative'}}>
                    <div className="flex mr-8" style={{width:'70%'}} >
                        <div className="image is-40 mr-8" style={{backgroundImage:`url(${data.image})`}}></div>
                        <div className="card-info" style={{overflow:'hidden'}}>
                            <h3 className="item-name">{data.name}</h3>
                            <div>{data.number_followers} quan tâm</div>
                        </div>
                    </div>
                    <div >
                        <div onClick={()=>setfollow()}>{data.followed?'Góc nhạc':'Quan tâm'}</div>
                    </div>
                </div>
                <div className='description mt-8'>{data.description}</div>
                <div className="modal-body mt-16">
                    <div className="title mb-8">Mới nhất</div>
                    <div className='flex'>
                        {data.songs.map(song=>
                            <Song
                                song={song}
                                key={song.id}
                            />
                        )}
                    </div>
                </div>
            </ModalContent>
        </div>
    )
}
export default InfoArtist