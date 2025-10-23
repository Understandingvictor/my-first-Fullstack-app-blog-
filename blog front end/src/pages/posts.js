import { Link, useNavigate } from "react-router-dom";
import Card from "../components/postsCard";
import style1 from "../styles/makePostButton.module.css";
import style from "../styles/posts.module.css";
import ShareYours from "../components/makePostButton";
import { useEffect, useState } from "react";
import formatDate from "../helpers/dateFormat";

import Filter from "./filter";
const API_URL = process.env.REACT_APP_BACKEND_URL;


function Posts() {
  const [isReactedTo, setIsREactedTo] = useState(false);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  let [skip, setSkip] = useState(0);
  const [limit] = useState(14);
  const [pages, setPages] = useState(1);
  const [pagesLeft, setPagesLeft] = useState(1);
  const [currentPage, setCurrentPage] = useState(1); 

  //this is a function we call to apply filtering
  const applyFiltering = async(choosedDate, choosedEndDate, choosedCategory) => {
    try {
      
      const date = choosedDate ? new Date(choosedDate).toISOString().split("T")[0] : ""; 
      const res = await fetch(`${API_URL}/post/allPosts?date=${date}&endDate=${choosedEndDate}&category=${choosedCategory}`);
      const data = await res.json();
        if (!res.ok) {
          navigate("/error");
          return;
      }
      setPosts(data.Posts); //we fetch from back end and set it to state
      return;
    } catch (error) {
      throw error;
    }
  }

    //handler that accepts trigger sent by component
    const isReactedToHandler = () => {
      try {
        setIsREactedTo(!isReactedTo);
      } catch (error) {
        navigate('/error');
      }
  }
  

  //this function is for fetching post on component mount
      const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/post/allPosts?limit=${limit}&skip=${skip}&page=${currentPage}`); 
        //console.log(currentPage, "is the current page from front end");
        const data = await res.json();
        if (!res.ok) {
          //console.log("error here at fetch post on posts page")
          navigate("/error");
          return;
        }
        //response format {Posts: posts, message:`posts are ${posts.length} in number`}
        setPosts(data.Posts); //we fetch from back end and set it to state
        setPages(data.Pages);
        setPagesLeft(data.pagesLeft);
        setCurrentPage(data.currentPage);
      } catch (error) {
        navigate("/error");
      }
  }
  const scrollToTheTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  const nextPage = () => {
    try {
      setSkip(skip += limit);
      setCurrentPage(currentPage + 1);
      scrollToTheTop();
      //setPagesLeft(pages-= 1);
      
      return;
    } catch (error) {
      
    }
  }
  const previousPage = () => {
    try {
      
      setSkip(skip -= limit);
      setCurrentPage(currentPage - 1);
      scrollToTheTop();
      return;
    } catch (error) {
      
    }
  }

  //track the screen width to determine the numnber of posts to display to the front End
  const trackScreenWidth = () => {
    let width = window.innerWidth;
    if (width > 768) {

    }
    else {

    }
  //console.log(width, 'is the screen width')
  }

  useEffect(() => {
    fetchPosts();
    trackScreenWidth();
    // eslint-disable-next-line
  }, [isReactedTo, currentPage]);
  
  return (
    <>
      <h1>WITHOUT SHARING YOUR LIFE EXPERIENCES, OTHERS WONT LEARN</h1>
      <Link to={"/newPost"}>
        <ShareYours
          text={"SHARE YOURS"}
          className={`${style1.postsShareButton}`}
        />
      </Link>
      <center >
              <div style={{
        display: "flex",
        padding: "5px",

      }}>
        <p> PAGE {currentPage} of {pages}</p>
        
      </div>
        {
          posts.length === 0 ? (
            <p style={{fontStyle:"italic", marginTop:"30vh"}}>no posts available pls try another filter</p>
          ):(
        <div className={style.cardContainerr}>
        {
          posts.map((eachPost, index) => {
            let picsUrl; 
            let date = formatDate(`${eachPost.updatedAt}`);
            if (eachPost.user.profilePics) {
              picsUrl = `${API_URL}${eachPost.user.profilePics}`
            }
            else {
               picsUrl = undefined
            }
            //let picsUrl = eachPost.user.profilePics
            //console.log(eachPost);
            return (
              <>
                <Card key={index}
                  authorUsername={<Link to={`/myDashboard/${eachPost.user._id}`}>{eachPost.user.username}</Link>}
                  topic={eachPost.title}
                  datePublished={date}
                  bio={eachPost.user.bio}
                  picture={picsUrl}
                  likes={eachPost.likes}
                  dislikes={eachPost.dislikes}
                  userId={eachPost.user._id}
                  postId={eachPost._id}
                  IsReactedToFunction={isReactedToHandler}
                /> 

                
            </>)
          })
        }
        
        </div>
          )
        }
      
      </center>

      <div style={{
        display: "flex",
        position: "fixed",
        bottom:"30px"
      }}>
         {
        currentPage !== 1 && (
          <button onClick={previousPage} className={style.btnn} >previousPage</button>
        )
      }
      {
        pagesLeft !== 0 && posts.length !== 0  && (
          <button onClick={nextPage} className={style.btnn}>nextPage</button>
        )

      }
      </div>
     



      <Filter applyFilters={applyFiltering}/>
    </>
  );
}
export default Posts;
