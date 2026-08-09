package com.cloudlabjp.novacommerce.modules.sales.application.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CustomerResponse {
    private UUID id;

    private String name;

    private String email;
}
