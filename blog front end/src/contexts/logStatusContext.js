import { createContext, useState, useEffect, useContext } from "react";
const API_URL = process.env.REACT_APP_BACKEND_URL;
const context = createContext();


//log context api for managing log status
function LogContext({ children }) {

    const [logStatus, setLogStatus] = useState(null);
    const [userIdFromContext, setUserIdFromContext] = useState(null);

    //checks for log status
    const logStatusChecking = async () => {
    const response = await fetch(`${API_URL}/logStatus`, { //we pass userId so the backend checks if logged user is the owner of the dashboard
            method: "post",
            credentials: "include"
        });
        let data = await response.json();
    //console.log(data, "is the data from log context");
        return {isLoggedIn: data.message, userId:data.userId};
    }
    

    useEffect(() => {
        const checkingLoginStatusOnMount = async () => {
          let result = await logStatusChecking();
            setLogStatus(result.isLoggedIn);
            setUserIdFromContext(result.userId);
        }
    
        checkingLoginStatusOnMount(); //checking log status 
    }, [logStatus, userIdFromContext])
    
    //jsx returned
    return (
        <context.Provider value={{logStatus, setLogStatus,  userIdFromContext}}>
            {children}
        </context.Provider>
    )
}

const LogUseContext = () => {
    try {
        const  initializedLogContext = useContext(context);
        return initializedLogContext;
    } catch (error) {
        console.log(error.message);
    }
}

export { LogContext, LogUseContext };