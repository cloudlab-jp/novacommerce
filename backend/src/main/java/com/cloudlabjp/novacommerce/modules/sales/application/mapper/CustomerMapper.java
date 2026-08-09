package com.cloudlabjp.novacommerce.modules.sales.application.mapper;

import org.springframework.stereotype.Component;

import com.cloudlabjp.novacommerce.modules.sales.domain.model.Customer;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CreateCustomerRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.UpdateCustomerRequest;
import com.cloudlabjp.novacommerce.modules.sales.application.dto.CustomerResponse;

@Component
public class CustomerMapper {

    public Customer toEntity(CreateCustomerRequest request) {

        var entity = new Customer();

        entity.setName(request.getName());
        entity.setEmail(request.getEmail());

        return entity;
    }

    public CustomerResponse toResponse(Customer entity) {

        var response = new CustomerResponse();

        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setEmail(entity.getEmail());

        return response;
    }

    public void update(
            Customer entity,
            UpdateCustomerRequest request
    ) {

        entity.setName(request.getName());
        entity.setEmail(request.getEmail());
    }

}
