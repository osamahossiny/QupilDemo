import { useState } from "react";
import { useUserContext } from "./useUserContext";
export const useLogin = () => {
    const [error,setError] = useState(null)
    const [isLoading,setIsLoading] = useState('')
    const {dispatch} = useUserContext()
    const login = async (email,password) =>{
        setIsLoading(true)
        setError(null)
        let success = false
        await fetch("/api/user/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          }),
          credentials: "include"
        }).then( async (res)=> {
            if (res.ok){
              success = true
              const data = await res.json();
              await dispatch({type:'LOGIN',payload:data})
            }
            else {
              success = false;
              setIsLoading(false);
              const error = await res.json();              
              setError(error.error)
            }
        }).catch((error)=>{
            console.log(error);
            if (error.response && error.response.data && error.response.data.error) setError(error.response.data.error)
            else setError("Server error")
          });
        return success
    }
    return {login, isLoading, error, setError}
}