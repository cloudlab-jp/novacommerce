package com.cloudlabjp.novacommerce.modules.catalog.application.mapper;

import org.springframework.stereotype.Component;

import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Product;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CreateProductRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.UpdateProductRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.ProductResponse;

@Component
public class ProductMapper {

    public Product toEntity(CreateProductRequest request) {

        var entity = new Product();

        entity.setName(request.getName());
        entity.setPrice(request.getPrice());

        return entity;
    }

    public ProductResponse toResponse(Product entity) {

        var response = new ProductResponse();

        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setPrice(entity.getPrice());

        return response;
    }

    public void update(
            Product entity,
            UpdateProductRequest request
    ) {

        entity.setName(request.getName());
        entity.setPrice(request.getPrice());
    }

}
