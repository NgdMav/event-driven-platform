package com.mav.apigateway.security;

import com.mav.apigateway.config.GatewaySecurityProperties;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationGatewayFilter extends OncePerRequestFilter {
    
    private final GatewayJwtService jwtService;
    private final GatewaySecurityProperties securityProperties;
    private final ObjectMapper objectMapper;
    
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        if (isPublic(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            writeUnauthorized(response, request, "Authentication required");
            return;
        }
        
        String token = authorizationHeader.substring(7);
        
        try {
            Claims claims = jwtService.parseToken(token);
            String userId = claims.getSubject();
            
            HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(request) {
                @Override
                public String getHeader(String name) {
                    if ("X-User-Id".equalsIgnoreCase(name)) {
                        return userId;
                    }
                    if ("Authorization".equalsIgnoreCase(name)) {
                        return null;
                    }
                    return super.getHeader(name);
                }
                
                @Override
                public Enumeration<String> getHeaders(String name) {
                    if ("X-User-Id".equalsIgnoreCase(name)) {
                        return Collections.enumeration(List.of(userId));
                    }
                    if ("Authorization".equalsIgnoreCase(name)) {
                        return Collections.emptyEnumeration();
                    }
                    return super.getHeaders(name);
                }
                
                @Override
                public Enumeration<String> getHeaderNames() {
                    List<String> names = new ArrayList<>();
                    Enumeration<String> originalNames = super.getHeaderNames();
                    while (originalNames.hasMoreElements()) {
                        String name = originalNames.nextElement();
                        if (!"X-User-Id".equalsIgnoreCase(name) && !"Authorization".equalsIgnoreCase(name)) {
                            names.add(name);
                        }
                    }
                    names.add("X-User-Id");
                    return Collections.enumeration(names);
                }
            };
            
            filterChain.doFilter(wrappedRequest, response);
            
        } catch (Exception exception) {
            log.warn("JWT validation failed: {}", exception.getMessage());
            writeUnauthorized(response, request, "Invalid or expired token");
        }
    }
    
    private boolean isPublic(String path) {
        return securityProperties.getPublicPaths().stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
    }
    
    private void writeUnauthorized(HttpServletResponse response,
                                   HttpServletRequest request,
                                   String detail) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED.value());
        problemDetail.setTitle("Unauthorized");
        problemDetail.setDetail(detail);
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        
        byte[] bytes = objectMapper.writeValueAsBytes(problemDetail);
        response.getOutputStream().write(bytes);
    }
}
