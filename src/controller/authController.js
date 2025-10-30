import { toast } from 'react-toastify';

export const handleSignup = async (formdata) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const signupRoute = import.meta.env.VITE_SIGNUP_ROUTE;

    if (!backendUrl || !signupRoute) {
      throw new Error("Environment variables VITE_BACKEND_URL or VITE_SIGNUP_ROUTE are not defined");
    }

    const URL = backendUrl + signupRoute;
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    });

    return {status: response.status, data: await response.json()};
  } 
  catch {
    return {status: 500, data: {message: "Internal Server Error"}};
  }
};

export const doesExists = async(email) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const doesExistRoute = import.meta.env.VITE_DOES_EXIST_ROUTE;

    if (!backendUrl || !doesExistRoute) {
      throw new Error("Environment variables VITE_BACKEND_URL or VITE_DOES_EXIST_ROUTE are not defined");
    }

    const URL = backendUrl + doesExistRoute;
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email}),
    });

    return {status: response.status, data: await response.json()};
};

export const handleGoogleAuth = (returnPath = 'login') => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const googleAuthRoute = import.meta.env.VITE_GOOGLE_AUTH_ROUTE;

  if (!backendUrl || !googleAuthRoute) {
    throw new Error("Environment variables VITE_BACKEND_URL or VITE_GOOGLE_AUTH_ROUTE are not defined");
  }

  // Redirect to the backend's Google auth endpoint with return path
  const authUrl = new URL(`${backendUrl}${googleAuthRoute}`);
  authUrl.searchParams.append('returnTo', `/${returnPath}`);
  window.location.href = authUrl.toString();
};


export const handleGoogleRedirect = (navigate) => {
  // Only handle if there are query parameters
  if (window.location.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');
      const isMailVerified = params.get('isMailVerified');
      const isNewUser = params.get('isNewUser') === 'true';

      if (accessToken && refreshToken) {
        // Store tokens in localStorage
        localStorage.setItem('zipp-accessToken', accessToken);
        localStorage.setItem('zipp-refreshToken', refreshToken);
        localStorage.setItem('zipp-isMailVerified', isMailVerified || 'false');

        // Clean URL by removing query parameters
        window.history.replaceState({}, document.title, window.location.pathname);

        // Show appropriate success message
        if (isNewUser) {
          toast.success('Account created successfully with Google!');
        } else {
          toast.success('Welcome back! Successfully logged in with Google');
        }

        // Redirect to clipboard page
        navigate('/clipboard');
      }
    } catch (error) {

      toast.error('Failed to complete Google authentication');
    }
  }
};


export const handleLogin = async (formdata) => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const loginRoute = import.meta.env.VITE_LOGIN_ROUTE;
    if (!backendUrl || !loginRoute) {
      throw new Error("Environment variables VITE_BACKEND_URL or VITE_LOGIN_ROUTE are not defined");
    }

    const URL = backendUrl + loginRoute;
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    });

    return {status: response.status, data: await response.json()};
  } catch {
    return {status: 500, data: {message: "Internal Server Error"}};
  }
};

export const sendVerification = async () => {
  const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_SEND_OTP}`;

  const accessToken = localStorage.getItem('zipp-accessToken');
  const refreshToken = localStorage.getItem('zipp-refreshToken');

  if (!accessToken) {
    throw new Error("No access token found");
  }

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const token = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': JSON.stringify(token),
    },
  });

 

  if (response.ok) {
    const data = await response.json();

    const newAccessToken = response.headers.get('new-access-token');
    const newRefreshToken = response.headers.get('new-refresh-token');

    if (newAccessToken) {
      localStorage.setItem('zipp-accessToken', newAccessToken);
    }

    if (newRefreshToken) {
      localStorage.setItem('zipp-refreshToken', newRefreshToken);
    }

    return { status: response.status, data };
  } 
  else {
    const errorData = await response.json();
    throw new Error({status: response.status, data: errorData});
  }
};

export const verifyEmailOTP = async (email, otp) => {
  const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_VERIFY_EMAIL}`;
  
  const accessToken = localStorage.getItem('zipp-accessToken');
  const refreshToken = localStorage.getItem('zipp-refreshToken');

  if (!accessToken) {
    throw new Error("No access token found");
  }

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const token = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': JSON.stringify(token),
    },
    body: JSON.stringify({ email, otp }),
  });

  if (response.ok) {
    const data = await response.json();

    const newAccessToken = response.headers.get('new-access-token');
    const newRefreshToken = response.headers.get('new-refresh-token');

    if (newAccessToken) {
      localStorage.setItem('zipp-accessToken', newAccessToken);
    }

    if (newRefreshToken) {
      localStorage.setItem('zipp-refreshToken', newRefreshToken);
    }

    return { status: response.status, data };
  }
    else if(response.status === 400 || response.status === 429){
        const data = await response.json();
        return {status: response.status, data};

  } else {
    const errorData = await response.json();
     throw new Error({status: response.status, data: errorData})
  }
};

