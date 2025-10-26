import style from "../styles/form.module.css"
import { motion } from "motion/react";
import { postCardAnimation } from "../motions/motion1.motions";


function Form() {
    return (
        <>
            <motion.div
                          variants={postCardAnimation}
                          whileHover="whileHover"
                          initial="hidden"
                            whileInView="visible"
                            viewport={{once:true}}
                className={style.formContainer}>
                <p>GOT ANYTHINHG TO SHARE?</p>
                <div className={style.formInnerContainer}>
                    <form className={style.form}>
                    <input placeholder="e.g Victor" className={ style.name}></input>
                    <input placeholder="myemailaddress@gmail.com" className={ style.email}></input>
                        <textarea placeholder="express your self" className={style.experienceTextarea} ></textarea>
                        <button className={style.btnn}>SUBMIT</button>
                    </form>
                </div>
            </motion.div>
        </>
    )
}
export default Form;