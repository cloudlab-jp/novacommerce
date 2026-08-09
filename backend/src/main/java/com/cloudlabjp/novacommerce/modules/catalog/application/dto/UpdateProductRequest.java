package com.cloudlabjp.novacommerce.modules.catalog.application.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProductRequest {

    @NotBlank
    private String name;

    private BigDecimal price;



}