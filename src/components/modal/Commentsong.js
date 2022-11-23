import { useState,useEffect,useCallback } from "react"
import { useDispatch,useSelector } from "react-redux"
import {Comment} from "./DetailFeed"
import styled from "styled-components"
import axios from "axios"
import { songURL } from "../../urls"
import { headers } from "../../actions/auth"
import { showmodal } from "../../actions/player"
const Commentcontent=styled.div`
width:652px;
border-top:1px solid;
padding:12px 0;
.count-comment{
    font-size:14px;
    margin-bottom:16px;
    color: var(--text-secondary);
    font-weight:500
};
.list-comment{
    overflow-y:auto;
    max-height:280px;
};
.empty-content{
    padding:30px 0;
    text-align: center;
    color: var(--text-secondary);
}
.btn-submit{
    color:#fff
}
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
const Commentsong=()=>{
    const dispatch = useDispatch()
    const [listcomment,setListcomment]=useState([])
    const player=useSelector(state=>state.player)
    const [count,setCount]=useState(0)
    const {data}=player
    useEffect(() => {
        if(data){
            setListcomment(data.data.comments)
            setCount(data.data.count)
        }
    }, [data])
    const setcomments=useCallback((data)=>{
        setListcomment(data)
    },[listcomment])
    const [keyword,setKeyword]=useState('')
    const submit= async () =>{
        const res = await axios.post(`${songURL}/${data.data.id}`,JSON.stringify({body:keyword,action:'comment'}),headers)
        const commentupdate=[{...res.data},...listcomment]
        setKeyword('')
        setListcomment(commentupdate)
    }
    function autogrow(e) {
        e.target.style.height = "5px";
        e.target.style.height = (e.target.scrollHeight)+"px";
    }
    return(
        <Commentcontent>
            <button onClick={()=>dispatch(showmodal(false))} class="close-btn type-1">
                <svg viewBox="0 0 16 16" stroke="#EE4D2D" class="home-popup__close-button"><path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path><path stroke-linecap="round" d="M15,1L0.9,15.1"></path></svg>
            </button>
            <div className="count-comment subtitle">{listcomment.length} Bình luận</div>
            <div>
                {listcomment.length>0?
                <div className="list-comment">
                {listcomment.map(item=>
                    <Comment
                        item={item}
                        comments={listcomment}
                        setcomments={data=>setcomments(data)}
                        url={songURL}
                    />
                )}
                </div>:
                <div className="empty-content">
                    <div className="mb-16">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="54px" width="54px" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg>
                    </div>
                    <div>Chưa có bình luận nào</div>
                </div>}
            </div>
            <div className="flex-end mt-16">
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
                        <div data-e2e="comment-emoji-icon" class="icon-button">
                            <svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6ZM2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17 23C18.6569 23 20 21.2091 20 19C20 16.7909 18.6569 15 17 15C15.3431 15 14 16.7909 14 19C14 21.2091 15.3431 23 17 23Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M31 23C32.6569 23 34 21.2091 34 19C34 16.7909 32.6569 15 31 15C29.3431 15 28 16.7909 28 19C28 21.2091 29.3431 23 31 23Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16 28.3431C16 31.4673 19.5817 36 24 36C28.4183 36 32 31.4673 32 28.3431C32 25.219 16 25.219 16 28.3431Z"></path></svg>
                        </div>
                    </Contentinput>
                    <button disabled={keyword.trim()?false:true} onClick={submit} data-e2e="comment-post" class="ml-8 btn-submit">Post</button>
                </div>
            </div>
        </Commentcontent>
    )
}
export default Commentsong