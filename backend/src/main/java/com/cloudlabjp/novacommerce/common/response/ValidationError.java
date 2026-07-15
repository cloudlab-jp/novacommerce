package com.cloudlabjp.novacommerce.common.response;

public record ValidationError(
        String field,
        String message
) {
}