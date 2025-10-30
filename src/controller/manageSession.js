export const logout = async() => {
    try{
        const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_LOGOUT;
        const accessToken = localStorage.getItem('zipp-accessToken');
        const refreshToken = localStorage.getItem('zipp-refreshToken');
        const token={
            access_token: accessToken,
            refresh_token: refreshToken
        }
        if (!accessToken) {
            throw new Error("No access token found");
        }
        if (!refreshToken) {
            throw new Error("No refresh token found");
        }
        const response = await fetch(api, {
            method : 'PUT',
            headers : {
                'Content-Type': 'application/json',
                'token': JSON.stringify(token)
            },
        });
        if (!response.ok) {
            throw new Error("Failed to logout");
        }
    }
    catch(error){
        console.error("Logout failed:", error);
    }
    finally{
        localStorage.removeItem('zipp-accessToken');
        localStorage.removeItem('zipp-refreshToken');
    }
}
export const logoutAll = async() => {
    try{
        const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_LOGOUT_ALL;
        const accessToken = localStorage.getItem('zipp-accessToken');
        const refreshToken = localStorage.getItem('zipp-refreshToken');
        const token={
            access_token: accessToken,
            refresh_token: refreshToken
        }
        if (!accessToken) {
            throw new Error("No access token found");
        }
        if (!refreshToken) {
            throw new Error("No refresh token found");
        }
        const response = await fetch(api, {
            method : 'PUT',
            headers : {
                'Content-Type': 'application/json',
                'token': JSON.stringify(token)
            },
        });
        if (!response.ok) {
            throw new Error("Failed to logout from all devices");
        }
    }
    catch(error){
        console.error("Logout from all devices failed:", error);
    }
    finally{
        localStorage.removeItem('zipp-accessToken');
        localStorage.removeItem('zipp-refreshToken');
    }
}
