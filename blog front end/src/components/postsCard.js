import { useNavigate, Link } from "react-router-dom";

import { useState, useEffect } from "react";
import likeIcon from "../assets/icon/like.png"
import dislikeIcon from "../assets/icon/disliker.png";
import share from "../assets/icon/share.png"
import style from "../styles/postCard.module.css"
import { AccessTokenUseContext } from "../contexts/accessTokenContext";
import { getAccessToken } from "../helpers/checkAuth";
import { apiReFetch } from "../helpers/generalRetrying.helpers";
import { motion } from "motion/react";
import { postCardAnimation, postCardstyle } from "../motions/motion1.motions";
import defaultImage from "../assets/images/default.jpg"

const API_URL = process.env.REACT_APP_BACKEND_URL;





function Card({
  authorUsername,
  topic,
  bio,
  datePublished,
  timePublished,
  likes,
  dislikes,
  picture,
  postId,
  userId,
  IsReactedToFunction,
}) {
  const navigate = useNavigate();
    let [like, setLike] = useState(0);
  let [dislike, setDislike] = useState(0);
  const { accessToken, setAccessToken } = AccessTokenUseContext();
  let [isLiked, setIsliked] = useState(false);

  
  //handler for Sharing
    const submitShare = async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title:topic,
            url:`${window.location.origin}/body/${postId}/${userId}/${likes}/${dislikes}`
          })
       }
      } catch (error) {
          navigate('/error');
      }
  }
  

  //handler for likes
  const submitReaction = async (reaction) => {
    try {
      if (reaction === 'like') {
        const res = await fetch(`${API_URL}/post/submitReactions?like=like&postId=${postId}`, {
          method: "POST",
          
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          credentials:"include"
        });

        if (res.status === 200 || res.ok) {
           const data = await res.json();
          IsReactedToFunction(true);
          setLike(data.data.likes);
          return;
        }

        if (res.status === 401) {
           //const data = await res.json();
          const { newAccessToken, statusCode } = await getAccessToken();
          if (statusCode === 403) {
            const redirectPath = window.location.pathname
            sessionStorage.setItem("redirectPath", redirectPath);
            navigate('/login');
              return;
          }
        //console.log(newAccessToken, "is the new access token")
        if (newAccessToken) {
          setAccessToken(newAccessToken); //we set new access token
          const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${newAccessToken}`, }
          const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/submitReactions?like=like&postId=${postId}`, "post", headers);
          IsReactedToFunction(true);
          //console.log(response, "is the data data");
          setLike(response.data.likes);
          return;
        }
        }
        
        //this part is redundant cos status in this function can never equate to 403
        if (res.status === 403) {
          const redirectPath = window.location.pathname
          sessionStorage.setItem("redirectPath", redirectPath);
          navigate('/login');
        }
        return;
      }

      if (reaction === "dislike") {
         const res = await fetch(`${API_URL}/post/submitReactions?dislike=dislike&postId=${postId}`, {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          credentials:"include"
       });
      
        if (res.status === 200 || res.ok) {
          const data = await res.json();
          //console.log(data.message, "is the data");
          IsReactedToFunction(true);
          setDislike(data.data.dislikes);
          return;
      }
      
        if (res.status === 401) {
          const { newAccessToken, statusCode } = await getAccessToken();
            if (statusCode === 403) {
              const redirectPath = window.location.pathname
              sessionStorage.setItem("redirectPath", redirectPath);
              navigate('/login');
              return;
           }
          if (newAccessToken) {
            setAccessToken(newAccessToken); //we set new access token
            const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${newAccessToken}`, }
            const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/submitReactions?dislike=dislike&postId=${postId}`, "post", headers);
            IsReactedToFunction(true);
            setDislike(response.data.dislikes);
            return;
          }
        }

      //this part is redundant cos status in this function can never equate to 403
      if (res.status === 403) {
          const redirectPath = window.location.pathname
          sessionStorage.setItem("redirectPath", redirectPath);
        navigate('/login');
        return;
        }
      }
    } catch (error) {
      //console.log(error.message);
        navigate('/error');
    }
  }

  //handler to check if user has liked the post so to change the background of the button
  const checkIfLiked = async () => {
    try {
      
    } catch (error) {
      
    }
  }

    useEffect(() => {
      // fetchPost();
      // fetchAuthorsPost();
      // fetchIfFollowing();
      //followAuthor();
      //fetchReaction();
    }, [postId, like, dislike]);
  
    return (
      <>

        <div className={style.mainCardCont}>

        
        <motion.div
          variants={postCardAnimation}
          whileHover="whileHover"
          initial="hidden"
            whileInView="visible"
            viewport={{once:true}}
          className={style.cardContainer}>
          
          <div className={style.imageAndName}>
            <div className={style.authorImageContainer} style={{backgroundImage:`url(${picture || defaultImage})`,  backgroundSize:"contain" }}></div>
            <div className={style.usernameAndIntro}>
              <h3 className={style.authorUsername}>{authorUsername} </h3>
              <small className={style.intro}>{bio}</small>
            </div>
          </div>
          <span className={style.dateTime}>
            <small>{datePublished} |</small> <small>{timePublished}</small>
            </span>
            <Link to={`/body/${postId}/${userId}/${likes}/${dislikes}`}>
          <div className={style.topicContainer}>
            <h1 className={style.topic}>{ topic}</h1>
              </div>
              </Link>
          <div className={style.postImage}></div>
          <div className={style.shareReact}>
            <button onClick={()=>submitReaction('like')} className={style.btn}><small><img src={likeIcon} className="iconImage" /><span className={style.reactionCount}>{likes}</span></small></button> 
            <button onClick={()=>submitReaction('dislike')} className={style.btn}><small><img src={dislikeIcon} className="iconImage" /><span className={style.reactionCount}>{dislikes}</span></small></button>
             <button onClick={submitShare} className={style.btn}><small><img src={share} className="iconImage"/></small></button> 
          </div>
          </motion.div >
          </div>
      </>
    );
}
export default Card;
