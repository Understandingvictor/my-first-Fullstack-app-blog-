//import style from "../styles/beneathModal.module.css";
import arrowUp from "../assets/icon/up.png";
import arrowDown from "../assets/icon/down.png";
import ModalCloseButton from "./modalCloseButton";
import filter from "../assets/icon/filter.svg";
// / <div className={style.modalBackdrop}></div>

import { useState, useEffect } from "react";

function Modal1({children, style, toggle}){
  const [isModalOpen, setIsModalOpen] = useState(true);

     useEffect(() => {
     setIsModalOpen(!isModalOpen); // ✅ runs once after mount
  }, [toggle]);
  
    return (
      <>
        <div onClick={()=>setIsModalOpen(!isModalOpen)} className={isModalOpen ? `${style.modalBackdrop}` : ""}></div>
          <div
            className={`${style.modalContainer} ${
              isModalOpen ? style.active : style.inactive
               }`}>
            <ModalCloseButton
              text={
                isModalOpen ? (
                  <img src={arrowDown} width={"20px"} />
                ) : (
                  <img src={arrowUp} width={"20px"} />
                )
              }
              className={style.closeModal}
              handler={() => {
                setIsModalOpen(!isModalOpen);
              }}
          />
          



          {children}
          

          
          </div>
      </>
    );
}

export default Modal1;