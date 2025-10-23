import style from "../styles/homepage.module.css"
import { Link } from "react-router-dom";
function ErrorPage() {
    return (
        <>
            <h1>Something went wrong</h1>
            <Link to={"/experiences"}><button style={{background:"linear-gradient(45deg, black, red)", border:"none", color:"white", padding:"10px", fontFamily:"mont1"}} >HEAD BACK TO PEOPLE EXPERIENCES</button></Link>
            <hr></hr>
            <p>might grab some knowledge</p>
        </>
    )
}
export default ErrorPage;