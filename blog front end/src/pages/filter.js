import { Link } from "react-router-dom";
import Modal1 from "../components/beneathModal";
import style2 from "../styles/beneathModal.module.css";
import ModalButton from "../components/modalButton";
import style1 from "../styles/modalButton.module.css"
import style from "../styles/filter.module.css";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css"; 
import { LogUseContext } from "../contexts/logStatusContext";

import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_BACKEND_URL;





function Filter({ applyFilters}){
  const [date, setDate] = useState(new Date()); // State for selected date
  const [endDate, setEndDate] = useState(new Date()); // State for selected date
  const [input, setInput] = useState({})
  const [category, setCategory] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();
  const { logStatus, userIdFromContext, setLogStatus } = LogUseContext(); //this from context api
  const [isModalOpen, setIsModalOpen] = useState(true);

  
   
  
  
  //this logout is used for logging out 
  const logOut = async () => {
    const response = await fetch(`${API_URL}/logout`, {
      method: "post",
      credentials:"include"
    });
    
    if (response.status === 200) {
      const data = await response.json()
      setLogStatus(null); //clear context
      sessionStorage.clear(); //clear session
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


  //handles category selection when you want to filter in the modal
  const categoryHandler = (e) => {
    setInput(prev => ({  ...prev, category: e.target.value }));
  };

  //a handler that runs when find button is clicked on the modal at posts page
  const filterNow = () => {
    setIsModalOpen(!isModalOpen); //used to control the modal
      const dateToIso = new Date(date);
      const endDateToIso = new Date(endDate);
     applyFilters(dateToIso, endDateToIso, input.category); //calling a function to filter according to our selection
  }


//entry into jsx
  return (
    <>
      <Modal1 style={style2} toggle={isModalOpen}>
        <div>
          <div className={style.visitDahboardButtonContainer}>
            {
              logStatus && (
                 <Link to={`/myDashboard/${userIdFromContext}`} ><ModalButton text={"DASHBOARD"} onClick={filterNow} className={style.visitDahboardButton} /></Link>
              )
            }
           
          </div>
          
   <hr></hr>
          <div className={style.mainContainerDateTime}>
            <div className={style.containerDateTime}>
           
            <div>
              <small className={style.startEndDateText}>start date</small>
              <label htmlFor="startDate"></label>
            
            <Flatpickr
              id="startDate"
              value={endDate}
              onChange={([newDate]) => setDate(newDate)} // Update state on change
              options={{
                dateFormat: "Y-m-d", // Customize date format
                 
              }}
              disabled={isDisabled}
            />
            </div>
            
            <div id="endDatecontainer">
              <small className={style.startEndDateText}>end date</small>
              <label htmlFor="endDate"></label>
            <Flatpickr
              id="endDate"
              value={date}
              onChange={([newDate]) => setEndDate(newDate)} // Update state on change
              options={{
                dateFormat: "Y-m-d", // Customize date format
              }}
              disabled={isDisabled}
            />
            </div>
            
          </div>
          <div className={style.category}>
            <h1 style={{color:"white"}}>CATEGORY</h1>
            <div>
              <select
                  required
                  className={style.taskInputSelect}
                  name="category"
                  onChange={categoryHandler}
                  value={input.category || ""}
                >
                <option value="" disabled>
                  select category
                </option>
                <option value="all">all</option>
                <option value="life">life</option>
                <option value="job">job</option>
                  <option value="sports">sports</option>
                  <option value="tech">sports</option>
                  <option value="family">sports</option>
                  <option value="friendship">sports</option>
              </select>
            </div>
          </div>
              <ModalButton text={"FIND"} onClick={filterNow} className={style1.modalButton} />
          </div>
          
        
            <hr></hr>
          {
            
            logStatus ?
              
            (<button className={style1.logoutButton} onClick={logOut}>LOGOUT</button>)
          :
            (<button className={style1.logoutButton} onClick={logIn}>LOGIN</button>)
          } 
        </div>
      </Modal1 >
    </>
  );
}
export default Filter;