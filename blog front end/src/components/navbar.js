import { Link } from "react-router-dom";

function Navbar(){
    return(
        <div>
            <nav>
               <Link to="/profile"><button>PROFILE CARD</button></Link>
            </nav>
        </div>
    )
}
export default Navbar;