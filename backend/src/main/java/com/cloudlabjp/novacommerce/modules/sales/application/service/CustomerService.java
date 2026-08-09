package com.cloudlabjp.novacommerce.modules.sales.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cloudlabjp.novacommerce.modules.sales.domain.repository.CustomerRepository;
import com.cloudlabjp.novacommerce.modules.sales.application.mapper.CustomerMapper;
import com.cloudlabjp.novacommerce.modules.sales.domain.model.Customer;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CreateCustomerRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.UpdateCustomerRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CustomerResponse;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class CustomerService {

    private final CustomerRepository repository;

    private final CustomerMapper mapper;

    public CustomerResponse create(CreateCustomerRequest request) {
        Customer entity = mapper.toEntity(request);
        entity = repository.save(entity);
        return mapper.toResponse(entity);
    }

    public CustomerResponse update(UUID id, UpdateCustomerRequest request) {
        Customer entity = repository.findById(id).orElseThrow();
        mapper.update(entity, request);
        entity = repository.save(entity);
        return mapper.toResponse(entity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public CustomerResponse findById(UUID id) {
        Customer entity = repository.findById(id).orElseThrow();
        return mapper.toResponse(entity);
    }

    public List<CustomerResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}

