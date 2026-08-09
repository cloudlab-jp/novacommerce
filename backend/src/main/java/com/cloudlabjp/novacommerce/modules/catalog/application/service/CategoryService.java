package com.cloudlabjp.novacommerce.modules.catalog.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.cloudlabjp.novacommerce.modules.catalog.domain.repository.CategoryRepository;
import com.cloudlabjp.novacommerce.modules.catalog.application.mapper.CategoryMapper;
import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Category;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CreateCategoryRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.UpdateCategoryRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CategoryResponse;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository repository;

    private final CategoryMapper mapper;

    public CategoryResponse create(CreateCategoryRequest request) {

        Category entity = mapper.toEntity(request);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    public CategoryResponse update(
            UUID id,
            UpdateCategoryRequest request
    ) {

        Category entity =
                repository.findById(id)
                        .orElseThrow();

        mapper.update(entity, request);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    public void delete(UUID id) {

        repository.deleteById(id);
    }

    public CategoryResponse findById(UUID id) {

        Category entity =
                repository.findById(id)
                        .orElseThrow();

        return mapper.toResponse(entity);
    }

    public List<CategoryResponse> findAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

}
