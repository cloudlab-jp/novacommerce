package com.cloudlabjp.novacommerce.modules.catalog.application.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {

    private UUID id;

    private String name;

    private BigDecimal price;

}