export const handleDetails = async() => {
      const accessToken = localStorage.getItem('zipp-accessToken');
      const refreshToken = localStorage.getItem('zipp-refreshToken');
      const token={
          access_token: accessToken,
          refresh_token: refreshToken
      }
      const URL = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_GET_USER_DETAILS_ROUTE}`;
      if (!accessToken) {
          throw new Error("No access token found");
      }
      if (!refreshToken) {
          throw new Error("No refresh token found");
      }
      
      const response = await fetch(URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'token': JSON.stringify(token)
          }
      });

      if (response.ok) {
          const data = await response.json();
          const newAccessToken = response.headers.get('new-access-token');
          const newRefreshToken = response.headers.get('new-refresh-token');
            
          if (newAccessToken) {
              localStorage.setItem('zipp-accessToken', newAccessToken);
          }
          if (newRefreshToken) {
              localStorage.setItem('zipp-refreshToken', newRefreshToken);
          }
          return {status: response.status, data};
        } 
        else {
          const errorData = await response.json();
          throw new Error({status: response.status, data: errorData})
      }
}


export const forgotPassword1 = async (email) => {
  const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_FORGOT_PASSWORD_1}`;
  
  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    const data = await response.json();
    return { status: response.status, data };
  } 
  else if(response.status === 400 || response.status === 429 || response.status === 404){
        const data = await response.json();
        return {status: response.status, data};

  }
  else {
    const errorData = await response.json();
      throw new Error({status: response.status, data: errorData})
  }
};

export const forgotPassword2 = async (email , password, confirmPassword, passKey , otp) => {
  const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_FORGOT_PASSWORD_2}`;

  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, confirmPassword, passKey , otp }),
  });

  if (response.ok) {
    const data = await response.json();
    return { status: response.status, data };
  } 
  else if(response.status === 400 || response.status === 429 || response.status === 404 || response.status === 401){
        const data = await response.json();
        return {status: response.status, data};

  }
  else {
    const errorData = await response.json();
      throw new Error({status: response.status, data: errorData})
  }
};

export const setPin = async (pin, password) => {
  const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_SET_PIN}`;

  const accessToken = localStorage.getItem('zipp-accessToken');
  const refreshToken = localStorage.getItem('zipp-refreshToken');

  if (!accessToken) {
    throw new Error("No access token found");
  }

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const token = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': JSON.stringify(token),
    },
    body: JSON.stringify({ pin, password }),
  });

  if (response.ok) {
    const data = await response.json();

    const newAccessToken = response.headers.get('new-access-token');
    const newRefreshToken = response.headers.get('new-refresh-token');

    if (newAccessToken) {
      localStorage.setItem('zipp-accessToken', newAccessToken);
    }

    if (newRefreshToken) {
      localStorage.setItem('zipp-refreshToken', newRefreshToken);
    }

    return { status: response.status, data };
  } 
  else if(response.status === 400 || response.status === 403 || response.status === 429 || response.status === 469){
        const data = await response.json();
        return {status: response.status, data};

  }
  else {
    const errorData = await response.json();
    throw new Error({status: response.status, data: errorData});
  }
};

