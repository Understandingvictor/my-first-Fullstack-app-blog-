import { Link } from "react-router-dom";
import { useState } from "react";
import style from "../styles/login.module.css";
import LoginButton from "../components/loginButton";
import SignUpButton from "../components/signUpButton";
import Spinner from "../components/spinner";
const API_URL = process.env.REACT_APP_BACKEND_URL;

function PasswordRecovery() {

  const [status, setStatus] = useState("");
  const [input, setInput] = useState({
    email: ""
  });
  const [triggerSpinner, setTriggerSpinner] = useState(false);
  let submit;

    //for input handling
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev)=>({...prev, [name]:value}));
  };


  const formHandler = async (e) => {
    try {
       setTriggerSpinner(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataObject = Object.fromEntries(formData.entries());

    //sending request to backend
    const res = await fetch(`${API_URL}/forgotPassword`, {
      method: "post",
      headers: {
      "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(dataObject)
    });

    if (res.status === 400 || res.status === 200) {
      setTriggerSpinner(false);
      const data = await res.json();
      setStatus(data.message);
      setTimeout(() => {
        setStatus("")
      }, 5000);
      return;
    }
    setStatus("something went wrong, pls reload");
      setTimeout(() => {
        setStatus("")
      }, 3000);
    } catch (error) {
          setStatus(error.message);
      setTimeout(() => {
        setStatus("")
      }, 3000);
    }
   
  }
  return (
    <>
      <div className={style.formContainer}>
        <h1>RECOVER PASSWORD</h1>
        { 
          triggerSpinner && (
            <Spinner/>
          )
        }
          <p style={{ fontStyle: "italic", fontSize: "small" }}>{status}</p>
        <form onSubmit={formHandler} className={style.form}>
          <div className={style.formInnerContainer}>
            <div className={style.shape}></div>
            <div className={style.inputContainer}>
              <input
                name="email"
                className={style.usernameInput}
                onChange={inputHandler}
                value={input.email}
                placeholder="EMAIL"
              ></input>
              <hr />
            </div>
          </div>
          <div>
            <LoginButton  text={"SUBMIT"} />
            <small>OR</small>
           <Link to={"/login"}><SignUpButton handler={submit} text={"BACK TO LOGIN"} /></Link> 
          </div>
        </form>
      </div>
    </>
  );
}
export default PasswordRecovery;
