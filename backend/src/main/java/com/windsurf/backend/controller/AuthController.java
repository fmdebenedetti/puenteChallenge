package com.windsurf.backend.controller;

import com.windsurf.backend.dto.AuthResponse;
import com.windsurf.backend.dto.LoginRequest;
import com.windsurf.backend.dto.RegisterRequest;
import com.windsurf.backend.exception.AuthenticationFailedException;
import com.windsurf.backend.exception.InvalidPasswordException;
import com.windsurf.backend.exception.UserAlreadyExistsException;
import com.windsurf.backend.model.Role;
import com.windsurf.backend.model.User;
import com.windsurf.backend.service.UserService;

import lombok.AllArgsConstructor;

import com.windsurf.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("El email ya está registrado");
        }

        if (registerRequest.getPassword().length() < 8) {
            throw new InvalidPasswordException("La contraseña debe tener al menos 8 caracteres");
        }

        User newUser = new User();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setName(registerRequest.getName());
        newUser.setRole(Role.USER);

        User savedUser = userService.createUser(newUser);
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
            .username(savedUser.getEmail())
            .password(savedUser.getPassword())
            .roles("USER")
            .build();

        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token, savedUser.getEmail(), savedUser.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.getUserByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AuthenticationFailedException("Usuario no encontrado"));
            
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();

            String token = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getRole().name()));
            
        } catch (Exception e) {
            throw new AuthenticationFailedException("Error de autenticación: credenciales inválidas");
        }
    }
}
