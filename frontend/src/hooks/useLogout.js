import { useUserContext } from "./useUserContext"
export const useLogout = () => {
    const { dispatch } = useUserContext()
    const logout = async () => {
        let success = false
        await fetch('/api/user/logout', { method: "POST", credentials: "include" }).then(async (res) => {
            if (res.ok) {
                success = true
                await dispatch({ type: 'LOGOUT' })
            }
        })
        return success
    }
    return { logout }
}