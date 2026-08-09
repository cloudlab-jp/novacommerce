package com.cloudlabjp.novacommerce.modules.catalog.application.mapper;

import org.springframework.stereotype.Component;

import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Category;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CreateCategoryRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.UpdateCategoryRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CategoryResponse;

@Component
public class CategoryMapper {

    public Category toEntity(CreateCategoryRequest request) {

        var entity = new Category();

        entity.setName(request.getName());

        return entity;
    }

    public CategoryResponse toResponse(Category entity) {

        var response = new CategoryResponse();

        response.setId(entity.getId());
        response.setName(entity.getName());

        return response;
    }

    public void update(
            Category entity,
            UpdateCategoryRequest request
    ) {

        entity.setName(request.getName());
    }

}
