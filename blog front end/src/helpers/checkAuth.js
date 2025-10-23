
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;


function Navigation(url){
    const navigate = useNavigate();
    navigate(url);
}
//get access token
const getAccessToken = async () => {
    try {
        const res = await fetch(`${API_URL}/gettingNewToken`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        console.log(res.status, "is the status")
        if (res.status === 200) {
            const newAccessTokenObject = await res.json();
            //console.log(newAccessTokenObject, "is received from getAccesstoken helper")
            return newAccessTokenObject;
        }
        if (res.status === 403) {
            // const redirectPath = window.location.pathname
            // sessionStorage.setItem("redirectPath", redirectPath);
            return {statusCode:403};
        }
    } catch (error) {
        console.log(error.message, "ios the error from get access token")
        return {error:error.message}
    }
}
export{getAccessToken};