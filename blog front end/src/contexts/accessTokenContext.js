import { createContext, useContext, useState } from "react";

const accessTokenContext = createContext();


function AccessTokenContext({ children }) {
    const [accessToken, setAccessToken] = useState(null);

    return (
        <accessTokenContext.Provider value={{accessToken, setAccessToken}}>
            {children}
        </accessTokenContext.Provider>
    )
}

function AccessTokenUseContext() {
    const initialAccessTokenContext = useContext(accessTokenContext);
    return initialAccessTokenContext;
}

export { AccessTokenContext, AccessTokenUseContext };
