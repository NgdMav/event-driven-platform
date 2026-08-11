package com.mav.profileservice.api;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

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
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST.value());
        problemDetail.setTitle("Validation failed");
        problemDetail.setDetail("Request validation failed");
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        
        Map<String, String> errors = new HashMap<>();
        
        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        
        problemDetail.setProperty("errors", errors);
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetail> handleResponseStatus(
            ResponseStatusException exception,
            HttpServletRequest request
    ) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(exception.getStatusCode().value());
        problemDetail.setTitle(exception.getReason());
        problemDetail.setDetail(exception.getReason());
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        
        return toResponse(problemDetail);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpected(
            Exception exception,
            HttpServletRequest request
    ) {
        log.error("Unhandled exception", exception);
        
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        problemDetail.setTitle("Internal server error");
        problemDetail.setDetail("Unexpected error occurred");
        problemDetail.setInstance(URI.create(request.getRequestURI()));
        
        return toResponse(problemDetail);
    }
    
    private ResponseEntity<ProblemDetail> toResponse(ProblemDetail problemDetail) {
        return ResponseEntity
                .status(problemDetail.getStatus())
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }
}
