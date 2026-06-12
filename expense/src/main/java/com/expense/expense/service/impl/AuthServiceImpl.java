package com.expense.expense.service.impl;

import com.expense.expense.dto.request.LoginRequest;
import com.expense.expense.dto.request.LogoutRequest;
import com.expense.expense.dto.request.RefreshTokenRequest;
import com.expense.expense.dto.request.RegisterRequest;
import com.expense.expense.dto.response.AuthResponse;
import com.expense.expense.dto.response.TokenRefreshResponse;
import com.expense.expense.entity.RefreshToken;
import com.expense.expense.entity.User;
import com.expense.expense.enums.Role;
import com.expense.expense.exception.BadRequestException;
import com.expense.expense.exception.DuplicateResourceException;
import com.expense.expense.exception.UnauthorizedException;
import com.expense.expense.repository.UserRepository;
import com.expense.expense.security.CustomUserDetails;
import com.expense.expense.service.AuthService;
import com.expense.expense.service.JwtService;
import com.expense.expense.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.jwt.access-expiration}")
    private long accessTokenExpiration;

    @Override
    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new DuplicateResourceException("Email already exists");
        }
        User user=User.builder()
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail().toLowerCase().trim())
                .enabled(true)
                .roles(Set.of(Role.ROLE_USER))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        User savedUser=userRepository.save(user);
        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String accessToken=jwtService.generateAccessToken(userDetails);
        RefreshToken refreshToken=refreshTokenService.createRefreshToken(String.valueOf(savedUser.getId()));
        return buildAuthResponse(savedUser,accessToken,refreshToken.getToken());
    }


    @Override
    public AuthResponse login(LoginRequest request){
        try{
            Authentication authentication=authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String accessToken=jwtService.generateAccessToken(userDetails);
            RefreshToken refreshToken=refreshTokenService.createRefreshToken( String.valueOf(userDetails.getUserId())
            );
            return buildAuthResponse(userDetails.getUser(), accessToken, refreshToken.getToken());

        }catch (BadRequestException ex){
            throw new UnauthorizedException("Invalid email or password");
        }

    }




    @Override
    public TokenRefreshResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.verifyExpiration(request.getRefreshToken());

        User user = userRepository.findById(
                        Long.valueOf(refreshToken.getUserId())
                )
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        String accessToken = jwtService.generateAccessToken(new CustomUserDetails(user));

        return TokenRefreshResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .build();
    }

    @Override
    @Transactional
    public void logout(LogoutRequest request) {
        refreshTokenService.deleteByUserId(request.getUserId());
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiration / 1000)
                .userId(String.valueOf(user.getId()))
                .name(user.getName())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()))
                .build();
    }
















}
