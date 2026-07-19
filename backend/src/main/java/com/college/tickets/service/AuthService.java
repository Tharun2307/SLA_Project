package com.college.tickets.service;

import com.college.tickets.dto.AuthResponse;
import com.college.tickets.dto.LoginRequest;
import com.college.tickets.dto.RegisterRequest;
import com.college.tickets.model.Role;
import com.college.tickets.model.User;
import com.college.tickets.repository.UserRepository;
import com.college.tickets.security.CustomUserDetails;
import com.college.tickets.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.USER
        );
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getId(), user.getEmail(),
                user.getRole().name(), user.getDepartmentId()
        );

        return new AuthResponse(token, user.getRole().name(),
                user.getName(), user.getId(), user.getDepartmentId(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(
                user.getId(), user.getEmail(),
                user.getRole().name(), user.getDepartmentId()
        );

        return new AuthResponse(token, user.getRole().name(),
                user.getName(), user.getId(), user.getDepartmentId(), user.getEmail());
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        throw new RuntimeException("No authenticated user found");
    }
}
