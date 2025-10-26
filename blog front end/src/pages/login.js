import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { Link, replace, useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "../styles/login.module.css";
import LoginButton from "../components/loginButton";
import SignUpButton from "../components/signUpButton";
import { LogUseContext } from "../contexts/logStatusContext";
import { AccessTokenUseContext } from "../contexts/accessTokenContext";
import { motion } from 'motion/react';
import Spinner from '../components/spinner';
const API_URL = process.env.REACT_APP_BACKEND_URL;

function Login() {

  const navigate = useNavigate();
  
  // const [ user, setUser ] = useState([]);
  // const [ profile, setProfile ] = useState([]);
  const[triggerSpinner, setTriggerSpinner] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("");

  //useContexts
  const { setLogStatus } = LogUseContext();
  const { setAccessToken } = AccessTokenUseContext();


  //const sending user OAUTH credentials to backend, if mode of authentication is via google login
  const handleLoginSuccess = async (codeResponse) => {
    try {
      const res = await fetch(`${API_URL}/OAUTH`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(codeResponse)
      })
      if (res.status === 200) {
        const redirectPath = sessionStorage.getItem("redirectPath") || '/experiences' //here we get from session storage the last location before we logged in now
        setStatus("logging in ...");
        setTimeout(() => {
          setLogStatus(true); //set context that we are logged in
          navigate(redirectPath, { replace: true });
          sessionStorage.removeItem("redirectPath");
        }, 2000);
        //navigate('/experiences')
      }
    } catch (error) {
      console.log(error.message);
      setStatus(error.message);
    }
  }
  
  //fetching user info and updating user info state
  //for input handling
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  //for clearing of logs from the FE
  const clearStatus = (timeInMili) => {
    setTimeout(() => {
      setStatus("");
    }, timeInMili);
  };

  //for processing of responsae received form fetch
  const processResponse = async (data) => {
    setStatus(data.message);
    setAccessToken(data.accessToken);
      setTimeout(() => {
        setStatus("redirrecting...");
      }, 2000);
    clearStatus(3000);
    
    setStatus(data.message);
    //console.log(data);
    clearStatus(3000);
    return;
  };


  //form submitting handler
  const submitHandler = async (e) => {
    setTriggerSpinner(true);
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const dataObject = Object.fromEntries(formData.entries());

      //making requweest
        const response = await fetch(`${API_URL}/login`, {
                                    method:"POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                        },
                                    credentials: "include",
                                    body: JSON.stringify(dataObject)
        })
      const data = await response.json();
      //console.log(data, response.status, "is the response");
      if (response.status === 200) {
        await processResponse(data);

        const redirectPath = sessionStorage.getItem("redirectPath") || '/experiences' //here we get from session storage the last location before we logged in now
        setTimeout(() => {
          setLogStatus(true);
          navigate(redirectPath, { replace: true });
          sessionStorage.removeItem("redirectPath");
        }, 4000);

      }
      else if (response.status === 404) {
        setTriggerSpinner(false);
        setStatus("user not found");
         clearStatus(3000)
      }
      else {
        setTriggerSpinner(false);
        setStatus("something went wrong");
        clearStatus(3000);
      }
    } catch (error) {
      setStatus("network error");
      return;
    }
  };



  return (
    
    <>
      
  
          
      <div className={style.formContainer}>
            <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
               scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}>
          <h1>LOGIN</h1>
          {
            triggerSpinner && (<Spinner />)
          }
    <p style={{ fontStyle: "italic", fontSize: "large" }}>{status}</p>
        <form className={style.form} onSubmit={submitHandler}>
          <div className={style.formInnerContainer}>
            <div className={style.shape}></div>
            <div className={style.inputContainer}>
              <input
                name="email"
                onChange={inputHandler}
                value={input.email}
                className={style.usernameInput}
                placeholder="EMAIL"
              ></input>
              <hr />
              <input
                name="password"
                onChange={inputHandler}
                value={input.password}
                className={style.usernameInput}
                placeholder="PASSWORD"
              ></input>
              <hr />
            </div>
          </div>
          <div>
            <LoginButton text={"LOGIN"} />
            <small>OR</small>
            <Link to={"/signup"}>
              <SignUpButton text={"SIGN UP"} />
            </Link>
          </div>
          <div className={style.smallContainer}>
            <Link to={"/passwordRecovery"}>
              <small className={style.small}>forgot password?</small>
            </Link>
          </div>
          </form>
          
         <div>
         <center>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"></GoogleLogin>
              </center>
          </div>
          </motion.div>
        </div>
        
      
      </>
  );
}
export default Login;
