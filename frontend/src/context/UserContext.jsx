import { createContext, useReducer, useState } from "react";
export const UserContext = createContext()

export const userReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'RESTORE':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: {username:'',type:''} }
        default:
            return state
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, { user: null })
    const [loading, setLoading] = useState(false)
    if(!state.user){
        fetch('/api/user/restore',{method:'GET',credentials:"include"}).then((res)=>{
                if (res.ok){
                    res.json().then((data)=>{
                        dispatch({type:'RESTORE',payload: data})
                        setLoading(false)
                    })
                }
                else {
                    setLoading(false)
                    dispatch({type:'RESTORE',payload:{username:'',type:''}})
                }
            }).catch((error)=>{
                setLoading(false)
                dispatch({type:'RESTORE',payload:{username:'',type:''}})
            })
    }
    return (
        <UserContext.Provider value={{ ...state, dispatch, loading }}>
            {children}
        </UserContext.Provider>
    )
}
