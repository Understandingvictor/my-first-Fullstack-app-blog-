import { useState } from "react"
import { useNavigate } from "react-router-dom";
import LoginButton from "../components/loginButton";
import style from "../styles/login.module.css";
const API_URL = process.env.REACT_APP_BACKEND_URL;



function PasswordResetPage() {
    const [password, setNewPassword] = useState({
        newPassword: "",
        confirmNewPassword:""
    });
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const  {name, value} = e.target;
        setNewPassword(prev=>({...prev, [name]:value}))
    }

    const [status, setStatus] = useState("")

    //handler for form submission
    const formHandler = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmNewPassword) {
            setStatus("passwords DON'T match");
            setTimeout(() => {
                 setStatus("");
            }, 3000);
        }

    //grab the entries
    const formData = new FormData(e.target);
    const dataObject = Object.fromEntries(formData.entries());
    
        //console.log(window.location.search.split("=")[1], "is the pathnake") 

        const token = window.location.search.split("=")[1];
     //sending request to backend
    const res = await fetch(`${API_URL}/passwordReset?token=${token}`, {
      method: "post",
      headers: {
      "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(dataObject)
    });
    
    const data = await res.json();
    if ( res.status === 200) {
      setStatus(data.message);
      setTimeout(() => {
        setStatus("redirecting to login");
      }, 3000);
        
        setTimeout(() => {
            navigate("/login");
        }, 4000);
        
        }
        setStatus(data.message);
    }

    return (
        <>
             <div className={style.formContainer}>
                    <h1>CHANGE PASSWORD</h1>
                <form onSubmit={formHandler} className={style.form}>
                     <p style={{ fontStyle: "italic", fontSize: "small", color:"red"}}>{status}</p>
                      <div className={style.formInnerContainer}>
                        <div className={style.shape}></div>
                        <div className={style.inputContainer}>
                            <input
                                name="newPassword"
                                onChange={inputHandler}
                                value={password.newPassword }
                                className={style.usernameInput}
                                placeholder="enter new password"
                            ></input>
                                <input
                                name="confirmNewPassword"
                                onChange={inputHandler}
                                value={password.confirmNewPassword }
                                className={style.usernameInput}
                                placeholder="confirm new password">
                            </input>
                          <hr />
                        </div>
                      </div>
                      <div>
                        <LoginButton text={"CHANGE PASSWORD"} />
                      </div>
                    
                    </form>
                  </div>
        </>
    )
}
export default PasswordResetPage;