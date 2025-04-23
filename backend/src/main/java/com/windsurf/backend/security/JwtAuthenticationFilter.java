package com.windsurf.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        log.debug("Processing request to {}", request.getRequestURI());

        final String authHeader = request.getHeader("Authorization");
        log.info("[JWT] Authorization header: {}", authHeader);
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("[JWT] No JWT token found in request headers or header does not start with 'Bearer '");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        log.info("[JWT] JWT token extracted: {}", jwt);

        try {
            userEmail = jwtUtil.extractUsername(jwt);
            log.info("[JWT] Extracted username from JWT: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                log.info("[JWT] Loaded user details for: {}", userDetails.getUsername());
                
                boolean valid = jwtUtil.validateToken(jwt, userDetails);
                log.info("[JWT] Token validation result: {}", valid);
                if (valid) {
                    log.info("[JWT] JWT token is valid");

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("[JWT] Authentication set in SecurityContextHolder");
                } else {
                    log.warn("[JWT] JWT token validation failed for user: {}", userEmail);
                }
            }
        } catch (Exception e) {
            log.error("[JWT] Error processing JWT token: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}
