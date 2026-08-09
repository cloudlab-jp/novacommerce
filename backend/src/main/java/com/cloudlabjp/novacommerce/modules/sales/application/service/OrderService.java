package com.cloudlabjp.novacommerce.modules.sales.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cloudlabjp.novacommerce.modules.sales.domain.repository.OrderRepository;
import com.cloudlabjp.novacommerce.modules.sales.application.mapper.OrderMapper;
import com.cloudlabjp.novacommerce.modules.sales.domain.model.Order;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CreateOrderRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.UpdateOrderRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.OrderResponse;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class OrderService {

    private final OrderRepository repository;

    private final OrderMapper mapper;

    public OrderResponse create(CreateOrderRequest request) {
        Order entity = mapper.toEntity(request);
        entity = repository.save(entity);
        return mapper.toResponse(entity);
    }

    public OrderResponse update(UUID id, UpdateOrderRequest request) {
        Order entity = repository.findById(id).orElseThrow();
        mapper.update(entity, request);
        entity = repository.save(entity);
        return mapper.toResponse(entity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public OrderResponse findById(UUID id) {
        Order entity = repository.findById(id).orElseThrow();
        return mapper.toResponse(entity);
    }

    public List<OrderResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}

