import InstagramLogin from 'react-instagram-login';
const LoginInstagram=()=>{
    const responseInstagram = response => {
        console.log(response)
    }
    return(
    <InstagramLogin
      clientId="851393199388551"
      buttonText=" Login with Instagram "
      cssclassName="InstagramLogin"
      onSuccess={responseInstagram}
      onFailure={responseInstagram}
    ><span>Instagram</span></InstagramLogin>
    )
}
export default LoginInstagram