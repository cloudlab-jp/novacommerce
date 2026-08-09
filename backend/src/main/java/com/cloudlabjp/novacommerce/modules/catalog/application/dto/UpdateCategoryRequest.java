package com.cloudlabjp.novacommerce.modules.catalog.application.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateCategoryRequest {

    @NotBlank
    private String name;



}