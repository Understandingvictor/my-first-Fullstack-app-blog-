import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ExperienceCard from "../components/dashboardComponent";
import style from "../styles/dashboard.module.css"
import updateProfileIcon from "../assets/icon/user.png"
import ProfilePicsUploadComponent from "../components/uploadPictureModal";
import { LogUseContext } from "../contexts/logStatusContext";
import { AccessTokenUseContext } from "../contexts/accessTokenContext";
import { getAccessToken } from "../helpers/checkAuth";
import { apiReFetch } from "../helpers/generalRetrying.helpers";
import { motion } from "motion/react";
import { buttonAnimation } from "../motions/motion1.motions";
import defaultImage from "../assets/images/default.jpg";
import Spinner from '../components/spinner';
const API_URL = process.env.REACT_APP_BACKEND_URL;

function UsersDashboard({ userName, desc }) {


  const navigate = useNavigate();
  const [isModalOpen, setIsmodalOpen] = useState(false);
  const { userId } = useParams(); //grab post id from route
  const [posts, setPosts] = useState([]);
  const [profileAvatar, setProfileAvatar] = useState(null);
  let [isFollowing, setIsFollowing] = useState(false);
  const [isPictureUploaded, setIsPictureUploaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(true);
  const [isModalOpenForPictureUpdate, setIsModalOpenForPictureUpdate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("This is my description");
   const { accessToken, setAccessToken } = AccessTokenUseContext();
  const { logStatus, userIdFromContext } = LogUseContext();  
  const [isAdmin, setIsAdmin] = useState(null);
  const [triggerSpinner, setTriggerSpinner] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [callback, setCallback] = useState(null);
//const { setLogStatus, userIdFromContext} = LogUseContext(); //this from context api

  


 //a handler that checks if the userId eqauls the author id this meanas the person accessing the dashboard is the admin
  const checkIfAdmin = () => {
    try {
      // console.log("i got here");
      // console.log(userId, userIdFromContext, "is the user id and user id from contextr")
      if (userId.toString() === userIdFromContext.toString()) setIsAdmin(true); //if equal then set to true
      else {
        throw new Error("something went");
      }
    } catch (error) {
      return { error: error.message };
    }
  }



  const deleteModalHandler = async (callBack) => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
    setCallback(()=>callBack);
  }
  const handleModalResult = (usersChoice) => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
    if (callback) callback(usersChoice);
}

  const fetchUserDashboard = async() => {
    try {
      const res = await fetch(`${API_URL}/post/allPosts?id=${userId}&requestFromDashboard=yes`);
      if (res.status === 200) {
      
        const data = await res.json();
        setPosts(data.Posts);
          setTriggerSpinner(false);//off the spinner
        if (data.Posts.length !== 0) {
          let picsUrl;
          if (data.Posts[0]?.user.profilePics) {
            setProfileAvatar(`${API_URL}${data.Posts[0]?.user.profilePics}`);
            return;
          }
            setProfileAvatar(undefined); 
        }
      }
    } catch (error) {
      console.log(error.message)
      navigate('/error');
    }
  }

  const setIsdeletedStatus = () => {
    setIsDeleted(!isDeleted);
  }
  
  //handler for
  const openUploadDialog = () => {
    setIsModalOpenForPictureUpdate(!isModalOpenForPictureUpdate);
  }

  
  //handler for updating profile pics
  const updateProfilePicsHandler = async (e) => {
    setIsModalOpenForPictureUpdate(true);
    let formData = new FormData();
    let file = e.target.files[0]
    let profileAvatarPointer;
    formData.append("profilePic", file);
   //console.log(profileAvatar.split('/')[4], " is the proile avata")
    //return
    //console.log(profileAvatar.split('/'), " is the proile avata")
    if (profileAvatar !== undefined) {
      console.log("i entered here PROFILE PIC IS NOT UNDEFINED")
      profileAvatarPointer = profileAvatar.split('/')[4] || ""
            console.log(profileAvatarPointer)
    }
    else {
      console.log("i entered here PROFILE PIC IS  UNDEFINED")
      profileAvatarPointer = undefined
      console.log(profileAvatarPointer);
    }
     const res = await fetch(`${API_URL}/user/updateUserProfilePic?previousAvatar=${profileAvatarPointer} `, {
       method: "post",
       headers: {
          "Authorization": `Bearer ${accessToken}`,
       },
       credentials: "include",
       body: formData
     })
    console.log(res.status, "is the status at updating users progile")
     if (res.ok || res.status === 200) {
        const data = await res.json();
       setIsPictureUploaded(!isPictureUploaded);
       setIsModalOpenForPictureUpdate(false);
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
                const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/user/updateUserProfilePic?previousAvatar=${profileAvatarPointer}`, "post", headers, formData);
                
                if (response.status) {
                  navigate('/error');
                }
                setIsPictureUploaded(!isPictureUploaded);
                setIsModalOpenForPictureUpdate(false);
                return;
              }
    
    }
        // const redirectPath = window.location.pathname
        // sessionStorage.setItem("redirectPath", redirectPath);
        // navigate('/login');
  }

  //this logout is used for logging out 
  const logOut = async () => {
    const response = await fetch(`${API_URL}/logout`, {
      method: "post",
      credentials:"include"
    });
    
    if (response.status === 200) {
      const data = await response.json()
      sessionStorage.clear();
      // Full page reload
      return window.location.replace('/');
    }
    if (response.status === 404) {
      return window.location.replace('/login');
    }
    return window.location.replace('/error');
}

  //this handler for the logout button is used for logging from the modal
  const logIn = () => {
    //setLogStatus(true);
    navigate('/login');
  }


  //handler for following an author
  const followAuthor = async() => {
    try {
      const res = await fetch(`${API_URL}/post/followAuthor?authorId=${userId}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials:"include"
      })  
      if (res.ok || res.status === 200) {
        const data = await res.json();
        //console.log(data);
        setIsFollowing(data.isFollowing);
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
                const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/followAuthor?authorId=${userId}`, "post", headers);
                if (response.status) {
                  navigate('/error');
                }
                  setIsFollowing(response.isFollowing);
                return;
              }
        // const redirectPath = window.location.pathname
        // sessionStorage.setItem("redirectPath", redirectPath);
        // navigate('/login');
      }
    } catch (error) {
      navigate('/error');
    }
  }

//handler that fetches if the user is following the author or not
  const fetchIfFollowing = async () => {
    try {
      const res = await fetch(`${API_URL}/post/fetchIfFollowing?authorId=${userId}`, {
        method: "post",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type":"application/json"
        },
        credentials:"include"
      })

      if (res.ok || res.status === 200) {
        const data = await res.json();
        //console.log(data);
        setIsFollowing(data.isFollowing);
        return;
      }
      //when we are logged out
      if (res.status === 403) {
        setIsFollowing(false);
        return;
      }
      //when we are logged in and we refresh the page
      if (res.status === 401) {
        const { newAccessToken, statusCode } = await getAccessToken();
                   if (statusCode === 403) { //meaning theres no refresh token
                      const redirectPath = window.location.pathname
                      sessionStorage.setItem("redirectPath", redirectPath);
                      setIsFollowing(false);
                      return;
      }
              if (newAccessToken) { //meaning theres new access token
                setAccessToken(newAccessToken); //we set new access token
                const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${newAccessToken}`, }
                const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/fetchIfFollowing?authorId=${userId}`, "post", headers);
                if (response.status) {
                  navigate('/error');
                }
                  setIsFollowing(response.isFollowing);
                return;
              }
      }
      // if (res.status === 404) {
      //   console.log("not following");
      //   setIsFollowing(false);
      //   return;
      // }
      setIsFollowing(false);
    } catch (error) {
      console.log(error.message);
      console.log("error happened here");
      navigate('/error');
    }
  }
 
  //handler for when you save the users bio
  const saveDescriptionHandler = async() => {
    try {
       const res = await fetch(`${API_URL}/user/addBio`, {
        method: "post",
         headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type":"application/json"
        },
         credentials: "include",
         body: JSON.stringify({ bio : text })
       })
      
      if (res.ok || res.status === 200) {
        const data = await res.json();
        setText(data.bio);
        setIsEditing(false);
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
                const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/user/addBio`, "post", headers, { bio : text });
                if (response.status) {
                  navigate('/error');
                }
                  setText(response.bio);
                  setIsEditing(false);
                return;
              }
      }
     
    } catch (error) {
      navigate('/error');
    }
  }

  useEffect(() => {
   setTriggerSpinner(true);//start the spinner
    checkIfAdmin();
    fetchUserDashboard();
    fetchIfFollowing();

    //followAuthor();
    
  }, [isPictureUploaded, isDeleted, isAdmin, text, isEditing]);
  return (
    <>
      <motion.div
         initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            transition={{
                duration: 0.4,
               scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
      >
      <div className={style.mainContainer}>
        <div className={style.imageAndName}>
          <div>
            <div className={style.imageAndNameinner}>
              <div className={style.authorImageAndUpdateIcon}>
                <div  className={style.authorImageContainer} style={{overflow:"hidden", objectFit:"cover", alignItems:"center", backgroundImage:`url(${profileAvatar || defaultImage})`,  backgroundSize:"contain"}}></div>
                {
                  userId === userIdFromContext && (
                    <img onClick={openUploadDialog} src={updateProfileIcon} className={style.updateProfileIcon}></img>
                  )
                }
              </div>
              <div className={style.usernameAndIntro}>
                <h3 className={style.authorUsername}>{posts[0]?.user.username || "USER"} </h3>
                <small className={style.intro}>


                  {isEditing && isAdmin ? (
                        <div>
                          <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                          />
                          <button onClick={ saveDescriptionHandler}>Save</button>
                        </div>
                      ) : (
                        <div>
                          <p>{posts[0]?.user.bio || "the great great user user"}</p>
                        
                          {isAdmin && (
                            <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
                          )}
                        </div>
                  )}

                </small>
              </div>
            </div>
            <div className={style.followingContainer}>
              <button className={style.isFollowing} onClick={followAuthor}>
                 {
                  isFollowing ? ("FOLLOWING"):("FOLLOW")
                }
              </button>
            </div>
          </div>
          <div
            onClick={() => setIsmodalOpen(!isModalOpen)}
            className={style.hamburger}
          >
            <div className={style.hamburgerLine1}></div>
            <div className={style.hamburgerLine2}></div>
            <div className={style.hamburgerLine3}></div>
          </div>
        </div>
      </div>
      <div className={style.experienceCardContainer}>
        {
          triggerSpinner ? (<Spinner />) : (
                    
          posts.length === 0 ? (
            <>
              <p style={{ fontStyle: "italic", marginTop: "50vh" }}>CREATE YOUR FIRST POST TO USE DASHBOARD</p><br></br>
               <Link to={"/newPost"}>
              < motion.button 
                      variants={buttonAnimation}
                      whileTap="whileTap"
                      animate="animate"
                      className={style.btnn}>SHARE EXPERIENCE
              </motion.button>
            </Link>
                      </>
                     
         
                      ) :
                          (
                          posts.map((eachPost, index) => {
                          return (
                            <>
                              <ExperienceCard key={index}
                              title={<Link to={`/body/${eachPost._id}/${eachPost.user._id}/${eachPost.likes}/${eachPost.dislikes}`}>{eachPost.title}</Link>}
                              likes={eachPost.likes || ""} 
                              dislike={eachPost.dislikes || ""}
                              edit={"edit"}
                              remove={"remove"}
                              userId={eachPost.user._id}
                                postId={eachPost._id}
                                setIsDeleted={setIsdeletedStatus}
                                deleteResponse={deleteModalHandler}
                              />
                          </>)
                        })
                          )
        
          )
        }


       
        {
          isAdmin === isModalOpenForPictureUpdate &&(
            <ProfilePicsUploadComponent>
          <div onClick={()=>setIsModalOpenForPictureUpdate(!isModalOpenForPictureUpdate)} className={isModalOpenForPictureUpdate ? `${style.modalBackdrop}` : ""}></div>
          <div style={{
                background: "red",
            zIndex:"200",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "6px",
            padding: "0 10px",
            boxShadow:"0px 0px 5px 1px rgb(37, 6, 6)"

          }}  >
            <h4 style={{fontSize:"inherit", opacity:"70%"}}>upload picture here</h4>
            <label htmlFor="profilePic">
                  <motion.div
                    variants={buttonAnimation}
                    initial="initial"
                    animate="animate"
                    whileTap="whileTap"
                    style={{
                background: "red",
                zIndex:"100000",
                outline: "2px solid white",
                padding: "5px",
                borderRadius: "6px",
                fontFamily: "mont2",
                fontSize: "smaller",
                fontStyle:"italic"
              }}>
                click to update
              </motion.div>
            </label>
            <input
              id="profilePic"
              style={{ display: "none" }}
              type="file" onChange={(e)=>updateProfilePicsHandler(e)}></input>
          </div>

            </ProfilePicsUploadComponent>
            

          )
        }
        
        {
          isDeleteModalOpen && (
            <ProfilePicsUploadComponent>
              <div className={style.modalBackdrop}></div>
              <div style={{
                outline: "white",
                color: "white",
                zIndex: 200,
                background: "black",
                position: "fixed",
                padding: "10px",
                borderRadius:"10px"
              }}>
                <div >
                  <h3>Are you sure you want to <span style={{color:"red"}}>DELETE</span> this post?</h3>
                  <hr />
                  <br/>
                  <button style={{background:"red", padding:"10px", borderRadius:"10px"}} onClick={()=>handleModalResult(true)}>YES</button><button style={{padding:"10px"}} className={style.btnn} onClick={()=>handleModalResult(false)}>NO</button>
               </div>
              </div>

            </ProfilePicsUploadComponent>
          )
        }
        

        {
          isModalOpen && (
            <ProfilePicsUploadComponent >
              <div onClick={()=>setIsmodalOpen(!isModalOpen)} className={isModalOpen ? `${style.modalBackdrop}` : ""}></div>
          <div className={style.dashboardSideBar}> 
            <div>
                 <Link to={"/experiences"}> <button className={style.btnn}>BACK TO EXPERIENCES</button></Link>
                <Link to={"/"}><button className={style.btnn}>BACK TO HOMEPAGE</button></Link>
            </div>

                  {
                    logStatus ?
                    (<button className={style.logoutButton} onClick={logOut}>LOGOUT</button>)
                  :
                    (<button className={style.logoutButton} onClick={logIn}>LOGIN</button>)
                  } 
          </div>
        </ProfilePicsUploadComponent>
          )
        }
      
        </div>
        </motion.div>
    </>
  );
}
export default UsersDashboard;