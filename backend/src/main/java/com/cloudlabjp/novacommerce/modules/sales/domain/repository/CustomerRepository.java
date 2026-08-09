package com.cloudlabjp.novacommerce.modules.sales.domain.repository;

import com.cloudlabjp.novacommerce.modules.sales.domain.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
}