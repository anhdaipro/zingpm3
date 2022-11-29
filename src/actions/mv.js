import { SHOW_VIDEO } from "./types"

export const setshowvideo=(data)=>{
    return{
        payload:data,
        type:SHOW_VIDEO
    }
}