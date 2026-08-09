package com.cloudlabjp.novacommerce.modules.sales.infrastructure.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import com.cloudlabjp.novacommerce.modules.sales.application.service.CustomerService;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CreateCustomerRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.UpdateCustomerRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CustomerResponse;

@RestController
@RequestMapping(value = "/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;

    @PostMapping
    public ResponseEntity<CustomerResponse> create(
            @Valid @RequestBody CreateCustomerRequest request
    ) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<CustomerResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCustomerRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CustomerResponse> findById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
