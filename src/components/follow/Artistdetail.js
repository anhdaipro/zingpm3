import { useEffect } from "react"
import { useNavigate } from "react-router"
import { headers } from "../../actions/auth"
import { newsongURL } from "../../urls"
import axios from "axios"
const Artistdetail=()=>{
    const {choice}=useNavigate()
    console.log('ss')
    useEffect(()=>{
        ( async () =>{
           const res= await axios.get(newsongURL,headers)
        })()
    },[])
    return(
        <div></div>
    )
}
export default Artistdetail