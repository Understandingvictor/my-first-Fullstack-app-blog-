import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom";
import style from "../styles/newPost.module.css";
import Modal1 from "../components/beneathModal";
import { AccessTokenUseContext } from "../contexts/accessTokenContext";
import { getAccessToken } from "../helpers/checkAuth";
import { apiReFetch } from "../helpers/generalRetrying.helpers";
const API_URL = process.env.REACT_APP_BACKEND_URL;

function EditPost() {
    const navigate = useNavigate();
    const [input, setInput] = useState({ title: "", body: "", category: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState("");
    const [options, setOptions] = useState(['life', 'job', 'sports']);
    const [array, setArray] = useState([]);
    const [newOption, setNewOption] = useState("");
    const { postId } = useParams(); //grab post id from route
    const textareaRef = useRef(null);
  const { accessToken, setAccessToken } = AccessTokenUseContext();
  
    //this function grabs a post on component mount
  const fetchPost = async () => {
    let res = await fetch(`${API_URL}/post/getPost?postId=${postId}`) //make get request
    //console.log(res.status, "is whether this is okay or not")
    if (res.status === 200 || res.ok) {
      const data = await res.json()
       setInput(prev=>({ ...prev, title:data.data.title, body:data.data.body, category:data.data.category}));
    }
    else {
      navigate('/error');
    }
  }

    const inputHandler=(e)=>{
        const {name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
  }
  

    const customTagHandler = (e)=>{
        e.preventDefault();
        setSelectedTag(newOption);
        setOptions(prev=>([newOption, ...prev]));
        input.category = selectedTag;
    }

    const formHandler = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
      const dataObject = Object.fromEntries(formData.entries());
      
      //request to edit backend
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/updatePost?postId=${postId}`, {
                                    method:"put",
                                    headers: {
                                      "Content-Type": "application/json",
                                      "Authorization": `Bearer ${accessToken}`,
                                        },
                                        
                                    credentials: "include",
                                    body: JSON.stringify(dataObject)
        })
      
          if (response.status === 401) { 
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
          const response = await apiReFetch(`${process.env.REACT_APP_BACKEND_URL}/post/createPost`, "post", headers, dataObject);
          //console.log(response, "is wether fetching was true")
          navigate("/experiences");
          return;
        }
      }
      // if (response.status === 403) {
      //   const redirectPath = window.location.pathname
      //   sessionStorage.setItem("redirectPath", redirectPath);
      //       navigate("/login");
      //       return;
      // }
      if (response.status === 200) {
        navigate("/experiences"); //your post will be first in the feed
      }

    }
    //this is used to spread every options inside option into array
    useEffect(() => {
      setArray([...options]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // reset height
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
     }
    }, [options,  input.body] );
  
    useEffect(() => {
      fetchPost();
    },[]);

    return (
      <>
        <div className={style.newPostSmall}>
          <small>Edit Post</small>
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
               ref={textareaRef}
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
            <button className={style.btn}>PUBLISH</button>
          </form>
        </div>
      </>
    );
}
export default EditPost;