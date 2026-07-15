package com.cloudlabjp.novacommerce.response;

public record ValidationError(
        String field,
        String message
) {
}