package com.mav.authservice.api;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                "Request validation failed",
                request
        );
        
        Map<String, String> errors = new HashMap<>();
        
        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        
        problemDetail.setProperty("errors", errors);
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ProblemDetail> handleHttpMessageNotReadable(
            HttpMessageNotReadableException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Malformed request",
                "Request body is missing or malformed",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ProblemDetail> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Invalid parameter",
                "Parameter '" + exception.getName() + "' has invalid format",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ProblemDetail> handleConstraintViolation(
            ConstraintViolationException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.BAD_REQUEST,
                "Constraint violation",
                "Request violates constraints",
                request
        );
        
        Map<String, String> errors = new HashMap<>();
        
        exception.getConstraintViolations()
                .forEach(violation -> errors.put(
                        violation.getPropertyPath().toString(),
                        violation.getMessage()
                ));
        
        problemDetail.setProperty("errors", errors);
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetail> handleResponseStatusException(
            ResponseStatusException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(exception.getStatusCode().value());
        problemDetail.setTitle(exception.getReason() != null ? exception.getReason() : "Request failed");
        problemDetail.setDetail(exception.getReason());
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetail> handleAuthenticationException(
            AuthenticationException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.UNAUTHORIZED,
                "Unauthorized",
                "Authentication required or credentials are invalid",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDenied(
            AccessDeniedException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.FORBIDDEN,
                "Forbidden",
                "Access denied",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ProblemDetail> handleJwtException(
            JwtException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.UNAUTHORIZED,
                "Invalid token",
                "JWT token is invalid or expired",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleDataIntegrityViolation(
            DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {
        log.warn("Data integrity violation: {}", exception.getMessage());
        
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.CONFLICT,
                "Conflict",
                "Request conflicts with current state",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ProblemDetail> handleNoResourceFound(
            NoResourceFoundException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.NOT_FOUND,
                "Not found",
                "Resource not found",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpectedException(
            Exception exception,
            HttpServletRequest request
    ) {
        log.error("Unhandled exception", exception);
        
        ProblemDetail problemDetail = buildProblemDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error",
                "Unexpected error occurred",
                request
        );
        
        return toResponse(problemDetail);
    }
    
    private ProblemDetail buildProblemDetail(
            HttpStatus status,
            String title,
            String detail,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(status.value());
        problemDetail.setTitle(title);
        problemDetail.setDetail(detail);
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        return problemDetail;
    }
    
    private ResponseEntity<ProblemDetail> toResponse(ProblemDetail problemDetail) {
        return ResponseEntity
                .status(problemDetail.getStatus())
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }
}