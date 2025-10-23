import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import style from "../styles/newPost.module.css";
import Modal1 from "../components/beneathModal";
import { AccessTokenUseContext } from "../contexts/accessTokenContext";
import { getAccessToken } from "../helpers/checkAuth";
import { apiReFetch } from "../helpers/generalRetrying.helpers";
import { motion } from "motion/react";
import { buttonAnimation } from "../motions/motion1.motions";



//component for creating new post

function NewPost() {
  const navigate = useNavigate();
  const [input, setInput] = useState({ title: "", body: "", category: "" });
  const [selectedTag, setSelectedTag] = useState("");
  const [options, setOptions] = useState(['life', 'job', 'sports']);
  const [array, setArray] = useState([]);
  const [newOption, setNewOption] = useState("");
  const { accessToken, setAccessToken } = AccessTokenUseContext();
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
   
  }
  const customTagHandler = (e) => {
    e.preventDefault();
    setSelectedTag(newOption);
    setOptions(prev => ([newOption, ...prev]));
    input.category = selectedTag;
  }

  const formHandler = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const dataObject = Object.fromEntries(formData.entries());
        
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/post/createPost`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(dataObject)
      })

      if (response.status === 401) {
        const { newAccessToken, statusCode } = await getAccessToken();
         if (statusCode === 403) {
            const redirectPath = window.location.pathname
           sessionStorage.setItem("redirectPath", redirectPath);
           sessionStorage.setItem("usersInput", JSON.stringify(dataObject)); //we grab users input before redirected to login page
            navigate('/login');
              return;
          }
        if (newAccessToken) {
          setAccessToken(newAccessToken); //we set new access token
          const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${newAccessToken}`, }
           await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/createPost`, "post", headers, dataObject);
          //console.log(response, "is wether fetching was true")
          navigate("/experiences");
          return;
        }
      }

      // if (response.status === 403) {
      //   const redirectPath = window.location.pathname
      //   sessionStorage.setItem("redirectPath", redirectPath);
      //   navigate("/login");
      //   return;
      // }
      if (response.status === 200) {
        navigate("/experiences"); //your post will be first in the feed
      }
    }catch (error) {
      console.log(error.message, "is the error");
  }
  }
  
  const usersInput = () => {
    try {
      if (sessionStorage.getItem("usersInput")) {
        const usersInputObject = JSON.parse(sessionStorage.getItem("usersInput")); //grab the users input
        console.log(usersInputObject, "is what i got from session storage")
        setInput(usersInputObject);
        sessionStorage.removeItem("usersInput");
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
        
    //this is used to spread every options inside option into array
    useEffect(() => {
      setArray([...options]);
      usersInput();
    }, [options]);

    return (
      <>
        <div className={style.newPostSmall}>
          < small>New Post</small>
        </div>
        <div className={style.formContainer}>
          {/*  this form is for adding new posts*/} 
          <form onSubmit={formHandler}>
            {/*this input is for title of the post  */}
            <input
              required
              className={style.input1}
              placeholder="title"
              onChange={inputHandler}
              value={input.title}
              name="title">
              </input>
              
            <br />

            {/* this text area is for the body of post */}
            <textarea
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              className={style.textarea1}
              placeholder="text"
              onChange={inputHandler}
              value={input.body || " "}
              name="body">
              </textarea>

            <br />

            {/*  this part is for the custom tag creation*/}
            <select
              required
              className={style.select}
              name="category"
              onChange={inputHandler}
              value={input.category || ""}>
              <option value="" disabled>
                
                select category
              </option>
              
              {array.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
              <option value="create Tag">Create Tag</option>
            </select>
            
            {/* if waht was selected is create tag then bring ouot this part */}
            {input.category === "create Tag" && (
              <Modal1 style={style}>
                <input
                  required
                  placeholder="add category here"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  name="custom-category">
                  </input>
                <button className={style.btn} onClick={customTagHandler}> ADD TAG</button>
              </Modal1>
            )}
            <motion.button
              variants={buttonAnimation}
              whileTap="whileTap"
              className={style.btn}>PUBLISH
            </motion.button>
          </form>
        </div>
      </>
    );
}
export default NewPost;