import axios from "axios"
import { useState,useEffect,useRef, useCallback } from "react"
import { useSelector ,useDispatch} from "react-redux"
import { headers } from "../../actions/auth"
import { updateposts,setshowpost } from "../../actions/player"
import { commentURL,listcommentURL,artistURL, postURL } from "../../urls"
import dayjs from "dayjs"
import styled from "styled-components"
import { timeago } from "../../constants"
import PropTypes from "prop-types"
const Modalcontent=styled.div`
    position: absolute;
    left: 50%;
    max-width:680px;
    top: 50%;
    padding: 12px;
    overflow: hidden;
    max-height:500px;
    z-index: 1000;
    transform: translate(-50%,-50%);
    background: #34224f;
    box-shadow: rgb(34 90 89 / 20%) 2px 4px 20px;
    border-radius: 8px;
`
const Flexcenter=styled.div`
display:flex;
align-items:center
`
const FeedRigtht=styled.div`
width:320px;
display:flex;
color:#fff;
flex-direction:column;
.btn-submit{
    cursor:pointer;
    color:#fff;
}
.avatar{
    width:25px;
    height:25px
}
`
const FeedLeft=styled.div`
min-width:280px;
flex:1
`
const Contentinput=styled(Flexcenter)`
position:relative;
border-radius:8px;
padding:2px 6px;
background:rgba(255, 255, 255, 0.3);
color:#fff;
flex:1;
.flex-1{
    height:100%;
    display:flex;
    max-width:240px;
    align-items:center
};
.textarea{
    resize: none;
    width:100%;
    overflow: hidden;
    height: 28px;
    line-height:20px;
    padding:4px 0;
    max-height: 100px;
    color:#fff;
}

`
const Commentcontent=styled.div`
position:relative;
overflow-y:auto;
min-height:300px;
max-height:340px;
margin-bottom:12px
`
const Stylecomment=styled.div`
font-size: 13px;
    padding: 0;
    display:flex;
    margin-bottom: 10px;
    align-items: flex-start;
    .username{
        font-weight:700
    }
    .reactions{
        margin-top: 10px;
        display: flex;
        align-items: center;
        color: var(--text-secondary);
    }
    .count{
        color: var(--text-secondary);
    }
    .icon {
       
        fill:var(--text-secondary);
        color: var(--text-secondary);
        display: inline-block;
    }
`
export const Comment=(props)=>{
    const {item,setcomments,comments,url}=props
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
            <Stylecomment className="flex">
                <div className="mr-8">
                    <div className='avatar' style={{backgroundImage:`url(${item.user.avatar})`}}></div>
                </div>
                <div className="media-content">
                    <div className="flex">
                        <div className="username">{item.user.name}</div>
                        <div className="dot d-flex align-items-center">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
                        </div>
                        <div className="subtitle">{timeago(item.created_at)} ago</div>
                    </div>
                    <div className="item-name">{item.body}</div>
                    <div className="reactions flex-center">
                        <button className="comment-btn mr-16" onClick={()=>setlikecomment('like')}>
                            <i className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 270" width="270" height="270" preserveAspectRatio="xMidYMid meet" >
                                   <g clipPath="url(#__lottie_element_43)" transform="matrix(1.0880000591278076,0,0,1.0880000591278076,69.95299530029297,67.9433822631836)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,60,60)" opacity="1" style="display: block;">
                                       <path fill="rgb(0,0,0)" fill-opacity="1" d=" M25.025999069213867,-4.00600004196167 C25.025999069213867,-4.00600004196167 5.992000102996826,-3.996999979019165 5.992000102996826,-3.996999979019165 C5.992000102996826,-3.996999979019165 11.012999534606934,-22.983999252319336 11.012999534606934,-22.983999252319336 C12.230999946594238,-26.90399932861328 13,-31.94300079345703 8.994000434875488,-31.981000900268555 C7,-32 5,-32 4.021999835968018,-31.007999420166016 C4.021999835968018,-31.007999420166016 -19.993000030517578,-5.03000020980835 -19.993000030517578,-5.03000020980835 C-19.993000030517578,-5.03000020980835 -20.027999877929688,32.025001525878906 -20.027999877929688,32.025001525878906 C-20.027999877929688,32.025001525878906 20.97599983215332,31.986000061035156 20.97599983215332,31.986000061035156 C25.010000228881836,31.986000061035156 26.198999404907227,29.562000274658203 26.99799919128418,25.985000610351562 C26.99799919128418,25.985000610351562 31.972000122070312,4.026000022888184 31.972000122070312,4.026000022888184 C33,-0.6930000185966492 30.392000198364258,-4.00600004196167 25.025999069213867,-4.00600004196167z"></path>
                                       <path strokeLinecap="butt" strokeLinejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(0,0,0)" stroke-opacity="1" strokeWidth="4" d=" M25.025999069213867,-4.00600004196167 C25.025999069213867,-4.00600004196167 5.992000102996826,-3.996999979019165 5.992000102996826,-3.996999979019165 C5.992000102996826,-3.996999979019165 11.012999534606934,-22.983999252319336 11.012999534606934,-22.983999252319336 C12.230999946594238,-26.90399932861328 13,-31.94300079345703 8.994000434875488,-31.981000900268555 C7,-32 5,-32 4.021999835968018,-31.007999420166016 C4.021999835968018,-31.007999420166016 -19.993000030517578,-5.03000020980835 -19.993000030517578,-5.03000020980835 C-19.993000030517578,-5.03000020980835 -20.027999877929688,32.025001525878906 -20.027999877929688,32.025001525878906 C-20.027999877929688,32.025001525878906 20.97599983215332,31.986000061035156 20.97599983215332,31.986000061035156 C25.010000228881836,31.986000061035156 26.198999404907227,29.562000274658203 26.99799919128418,25.985000610351562 C26.99799919128418,25.985000610351562 31.972000122070312,4.026000022888184 31.972000122070312,4.026000022888184 C33,-0.6930000185966492 30.392000198364258,-4.00600004196167 25.025999069213867,-4.00600004196167z"></path></g><g style="display: none;" transform="matrix(1,0,0,1,60,60)" opacity="1">
                                           <path strokeLinecap="butt" strokeLinejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(0,0,0)" stroke-opacity="1" strokeWidth="4" d=" M25.025999069213867,-4.00600004196167 C25.025999069213867,-4.00600004196167 5.992000102996826,-3.996999979019165 5.992000102996826,-3.996999979019165 C5.992000102996826,-3.996999979019165 11.012999534606934,-22.983999252319336 11.012999534606934,-22.983999252319336 C12.230999946594238,-26.90399932861328 13,-31.94300079345703 8.994000434875488,-31.981000900268555 C7,-32 5,-32 4.021999835968018,-31.007999420166016 C4.021999835968018,-31.007999420166016 -19.993000030517578,-5.03000020980835 -19.993000030517578,-5.03000020980835 C-19.993000030517578,-5.03000020980835 -20.027999877929688,32.025001525878906 -20.027999877929688,32.025001525878906 C-20.027999877929688,32.025001525878906 20.97599983215332,31.986000061035156 20.97599983215332,31.986000061035156 C25.010000228881836,31.986000061035156 26.198999404907227,29.562000274658203 26.99799919128418,25.985000610351562 C26.99799919128418,25.985000610351562 31.972000122070312,4.026000022888184 31.972000122070312,4.026000022888184 C33,-0.6930000185966492 30.392000198364258,-4.00600004196167 25.025999069213867,-4.00600004196167z"></path></g><g style="display: none;" transform="matrix(1,0,0,1,60,60)" opacity="1"><path strokeLinecap="butt" strokeLinejoin="miter" fill-opacity="0" stroke-miterlimit="4" stroke="rgb(0,0,0)" stroke-opacity="1" strokeWidth="4" d=" M-19.986000061035156,-4.03000020980835 C-19.986000061035156,-4.03000020980835 -36.020999908447266,-3.996999979019165 -36.020999908447266,-3.996999979019165 C-36.020999908447266,-3.996999979019165 -36.00199890136719,31.993000030517578 -36.00199890136719,31.993000030517578 C-36.00199890136719,31.993000030517578 -20.030000686645508,32.02299880981445 -20.030000686645508,32.02299880981445 C-20.030000686645508,32.02299880981445 -19.986000061035156,-4.03000020980835 -19.986000061035156,-4.03000020980835z"></path></g></g>
                                </svg>
                            </i>
                            <span className="count">{item.count_likers}</span>
                        </button>
                        <button className="comment-btn" onClick={()=>setlikecomment('dislike')}>
                            <i className="icon">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon"  width="20px" height="20px"><g className="style-scope yt-icon"><path d="M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z" className="style-scope yt-icon"></path></g></svg>
                            </i>
                            <span className="count">{item.count_dislikers}</span>
                        </button>
                    </div>
                </div>

            </Stylecomment>
            
        </div>   
    )
}

