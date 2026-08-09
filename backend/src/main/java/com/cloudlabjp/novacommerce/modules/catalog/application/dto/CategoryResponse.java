package com.cloudlabjp.novacommerce.modules.catalog.application.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryResponse {

    private UUID id;

    private String name;

}
