import {createContext, useContext, useState} from 'react';
const dataRoom = createContext();

function UserInfoContext({children}){
    const [inputs, setInputs] = useState({}); //our data storage
    return(<dataRoom.Provider value={{inputs, setInputs}}>
        {children}
    </dataRoom.Provider>
    )
}

function UseDcontext(){ //our endpoint that allows us access to the dataRoom
    const context = useContext(dataRoom);
    return(
        context
    )
}
export {UserInfoContext, UseDcontext};