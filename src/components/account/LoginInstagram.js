import InstagramLogin from 'react-instagram-login';
const LoginInstagram=()=>{
    const responseInstagram = response => {
        console.log(response)
    }
    return(
    <InstagramLogin
      clientId="851393199388551"
      buttonText=" Login with Instagram "
      cssClass="InstagramLogin"
      onSuccess={responseInstagram}
      onFailure={responseInstagram}
    />
    )
}
export default LoginInstagram