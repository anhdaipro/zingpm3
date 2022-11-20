import { useRef } from "react"

const Audio=()=>{
    
    const audioRef=useRef()
    return(
        <audio ref={audioRef} data-html5-video="" preload="auto" src=""></audio>
    )
}
export default Audio