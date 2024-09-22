import { useState } from "react";
import { useUserContext } from "./useUserContext";
export const useRegister = () => {
    const [isLoading,setIsLoading] = useState('')
    const {dispatch} = useUserContext()
    const register = async (email,password,username) =>{
        setIsLoading(true)
        let success = await fetch(
            "/api/user/register",
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                username,
                password
              }),
              credentials: "include"
            }
            
          ).then( async (res)=> {
            let data = res.json()
            await dispatch({type:'LOGIN',payload:data})
            return {message:'success'}
        }).catch((error)=>{
            let data = error.json()
            return {error:data.error};
          });
        return success
    }
    return {register, isLoading}
}