import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import formatDate from "../helpers/dateFormat";

import liker from "../assets/icon/like.png"
import disliker from "../assets/icon/disliker.png";
import share from "../assets/icon/share.png"
import style from "../styles/postPage.module.css"
import style2 from "../styles/postPageStyle2.module.css"
import Modal1 from "../components/beneathModal";
import { LogUseContext } from "../contexts/logStatusContext";
import { AccessTokenUseContext } from "../contexts/accessTokenContext";
import { getAccessToken } from "../helpers/checkAuth";
import defaultImage from "../assets/images/default.jpg"
import { apiReFetch } from "../helpers/generalRetrying.helpers";


const API_URL = process.env.REACT_APP_BACKEND_URL;

function PostPage({image, userName, desc, following, topic, body}){

  const navigate = useNavigate();
  const [isModalOpen, setIsmodalOpen] = useState(false);
  const [fetchedPost, setFetchedPost] = useState({});
  const [authorPosts, setAuthorPosts] = useState([]) //to grab more posts from author
  const { postId, userId } = useParams(); //grab post id from route
   const [profileAvatar, setProfileAvatar] = useState(null)
  let [like, setLike] = useState(0);
  let [dislike, setDislike] = useState(0);
  let [isFollowing, setIsFollowing] = useState(false);;
  
  //useContexts
  const { logStatus, setLogStatus, userIdFromContext } = LogUseContext(); //this from context api
  const { accessToken, setAccessToken } = AccessTokenUseContext();

  //this function grabs a post on component mount
  const fetchPost = async () => {
    let res = await fetch(`${API_URL}/post/getPost?postId=${postId}`) //make get request
    //console.log(res.status, "is whether this is okay or not")
    if (res.status === 200 || res.ok) {
      const data = await res.json()
      setFetchedPost(data.data);
      setLike(data.data?.likes);
      setDislike(data.data?.dislikes);
    }
    else {
      navigate('/error');
    }
  }
  
  //this is used to turn on the modal on
  const modify = () => {
    setIsmodalOpen(!isModalOpen);
    setTimeout(() => {
      setIsmodalOpen(true);
    }, 1000);
  }

  //fetch authors post
  const fetchAuthorsPost = async () => {
    //console.log(userId, "is the userId")
    try {
      let res = await fetch(`${API_URL}/post/allPosts?id=${userId || "undefined"}`);
      if (res.status === 200 || res.ok) {
        const data = await res.json()
        //console.log(data.Posts, "is the data");
        setAuthorPosts(data.Posts);
         setProfileAvatar(`${API_URL}${data.Posts[0]?.user.profilePics}`);
      }
    } catch (error) {
        //console.log("error here at fetchAuthorsPost");
        //console.log(error.message)
        navigate('/error');
    }
  }

  // //fetch reactions
  // const fetchReaction = async () => {
  //   try {
  //      let res = await fetch(`${API_URL}/post/fetchReactions?postId=${postId}`);
  //       if (res.status === 200 || res.ok) {
  //         const data = await res.json();
  //         //console.log(data.reactions.likes, "is the data for fetching reaction");
  //         return;
  //         setLike(data.reactions.likes);
  //         setDislike(data.reactions.dislike);
  //       }
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  //handler for likes
  const submitLike = async (reaction) => {
    try {
      if (reaction === 'like') {
        const res = await fetch(`${API_URL}/post/submitReactions?like=like&postId=${postId}`, {
          method:"POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type":"application/json"
          },
          credentials:"include"
        });
        //console.log(res.status, "is the response at submit like")
        if (res.status === 200 || res.ok) {
          const data = await res.json();
          //console.log(data.message, "is the data");
            setLike(data.data.likes);
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
                const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/submitReactions?like=like&postId=${postId}`, "post", headers);
                if (response.status) {
                  navigate('/error');
                }
                setLike(response.data.likes);
                return;
              }
        }
        return;
      }
       const res = await fetch(`${API_URL}/post/submitReactions?dislike=dislike&postId=${postId}`, {
          method:"POST",
         headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type":"application/json"
          },
          credentials:"include"
        });
        if (res.status === 200 || res.ok) {
          const data = await res.json();
          console.log(data.message, "is the data");
            setDislike(data.data.dislikes);
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
                const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/submitReactions?like=like&postId=${postId}`, "post", headers);
                if (response.status) {
                  navigate('/error');
                }
                setLike(response.data.likes);
                return;
              }
        }
    } catch (error) {
      console.log(error.message);
        navigate('/error');
    }
  }

  //   //handler for dislikes
  // const submitDislike = async () => {
  //   try {
  //     const res = await fetch(`${API_URL}/post/submitReactions?dislike=dislike}`);
  //     if (res.status === 200 || res.ok) {
  //         const data = await res.json()
  //         //console.log(data.Posts, "is the data");
  //         setDislike(like+1);
  //       }
  //   } catch (error) {
  //        //console.log(error.message)
  //       navigate('/error');
  //   }
  // }

     //handler for Sharing
  const submitShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: fetchedPost.title,
          url:window.location.href
        })
     }
    } catch (error) {
         //console.log(error.message)
        navigate('/error');
    }
  }

  //handler for following an author
  const followAuthor = async() => {
    try {
      const res = await fetch(`${API_URL}/post/followAuthor?authorId=${userId}`, {
        method: "post",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type":"application/json"
        },
        credentials:"include"
      })
      if (res.ok || res.status === 200) {
        const data = await res.json();
        console.log(data);
        setIsFollowing(data.isFollowing);
        return;
      }
      if (res.status === 401) {
        const redirectPath = window.location.pathname
        sessionStorage.setItem("redirectPath", redirectPath);
        navigate('/login');
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
        console.log(data);
        setIsFollowing(data.isFollowing);
      }
      if (res.status === 401) {
                  const { newAccessToken, statusCode } = await getAccessToken();
                   if (statusCode === 403) { //meaning theres no refresh token
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
        setIsFollowing(false);
      }
    } catch (error) {
      navigate('/experiences');
      console.log("something went wrong, reload");
    }
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


  useEffect(() => {
    fetchPost();
    fetchAuthorsPost();
    fetchIfFollowing();
    //followAuthor();
    //fetchReaction();
  }, [postId, like, dislike]);
return (
  <>
    <div className={style.mainContainer}>
      <div className={style.imageAndName}>
        <div className={style.imageAndNameCont} >
      
          <div className={style.imageAndNameinner}>
            <div className={style.authorImageContainer} style={{overflow:"hidden", objectFit:"cover",  backgroundImage:`url(${profileAvatar || defaultImage})`,  backgroundSize:"contain"}} ></div>
              <Link to={`/myDashboard/${userId}`}>
                <div className={style.usernameAndIntro}>
                  <h3 className={style.authorUsername}>{fetchedPost.user?.username  || "USER"} </h3>
                  <small className={style.intro}>{fetchedPost.user?.bio || "the great great user user"}</small>
                </div>
              </Link>
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
          className={style.hamburger}>
          
          <div className={style.hamburgerLine1}></div>
          <div className={style.hamburgerLine2}></div>
          <div className={style.hamburgerLine3}></div>
        </div>
      </div>
    </div>
    <div className={style.bodyContainer}>
      <h1 className={style.headline}>{fetchedPost.title}</h1>
      <hr className={style.postPageHr} />

      <p className={style.postBody}>
        {fetchedPost?.body || "fetching post..."}
      </p>

    </div>

    <div className={style.reactionContainer}>
      <button onClick={()=>submitLike('like')}><img src={liker} className="iconImage" /><span className={style.reactionCount}>{like || "0"}</span></button>
      <button onClick={()=>submitLike('dislike')}><img src={disliker} className="iconImage" /><span className={style.reactionCount}>{dislike || "0"}</span></button>
      <button onClick={submitShare}><img src={share} className="iconImage"/></button>
    </div>

    {isModalOpen && (
      <Modal1 style={style2}>
        <h1 className={style2.sideBarMore}>MORE FROM AUTHOR</h1>
        <hr className={style2.sideBarhr} />
        <div className={style2.sideBarContentsContainer}>
          {" "}
          {
            authorPosts.map((post, index) => {
               let date = formatDate(`${post.updatedAt}`);
              return(
                  <div key={index}>
                  <Link to={`/body/${post._id}/${post.user._id}/${post.likes}/${post.dislikes}`} onClick={modify}><p  className={style2.sideBarContents}>{post.title} <br></br> <span className={style2.modalDate}>{date}</span></p></Link>
                  </div>
                   )
              })
          }
        </div>

        <div className={style2.sideBarAuthorContainer}>
          <div className={style2.logButtonContainer}>
                    {
                      logStatus ?
                      (<button className={style2.logoutButton} onClick={logOut}>LOGOUT</button>)
                    :
                      (<button className={style2.logoutButton} onClick={logIn}>LOGIN</button>)
                    } 
          </div>
          <div className={style2.sideBarAuthorBlock}>
            <div className={style.imageAndNameinner}>
              <div className={style.authorImageContainer} style={{overflow:"hidden", objectFit:"cover",  backgroundImage:`url(${profileAvatar || defaultImage})`,  backgroundSize:"contain"}}></div>
                <Link to={`/myDashboard/${userId}`}>
                  <div className={style.usernameAndIntro}>
                    <h3 className={style.authorUsername}>{fetchedPost.user.username || "USER"} </h3>
                    <small className={style.intro}>
                      {fetchedPost.user.bio || "the great user"}
                    </small>
                  </div>
                </Link>
            </div>
          </div>
        </div>
      </Modal1>
    )}
  </>
);
}
export default PostPage;