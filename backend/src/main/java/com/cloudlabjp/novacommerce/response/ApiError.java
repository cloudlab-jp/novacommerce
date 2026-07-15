package com.cloudlabjp.novacommerce.response;

import java.time.Instant;
import java.util.List;

public record ApiError(
        boolean success,
        String message,
        String errorCode,
        List<ValidationError> errors,
        Instant timestamp
) {

    public static ApiError of(
            String message,
            String errorCode,
            List<ValidationError> errors
    ) {
        return new ApiError(
                false,
                message,
                errorCode,
                errors,
                Instant.now()
        );
    }

    public static ApiError of(
            String message,
            String errorCode
    ) {
        return new ApiError(
                false,
                message,
                errorCode,
                List.of(),
                Instant.now()
        );
    }

}