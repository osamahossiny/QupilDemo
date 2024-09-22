import { useUserContext } from "./useUserContext"
export const useLogout = () => {
    const { dispatch } = useUserContext()
    const logout = async () => {
        let success = false
        await fetch('/user/logout', { method: "POST", credentials: "include" }).then(async () => {
            success = true
            await dispatch({ type: 'LOGOUT' })
        })
        return success
    }
    return { logout }
}