import axios from "axios";
const api=axios.create({
     baseURL: " https://graveyard-reproach-overlaid.ngrok-free.dev/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem("accessToken");
        if(token && 
             !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
        ){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>Promise.reject(error)
    );


export default api;




