import axios from "axios"
import { useRef,useState,useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import { headers,token } from "../../actions/auth"
import { showmodal } from "../../actions/player"
import { dataURLtoFile } from "../../constants"
import { uploadpostURL } from "../../urls"
import styled from "styled-components"
const Content=styled.div`
width:500px;
border-top:1px solid;
padding:12px 8px;
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
const Bodycontent=styled.div`
position:relative;
margin:12px 0
`
const Contentfile=styled.div`
position:relative;
border:1px solid rgba(255,255,255,0.2);
border-radius:8px;
height:260px;
margin-bottom:12px;
.post-media{
    width:100%;
    height:100%;
    background-size:cover
};
.btn-add{
    padding:4px 8px;
    color:#fff
};
.close-btn{
    position:absolute;
    top:-12px;
    right:-12px;
    width:24px;
    z-index:100;
    background-color: #333;
    height:24px;
    color:#fff;
    font-size:10px;
    .home-popup__close-button{
        width:12px;
        height:12px
    }
}
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
const Addfeed=()=>{
    const inputRef=useRef()
    const [image,setImage]=useState()
    const dispatch = useDispatch()
    const player=useSelector(state=>state.player)
    const [formData,setformDatata]=useState({caption:'',file:null,file_preview:null,duration:0})
    const {caption,file,file_preview,duration}=formData
    const submit= async ()=>{
        let form=new FormData()
        form.append('file',file)
        form.append('file_preview',file_preview)
        form.append('duration',duration)
        form.append('caption',caption)
        const res= await axios.post(uploadpostURL,form,{headers:{ Authorization:`JWT ${token()}`,'Content-Type': 'multipart/form-data'}})
        dispatch(showmodal(false))
    }
    const previewFile=(e)=>{
        [].forEach.call(e.target.files, function(file) {
            if ((/image\/.*/.test(file.type))){
                setImage((window.URL || window.webkitURL).createObjectURL(file))
                setformDatata(prev=>{return{...prev,file:file}})
            }
            else if(file.type.match('video.*')){ 
                var url = (window.URL || window.webkitURL).createObjectURL(file);
                let video = document.createElement('video');
                video.src = url;
                video.addEventListener('loadeddata', e =>{
                    video.currentTime=video.duration/4
                });
                video.addEventListener('seeked',e=>{
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                let image = canvas.toDataURL("image/png");
                let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
                setformDatata(prev=>{return{...prev,file:file,file_preview:file_preview,duration:video.duration}})
                setImage((window.URL || window.webkitURL).createObjectURL(file_preview))
                });
                video.preload = 'metadata';
                // Load video in Safari / IE11
                video.muted = true;
            }
        })
    }

    function autogrow(e) {
        e.target.style.height = "5px";
        e.target.style.height = (e.target.scrollHeight)+"px";
    }
    return(
        <Content>
           
            <Bodycontent >
                <input onChange={(e)=>previewFile(e)} ref={inputRef} type="file"/>
                <Contentfile className="center">
                    {image?<img className="post-media" src={image}/>:<button className="btn-add" onClick={()=>inputRef.current.click()}>Thêm ảnh or video</button>}
                    {image&&(
                    <button className="close-btn" onClick={()=>{
                        setformDatata({...formData,file:null,file_preview:null})
                        setImage()
                    }}>
                        <svg viewBox="0 0 16 16" stroke="#EE4D2D" class="home-popup__close-button"><path stroke-linecap="round" d="M1.1,1.1L15.2,15.2"></path><path stroke-linecap="round" d="M15,1L0.9,15.1"></path></svg>
                    </button>)}
                </Contentfile>
                <Contentinput className="">
                    <div className="flex-1">
                        <textarea className="textarea" 
                            onChange={(e)=>setformDatata({...formData,caption:e.target.value})}
                            maxLength='1000'
                            spellCheck={false}
                            placeholder="Nhập vào"
                            onKeyDown={(e)=>{
                                if (e.key === "Enter") {
                                    submit()
                                }}}  
                            onInput={(e)=>{
                                autogrow(e)
                            }}  
                        value={caption}/>
                    </div>
                       
                </Contentinput>
                <div></div>
            </Bodycontent>
            <div class="item-end">
                <button onClick={()=>dispatch(showmodal(false))} class="btn btn-primary mr-16">Cancel</button>
                <button onClick={submit} class="btn btn-second">Save</button>
            </div>
        </Content>
    )
}
export default Addfeed