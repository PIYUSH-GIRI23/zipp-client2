export const handleTextSave = async(data) =>{
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_TEXT_ENDPOINT;
    
    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');
    const token={
        access_token: accessToken,
        refresh_token: refreshToken
    }
    const {head,body} = data;
    if (!accessToken) {
        throw new Error("No access token found");
    }
    if (!refreshToken) {
        throw new Error("No refresh token found");
    }
    if (!head || !body) {
        throw new Error("Both head and body are required");
    }
    const response = await fetch(api, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'token': JSON.stringify(token)
        },
        body: JSON.stringify({head, body}),
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
    if(response.status === 400 || response.status === 429 || response.status === 401 || response.status === 404 || response.status === 403){
        const data = await response.json();
        return {status: response.status, data};
    }
    else {
        const errorData = await response.json();
        throw new Error({status: response.status, data: errorData});
    }
}

export const getClips = async() => {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_GET_ENDPOINT;
        
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
        method : 'POST',
        headers : {
            'Content-Type': 'application/json',
            'token': JSON.stringify(token)
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
        return {status: response.status, data};
    } 
    else if(response.status === 404 || response.status === 400 || response.status === 429){
        const data = await response.json();
        
        return {status: response.status, data , msg:"hola"};
    }
    else {
        const errorData = await response.json();
       
        throw new Error({status: response.status, data: errorData});
    }
}

export const deleteText = async(id) => {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_TEXT_DELETE_ENDPOINT + `/${id}`;
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
        method : 'DELETE',
        headers : {
            'Content-Type': 'application/json',
            'token': JSON.stringify(token)
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
        return {status: response.status, data};
    } 
    else {
        const errorData = await response.json();
        throw new Error({status: response.status, data: errorData});
    }
};


export const resetClips = async() => {
  try {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_RESET_ENDPOINT;
    
    
    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');
    
    if (!accessToken || !refreshToken) {
      return {status: 401, data: {message: "Authentication required"}};
    }
    
    const token = {
      access_token: accessToken,
      refresh_token: refreshToken
    };
    
    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': JSON.stringify(token)
      },
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
      return {status: response.status, data};
    } 
    else if (response.status === 400 || response.status === 401 || response.status === 429) {
      return {status: response.status, data};
    } 
    else {
      return {status: response.status, data};
    }
  } catch (error) {
    console.error("Error resetting clips:", error);
    return {status: 500, data: {message: "Error resetting clips"}};
  }
};

export const uploadFile = async(formData) => {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_UPLOAD_FILE_ENDPOINT;
    


    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');
    const token = {
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
        method: 'POST',
        body: formData,
        headers: {
            'token': JSON.stringify(token),
        },
        credentials: 'include'
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
    else if(response.status === 404 || response.status === 400 || response.status === 429 || response.status === 403){
        const data = await response.json();
    
        return {status: response.status, data};
    }
    else{
        const errorData = await response.json();
        
        throw new Error(JSON.stringify({status: response.status, data: errorData}));
    }
};

export const uploadImage = async(formData) => {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_UPLOAD_IMAGE_ENDPOINT;
     
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
        method: 'POST',
        body: formData,
        headers: {
            'token': JSON.stringify(token),
        },
        duplex : 'half',
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
    else if(response.status === 404 || response.status === 400 || response.status === 429 || response.status === 403){
        const data = await response.json();
        
        return {status: response.status, data };
    }
    else {
        const errorData = await response.json();
     
        throw new Error({status: response.status, data: errorData});
    }
};

export const uploadProfilePic = async(formData) => {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_UPLOAD_PROFILE_PIC_ENDPOINT;
   
    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');
    const token = {
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
        method: 'POST',
        body: formData,
        headers: {
            'token': JSON.stringify(token)
        },
        credentials: 'include'
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
    else if(response.status === 404 || response.status === 400 || response.status === 429 || response.status === 403){
        const data = await response.json();
   
        return {status: response.status, data : data};
    }
    else {
        const errorData = await response.json();
     
        throw new Error(JSON.stringify({status: response.status, data: errorData}));
    }
};

export const removeProfilePic = async() => {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_REMOVE_PROFILE_PIC_ENDPOINT;
    
    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');
    const token = {
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
        method: 'POST',
        headers: {
            'token': JSON.stringify(token)
        },
        // credentials: 'include'
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
    else if(response.status === 404 || response.status === 400 || response.status === 429 || response.status === 403){
        const data = await response.json();
        
        return {status: response.status, data};
    }
    else {
        const errorData = await response.json();
        
        throw new Error(JSON.stringify({status: response.status, data: errorData}));
    }
};

export const removeMedia = async(id, type) => {
    const api = import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_CLIP_REMOVE_MEDIA_ENDPOINT;
    
    const accessToken = localStorage.getItem('zipp-accessToken');
    const refreshToken = localStorage.getItem('zipp-refreshToken');
    const token = {
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
        method: 'POST',
        headers: {
            'token': JSON.stringify(token),
            'content-type': 'application/json'
        },
        body : JSON.stringify({ id,type })
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
    else if(response.status === 404 || response.status === 400 || response.status === 429 || response.status === 403){
        const data = await response.json();
       
        return {status: response.status, data};
    }
    else {
        const errorData = await response.json();
        
        throw new Error(JSON.stringify({status: response.status, data: errorData}));
    }
}
