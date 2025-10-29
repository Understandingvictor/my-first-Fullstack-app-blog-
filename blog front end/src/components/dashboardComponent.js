import DashboardButton from "./dashboardButton";
import like from "../assets/icon/like.png"
import disliker from "../assets/icon/disliker.png";
import editing from "../assets/icon/editing.png";
import remover from "../assets/icon/remover.png";
import style from "../styles/dashboard.module.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogUseContext } from "../contexts/logStatusContext"; //context Api
import { AccessTokenUseContext } from "../contexts/accessTokenContext";
import { getAccessToken } from "../helpers/checkAuth";
import { apiReFetch } from "../helpers/generalRetrying.helpers";
const API_URL = process.env.REACT_APP_BACKEND_URL;


   
function ExperienceCard({ title, likes, dislikes, userId, postId, setIsDeleted, deleteResponse, DeleteResponseFromUser, triggerModal }) {
  const navigate = useNavigate();
  //const [isDeleted, setIsDeleted] = useState(null);
const { accessToken, setAccessToken } = AccessTokenUseContext();
  const { setLogStatus, userIdFromContext} = LogUseContext(); //this from context api
  //console.log(logStatus,  userIdFromContext, "is the status of the context and userId");

  const [isAdmin, setIsAdmin] = useState(null);


  const editHandler= () => {
    navigate(`/editPost/${postId}`);
        return;
  }

  const modalTrigger = () => {
    triggerModal();
  }
    //handler to trigger delete modal
  const deleteModalTrigger = async() => {
    const response = await DeleteResponseFromUser();
    if (response === true) deleteHandler();
    else {
      return;
    }
  }

  //handler to delete a post
    const deleteHandler = async () => {
      try {
        deleteResponse(async(usersChoice) => {
              if (usersChoice === true) {
                      const res = await fetch(`${API_URL}/post/deletePost?postId=${postId}`, {
                          method: "delete",
                          headers: {
                                  "Authorization": `Bearer ${accessToken}`,
                          },
                        credentials: "include",
                      })
              if (res.ok || res.status === 200) {
                  const data = await res.json();
                  setIsDeleted();// a function being called to remount the dashboard
                return;
              }
              if (res.status === 401) {
                        const { newAccessToken, statusCode } = await getAccessToken();
                                  if (statusCode === 403) { //meaning theres no refresh token
                                    const redirectPath = window.location.pathname
                                    sessionStorage.setItem("redirectPath", redirectPath);
                                    navigate('/login');
                                    return;
                    }
                            if (newAccessToken) { //meaning theres new access token
                              setAccessToken(newAccessToken); //we set new access token
                              const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${newAccessToken}`, }
                              const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/deletePost?postId=${postId}`, "post", headers);
                              if (response.status) {
                                navigate('/error');
                              }
                              setIsDeleted();// a function being called to remount the dashboard
                              return;
                            }
                navigate(`/myDashboard/${userId}`);
              }
              if (res.status === 404) {
                const redirectPath = window.location.pathname
                sessionStorage.setItem("redirectPath", redirectPath);
                navigate('/login');
              }
          }
          else{
                return;
          }
        });
    } catch (error) {
       return { error: error.message };
    }
  }
  
  

  //a handler that checks if the userId eqauls the author id this meanas the person accessing the dashboard is the admin
  const checkIfAdmin =() => {
    try {
      if (userId.toString() === userIdFromContext.toString()) setIsAdmin(true); //if equal then set to true
      else {
        throw new Error("something went");
      }
    } catch (error) {
      return { error: error.message };
    }
  }


    //let [logStatus, setLogStatus] = useState(null)
 //checks for log status
  const logStatusChecking = async () => {
    const response = await fetch(`${API_URL}/logStatus?authorId=${userId}`, { //we pass userId so the backend checks if logged user is the owner of the dashboard
      method: "post",
      credentials: "include"
    });

    let data = await response.json();
    //console.log(data.message, "is the log status");
    return data.message;
  }
  
  useEffect(() => {
    const checkingLoginStatusOnMount = async () => {
      let isLoggedIn = await logStatusChecking();
      setLogStatus(isLoggedIn);
    }

    //checkingLoginStatusOnMount(); //checking log status 
    checkIfAdmin();
  }, [])
    return (
      <>
        <div className={style.components}>
          <div className={style.titlehContainer}><p className={style.titleh3}>{title || "this is title"}</p></div>
          <div>
            <DashboardButton image={<img src={like} className={style.iconImage} alt="like"/>}/> <span style={{fontSize:"xx-small"}}>{likes}</span>
            <DashboardButton image={<img src={disliker} className={style.iconImage} alt="dislike" />}/><span style={{ fontSize: "xx-small" }}>{dislikes}</span>
            {
              isAdmin && (
                <>
                  <DashboardButton image={<img src={editing} className={style.iconImage}/>} alt="edit"  handler={editHandler}/>
                  <DashboardButton image={<img src={remover} className={style.iconImage} alt="delete"/>} handler={deleteHandler}/>
                </>
              )
            }
          </div>
        </div>
      </>
    );
}
export default ExperienceCard;