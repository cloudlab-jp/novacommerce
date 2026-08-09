package com.cloudlabjp.novacommerce.modules.catalog.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.cloudlabjp.novacommerce.modules.catalog.domain.repository.ProductRepository;
import com.cloudlabjp.novacommerce.modules.catalog.application.mapper.ProductMapper;
import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Product;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CreateProductRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.UpdateProductRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.ProductResponse;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ProductService {

    private final ProductRepository repository;

    private final ProductMapper mapper;

    public ProductResponse create(CreateProductRequest request) {

        Product entity = mapper.toEntity(request);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    public ProductResponse update(
            UUID id,
            UpdateProductRequest request
    ) {

        Product entity =
                repository.findById(id)
                        .orElseThrow();

        mapper.update(entity, request);

        entity = repository.save(entity);

        return mapper.toResponse(entity);
    }

    public void delete(UUID id) {

        repository.deleteById(id);
    }

    public ProductResponse findById(UUID id) {

        Product entity =
                repository.findById(id)
                        .orElseThrow();

        return mapper.toResponse(entity);
    }

    public List<ProductResponse> findAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

}
