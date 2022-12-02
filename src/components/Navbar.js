import {useState,useRef,useEffect,useMemo} from 'react'
import axios from "axios"
import { dataURLtoFile, generateString, slugify } from '../constants';
import { setrequestlogin,settheme,token } from '../actions/auth';
import { useSelector,useDispatch } from 'react-redux';
import AccountLogin from './header/AccountLogin';
import Searchcontent from './header/Searchcontent';
import { uploadsongURL,uploadmvURL, refreshTokenURL } from '../urls';
import dayjs from 'dayjs';
let jsmediatags = window.jsmediatags;

   
const Navbar=()=>{
    const dispatch = useDispatch()
    const [now,setNow]=useState(new Date())
    const inputref=useRef()
    const inputref1=useRef()
    const user=useSelector(state=>state.auth.user)
     
    const uploadfile=async (e)=>{
        try{
            [].forEach.call(e.target.files, function(file) {
                console.log(file)
                var url = (window.URL || window.webkitURL).createObjectURL(file);
                const video=document.createElement('video')
                video.src=url
                video.addEventListener('loadeddata', e =>{
                    var rand = Math.round(Math.random() * video.duration * 1000) + 1;
                    video.currentTime = rand / 1000;
                })
                video.addEventListener('seeked',e=>{
                    let canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    let image = canvas.toDataURL("image/png");
                    let file_preview = dataURLtoFile(image,'dbc9a-rg53.png');
                    let form=new FormData()
                    form.append('name',file.name.slice(-50,-6))
                    form.append('file',file)
                    form.append('file_preview',file_preview)
                    form.append('duration',video.duration)
                    axios.post(uploadmvURL,form,{headers:{ Authorization:`JWT ${token()}`,'Content-Type': 'multipart/form-data'}})
                    .then(res=>{
                        console.log(res.data)
                    })
                })
                
                video.preload = 'metadata';
            })
        }
        catch(e){
            console.log(e)
        }
    }
    const previewFile= async (e)=>{
        try{
        [].forEach.call(e.target.files, function(file) {
            console.log(file)
            var url = (window.URL || window.webkitURL).createObjectURL(file);
            const audio=document.createElement('audio')
            audio.src=url
            audio.addEventListener('loadeddata', e =>{      
              jsmediatags.read(file, {
                onSuccess: function(tag) {
                  console.log(tag);
                  const {title,artist,genre,album,lyrics,picture}=tag.tags
                  let form=new FormData()
                  if(picture){
                      let base64String = "";
                      for (let i = 0; i < picture.data.length; i++) {
                          base64String += String.fromCharCode(picture.data[i]);
                      }
                      const dataUrl = "data:" + picture.format + ";base64," +window.btoa(base64String);
                      form.append('media_cover',dataURLtoFile(dataUrl,title))
                      form.append('image',dataURLtoFile(dataUrl,title))
                      console.log(dataURLtoFile(dataUrl,title))
                  }
                  form.append('file',file)
                  form.append('name',title)
                  form.append('slug',slugify(title))
                  form.append('album',album)
                  form.append('artist_name',artist)
                  form.append('viewer','1')
                  form.append('singer',user.singer)
                  if(genre){
                    form.append('genre',genre)
                  }
                  if(lyrics){
                    form.append('lyrics',lyrics.lyrics)
                  }
                  form.append('duration',audio.duration)
                  
                  axios.post(uploadsongURL,form,{headers:{ Authorization:`JWT ${token()}`,'Content-Type': 'multipart/form-data'}})
                  .then(res=>{
                    console.log(res.data)
                  })
                },
                onError: function(error) {
                  console.log(':(', error.type, error.info);
                }
              });
          });
              
        }) 
    }
    catch(e){
        console.log(e)
    }
    }
    
    
    return (
        <div className="header">
            <div className="header-wrapper">
                <div className="header-changepage">
                    <button className="_header-backPage_1fdcg_59">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path></svg>
                    </button>
                    <button className="_header-nextPage_1fdcg_60">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"></path></svg>
                    </button>
                </div>
                <Searchcontent/>
                
                <div className="header-right item-end flex-1">
                    <div onClick={()=>dispatch(settheme({showtheme:true}))} className="_header-icon_1fdcg_34 _header-theme_1fdcg_48" title="Chủ đề">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M32 144l48 64 64-32-16 304c64 16 192 16 256 0l-16-304 64 32 48-64-112-96-48-16c-16 64-112 64-128 0l-48 16z"></path></svg>
                    </div>
                    <div onClick={()=>{
                        if(user){
                        inputref.current.click()
                        }
                        else{
                            dispatch(setrequestlogin(true))
                        }
                        }}  className="_header-icon_1fdcg_34" title="Tải lên" aria-label="Tải lên">
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <input ref={inputref} multiple={true} onChange={(e)=>previewFile(e)} type="file" accept="audio/*"/>
                    </div>
                    <div onClick={()=>{
                        if(user){
                        inputref1.current.click()
                        }
                        else{
                            dispatch(setrequestlogin(true))
                        }
                        }}  className="_header-icon_1fdcg_34" title="Tải video" aria-label="Tải lên">
                        <svg stroke="currentColor" fill="none" width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.1571 13.8359L21.9247 12.3786C21.4686 9.51917 18.9876 7.3335 16 7.3335C12.6863 7.3335 10 10.0197 9.99996 13.3334L10.0011 15.2304L8.11578 15.3398C6.19293 15.4513 4.66663 17.0482 4.66663 19.0002C4.66663 21.0252 6.30825 22.6668 8.33329 22.6668H15.3333V17.0813L14.1785 18.236C13.9182 18.4964 13.4961 18.4964 13.2357 18.236L12.7643 17.7646C12.504 17.5043 12.504 17.0822 12.7643 16.8218L15.862 13.7242C16.1223 13.4638 16.5444 13.4638 16.8048 13.7242L19.9024 16.8218C20.1628 17.0822 20.1628 17.5043 19.9024 17.7646L19.431 18.236C19.1706 18.4964 18.7485 18.4964 18.4882 18.236L17.3333 17.0811V22.6668H23C25.3932 22.6668 27.3333 20.7267 27.3333 18.3335C27.3333 16.151 25.7179 14.3423 23.6181 14.0437L22.1571 13.8359ZM8.33329 24.6668H15.3333H17.3333H23C26.4978 24.6668 29.3333 21.8313 29.3333 18.3335C29.3333 15.1411 26.9714 12.5005 23.8997 12.0636C23.2913 8.24881 19.9861 5.3335 16 5.3335C11.5817 5.3335 7.99996 8.91522 7.99996 13.3335L7.99996 13.3431C5.0255 13.5157 2.66663 15.9824 2.66663 19.0002C2.66663 22.1298 5.20368 24.6668 8.33329 24.6668Z"></path></svg>
                        <input ref={inputref1} multiple={true} onChange={(e)=>uploadfile(e)} type="file" accept="video/*,.mkv"/>
                    </div>
                    <div className="_header-icon_1fdcg_34 _header-theme_1fdcg_48" aria-label="Chủ đề">
                        <svg height="1em" width="1em" stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 246.989 246.989" enableBackground="new 0 0 246.989 246.989" xmlSpace="preserve">
                            <path xmlns="http://www.w3.org/2000/svg" d="M246.038,83.955l-39.424-70.664c-1.325-2.374-3.831-3.846-6.55-3.846H46.93c-2.719,0-5.225,1.471-6.55,3.846L0.951,83.955  c-1.497,2.683-1.206,6.008,0.734,8.391l116.002,142.432c0.037,0.046,0.08,0.085,0.118,0.13c0.12,0.141,0.244,0.278,0.375,0.41  c0.015,0.015,0.028,0.033,0.043,0.048c0.034,0.033,0.069,0.064,0.104,0.096c0.012,0.012,0.025,0.021,0.037,0.033  c0.133,0.125,0.27,0.245,0.412,0.361c0.065,0.053,0.131,0.106,0.198,0.157c0.145,0.11,0.295,0.213,0.448,0.313  c0.072,0.047,0.143,0.094,0.216,0.139c0.129,0.077,0.263,0.148,0.397,0.219c0.055,0.028,0.108,0.059,0.164,0.086  c0.051,0.025,0.101,0.05,0.152,0.074c0.149,0.069,0.303,0.128,0.459,0.188c0.097,0.038,0.192,0.079,0.291,0.113  c0.019,0.006,0.035,0.015,0.054,0.021c0.007,0.002,0.014,0.003,0.021,0.005c0.066,0.022,0.137,0.034,0.205,0.054  c0.253,0.075,0.51,0.136,0.77,0.184c0.108,0.02,0.215,0.04,0.324,0.055c0.309,0.043,0.622,0.07,0.938,0.074  c0.029,0,0.058,0.007,0.088,0.007h0.001h0.001c0.03,0,0.059-0.007,0.088-0.007c0.317-0.004,0.63-0.031,0.939-0.074  c0.108-0.015,0.214-0.035,0.321-0.054c0.263-0.048,0.522-0.11,0.776-0.186c0.065-0.019,0.133-0.031,0.198-0.052  c0.008-0.003,0.016-0.003,0.023-0.006c0.02-0.006,0.036-0.015,0.055-0.022c0.098-0.033,0.191-0.074,0.287-0.11  c0.156-0.06,0.312-0.12,0.462-0.189c0.052-0.024,0.104-0.05,0.155-0.075c0.053-0.026,0.104-0.056,0.155-0.082  c0.136-0.071,0.271-0.143,0.401-0.221c0.074-0.045,0.146-0.093,0.22-0.141c0.152-0.099,0.302-0.202,0.444-0.311  c0.068-0.051,0.134-0.104,0.199-0.158c0.144-0.116,0.281-0.237,0.414-0.362c0.013-0.013,0.027-0.023,0.04-0.035  c0.03-0.029,0.062-0.056,0.092-0.086c0.017-0.017,0.032-0.036,0.049-0.053c0.134-0.135,0.261-0.276,0.383-0.42  c0.036-0.042,0.076-0.079,0.111-0.122L245.304,92.346C247.244,89.963,247.535,86.638,246.038,83.955z M138.3,24.446l21.242,55.664  H87.457l21.249-55.664H138.3z M160.065,95.11l-36.563,110.967L86.935,95.11H160.065z M71.142,95.11l32.524,98.699L23.282,95.11  H71.142z M175.858,95.11h47.851l-80.37,98.696L175.858,95.11z M226.715,80.11h-51.118l-21.242-55.664h41.306L226.715,80.11z   M51.333,24.446h41.317L71.402,80.11H20.274L51.333,24.446z"/>
                        </svg>
                        
                    </div>
                    <div className="_header-icon_1fdcg_34" title="Cài đặt">
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </div>
                    <AccountLogin/>
                    
                </div>
            </div>
        </div>
    )
}
export default Navbar