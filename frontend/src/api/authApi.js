import api from "./axios"
export const registerUser=(userData)=>{
    return api.post("/auth/register",userData);
};

export const loginUser=(userData)=>{
    return api.post("/auth/login",userData);
};

// VERIFY OTP ⭐ NEW
export const verifyOtp = (data) => {
  return api.post("/auth/verify-otp", data);
};

// RESEND OTP ⭐ NEW
export const resendOtp = (data) => {
  return api.post("/auth/resend-otp", data);
};



