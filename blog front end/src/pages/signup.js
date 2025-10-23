import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "../styles/login.module.css";
import LoginButton from "../components/loginButton";
import SignUpButton from "../components/signUpButton";
const API_URL = process.env.REACT_APP_BACKEND_URL;




function Signup() {
  const Navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [status2, setStatus2] = useState("");
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    email:"",
    password:"",
    username:""
  })

  //for input handling
  const inputHandler=(e)=>{
   const  {name, value} = e.target;
    setInput(prev=>({...prev, [name]:value}))
  }

  //for clearing of logs from the FE
  const clearStatus = (timeInMili, statusOrErrors) => {
    if (statusOrErrors === "status") {
      setTimeout(() => {
      setStatus("");
      }, timeInMili);
    }
    if (statusOrErrors === "errors") {
        setTimeout(() => {
        setErrors([]);
        }, timeInMili);
    }
  }

  //for processing of responsae received form fetch
  const processResponse = async (response) => {
    console.log(response.status, "is the status");
    const data = await response.json();
      if(response.status === 200){
        setStatus(data.message);
        setTimeout(() => { setStatus("redirrecting...") }, 2000)
        setTimeout(() => { Navigate("/login") }, 4000);
        return;
        //clearStatus(3000);
    }
    else if (response.status === 409) {
      setStatus("user exists");
      clearStatus(3000, "status");
      return;
      }
      else if (response.status === 400) {
        setErrors(data.errors);
         clearStatus(5000, "errors");
    }
    else {
      setStatus("something went wrong");
      return;
    }

}
  //for form submission for sign up
  const submitHandler= async(event)=>{
    event.preventDefault();
    const body = {username:input.username, password:input.password, email:input.email} //to be submitted
    
    try {
      const response = await fetch(`${API_URL}/user/createUser`, {
        method: "post",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(body),
      });
   
         if (response.ok) {
            await processResponse(response);
         } else {
            await processResponse(response);
         }
    } catch (error) {
      console.log(error.message, "happened in the signup FE");
      setStatus(error.message);
      return;
    }
  }
  return (
    <>
    

      <div className={style.formContainer}>
        <h1>SIGN UP</h1>
          <p style={{ fontStyle: "italic", fontSize: "small" }}>{status}</p>
              {
        errors.map((error, index) => (
           <p style={{ fontStyle: "italic", fontSize: "small" }}>{error.msg}</p>
        ))
      }
        <form onSubmit={submitHandler} className={style.form}>
          <div className={style.formInnerContainer}>
            <div className={style.shape}></div>
            <div className={style.inputContainer}>
              <input
                onChange={inputHandler}
                className={style.usernameInput}
                placeholder="USERNAME"
                name="username"
                value={input.username}
              ></input>
              <hr />
              <input
                onChange={inputHandler}
                className={style.usernameInput}
                placeholder="EMAIL"
                name="email"
                value={input.email}
              ></input>
              <hr />
              <input
                onChange={inputHandler}
                className={style.usernameInput}
                placeholder="PASSWORD"
                name="password"
                value={input.password}
              ></input>
              <hr />
            </div>
          </div>
          <div>
            <SignUpButton text={"SIGN UP"} />
            <small>OR</small>
            <Link to={"/login"}>
              <LoginButton text={"LOGIN"} />
            </Link>
          </div>
          <div className={style.smallContainer}>
            <Link to={"/passwordRecovery"}>
              <small className={style.small}>forgot password?</small>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
export default Signup;
