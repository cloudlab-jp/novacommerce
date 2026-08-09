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

import com.cloudlabjp.novacommerce.modules.catalog.application.service.ProductService;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.CreateProductRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.UpdateProductRequest;
import com.cloudlabjp.novacommerce.modules.catalog.application.dto.ProductResponse;

@RestController
@RequestMapping(value = "/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody CreateProductRequest request
    ) {

        return ResponseEntity.ok(
                service.create(request)
        );
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request
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
    public ResponseEntity<ProductResponse> findById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> findAll() {

        return ResponseEntity.ok(
                service.findAll()
        );
    }

}
