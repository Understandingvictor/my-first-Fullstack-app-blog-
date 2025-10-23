// const apiFetch = (url, options = {}, retry = true)=> {
//   // include Authorization header
//   const headers = {
//     ...(options.headers || {}),
//     Authorization: accessToken ? `Bearer ${accessToken}` : "",
//     "Content-Type": "application/json",
//     };

const API_URL = process.env.REACT_APP_BACKEND_URL;
    
    const apiReFetch = async(url, method, headers, dataObject ) => {
    try {
        const res = await fetch(url,{
            method: method,
            headers: { ...headers || {} },
            credentials: 'include',
             body: JSON.stringify(dataObject || {})
        })
        if (res.status === 200) {
            //console.log(await res.json(), "is response from apiRefetch")
            const data = await res.json()
            return data;
        }
        return { status: "error" };
    } catch (error) {
        console.log(error.message);
        console.log("i am in api reefetvh")
        return error;
    }
}
export {apiReFetch}