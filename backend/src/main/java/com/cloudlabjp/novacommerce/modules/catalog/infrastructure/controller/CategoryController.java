package com.cloudlabjp.novacommerce.modules.catalog.infrastructure.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import com.cloudlabjp.novacommerce.modules.catalog.application.service.CategoryService;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CreateCategoryRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.UpdateCategoryRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CategoryResponse;

@RestController
@RequestMapping(value = "/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @Valid @RequestBody CreateCategoryRequest request
    ) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {

        return ResponseEntity.ok(
                service.update(id, request)
        );
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CategoryResponse> findById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> findAll() {

        return ResponseEntity.ok(
                service.findAll()
        );
    }

}