export const resetPin = async () => {
  const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_RESET_PIN}`;

  const accessToken = localStorage.getItem('zipp-accessToken');
  const refreshToken = localStorage.getItem('zipp-refreshToken');

  if (!accessToken) {
    throw new Error("No access token found");
  }

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const token = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  const response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': JSON.stringify(token),
    },
  });

  if (response.ok) {
    const data = await response.json();

    const newAccessToken = response.headers.get('new-access-token');
    const newRefreshToken = response.headers.get('new-refresh-token');

    if (newAccessToken) {
      localStorage.setItem('zipp-accessToken', newAccessToken);
    }

    if (newRefreshToken) {
      localStorage.setItem('zipp-refreshToken', newRefreshToken);
    }

    return { status: response.status, data };
  } 
  else {
    const errorData = await response.json();
    throw new Error({status: response.status, data: errorData});
  }
};

export const checkUsername = async (username) => {
  try {
    const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_CHECK_USERNAME}`;

    if(!username){
        return {status:400, data:{message:"Username cannot be empty", isUnique: false}};
    }

    if(username.length < 3 || username.length > 30) {
        return {status:400, data:{message:"Username must be between 3 and 30 characters long", isUnique: false}};
    }

    const pattern = /^[a-zA-Z0-9_-]+$/;
    if(!pattern.test(username)) {
        return {status:400, data:{message:"Username can only contain letters, numbers, underscores, and hyphens", isUnique: false}};
    }

    const access_token = localStorage.getItem('zipp-accessToken');
    const refresh_token = localStorage.getItem('zipp-refreshToken');

    if (!access_token || !refresh_token) {
        return {status:401, data:{message:"No authentication tokens found", isUnique: false}};
    }

    const token = {
        access_token: access_token,
        refresh_token: refresh_token,
    };

    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': JSON.stringify(token),
        },
        body: JSON.stringify({ username }),
    });

    
    const data = await response.json();
  

    if (response.ok) {
        const newAccessToken = response.headers.get('new-access-token');
        const newRefreshToken = response.headers.get('new-refresh-token');

        if (newAccessToken) {
            localStorage.setItem('zipp-accessToken', newAccessToken);
        }

        if (newRefreshToken) {
            localStorage.setItem('zipp-refreshToken', newRefreshToken);
        }

        return { status: response.status, data };
    } 
    else if(response.status === 400 || response.status === 409 || response.status === 429){
        return {status: response.status, data};
    }
    else {
        return {status: response.status, data};
    }
  } catch (error) {
    
    throw new Error({status: response.status, data: errorData});
  }
}

export const usernameUpdate = async (username) => {
  try {
    const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_UPDATE_USERNAME}`;
    
    
    if(!username){
      return {status:400, data:{message:"Username cannot be empty", success: false}};
    }

    if (/\d/.test(username[0])) {
      setIsUnique(null);
      toast.error("Username cannot start with a number");
      return;
    }
    
    if (username.length < 3 || username.length > 30) {
      return {status:400, data:{message:"Username must be between 3 and 30 characters long", success: false}};
    }
    
    // Check allowed characters (letters, numbers, underscores, hyphens)
    const allowedPattern = /^[a-zA-Z0-9_-]+$/;
    if (!allowedPattern.test(username)) {
      return {status:400, data:{message:"Username can only contain letters, numbers, underscores, and hyphens", success: false}};
    }

    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');

    if (!accessToken || !refreshToken) {
      return {status:401, data:{message:"No authentication tokens found", success: false}};
    }

    const token = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    const response = await fetch(api, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token),
      },
      body: JSON.stringify({ username }),
    });

   
    const data = await response.json();
 

    if (response.ok) {
      const newAccessToken = response.headers.get('new-access-token');
      const newRefreshToken = response.headers.get('new-refresh-token');

      if (newAccessToken) {
        localStorage.setItem('zipp-accessToken', newAccessToken);
      }

      if (newRefreshToken) {
        localStorage.setItem('zipp-refreshToken', newRefreshToken);
      }

      return { status: response.status, data };
    } 
    else if(response.status === 400 || response.status === 409 || response.status === 429){
      return {status: response.status, data};
    }
    else {
      return {status: response.status, data};
    }
  } catch (error) {
    
    throw new Error({status: 500, data: {message: "Error updating username", success: false}});
  }
}  

export const deleteAccount = async (password) => {
  try {
    if(!password){
      return {status:400, data:{message:"Password cannot be empty", success: false}};
    }
    
    
    const api = `${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_DELETE_ACCOUNT}`;
    
    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');
    
    if (!accessToken || !refreshToken) {
      return {status:401, data:{message:"No authentication tokens found", success: false}};
    }

    const token = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    

    const response = await fetch(api, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token),
      },
      body: JSON.stringify({ password }),
    });

    
    const data = await response.json();
  
    
    if (response.ok) {
      const newAccessToken = response.headers.get('new-access-token');
      const newRefreshToken = response.headers.get('new-refresh-token');
      
      if (newAccessToken) {
        localStorage.setItem('zipp-accessToken', newAccessToken);
      }

      if (newRefreshToken) {
        localStorage.setItem('zipp-refreshToken', newRefreshToken);
      }

      return { status: response.status, data };
    } 
    else if(response.status === 400 || response.status === 401 || response.status === 409 || response.status === 429 || response.status === 469){
      return {status: response.status, data};
    }
  } catch (error) {
    
    throw new Error({status: 500, data: {message: "Error deleting account", success: false}});
  }
};
