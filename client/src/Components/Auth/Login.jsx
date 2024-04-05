import "./Login.css"
import userIcon from  "../Assets/userIcon.png"
import { useNavigate } from "react-router-dom"
const Login =  ()=> {
    const navigate= useNavigate()
    return (
    <div className="wrapper fadeInDown">
    <div id="formContent">
      {/* <!-- Tabs Titles --> */}
      <h2 className="active" > Sign In </h2>
      <h2 className="inactive underlineHover" onClick={()=> navigate('/signup')}>Sign Up </h2>
  
      {/* <!-- Icon --> */}
      <div className="fadeIn first">
        <img src={userIcon} id="icon" alt="User Icon" className="userIcon" />
      </div>
  
      {/* <!-- Login Form --> */}
      <form>
        <input type="text" id="login" className="fadeIn second" name="login" placeholder="username"/>
        <input type="text" id="password" className="fadeIn third" name="login" placeholder="password"/>
        <input type="submit" className="fadeIn fourth" value="Log In"/>
      </form>
  
      {/* <!-- Remind Passowrd --> */}
      <div id="formFooter">
        <a className="underlineHover" href="#">Forgot Password?</a>
      </div>
  
    </div>
  </div>)
}
export default Login