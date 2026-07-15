package com.cloudlabjp.novacommerce.common.exception;

import com.cloudlabjp.novacommerce.common.constants.ApiMessages;
import com.cloudlabjp.novacommerce.common.constants.ErrorCodes;
import com.cloudlabjp.novacommerce.common.response.ApiError;
import com.cloudlabjp.novacommerce.common.response.ValidationError;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiError.of(
                        ex.getMessage(),
                        ErrorCodes.RESOURCE_NOT_FOUND
                ));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicate(DuplicateResourceException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiError.of(
                        ex.getMessage(),
                        ErrorCodes.DUPLICATE_RESOURCE
                ));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiError> handleUnauthorized(UnauthorizedException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiError.of(
                        ex.getMessage(),
                        ErrorCodes.UNAUTHORIZED
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {

        List<ValidationError> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::mapValidationError)
                .toList();

        return ResponseEntity.badRequest()
                .body(ApiError.of(
                        ApiMessages.VALIDATION_ERROR,
                        ErrorCodes.VALIDATION_ERROR,
                        errors
                ));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex) {

        List<ValidationError> errors = ex.getConstraintViolations()
                .stream()
                .map(error -> new ValidationError(
                        error.getPropertyPath().toString(),
                        error.getMessage()
                ))
                .toList();

        return ResponseEntity.badRequest()
                .body(ApiError.of(
                        ApiMessages.VALIDATION_ERROR,
                        ErrorCodes.VALIDATION_ERROR,
                        errors
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiError.of(
                        ApiMessages.INTERNAL_ERROR,
                        ErrorCodes.INTERNAL_SERVER_ERROR
                ));
    }

    private ValidationError mapValidationError(FieldError error) {

        return new ValidationError(
                error.getField(),
                error.getDefaultMessage()
        );
    }

}