Comment.prototype={
    item:PropTypes.object.isRequired,
    setcomments:PropTypes.func.isRequired,
    comments:PropTypes.array.isRequired,
    url:PropTypes.string.isRequired
}

const DetailFeed=()=>{
    const dispatch = useDispatch()
    const player=useSelector(state=>state.player)
    
    const {data,comments,posts,count,showpost}=player
    const [item,setItem]=useState()
    const [listcomment,setListcomment]=useState(()=>comments)
    const parentRef=useRef()
    const [loading,setLoading]=useState(true)
    const [keyword,setKeyword]=useState('')
    useEffect(()=>{
        if(showpost){
            setItem(data)
        }
    },[showpost,data])
    
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
    },[])
    const submit= async () =>{
        const res = await axios.post(`${postURL}/${data.id}`,JSON.stringify({body:keyword,action:'comment'}),headers)
        const commentupdate=[{...res.data},...listcomment]
        setKeyword('')
        setListcomment(commentupdate)
    }
    function autogrow(e) {
        e.target.style.height = "5px";
        e.target.style.height = (e.target.scrollHeight)+"px";
    }
    return(
        item &&(
        <div className="modal">
            <Modalcontent className="modal-content flex">
                
                <FeedLeft className="flex-1 mr-16">
                    {item.files.map(file=>
                        <div key={`file+${file.id}`} style={{backgroundImage:`url(${file.file_preview||file.file})`}} className="feed-image"></div>
                    )}
                </FeedLeft>
                <FeedRigtht ref={parentRef} onScroll={(e)=>additem(e)}>
                    <div className="card-header feed-header">
                        <div className="media mb-8">
                            <div className="media-left">
                                <div style={{backgroundImage:`url(${item.artist.image})`}} className="avatar"></div>
                            </div>
                            <div className="media-content">
                                <h3 className="flex">
                                    <div className="media-name">{item.artist.name}</div>
                                    <div className="dot d-flex align-items-center">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
                                    </div>
                                    <button onClick={()=>setfollow('followed',!item.artist.followed)} className="subtitle">{item.artist.followed?'Xem thêm':'Quan tâm'}</button>
                                </h3>
                                <div className="subtitle">{dayjs(item.updated_at).get('date')} tháng {dayjs(item.updated_at).get('month')+1} lúc {dayjs(item.updated_at).format('HH:mm')}</div>
                            </div>
                        </div>
                        <div className="feed-caption mb-8">{item.caption}</div>
                        <div>
                            <div></div>
                        </div>
                    </div>
                    <div className="flex-col flex-1">
                        <Commentcontent className="list-comment">
                            {listcomment.map(item=>
                                <Comment
                                item={item}
                                comments={listcomment}
                                setcomments={data=>setcomments(data)}
                                url={postURL}
                                />
                            )}
                        </Commentcontent>
                        <div className="">
                            <div className="flex-center">
                                <Contentinput className="">
                                    <div className="flex-1">
                                        <textarea className="textarea" 
                                        onChange={(e)=>setKeyword(e.target.value)}
                                        maxLength='1000'
                                        onKeyDown={(e)=>{
                                            if (e.key === "Enter") {
                                                submit()
                                            }
                                        }}  onInput={(e)=>{
                                            autogrow(e)
                                            
                                            
                                            }}  value={keyword}/>
                                    </div>
                                    <div data-e2e="comment-emoji-icon" className="icon-button">
                                        <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M17 23C18.6569 23 20 21.2091 20 19C20 16.7909 18.6569 15 17 15C15.3431 15 14 16.7909 14 19C14 21.2091 15.3431 23 17 23Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M31 23C32.6569 23 34 21.2091 34 19C34 16.7909 32.6569 15 31 15C29.3431 15 28 16.7909 28 19C28 21.2091 29.3431 23 31 23Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M16 28.3431C16 31.4673 19.5817 36 24 36C28.4183 36 32 31.4673 32 28.3431C32 25.219 16 25.219 16 28.3431Z"></path></svg>
                                    </div>
                                </Contentinput>
                                <button disabled={keyword.trim()?false:true} onClick={submit} data-e2e="comment-post" className="ml-8 btn-submit">Post</button>
                            </div>
                        </div>
                        
                    </div>
                </FeedRigtht>
            </Modalcontent>
            <button onClick={()=>dispatch(setshowpost({showpost:false}))} className="close-btn">
                <svg viewBox="0 0 16 16" stroke="#EE4D2D" className="home-popup__close-button">
                <path strokeLinecap="round" d="M1.1,1.1L15.2,15.2"></path>
                <path strokeLinecap="round" d="M15,1L0.9,15.1"></path>
                </svg>
            </button>
        </div>
        )
    )
}
export default DetailFeed