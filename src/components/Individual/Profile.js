import axios from "axios"
import { useRef,useState,useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import styled from "styled-components"
import { headers, updateprofile,token } from "../../actions/auth"
import { showmodal,actionuser } from "../../actions/player"
import {  profileURL } from "../../urls"
const Fullcontent=styled.div`
    width:100%;
    height:100%
`
const ContentWrap=styled.div`
    height: 30vh;
    max-height: 500px;
    min-height: 340px;
    max-width: none;
    overflow: hidden;
    padding-bottom: 24px;
    position: relative;
`
const Background=styled.div`
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    background-color: rgb(83, 83, 83);
    top: 0;
    width: 100%;
`
const Avatarcontent=styled.div`
    align-self: flex-end;
    height: 192px;
    margin-inline-end: 24px;
    min-width: 192px;
    width: 192px;
    
`

const AvatarProfile=styled.div`
    display: flex;
    height: inherit;
    position: relative; 
    .avatar,img{
        width:100%;
        
        height:100%
    }
    .avatar img{
        border-radius:50%
    }
`
const Actionprofile=styled.div`
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
`
const BtnAction=styled(Fullcontent)`
background-color: rgba(0,0,0,.7);
border-radius:50%;
padding: 0;
opacity:0;
text-align: center;
color:#fff;
${AvatarProfile}:hover & {
    opacity:1
}
`
const Infoprofile=styled.div`
    flex-flow: column;
    display: flex;
    justify-content: flex-end;
    z-index: 0;
    .profile-title{
    font-size: .75rem;
    margin-top: 4px;
    text-transform: uppercase;
    font-weight:700
    }
    .profile-name{
        margin: 0.08em 0px 0.12em;
        visibility: visible;
        width: 100%;
        font-size: 4.5rem;
        color:#fff
    }
    
    input{
        width:100%;
        height:100%;
    }
`
const Subtitle=styled.span`
font-size: 0.875rem;
font-weight: 400;
white-space: nowrap;
&.count-follow:before{
    content: "•";
    margin: 0px 4px;
}
`
export const FormProfile=()=>{
    const [formdata,setformdata]=useState({avatar:'',name:'',file:null})
    const {avatar,name,file}=formdata
    const user=useSelector(state=>state.auth.user)
    const player=useSelector(state=>state.player)
    const {data}=player
    const inputRef=useRef()
    const  dispatch = useDispatch()
    
    useEffect(() => {
        if(user){
            setformdata({...formdata,avatar:user.avatar,name:user.name})
        }
        
    }, [user])
    useEffect(()=>{
        if(data.changefile){
            inputRef.current.click()
        }
    },[data.changefile])
    const previewFile= async (e)=>{
        [].forEach.call(e.target.files, function(file) {
            
            var url = (window.URL || window.webkitURL).createObjectURL(file);
            setformdata({...formdata,avatar:url,file:file})
        })
    }
    const saveinfo= async () =>{
        let form=new FormData()
        form.append('avatar',file)
        form.append('name',name)
        const res= await axios.post(profileURL,form,{headers:{ Authorization:`JWT ${token()}`,'Content-Type': 'multipart/form-data'}})
        dispatch(showmodal(false))
        dispatch(updateprofile({avatar:avatar,name:name}))
    }
    return(
        <div>
            <input ref={inputRef} type="file" accept="image/*" onChange={(e)=>previewFile(e)} />
            <div className="flex-center mb-16">
                <Avatarcontent>
                    <AvatarProfile className="content-avatar">
                        <div className="avatar">
                            <img aria-hidden="false" draggable="false" loading="eager" src={avatar} alt="Phạm Đại" className="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ ta4ePOlmGXjBYPTd90lh Yn2Ei5QZn19gria6LjZj" sizes="(min-width: 1280px) 232px, 192px"/>
                        </div>
                        <Actionprofile>
                            <Fullcontent>
                                <BtnAction onClick={()=>inputRef.current.click()} data-testid="edit-image-button" className="item-center" aria-haspopup="true" type="button">
                                    <div className="center">
                                        <svg role="img" height="48" width="48" aria-hidden="true" viewBox="0 0 24 24" className="Svg-ytk21e-0 eqtHWV"><path d="M17.318 1.975a3.329 3.329 0 114.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 01-1.28-1.28l1.581-4.376a4.726 4.726 0 011.103-1.735L17.318 1.975zm3.293 1.414a1.329 1.329 0 00-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.726 2.726 0 001.001-.636L20.611 5.268a1.329 1.329 0 000-1.879z"></path></svg>
                                        <span className="mt-8 jN7ZUHc7IxpwvWsjb4jo">Choose photo</span>
                                    </div>
                                </BtnAction>
                            </Fullcontent>
                        </Actionprofile>
                    </AvatarProfile>
                </Avatarcontent>
                <Infoprofile>
                    <div className="content-input">
                        <input   onChange={(e)=>setformdata({...formdata,name:e.target.value})} type="text" value={name}/>
                    </div>  
                </Infoprofile>
            </div>
            <div className="item-end">
                <button className="btn btn-primary mr-16" onClick={()=>dispatch(showmodal(false))}>Cancel</button>
                <button className="btn btn-second" onClick={saveinfo}>Save</button>
            </div>
        </div>
    )
}

const Profile=()=>{
    
    const  dispatch = useDispatch()
    const user=useSelector(state=>state.auth.user)
    useEffect(() => {
        ( async ()=>{
            const res =await axios.get(profileURL,headers())
            dispatch(updateprofile({...res.data}))
        })()
        
    }, [dispatch])

    
    const editprofile=(value)=>{
        dispatch(showmodal(true))
        dispatch(actionuser({data:{title:'Profile details',changefile:value},action:'editprofile'}))
    }

    return(
        <div className="body-wrapper">
            {user &&(
            <ContentWrap className="flex">
                
                
                <Avatarcontent>
                    <AvatarProfile className="content-avatar">
                        <div className="avatar">
                            <img src={user.avatar} alt="Phạm Đại" className="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ ta4ePOlmGXjBYPTd90lh Yn2Ei5QZn19gria6LjZj" sizes="(min-width: 1280px) 232px, 192px"/>
                        </div>
                        <Actionprofile>
                            <Fullcontent>
                                <BtnAction onClick={()=>editprofile(true)} data-testid="edit-image-button" className="item-center" aria-haspopup="true" type="button">
                                    <div className="center">
                                        <svg role="img" height="48" width="48" aria-hidden="true" viewBox="0 0 24 24" className="Svg-ytk21e-0 eqtHWV"><path d="M17.318 1.975a3.329 3.329 0 114.707 4.707L8.451 20.256c-.49.49-1.082.867-1.735 1.103L2.34 22.94a1 1 0 01-1.28-1.28l1.581-4.376a4.726 4.726 0 011.103-1.735L17.318 1.975zm3.293 1.414a1.329 1.329 0 00-1.88 0L5.159 16.963c-.283.283-.5.624-.636 1l-.857 2.372 2.371-.857a2.726 2.726 0 001.001-.636L20.611 5.268a1.329 1.329 0 000-1.879z"></path></svg>
                                        <span className="mt-8">Choose photo</span>
                                    </div>
                                </BtnAction>
                            </Fullcontent>
                        </Actionprofile>
                    </AvatarProfile>
                </Avatarcontent>
                <Infoprofile>
                    <h2 className="profile-title">Profile</h2>
                    <span dir="auto" className="rEN7ncpaUeSGL9z0NGQR" draggable="false">
                        <button onClick={()=>editprofile(false)} title="Edit details">
                            <span className="o4KVKZmeHsoRZ2Ltl078">
                                <h1 dir="auto" className="profile-name" >{user.name}</h1>
                            </span>
                        </button>
                    </span>
                    <div className="flex-center">
                        <Subtitle>{user.count_playlists} Public Playlist</Subtitle>
                        <Subtitle className="count-follow">
                            <a draggable="false" href="/user/31odr4etlwiady3ekfhrk2d6nmnu/following">{user.count_followings} Following</a>
                        </Subtitle>
                    </div>
                </Infoprofile>
            </ ContentWrap>)}
        </div>
    )
}
export default Profile