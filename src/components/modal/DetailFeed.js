import axios from "axios"
import { useState,useEffect,useRef, useCallback } from "react"
import { useSelector ,useDispatch} from "react-redux"
import { headers } from "../../actions/auth"
import { updateposts,setshowpost } from "../../actions/player"
import { commentURL,listcommentURL,artistURL } from "../../urls"
import dayjs from "dayjs"
import styled from "styled-components"
import { timeago } from "../../constants"
const Modalcontent=styled.div`
    position: absolute;
    left: 50%;
    max-width:600px;
    top: 50%;
    padding: 12px;
    overflow: hidden;
    width:600px;
    max-height:680px;
    z-index: 1000;
    transform: translate(-50%,-50%);
    background: #34224f;
    box-shadow: rgb(34 90 89 / 20%) 2px 4px 20px;
    border-radius: 8px;
`
const Comment=(props)=>{
    const {item,setcomments,comments}=props
    const setlikecomment= async (name)=>{
        const res = await axios.post(`${commentURL}/${item.id}`,JSON.stringify({action:name}),headers)
        const data=comments.map(comment=>{
            if(item.id===comment.id){
                return({...comment,...res.data})
            }
            return({...comment})
        })
        setcomments(data)
    }
    return(
        <div key={item.id}>
            <div className="flex">
                <div className='avatar' style={{backgroundImage:`url(http://localhost${item.user.avatar})`}}></div>
                <div className="media-content">
                    <div className="flex">
                        <div className="media-name">{item.user.name}</div>
                        <div class="dot d-flex align-items-center">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
                        </div>
                        <div className="subtitle">{timeago(item.created_at)} ago</div>
                    </div>
                    <div className="item-name">{item.body}</div>
                </div>
            </div>
            <div className="flex-center action-comment">
                <button className="comment-btn mr-16" onClick={()=>setlikecomment('like')}>
                    <svg width="14px" height="14px" className="icon-like"  xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve">
                        <g>
                            <path d="M512,304.021c0-12.821-5.099-24.768-13.867-33.6c9.963-10.901,15.019-25.536,13.632-40.725    c-2.475-27.115-26.923-48.363-55.616-48.363H324.395c6.485-19.819,16.939-56.149,16.939-85.333c0-46.272-39.317-85.333-64-85.333    c-22.165,0-38.016,12.459-38.677,12.992c-2.539,2.048-3.989,5.099-3.989,8.341v72.32l-61.44,133.141l-2.56,1.28v-4.075    c0-5.888-4.779-10.667-10.667-10.667H53.333C23.936,224,0,247.936,0,277.333V448c0,29.397,23.936,53.333,53.333,53.333h64    c23.083,0,42.773-14.72,50.219-35.243c17.749,9.131,41.643,13.931,56.469,13.931H419.84c23.232,0,43.541-15.68,48.32-37.269    c2.453-11.115,1.024-22.315-3.84-32.043c15.744-7.936,26.347-24.171,26.347-42.688c0-7.552-1.728-14.784-5.013-21.333    C501.397,338.752,512,322.517,512,304.021z M149.333,448c0,17.643-14.379,32-32,32h-64c-17.664,0-32-14.357-32-32V277.333    c0-17.643,14.357-32,32-32v0.107h95.957v10.667c0,0.064,0.043,0.107,0.043,0.171V448z M466.987,330.368    c-4.117,0.469-7.595,3.264-8.896,7.211c-1.301,3.925-0.235,8.277,2.795,11.115c5.44,5.141,8.427,12.011,8.427,19.349    c0,13.44-10.155,24.768-23.637,26.304c-4.117,0.469-7.595,3.264-8.896,7.211c-1.301,3.925-0.235,8.277,2.795,11.115    c7.04,6.635,9.856,15.936,7.744,25.472c-2.624,11.883-14.187,20.523-27.499,20.523H224c-15.851,0-41.365-6.848-53.333-15.744    V262.656l15.381-7.68c2.155-1.088,3.883-2.88,4.907-5.077l64-138.667c0.64-1.387,0.981-2.923,0.981-4.459V37.909    c4.437-2.453,12.139-5.803,21.333-5.803c11.691,0,42.667,29.077,42.667,64c0,37.525-20.416,91.669-20.629,92.203    c-1.237,3.264-0.811,6.955,1.195,9.835c2.005,2.88,5.269,4.608,8.789,4.608h146.795c17.792,0,32.896,12.715,34.389,28.971    c1.131,12.16-4.672,23.723-15.168,30.187c-3.285,2.005-5.205,5.653-5.056,9.493c0.128,3.84,2.347,7.296,5.781,9.067    c9.003,4.608,14.592,13.653,14.592,23.595C490.603,317.504,480.448,328.832,466.987,330.368z"/>
                        </g>
                    </svg>
                    <span>{item.count_likers}</span>
                </button>
                <button className="comment-btn" onClick={()=>setlikecomment('dislike')}>
                    <svg width="14px" height="14px"  class="icon-like" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlSpace="preserve">
                        <g>
                            <path d="M512,208c0-18.496-10.603-34.731-26.347-42.667c3.285-6.549,5.013-13.803,5.013-21.333    c0-18.517-10.603-34.752-26.368-42.688c4.843-9.707,6.293-20.928,3.84-32.043C463.381,47.659,443.051,32,419.819,32H224    c-14.805,0-38.72,4.779-56.469,13.931c-7.424-20.544-27.115-35.264-50.197-35.264h-64C23.936,10.667,0,34.603,0,64v170.667    C0,264.064,23.936,288,53.333,288H160c5.888,0,10.667-4.779,10.667-10.667v-4.075l2.56,1.28l61.44,133.141V480    c0,3.243,1.472,6.293,3.989,8.341c0.683,0.533,16.512,12.992,38.677,12.992c24.683,0,64-39.061,64-85.333    c0-29.184-10.453-65.515-16.96-85.333h131.755c28.715,0,53.141-21.227,55.637-48.341c1.408-15.189-3.669-29.824-13.632-40.725    C506.901,232.768,512,220.821,512,208z M149.333,256c0,0.021,0,0.021,0,0.043c0,0.021,0,0.021,0,0.043v10.667h-96    c-17.643,0-32-14.357-32-32V64.085c0-17.643,14.357-32,32-32h64c17.643,0,32,14.357,32,32V256z M475.349,250.176    c10.475,6.464,16.299,18.027,15.168,30.208c-1.493,16.235-16.597,28.949-34.389,28.949H309.333c-3.52,0-6.763,1.749-8.768,4.629    c-2.005,2.88-2.453,6.571-1.195,9.835C299.563,324.331,320,378.475,320,416c0,34.923-30.976,64-42.667,64    c-9.195,0-16.917-3.349-21.333-5.803h-0.021v-68.779c0-1.536-0.341-3.072-0.981-4.459l-64-138.667    c-1.003-2.197-2.731-3.989-4.907-5.077l-15.424-7.723V69.141c11.947-8.896,37.483-15.723,53.333-15.723h195.861    c13.312,0,24.875,8.619,27.499,20.523c2.112,9.536-0.704,18.816-7.744,25.472c-3.029,2.837-4.117,7.168-2.795,11.115    c1.301,3.925,4.779,6.741,8.896,7.211c13.461,1.536,23.637,12.843,23.637,26.304c0,7.339-2.987,14.208-8.427,19.349    c-3.029,2.837-4.117,7.168-2.795,11.115c1.301,3.925,4.779,6.741,8.896,7.211c13.461,1.536,23.637,12.843,23.637,26.304    c0,9.92-5.589,18.965-14.592,23.595c-3.413,1.749-5.632,5.227-5.781,9.067C470.123,244.523,472.064,248.149,475.349,250.176z"/>
                        </g>
                    </svg>
                    <span>{item.count_dislikers}</span>
                </button>
            </div>
        </div>   
    )
}

