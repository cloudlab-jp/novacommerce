package com.cloudlabjp.novacommerce.modules.sales.application.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import com.cloudlabjp.novacommerce.modules.sales.domain.model.Order;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CreateOrderRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.UpdateOrderRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.OrderResponse;
import com.cloudlabjp.novacommerce.modules.sales.domain.model.Customer;
import com.cloudlabjp.novacommerce.modules.sales.domain.repository.CustomerRepository;
import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Product;
import com.cloudlabjp.novacommerce.modules.catalog.domain.repository.ProductRepository;
import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Category;
import com.cloudlabjp.novacommerce.modules.catalog.domain.repository.CategoryRepository;
import java.util.List;

@RequiredArgsConstructor
@Component
public class OrderMapper {

    private final CustomerRepository customerRepository;

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    public Order toEntity(CreateOrderRequest request) {
        var entity = new Order();
        entity.setCustomer(customerRepository.getReferenceById(request.getCustomerId()));
        if (request.getProductIds() != null) {
            entity.setProducts(request.getProductIds().stream().map(productRepository::getReferenceById).toList());
        }
        entity.setCategory(categoryRepository.getReferenceById(request.getCategoryId()));
        return entity;
    }

    public OrderResponse toResponse(Order entity) {
        var response = new OrderResponse();
        response.setCustomerId(entity.getCustomer() != null ? entity.getCustomer().getId() : null);
        response.setProductIds(entity.getProducts() == null ? List.of() : entity.getProducts().stream().map(Product::getId).toList());
        response.setCategoryId(entity.getCategory() != null ? entity.getCategory().getId() : null);
        return response;
    }

    public void update(Order entity, UpdateOrderRequest request) {
        entity.setCustomer(customerRepository.getReferenceById(request.getCustomerId()));
        if (request.getProductIds() != null) {
            entity.setProducts(request.getProductIds().stream().map(productRepository::getReferenceById).toList());
        }
        entity.setCategory(categoryRepository.getReferenceById(request.getCategoryId()));
    }
}
