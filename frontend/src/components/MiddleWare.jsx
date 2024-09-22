import { useEffect } from "react";
import { useUserContext } from "../hooks/useUserContext";
import Loading from "./Loading";
import { Outlet, Navigate } from "react-router-dom";

const MiddleWare = ({type}) => {
    const { user } = useUserContext()

    if(!user) return(<Loading/>)
    // else if(user.type == 'admin' && type !== "amdin"){
    //     return (<Navigate to="/admin" />)
    // }
    // else if(user.type == 'user' && type !== "user"){
    //     return (<Navigate to="/user" />)
    // }
    if (user && user.type && (type == "Login" || type == "Guest") ) {
        return (<Navigate to="/home" />)
    }
    else if(!user.type && type === "Login"){
        return (<Navigate to="/login" />)
    }
    else return(<Outlet/>)
}
export default MiddleWare