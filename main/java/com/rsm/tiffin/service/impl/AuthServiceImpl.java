package com.rsm.tiffin.service.impl;

import com.rsm.tiffin.dto.*;
import com.rsm.tiffin.entity.Role;
import com.rsm.tiffin.entity.User;
import com.rsm.tiffin.entity.UserStatus;
import com.rsm.tiffin.exception.BadRequestException;
import com.rsm.tiffin.exception.UnauthorizedException;
import com.rsm.tiffin.mapper.EntityMapper;
import com.rsm.tiffin.repository.UserRepository;
import com.rsm.tiffin.security.CustomUserDetails;
import com.rsm.tiffin.security.JwtService;
import com.rsm.tiffin.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EntityMapper mapper;

    @Override
    @Transactional
    public AuthResponse register(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new BadRequestException("Mobile number already registered");
        }
        if (request.getAadhaarNumber() != null && userRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
            throw new BadRequestException("Aadhaar number already registered");
        }

        User user = mapper.toUserEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new UnauthorizedException("Account is inactive. Please contact administrator.");
        }

        String token = jwtService.generateToken(userDetails);
        return buildAuthResponse(token, user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
