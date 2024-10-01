import { Outlet, useNavigate } from "react-router-dom";
import { userHook } from "../hooks/userHook"
import { useEffect } from "react";

const ProtectedRoute = ({ bypassRole, }) => {
    const { userInfo } = userHook();
    const navigate = useNavigate();

    useEffect(() => {
        if(userInfo.role != bypassRole){
            console.log("Usuario no permitido")
            navigate("/404");
            return
        }
    }, [])

    return(
        <Outlet/> 
    )
}

export default ProtectedRoute;