import { Link, useNavigate } from "react-router-dom";
import Card from "../components/postsCard";
import style from "../styles/homepage.module.css"
import papa from "../assets/images/smiling.jpg"
import Myslider from "../components/slider";
import { useState, useEffect } from "react";
import formatDate from "../helpers/dateFormat";
import { LogUseContext } from "../contexts/logStatusContext";
import { motion } from "motion/react";
import { buttonAnimation, postCardAnimation } from "../motions/motion1.motions";
import quote from "../assets/images/quote.jpg"
import ShinyText from "../components/shinyText";
import Form from "../components/form";

const API_URL = process.env.REACT_APP_BACKEND_URL;


function Homepage() {
  
  const [profileAvatar, setProfileAvatar] = useState(null)
 
  const [isModalOpen, setIsmodalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isReactedTo, setIsREactedTo] = useState(false);
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(null);
   const { logStatus, setLogStatus, userIdFromContext} = LogUseContext(); //this from context api

  const isReactedToHandler = () => {
    try {
      setIsREactedTo(!isReactedTo);
    } catch (error) {
      navigate('/error');
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
  const checkScreenWidth = () => {
    setScreenWidth(window.innerWidth)
}


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/post/allPosts?requestfromHomepage=${true}`);
        const data = await res.json();
        if (!res.ok) {
          console.log("error here at fetch post on posts page")
          navigate("/error");
          return;
        }
        //response format {Posts: posts, message:`posts are ${posts.length} in number`}
        setPosts(data.Posts); //we fetch from back end and set it to state
      } catch (error) {
        navigate("/error");
      }
  
    }
    checkScreenWidth();
    fetchPosts();
  }, [isReactedTo, screenWidth]);
    
  return (
    <>
      <div
        onClick={() => setIsmodalOpen(!isModalOpen)}
        className={style.hamburger}
        >
        <div className={style.hamburgerLine1}></div>
        <div className={style.hamburgerLine2}></div>
        <div className={style.hamburgerLine3}></div>
      </div>
      <navbar className={style.nav}>
        <div onClick={()=>setIsmodalOpen(!isModalOpen)} className={isModalOpen ? `${style.modalBackdrop}` : ""}></div>
        <ul className={`${style.navList} ${isModalOpen ? style.active : ""}`}>
          <li>
            <Link to={"/experiences"}>
              <motion.button
                variants={buttonAnimation}
                whileTap="whileTap"
                animate="animate"
                className={style.btn}>EXPERIENCES</motion.button>
            </Link> 
          </li>
          <li>
            <button className={style.btn}>CONTACT</button>
          </li>
          <li>
            {
              screenWidth < 1024 && (
                 logStatus ?
                    (< motion.button 
                      variants={buttonAnimation}
                      whileTap="whileTap"
                      className={style.logoutButton} 
                      onClick={logOut}>LOGOUT
                    </ motion.button>)
                  :
                    (< motion.button 
                      variants={buttonAnimation}
                      whileTap="whileTap" 
                      className={style.logoutButton} 
                      onClick={logIn}>LOGIN
                      </motion.button>)
              )
            }

          </li>

        </ul>
        <Link to={"/newPost"}><motion.button
                      variants={buttonAnimation}
                      whileTap="whileTap" 
                      animate="animate"
                      className={style.btnFirst}>SHARE EXPERIENCES
                      </motion.button>
        </Link>
      </navbar>

      <div className={style.sliderContainer}>

        <center>
         
         
  
<ShinyText 
  text="WELCOME TO ECHOES OF EXPERIENCE" 
  disabled={false} 
  speed={3} 
  className={style.welcome}
/>
              
          <Myslider />
          <div className={style.tagline}>
            <small>
              YOU SILENCE COULD BE SOMEONES{" "}
              <span className={style.downFall}>DOWNFALL</span>
            </small>
          </div>
          <Link to={"/newPost"}>< motion.button 
                      variants={buttonAnimation}
                      animate="animate"
                      whileTap="whileTap" 
                      className={style.btnn}>SHARE EXPERIENCE
                      </motion.button>
          </Link>
        </center>
      </div>
      <div className={style.pictureAndTestimony}>
        <div className={style.picture}>
          <img className={style.testimonyPicture} src={papa} />
        </div>
        <div className={style.testimony}>
          <h1 className={style.testify}>
              Every story we carry has a voice — an echo that reminds us where we’ve been and how far we’ve come. When we share our experiences, we don’t just tell stories; we release pieces of ourselves that can heal, teach, and inspire.

              Sharing helps us make sense of our own journey. It brings clarity, peace, and sometimes, closure. But beyond that, it touches someone else — someone who might be silently walking the same path. Our words can remind them that they’re not alone, that hope is real, and that growth often begins in pain.

              Every experience, whether good or bad, has value. When we share it, it becomes more than a memory — it becomes light for someone else’s path.
          </h1>
        </div>
      </div>
      <fieldset>
        <legend className={style.fieldset}>
          <ShinyText 
            text="EXPERIENCES" 
            disabled={false} 
            speed={3} 
            className={style.feature}
          />
        </legend>
        <div className={style.sectionContainer}>
          <motion.div
                      variants={postCardAnimation}
                      whileHover="whileHover"
                      initial="hidden"
                        whileInView="visible"
                        viewport={{once:true}}
            className={style.imageContainer}><img src={quote} className={style.quote} />
          </motion.div>
            <div className={style.cardContainerr}>
              <div className={style.innerContainer}>
                    {
                      posts.map((eachPost, index) => {
                        let date = formatDate(`${eachPost.updatedAt}`);
                        return (
                          <>
                            <Card key={index}
                              authorUsername={<Link to={`/myDashboard/${eachPost.user._id}`}>{eachPost.user.username}</Link>}
                              topic={<Link to={`/body/${eachPost._id}/${eachPost.user._id}/${eachPost.likes}/${eachPost.dislikes}`}>{eachPost.title}</Link>}
                              datePublished={date}
                              bio={eachPost.user.bio}
                              picture={`${API_URL}${eachPost.user.profilePics}`}
                              userId={eachPost.user._id}
                              postId={eachPost._id}
                              likes={eachPost.likes}
                              dislikes={eachPost.dislikes}
                              IsReactedToFunction={isReactedToHandler}
                            />
                        </>)
                      })
                    }
              </div>
          </div>
          <Form/>
        </div>

        <Link to={"/experiences"}>< motion.button 
                      animate="animate"
                      variants={buttonAnimation}
                      whileTap="whileTap" 
                      className={style.viewMorebtn}>MORE EXPERIENCES
                      </motion.button></Link>
      </fieldset>
      <div className={style.ctaContainer}>
        <center>
          <div className={style.cta}>
            <h3 className={style.ctah3}>
              <span className={style.downFall}>YOUR SILENCE</span>could be
              someone making a mistake, SPEAK - your story might save them
            </h3>
            <div className={style.bottomm}>
              <Link to={"/newPost"}>
              < motion.button 
                      variants={buttonAnimation}
                      whileTap="whileTap"
                      animate="animate"
                      className={style.btnn}>SHARE EXPERIENCE
              </motion.button>
            </Link>
            </div>
            
          </div>
        </center>
      </div>
    </>
  );
}
export default Homepage;