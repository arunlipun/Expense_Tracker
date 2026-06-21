package com.expense.expense.service.impl;

import com.expense.expense.dto.request.*;
import com.expense.expense.dto.response.AuthResponse;
import com.expense.expense.dto.response.TokenRefreshResponse;
import com.expense.expense.entity.OtpVerification;
import com.expense.expense.entity.RefreshToken;
import com.expense.expense.entity.User;
import com.expense.expense.enums.Role;
import com.expense.expense.exception.BadRequestException;
import com.expense.expense.exception.DuplicateResourceException;
import com.expense.expense.exception.UnauthorizedException;
import com.expense.expense.repository.OtpVerificationRepository;
import com.expense.expense.repository.UserRepository;
import com.expense.expense.security.CustomUserDetails;
import com.expense.expense.service.*;
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
    private final OtpService otpService;
    private final OtpVerificationRepository otpVerificationRepository;
    private final EmailService emailService;

    @Override
    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new DuplicateResourceException("Email already exists");
        }
        User user=User.builder()
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail().toLowerCase().trim())
                .enabled(false)
//                .enabled(true)

                .roles(Set.of(Role.ROLE_USER))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        User savedUser=userRepository.save(user);
        String otp= otpService.generateOtp();
        System.out.println("Generated OTP = " + otp);


        otpVerificationRepository.deleteByEmail(savedUser.getEmail());

        OtpVerification otpVerification = OtpVerification.builder()
                .email(savedUser.getEmail())
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        otpVerificationRepository.save(otpVerification);

        try {
            emailService.sendOtpEmail(
                    savedUser.getEmail(),
                    otp
            );
        } catch (Exception e) {
            System.out.println("Email Failed: " + e.getMessage());
        }

        return AuthResponse.builder()
                .userId(String.valueOf(savedUser.getId()))
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .roles(savedUser.getRoles()
                        .stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet()))
                .build();

//        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
//        String accessToken=jwtService.generateAccessToken(userDetails);
//        RefreshToken refreshToken=refreshTokenService.createRefreshToken(String.valueOf(savedUser.getId()));
//        return buildAuthResponse(savedUser,accessToken,refreshToken.getToken());


    }
    // verify otp ..
    @Override
    public AuthResponse verifyOtp(VerifyOtpRequest request) {

        OtpVerification otpVerification =
                otpVerificationRepository.findTopByEmailOrderByIdDesc(
                        request.getEmail().toLowerCase().trim()
                ).orElseThrow(() ->
                        new BadRequestException("OTP not found"));

        if (Boolean.TRUE.equals(otpVerification.getVerified())) {
            throw new BadRequestException("OTP already verified");
        }

        if (LocalDateTime.now().isAfter(
                otpVerification.getExpiryTime())) {

            throw new BadRequestException("OTP expired");
        }

        if (!otpVerification.getOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        User user = userRepository.findByEmail(
                request.getEmail().toLowerCase().trim()
        ).orElseThrow(() ->
                new BadRequestException("User not found"));

        user.setEnabled(true);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        otpVerification.setVerified(true);
        otpVerificationRepository.save(otpVerification);

        CustomUserDetails userDetails =
                new CustomUserDetails(user);

        String accessToken =
                jwtService.generateAccessToken(userDetails);

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(
                        String.valueOf(user.getId()));

        return buildAuthResponse(
                user,
                accessToken,
                refreshToken.getToken()
        );
    }

    @Override
    public void resendOtp(String email) {

        OtpVerification existingOtp =
                otpVerificationRepository.findTopByEmailOrderByIdDesc(email)
                        .orElseThrow(() ->
                                new BadRequestException("OTP record not found"));

        String otp = otpService.generateOtp();

        existingOtp.setOtp(otp);
        existingOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        existingOtp.setVerified(false);

        otpVerificationRepository.save(existingOtp);

        emailService.sendOtpEmail(email, otp);
    }




    @Override
    public AuthResponse login(LoginRequest request){
        try{
            long start = System.currentTimeMillis();
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

            long end = System.currentTimeMillis();

            System.out.println(
                    "LOGIN PROCESSING TIME = "
                            + (end - start)
                            + " ms"
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