const DetailFeed=()=>{
    const dispatch = useDispatch()
    const player=useSelector(state=>state.player)
    console.log(player)
    const {data,comments,posts,count,showpost}=player
    const [item,setItem]=useState()
    const [listcomment,setListcomment]=useState(()=>comments)
    const parentRef=useRef()
    const [loading,setLoading]=useState(true)
    useEffect(()=>{
        if(showpost){
            setItem(data)
        }
    },[showpost,data])
    console.log(item)
    const additem= async (e)=>{
        try{
            if(e.target.scrollTop==e.target.scrollHeight-e.target.offsetHeight &&loading && listcomment.length<count){
            setLoading(false)
            const res= await axios.get(`${listcommentURL}?from_item=${listcomment.length}`,headers)
            const list_items=[...listcomment,...res.data.comments]
            setListcomment(list_items)
            setLoading(true)      
            }
        }
        catch(e){
            console.log(e)
        }
    }
    
    const setfollow= async (name,value)=>{
        const res = await axios.post(`${artistURL}${item.artist.slug}`,JSON.stringify({action:'follow'}),headers)
        const dataposts=posts.map(post=>{
            if(item.artist.id===post.artist.id){
                return({...post,artist:{...post.artist,[name]:value}})
            }
            return({...post})
        })
        setItem({...item,artist:{...item.artist,[name]:value}})
        dispatch(updateposts(dataposts))
    }

    const setcomments=useCallback((data)=>{
        setListcomment(data)
    },[listcomment])
    return(
        item &&(
        <div className="modal">
            <Modalcontent className="modal-content flex">
                <div className="flex-1 mr-16">
                    {item.files.map(file=>
                        <div key={`file+${file.id}`} style={{backgroundImage:`url(http://localhost:8000${file.media_preview||file.media})`}} className="feed-image"></div>
                    )}
                </div>
                <div className="flex-1" ref={parentRef} onScroll={(e)=>additem(e)}>
                    <div className="card-header feed-header">
                        <div className="media mb-8">
                            <div className="media-left">
                                <div style={{backgroundImage:`url(http://localhost:8000${item.artist.image})`}} className="avatar"></div>
                            </div>
                            <div className="media-content">
                                <h3 className="flex">
                                    <div className="media-name">{item.artist.name}</div>
                                    <div class="dot d-flex align-items-center">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
                                    </div>
                                    <button onClick={()=>setfollow('followed',!item.artist.followed)} className="subtitle">{item.artist.followed?'Xem thêm':'Quan tâm'}</button>
                                </h3>
                                <div className="subtitle">{dayjs(item.updated_at).get('date')} tháng {dayjs(item.updated_at).get('month')+1} lúc {dayjs(item.updated_at).format('HH:mm')}</div>
                            </div>
                        </div>
                        <div className="feed-caption mb-8">{item.caption}</div>
                    </div>
                    <div>
                        <div></div>
                    </div>
                    <div>
                        <div></div>
                        <div>
                            {listcomment.map(item=>
                                <Comment
                                item={item}
                                comments={listcomment}
                                setcomments={data=>setcomments(data)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Modalcontent>
            <button onClick={()=>dispatch(setshowpost({showpost:false}))} className="close-btn">
                <svg viewBox="0 0 16 16" stroke="#EE4D2D" class="home-popup__close-button">
                <path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path>
                <path stroke-linecap="round" d="M15,1L0.9,15.1"></path>
                </svg>
            </button>
        </div>
        )
    )
}
export default DetailFeed