package com.cloudlabjp.novacommerce.modules.sales.application.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateCustomerRequest {

    @NotBlank
    private String name;

    private String email;



}