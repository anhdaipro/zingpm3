import { useRef,useState,useEffect } from "react"

const Addfeed=()=>{
    const inputRef=useRef()
    const [image,Image]=useState()
    const [formData,setformDatata]=useState({caption:'',file:null})
    const {caption,file}=formData
    const submit=()=>{

    }
    return(
        <div>
            <div>Thêm post</div>
            <div>
                <input onChange={(e)=>previewFile(e)} ref={inputRef} type="file"/>
                <div>
                    <button>Thêm ảnh or video</button>
                    <img src={image}/>
                </div>
                <div>
                    <input value={caption} onChange={e=>setformDatata({...formData,caption:e.target.value})} type='text'/>
                </div>
                <div></div>
            </div>
            <div>
                <button>Hủy</button>
                <button onClick={submit}>Xác nhận</button>
            </div>
        </div>
    )
}