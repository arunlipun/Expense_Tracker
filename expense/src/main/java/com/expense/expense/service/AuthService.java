package com.expense.expense.service;

import com.expense.expense.dto.request.*;
import com.expense.expense.dto.response.AuthResponse;
import com.expense.expense.dto.response.TokenRefreshResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse verifyOtp(VerifyOtpRequest request);

    void resendOtp(String email);
    AuthResponse login(LoginRequest loginRequest);
    TokenRefreshResponse refreshToken(RefreshTokenRequest request);
    void logout(LogoutRequest request);
}
